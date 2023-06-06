import axios from "axios";
import { resolveMotionValue } from "framer-motion";

const FIND_FLIGHT = 'http://localhost:8080/api/flights/findFlights';
const COMPLETE_RESERVATION = 'http://localhost:8080/api/ticket/completeReservation';

// helper class to assemble flights into
function FlightObject(flightNo, airlinesName, departureTime, departureCity, arrivalCity) {
    this.flightNo = flightNo;
    this.airlinesName = airlinesName;
    this.departureTime = departureTime;
    this.departureCity = departureCity;
    this.arrivalCity = arrivalCity;
}



// TODO: Integrate; as of now each of these methods are assumptions
class FlightBookingService {

    /**
     * 
     * @param {string} fromLocation The name of a starter location
     * @param {string} toLocation The name of an ending location
     * @param {string} departureDate A date in the format YYYY-MM-DD
     * @returns {Promise} resolves to a list of potential flights matching the criteria; throws error on reject
     */
    gatherLocations(fromLocation, toLocation, departureDate) {
        // return new Promise((resolve) => {
        //     setTimeout(
        //         resolve([
        //             new FlightObject(44, "Enverodie Lines", "3:30", fromLocation, toLocation),
        //             new FlightObject(643, "Enverodie Lines", "4:00", fromLocation, toLocation),
        //             new FlightObject(342, "Parody Flights", "4:15", fromLocation, toLocation),
        //             new FlightObject(52, "World Villager", "4:30", fromLocation, toLocation),
        //             new FlightObject(84, "Parody Flights", "4:30", fromLocation, toLocation)
        //         ]), 
        //     100)
        // })
        // Re-enable this when endpoint is ready

        return axios
            .get(FIND_FLIGHT + `?from=${fromLocation}&to=${toLocation}&departureDate=${departureDate}`)
            .then(response => {
            let sortedResponse = response.data;
            console.log(response);
                return sortedResponse;
            })
            .catch(e => { throw e })
            /* 
        */
    }

    /**
     * 
     * @param {Object} currentuser The react context object representing the LoginContext user
     * @returns {Promise} resolves to a confirmation, or throws a failure message
     */
    completeReservation(currentuser, flightId, passengerFirstName, passengerLastName, passengerEmail, passengerPhone, itineraryId) {
        /*
        Need:
            private Long flightId;
            private String passengerFirstName;
            private String passengerLastName;
            private String passengerEmail;
            private String passengerPhone;
            private Integer itineraryId;
            
        */
        let requestHead = {
            headers: {
            "Authorization": `Bearer ${currentuser.token}`
            }
        }
        let requestBody = {
            itineraryId: currentuser.getItinerary().itineraryId,
            flightId: flightId,
            passengerFirstName: passengerFirstName,
            passengerLastName: passengerLastName,
            passengerEmail: passengerEmail,
            passengerPhone: passengerPhone,
        }
        return axios
            .post(COMPLETE_RESERVATION, requestBody, requestHead)
            .then(response => {
                let sortedResponse = response;
                return sortedResponse;
            })
            .catch(e => { throw e })
    }
}

export default new FlightBookingService();