import axios from "axios";
import { formatDate } from "../constants/utilities";

const ENDPOINT = 'http://localhost:8080/api/itinerary';
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

class ItineraryService {

    /**
     * Creates a new itinerary with default values and adds it to the database
     * @param {object} usercontext 
     * @param {string} itineraryName 
     * @param {number} listId 
     * @returns {(Promise) => Itinerary | Error}
     */
    createNewItinerary(usercontext, itineraryName, listId) {
        let date = new Date();
        let newItinerary = new Itinerary(listId, itineraryName, daysOfWeek[date.getUTCDate()], formatDate());
        return axios.post(ENDPOINT, 
            {
                ...newItinerary
            },
            {
                headers: {
                    "Authorization" : `Bearer ${usercontext.token}` 
                },
            }
        )
            .then((response) => {
                try {
                    let rd = response.data;
                    console.log("createNewItinerary: ", response.data);
                    return new Itinerary(
                        undefined,
                        rd.itinerary_name,
                        rd.first_travel_day,
                        rd.start_date,
                        rd.action_with_date,
                        rd.itinerary_id,
                        Itinerary.DBStringToLocationsArray(rd.location_id)
                    )
                }
                catch (e) {
                    throw e;
                }
            })
            .catch((error) => { throw new Error(error) });
            
    }

    /**
     * Gets all data from all itineraries tied to the active user
     * @param {object} usercontext 
     * @returns {(Promise) => [Itinerary] | Error}
     */
    getAllItineraries(usercontext) {
        let callBody = { headers: { "Authorization": `Bearer ${usercontext.token}` } };
        return axios.get(ENDPOINT, callBody)
            .then((response) => {
                console.log("all itineraries: ", response);
                try {
                    let rd = response.data;
                    let iArray = [];
                    for (let unsortedI of rd) {
                        iArray.push(new Itinerary(
                            undefined,
                            unsortedI.itineraryName,
                            unsortedI.firstTravelDay,
                            unsortedI.startDate,
                            unsortedI.actionWithDate,
                            unsortedI.itineraryId,
                            Itinerary.DBStringToLocationsArray(unsortedI.locationId)
                        ))
                    }
                    return iArray;
                }
                catch (e) {
                    throw e;
                }
            })
            .catch((error) => { throw new Error(error) })
    }

    /**
     * Gets data from a single itinerary in the database
     * @param {object} usercontext 
     * @param {number} itineraryId 
     * @returns {(Promise) => Itinerary | Error}
     */
    getItineraryData(usercontext, itineraryId) {
        let apiCall = ENDPOINT + '/' + itineraryId;
        let callBody = { headers: { "Authorization": `Bearer ${usercontext.token}` } };
        return axios.get(apiCall, callBody)
            .then(response => {
                try {
                    let rd = response.data;
                    let frontendListId = usercontext.getItinerary()?.frontendListId;
                    return new Itinerary(
                        frontendListId,
                        rd.itinerary_name,
                        rd.first_travel_day,
                        rd.start_date,
                        rd.action_with_date,
                        rd.itinerary_id,
                        Itinerary.DBStringToLocationsArray(rd.location_id, rd.location_details)
                    );
                }
                catch (e) {
                    throw e
                }
            })
            .catch(error => { throw new Error(error) })
    }

    /**
     * Updates data for the provided itinerary ID to all the newly supplied fields.
     * Note: all itinerary fields are updated, regardless if they are included in the additionalInfo object or not.
     * @param {object} usercontext the context object of the logged in user
     * @param {number} itineraryId the id of the itinerary to modify in the database
     * @param {Itinerary} additionalInfo an itinerary object containing additional information that needs updated 
     */
    updateItineraryData(usercontext, itineraryId, additionalInfo) {
        let apiCall = ENDPOINT + '/' + itineraryId;
        let callHead = {
            headers: {
                "Authorization": `Bearer ${usercontext.token}`
            }
        }
        let callBody = Object.assign(new Itinerary(), additionalInfo);
        callBody.locationId = Itinerary.locationsToDBString(callBody.locationId);
        return axios.put(apiCall, callBody, callHead)
            .then((result) => {
                try {
                    let res = result.data;
                    console.log(res);
                    return new Itinerary(
                        additionalInfo.frontendListId || undefined,
                        res.itinerary_name,
                        res.first_travel_day,
                        res.start_date,
                        res.action_with_date,
                        res.itinerary_id,
                        Itinerary.DBStringToLocationsArray(res.location_id, res.location_details)
                    );
                }
                catch (e) { 
                    throw e 
                }
            })
            .catch(e => { throw new Error(e)});
    }

    /**
     * Deletes an itinerary with the given ID.
     * @param {object} usercontext 
     * @param {number} itineraryId 
     */
    deleteItineraryData(usercontext, itineraryId) {
        let apiCall = ENDPOINT + '/' + itineraryId;
        let callBody = {
            headers: {
                "Authorization": `Bearer ${usercontext.token}`
            }
        }
        return axios.delete(apiCall, callBody);
    }

}

export default new ItineraryService();

export class Itinerary {

    /**
     * 
     * @param {number} frontendListId
     * @param {string} name 
     * @param {string} firstTravelDay 
     * @param {string} startDate 
     * @param {string} actions 
     * @param {number} itineraryId
     * @param {[number]} locationId a list of locationIDs
     */
    constructor(frontendListId, name, firstTravelDay, startDate, actions, itineraryId, locationId) {
        this.frontendListId = frontendListId;
        this.itineraryName = name;
        this.firstTravelDay = firstTravelDay;
        this.startDate = startDate;
        this.actionWithDate = actions;
        this.itineraryId = itineraryId;
        this.locationId = locationId;
    }

    /**
     * Converts an array of locationId to a database-friendly string
     * @param {[{id: number, ...}]} locationId 
     * @returns {string}
     */
    static locationsToDBString(locationId) {
        if (locationId && locationId.length > 0) return locationId.map(({id}) => id).join('|');
        // if (locationId && locationId.length > 0)
        //     return locationId
        //         .map(({ id }) => {
        //             if (id) return id;
        //             else return null;
        //         })
        //         .join('|');
        else return undefined;
    }

    /**
     * Converts a database locationId string to an array of locationId
     * @param {string} locationId 
     * @returns {[{id: number, ...}]}
     */
    static DBStringToLocationsArray(locationId, locationDetails) {
        if (locationId) {
            locationId = locationId.split('|');
            locationId = locationId.map((str, index) => {
                let details = (locationDetails) ? locationDetails[index] : undefined;
                return { 
                    id: Number.parseInt(str), 
                    details: details
            }});
            return locationId;
        } 
        else return [];
    }
}