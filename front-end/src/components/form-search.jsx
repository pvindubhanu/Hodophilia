import { Link, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback, useContext } from 'react';
import { SearchOutlined, RightSquareOutlined, RightSquareFilled, CalendarOutlined } from '@ant-design/icons';
import SearchService from '../services/search';
import CityService, {LocationData} from '../services/city';
import ItineraryService from '../services/itinerary';
import MountainsImage from '../assets/graphics/rough-horn-2146181_640.jpg';
import ForestImage from '../assets/graphics/forest-gf13c9e753_640.jpg';

import Styles from './css/form-search.module.css'
import ItineraryStyles from './css/list-itinerarySelect.module.css'
import AddItineraryItem from './button-liAddItineraryItem';
import { LoginContext } from '../contexts/loginContext';

/**
 * JSX component that provides a search bar to find, display, and select locations from backend
 * @param {object} props
 * @param {int} props.showCount The number of dropdown results to be displayed on this form
 * @param {int} props.preload The number of results to request from the backend
 * @param {object} props.children Prefills the form to a specified string or JSX element
 * @param {string} props.placeholderSupplement Overrides default placeholder text
 * @param {(string) => void} props.selectItemAction callback performed when an item from the search results dropdown is selected
 * @param {boolean} props.clearSearch A boolean value (used alongside selectItemAction) to clear the form and inputs 
 */
