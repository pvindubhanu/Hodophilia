import React, {useContext, useEffect, useState} from "react";
import { LoadScript, GoogleMap, MarkerF as Marker, InfoWindow } from '@react-google-maps/api';
import DeleteItem from "./button-liDelete";
import {getSharedItineraryComments} from "../services/comments";
import ItineraryService from "../services/itinerary";
import {LoginContext} from "../contexts/loginContext";

const mapStyle = {
height: '40vh',
width: '90%'
};

const coordinates = {
    lat: 39.500000,
    lng: -98.500000
}

// const locations = [
//     {
//       name: "Luddy center for Artificial Intelligence",
//       location: {
//         lat: 39.173812,
//         lng: -86.522063
//       },
//     },
//     {
//       name: "Monument Circle",
//       location: {
//         lat: 39.768937,
//         lng: -86.158438
//       },
//     },
//     {
//       name: "India Sizzling II",
//       location: {
//         lat: 39.830312,
//         lng: -86.242312
//       }
//     }
//   ];



function Map(){

    const currentuser = useContext(LoginContext);
    const [locationsList, setLocations] = useState([])

    function getItineraryDetails() {
        if (currentuser.getItinerary() !== null && currentuser.getItinerary() !== undefined) {
            let ci = currentuser.getItinerary();
            ItineraryService.getItineraryData(currentuser, ci.itineraryId)
                .then(response => {
                    setLocations(response.locationId);
                    console.log("getItinerary response from maps: ", response, ci)
                })
        }
    }

    useEffect(() => {
        getItineraryDetails();
    }, [currentuser])

const [ selected, setSelected ] = useState({});
const onSelect = item => {
      setSelected(item);
    }
return(
<>
    <LoadScript googleMapsApiKey = 'AIzaSyDUV1a4bGkheaRNsqCziSyO9kJke-1ewAo'>
<GoogleMap zoom = {4} center = {coordinates} mapContainerStyle = {mapStyle}>

{
    locationsList.map(item => {
        return (
            <Marker position={item.details} onClick={() => onSelect(item)}/>
        )
    })
}
{
            selected.details &&
            (
              <InfoWindow
              position={selected.details}
              clickable={true}
              onCloseClick={() => setSelected({})}
            >
              <p>{selected.details.place}</p>
            </InfoWindow>
            )
}
</GoogleMap>
</LoadScript>
</>
)
}

export default Map;
