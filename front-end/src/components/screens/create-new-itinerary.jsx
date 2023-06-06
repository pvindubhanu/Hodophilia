import React from "react";
import PageWrapper from "./wrappers/wrapper-regularPage";
import Location from '../form-addLocation';
import { useState } from "react";

function CreateItinerary() {

    const [locationData, setLocationData] = useState(
        [new ItineraryItem(0, null, null, null, null)]
    );

    /**
     * 
     * @param {ItineraryItem} itineraryItem a new itinerary item that gets appended to the list
     */
    function addItineraryItem(itineraryItem) {
        setLocationData([...locationData, itineraryItem])
    }

    function removeItineraryItem(index) {
        setLocationData( [...locationData.slice(0, index), ...locationData.slice(index+1)]);
    }

    return ( 
        <PageWrapper>
            {
                locationData.map((itinItem, index) => {
                    return (
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <Location
                                id={index}
                                fromLocationName={itinItem.fromLocation}
                                toLocationName={itinItem.toLocation}
                                addItineraryItem={addItineraryItem}
                                removeItineraryItem={removeItineraryItem}
                            ></Location>
                        </div>
                    )
                })
            }
        </PageWrapper>
    );
}

export class ItineraryItem {

    /**
     * An object containing all needed info from the user for an itinerary item
     * @param {int} id The unique identifier for this item (must be in order)
     * @param {string} toLocation The name of the destination (corresponds to a name in DB) 
     * @param {string} fromLocation The name of the start point (corresponds to a name in DB)
     * @param {string} chosenFlight A string of the format MM/DD to indicate the time the user has indicated they wish to travel
     * @param {[string]} amenitiesList All the locations the user has selected to visit, in order 
     */
    constructor(id, toLocation, fromLocation, chosenFlight, amenitiesList) {
        this.id = id;
        this.toLocation = toLocation;
        this.fromLocation = fromLocation;
        this.chosenFlight = chosenFlight;
        this.amenitiesList = amenitiesList;
    }
}

export default CreateItinerary;