export default function SearchForm(props) {

    const defaultShowCount = 3;
    const showCount = props.showCount || defaultShowCount;
    const preloadResultsNumber = props.preload || showCount;
    
    const linkPath = '/search';
    const searchParam = 'search';

    const navigate = useNavigate();
    const currentuser = useContext(LoginContext)

    // generates the placeholder text in the search bar
    // note: this needs to come before our hooks
    const searchThings = ['locations', 'adventure', 'scenery', 'amazing views'];
    function generateNewPlaceholder() {
        let rng = Math.floor( Math.random() * searchThings.length );
        return `Search for ${searchThings[rng]}...`;
    }

    // Hooks
    const [input, setInput] = useState(props.children?.toString() || "");
    const [placeholderText, setPlaceholderText] = useState(props.placeholderSupplement || generateNewPlaceholder());
    const [goElementReady, setGoElementReady] = useState(false);
    const [queryResultsArray, setQueryResults] = useState([]);
    const [searchResultsArray, setSearchResults] = useState([]);
    const [displayIndex, setDisplayIndex] = useState(0);
    
    // selectItemAction performs the following actions when an item from the search results dropdown is selected.
    // expects an object with properties {locationName, locationLocation} as a single parameter
    // that *can be* assigned to a variable in this component's parent component if need be
    // TODO: add a locationID item that uniquely identifies it for later requests
    const selectItemAction = ({ locationName, locationLocation }) => { 
        if (props.selectItemAction) { // action when called from parent with prop 
            if (props.clearSearch) {
                setInput('');
                setSearchResults([]);
            }
            props.selectItemAction(locationName)
        }
        else { // default action
            let urlSafeName = encodeURIComponent(locationName);
            let urlSafeLocation = encodeURIComponent(locationLocation);
            navigate(`/city?city=${urlSafeName}`)
        }
    };

    function isActive(locationName) {
        return new Promise((resolve) => {
            let ci = currentuser.getItinerary();
            if (ci !== null) {
                
                CityService.getCityInfo(locationName)
                .then(response => {
                    let id = response._placeID;

                        if (ci.locationId.length === 0) {
                            resolve(false);
                        }
                        else {
                            // make sure the itinerary isn't the same as the previous
                            if (id === ci.locationId[ci.locationId.length - 1].id) resolve(true);
                            else resolve(false);
                        }
                        
                    })
                    .catch((e) => resolve(false))
            }
            else resolve(false);
        })
    }

    const collectLocations = useCallback(() => {
        SearchService.gatherLocations().then(locations => {
            return awaitAllResolve(locations, isActive)
                .then((result) => {
                    let setResult = result.map(({ request, response }) => { return { str: request, active: response } });
                    setQueryResults(setResult)
                })
                .catch((error) => {
                    console.error(error);
                    setQueryResults([])
                })
        })
    }, [])

    function awaitAllResolve(arrayOfQueries, asyncFunction) {
        return new Promise((resolve, reject) => {
            let resolved = 0;
            let resultArray = [];
            arrayOfQueries.forEach((qItem, index) => {
                asyncFunction(qItem)
                    .then((result) => {
                        resultArray[index] = {request: qItem, response: result};
                        resolved++
                        if (resolved === arrayOfQueries.length) resolve(resultArray);
                    })
                    .catch((e) => reject(e));
            })
        })
    }

    function filterQueryResults(newInput) {
        if (!newInput || newInput === "") setSearchResults([]);
        else setSearchResults(queryResultsArray.filter(({str}) => str.toLowerCase().includes(newInput.toLowerCase())))
    }

    useEffect(() => {
        collectLocations();
    }, []);

    useEffect(() => {
        filterQueryResults(input)
    }, [input, queryResultsArray]);

    // Event handlers

    function handleChange(e) {
        let currentFormInput = e.target.value;
        setGoElementReady(!!currentFormInput);
        setInput(currentFormInput);

        // TODO: include autofill functionality here
        filterQueryResults(currentFormInput);

    }

    function handleSubmit(e) {
        e.preventDefault();
    }

    let activateButton = null;
    if (useLocation().pathname === '/') {
        activateButton = <RightSquareOutlined style={{ fontSize: '1em' }} />
        if (goElementReady) {
            function handleSubmit(e) {
                e.preventDefault();
                let inp = input.trim();
                if (inp) {
                    let uriString = encodeURIComponent(inp);
                    navigate(`${linkPath}?${searchParam}=${uriString}`)
                } 
            }
            activateButton = (
                    <button onClick={handleSubmit}>
                        <RightSquareFilled style={{ fontSize: '1em' }} />
                    </button>
            )    
        } 
    }

    /**
     * 
     * @param {string} locationName 
     * @returns {boolean} true if successfully added, false if failed 
     */
    function addToItinerary(locationName) {
        let ci = currentuser.getItinerary();
        if (ci !== null) {
            
            CityService.getCityInfo(locationName)
                .then(response => {
                    let id = response._placeID;
                    
                    ci.locationId = [...ci.locationId, {id, details: undefined}];
                    
                    ItineraryService.updateItineraryData(currentuser, ci.itineraryId, ci)
                    .then((response) => {
                        let newActive = [...queryResultsArray];
                        newActive.forEach(item => item.active = false);
                        newActive.find(item => item.str === locationName).active = true;
                        setQueryResults(newActive)
                        // if (response.locationId[locationId.length-1].details.place === )
                    });
                })


            // ItineraryService.getItineraryData(currentuser, currentuser.getItinerary().itineraryId)
            //     .then(result => {
            //         currentuser.setItinerary(result);
            //         console.log(result)
            //     })

        }
    }

    let resultsJSX = null;
    if (searchResultsArray.length > 0) {
        resultsJSX = (
            <ul className={Styles['searchResults']}>
                {
                    searchResultsArray
                        .slice(displayIndex, showCount) // for pagination
                        .map((searchResult, index) => {
                        return (
                            <li key={index}>
                                <div className={Styles['info']}>
                                    <button onClick={
                                        () => selectItemAction({
                                                locationName: searchResult.str, 
                                                locationLocation: searchResult.str
                                            })
                                    }>
                                        <div className={Styles['imgContainer']}>
                                            <img src={searchResult.str.toLowerCase().charCodeAt(0) > 105 ? MountainsImage : ForestImage} alt={"Image for " + searchResult.str} />
                                        </div>
                                        <div className={Styles['textContainer']}>
                                            <span className={Styles['textContainer-name']}>{searchResult.str}</span>
                                            <span className={Styles['textContainer-location']}>{searchResult.str}</span>
                                        </div>
                                    </button>
                                    <div className={ItineraryStyles['toolTip']} alt="Add to itinerary">
                                        <AddItineraryItem 
                                            action={() => {addToItinerary(searchResult.str) }}
                                            alt={`Add ${searchResult.str} to itinerary`}
                                            isActive={searchResult.active}
                                            />
                                    </div>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }

    return (
        <div className={Styles['homepage-search']}>
            <form className={Styles['homepage-search-bar']} onSubmit={handleSubmit}>
                <div className={Styles['homepage-search-bar-flex']}>
                    <SearchOutlined style={{fontSize: '1em'}} />
                    <input type="text" name="search" value={input} onInput={handleChange} placeholder={placeholderText} autoComplete='off'></input>
                    {activateButton}
                </div>
            </form>
            {resultsJSX}
        </div>
    )
}