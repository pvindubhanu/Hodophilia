import { React, useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SearchForm from './form-search.jsx';
import { LoginContext } from "../contexts/loginContext";
import { ordinal_suffix_of } from "../constants/utilities.js";
import { CreateItinerary, ItineraryItem } from './screens/create-new-itinerary';

import Stage01 from "./form-addLocation/stage01.jsx";
import Stage02 from "./form-addLocation/stage02.jsx";
import Stage03 from "./form-addLocation/stage03.jsx";
import Stage04 from "./form-addLocation/stage04.jsx";

import Styles from './css/form-addLocation.module.css'
import FormSearchStyles from './css/form-search.module.css'

const FLIGHTS_DISPLAY_RESULTS = 3;


/**
 * JSX component for providing a form for the user to add a travel location, hotel, and ammenities
 * @param {object} props
 * @param {int} props.id A simple number to show the order of this location in the travel list
 * @param {string} props.fromLocationName The name of a previous location (usually used for location chaining)
 * @param {string} props.toLocationName The name of the new location
 * @param {(ItineraryItem) => void} props.addItineraryItem A function that adds the assembled ItineraryItem to the list in parent
 * @param {(int) => void} props.removeItineraryItem A function that should be executed when the user clicks the X button in this component
 */
function AddLocation({id, fromLocationName, toLocationName, addItineraryItem, removeItineraryItem}) {

    const navigate = useNavigate();
    const currentuser = useContext(LoginContext);
    let displayID = id+1;

    useEffect(() => {
        if (currentuser.token === "") {
            navigate('/login');
        }
    })

    const [ itineraryItem ] = useState(new ItineraryItem(id, toLocationName || null, fromLocationName || null, null, [null]))
    
    const [stage, setStage] = useState(
        <Stage01 
            id={displayID} 
            getToLocation={addTo} 
            />
        );

    function addTo(locationName) {
        itineraryItem.toLocation = locationName;
        setStage(
            <Stage02 
                id={displayID} 
                toName={locationName} 
                getToLocation={addTo} 
                getFromLocation={addFrom} 
                />
            );
    }

    function addFrom(locationName) {
        itineraryItem.fromLocation = locationName;
        setStage(
            <Stage03 
                id={displayID} 
                toName={itineraryItem.toLocation} 
                fromName={locationName} 
                getToLocation={addTo} 
                getFromLocation={addFrom} 
                getFlight={addFlight}
                />
            );
    }

    function addFlight(flightName) {
        console.log("Adding flight", flightName);
        itineraryItem.chosenFlight = flightName;
        setStage(
            <Stage04
                id={displayID}
                toName={itineraryItem.toLocation}
                fromName={itineraryItem.fromLocation}
                flight={flightName}
                getToLocation={addTo}
                getFromLocation={addFrom}
                getFlight={addFlight}
                addAmenities={addAmenities}
                addItineraryItem={addItineraryItem}
            />
        )
    }

    function addAmenities(amenitiesList) {
        itineraryItem.amenitiesList = amenitiesList;
    }

    return ( 
        <div className={Styles['addLocation']}>
            <div className={Styles['locationHeader']}>
                <h2>Location {displayID}</h2>
                {
                    (id > 0) &&
                    <button className={Styles['x']} onClick={() => removeItineraryItem(id)}>X</button>
                }
            </div>
            {stage}
        </div>
    );
}

export default AddLocation;