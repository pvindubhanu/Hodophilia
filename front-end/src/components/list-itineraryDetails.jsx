import { React, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../contexts/loginContext";
import EditableField from "./input-editableField";
import DeleteItem from "./button-liDelete";
import Map from './Map'
import { updateItineraryData } from "../services/itinerary";
import bookingdetails from "../services/bookingdetails";

import Styles from './css/list-itinerarySelect.module.css'
import AddLocationStyles from './css/form-addLocation.module.css'
import LoginSignupStyles from './css/form-loginSignup.module.css'
import ItineraryService from "../services/itinerary";


function ItineraryDetails() {

    const currentuser = useContext(LoginContext);
    const navigate = useNavigate();


    function hasItinerary() {
        return (currentuser.getItinerary() !== null && currentuser.getItinerary() !== undefined);
    }

    function getItineraryDetails() {
        if (hasItinerary()) {
            let ci = currentuser.getItinerary();
            ItineraryService.getItineraryData(currentuser, ci.itineraryId)
                .then(response => {
                    setLocations(response.locationId);
                    console.log("getItineraryDetails response: ", response, ci)
                })
        }
    }

    useEffect(() => {
        getItineraryDetails();
    }, [currentuser])

    const [locationsList, setLocations] = useState([])

    function forceRefreshWithItinerary() {
        currentuser.setItinerary({ ...currentuser.getItinerary() });
    }

    function goToDetails(options) {
        bookingdetails.getDetails(currentuser).then(res => {console.log(res); navigate('/booking-details', {state: res})});
        

    }

    function deleteItem(index, array) {
        let item = array[index];
        let ci = currentuser.getItinerary();

        let locations = [...array.slice(0, index), ...array.slice(index + 1)];
        ci.locationId = locations;
        ItineraryService.updateItineraryData(currentuser, ci.itineraryId, ci);

        return locations;
    }

    if (hasItinerary()) {
        return (
            <div className={`${Styles['itinerarySection']} ${Styles['itineraryDetails']}`}>
                <EditableField
                    tag = "h2"
                    editable = {new Editable(
                        currentuser.getItinerary().itineraryName, 
                        (changedValue) => {
                            currentuser.getItinerary().itineraryName = changedValue;
                            ItineraryService.updateItineraryData(currentuser, currentuser.getItinerary().itineraryId, currentuser.getItinerary());
                        },
                        forceRefreshWithItinerary
                    )}
                />
                <div className={AddLocationStyles['map']}>
                    {/*{currentuser.getItinerary()? <Map coordinates={coordinates} /> : <p> Please Wait...</p> }*/}
                    {(currentuser.getItinerary())? <Map /> : <p> Please Wait...</p> }
                </div>
                <div>
                    Start date:
                    <EditableField
                        tag='span'
                        editable={new Editable(
                            currentuser.getItinerary().startDate,
                            (changedValue) => {
                                currentuser.getItinerary().startDate = changedValue;
                                ItineraryService.updateItineraryData(currentuser, currentuser.getItinerary().itineraryId, {
                                    ...currentuser.getItinerary(),
                                    startDate: changedValue
                                });
                            },
                            forceRefreshWithItinerary
                        )}
                    />
                    <button
                        className={LoginSignupStyles['formButton']}
                        onClick={() => {navigate('/bookFlights')}}
                    >
                        Book flights
                    </button>
                    <button
                        className={LoginSignupStyles['formButton']}
                        onClick={() => goToDetails({

                        })}>
                        View booking details
                    </button>
                </div>
                <ul>
                    {
                        locationsList.map((location, index) => {
                            return (
                                <li key={index}>
                                    <p>{location.details.place}</p>
                                    <DeleteItem action={() => {setLocations(deleteItem(index, locationsList))}} />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
         );
    }
    else return null;
}

class Editable {

    /**
     * 
     * @param {string} initialValue 
     * @param {(changedValue:string) => void} setValue function input tag can update the new value with
     * @param {() => void|undefined} executeAfterEdit additional function to be executed after the field is changed
     */
    constructor(initialValue, setValue, executeAfterEdit) {
        this.setValue = setValue;
        this.initialValue = initialValue;
        this.executeAfterEdit = executeAfterEdit;
    }
}

export default ItineraryDetails;