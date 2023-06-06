import { useEffect, useContext } from 'react';
import { React, useState } from 'react'
import { LoginContext } from "../contexts/loginContext";
import ActionItem from './button-liActionItem.jsx'
import DeleteItem from './button-liDelete.jsx';
import ItineraryService from '../services/itinerary';

import Styles from './css/list-itinerarySelect.module.css'
import LoginSignupStyles from './css/form-loginSignup.module.css'
import ShareItem from "./button-liShare";
import {getAllSharedItinerary, shareNewItinerary} from "../services/sharedItinerary";
import {useNavigate} from "react-router-dom";
import CheckItem from "./button-liChecked";

function ItinerarySelect() {

    const currentuser = useContext(LoginContext);
    const navigate = useNavigate();

    const [sharedItineraryIndex, setSharedIndex ] = useState([]);
    const [resultsArray, setResultsArray] = useState([null]);
    const [obtainedItineraries, setObtained] = useState(false);
    const [activeItineraryIndex, setSelectedIndex] = useState(undefined)

    useEffect(() => {
        setObtained(false); 
        ItineraryService.getAllItineraries(currentuser)
            .then((result) => {
                result.forEach((itinerary, index) => {
                    itinerary.frontendListId = index;
                })
                setResultsArray(result);
                setObtained(true);
            })
            .catch((error) => console.warn(error))

        const fetchAllSharedIItinerary = async () => {
            let result = await getAllSharedItinerary(currentuser);
            result.map(sharedItr => {
                sharedItineraryIndex.push(sharedItr.itinerary_id);
            })
        }
        fetchAllSharedIItinerary().catch(console.error);
    }, [])

    /**
     * Calculates and returns the index of whichever itinerary is active, if any.
     * Useful for determining which itinerary to display as active on route render
     * @returns index of active itinerary
     */
    function getActiveIndex() {
        if (obtainedItineraries) {
            let itin = currentuser.getItinerary();
            if (itin !== null && itin !== undefined) {
                let result = resultsArray.findIndex((itinerary) => {
                    return itinerary?.itineraryId === itin.itineraryId;
                })
                if (result >= 0) return result;
                else return 0;
            }
            else return 0;
        }
        else return null;
    }

    // any time obtainedItineraries variable is set to true, change the selected index to whatever the LoginContext has active
    useEffect(() => {
        if (obtainedItineraries) setSelectedIndex(getActiveIndex())
    }, [obtainedItineraries])

    // when the activeItineraryIndex variable is updated, updates the LoginContext with the corresponding itinerary object
    useEffect(() => {
        if (obtainedItineraries) {
            if (activeItineraryIndex !== null) currentuser.setItinerary(resultsArray[activeItineraryIndex])
            else currentuser.setItinerary(null);
        }
    }, [activeItineraryIndex, resultsArray, currentuser, obtainedItineraries])
    
    function isActive(index) {
        return index === activeItineraryIndex;
    }

    function getSharedIndexList() {
        //get shared list and replace resultsArray with it
        //sharedItineraryIndex = [];
        getAllSharedItinerary(currentuser).then((result) => {
            let getShared = currentuser.getItinerary();
            if (getShared !== null && getShared !== undefined) {
                result.map(sharedItr => {
                    sharedItineraryIndex.push(sharedItr.itinerary_id);
                })
            }
        })
            .catch((error) => console.warn("The error from getSharedIndexList", error))
        return sharedItineraryIndex;
    }

    function isShared(index) {
        //check if index exists in the shared list maintained in state
        return sharedItineraryIndex.includes(index);
    }

    function deleteItem(deleteIndex) {
        let deleteItinerary = resultsArray[deleteIndex];
        if (isActive(deleteIndex)) setSelectedIndex(null);
        else if (deleteIndex < activeItineraryIndex) setSelectedIndex(activeItineraryIndex - 1);
        else setSelectedIndex(activeItineraryIndex);

        ItineraryService.deleteItineraryData(currentuser, deleteItinerary.itineraryId);
        setResultsArray([...resultsArray.slice(0, deleteIndex), ...resultsArray.slice(deleteIndex+1)])
    }

    function createNewLocalItinerary() {
        let l = resultsArray.length;
        ItineraryService.createNewItinerary(currentuser, `New Itinerary ${l + 1}`, l+1)
            .then((newItinerary) => {
                setResultsArray([...resultsArray, newItinerary]);
                setSelectedIndex(l);
            })
            .catch(e => {
                console.error(e);
            })

    }

    function clickActivate(index) {
        if (!isActive(index)) setSelectedIndex(index);
        else setSelectedIndex(null);
    }


    function shareItem(itineraryId) {
        if (itineraryId !== null) {
            //post to shared table
            shareNewItinerary(currentuser, itineraryId).then((result) => {
                // const fetchAllSharedIItinerary = async () => {
                //     let results = await getAllSharedItinerary(currentuser);
                //     sharedIndexList = [];
                //     results.map(sharedItr => {
                //         sharedIndexList.push(sharedItr.itinerary_id);
                //     })
                // }
                // fetchAllSharedIItinerary().catch(console.error);
                setSharedIndex(getSharedIndexList);
                navigate('/sharedItr');
            })
                .catch((error) => console.warn("The error from shareItem", error))
        }
    }

    return ( 
        <div className={`${Styles['itinerarySection']} ${Styles['itinerarySelect']}`} >
            <ul>
                {
                    resultsArray.map((itineraryItem, index) => {
                        if (itineraryItem !== null) return (
                            <li key={index} className={ isActive(index) ? Styles['active'] : ""}>
                                <p className={Styles['itineraryName']}>{itineraryItem.itineraryName}</p>
                                <p>{itineraryItem.startDate}</p>
                                <ActionItem 
                                    alt={isActive(index) ? "Itinerary active" : "Select this itinerary?"}
                                    action={() => {clickActivate(index)}}
                                    isActive={isActive(index)}
                                    />
                                <DeleteItem action={() => deleteItem(index)} />
                                {isShared(itineraryItem.itineraryId)? <CheckItem /> : <ShareItem action={() => shareItem(itineraryItem.itineraryId)} />}
                            </li>
                        )
                        else return null;
                    })
                }
            </ul>
            <button 
                className={LoginSignupStyles['formButton']}
                onClick={createNewLocalItinerary}
                >
                    Create new itinerary
            </button>
        </div>
     );
}

export default ItinerarySelect;