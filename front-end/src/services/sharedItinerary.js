import axios from "axios";
import {useContext} from "react";
import {LoginContext} from "../contexts/loginContext";

export function shareNewItinerary(currUser, itineraryId) {
    console.log("Inside shareNewItinerary:"+ currUser.token);
    if(itineraryId != null) {
        return axios.post('http://localhost:8080/api/share/'+itineraryId, {},{
            headers: {
                "Authorization": `Bearer ${currUser.token}`
            }
        })
            .then((response) => {
                console.log(response.data);
                return response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

export function getAllSharedItinerary(currUser) {
    console.log("The token: ", currUser.token);
    return axios.get('http://localhost:8080/api/share',
        {
            headers: {
                "Authorization": `Bearer ${currUser.token}`
            }
        }
    )
        .then((response) => {
            console.log(response.data);

            return response.data;

        })
        .catch((error) => {
            throw error;
        })
}

export function deleteSharedItinerary(currUser, itineraryId) {
    if(itineraryId != null) {
        return axios.delete('http://localhost:8080/api/share/'+itineraryId, {
            headers: {
                "Authorization": `Bearer ${currUser.token}`
            }
        })
            .then((response) => {
                console.log(response.data);
                return response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

