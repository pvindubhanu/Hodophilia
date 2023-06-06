import axios from "axios";

const ENDPOINT = 'http://localhost:8080/api/bookingDetails';

class BookingDetailService {

    getDetails(currentuser) {
        let requestHead = {
            headers: {
                "Authorization": `Bearer ${currentuser.token}`
            }
        }
        if (!currentuser.getItinerary()) throw new Error("User has no itinerary selected");
        return axios
            .get(ENDPOINT + '/' + currentuser.getItinerary().itineraryId, requestHead)
            .then(response => 
                response.data
            ) 
    }

}

export default new BookingDetailService();