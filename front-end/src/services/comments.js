import axios from "axios";

export function postItineraryComment(currUser, itineraryId, commentText) {
    console.log("Inside shareNewItinerary:"+ currUser.token);
    if(itineraryId != null) {
        return axios.post('http://localhost:8080/api/'+itineraryId+'/comments',
            {
                commentText
            },{
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

export function getSharedItineraryComments(currUser, itineraryId) {
    console.log("The token1: ", currUser.token);
    return axios.get('http://localhost:8080/api/'+itineraryId+'/comments',
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

export function deleteSharedItineraryComments(currUser, itineraryId) {
    if(itineraryId != null) {
        return axios.delete('http://localhost:8080/api/'+itineraryId+'/comments', {
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

