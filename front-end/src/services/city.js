import axios from "axios";
const GET_SEARCH_API = "http://localhost:8080/api/search/"
const GET_HOTEL_API ="http://localhost:8080/api/hotels/";
const GET_RESTAURANT_API ="http://localhost:8080/api/restaurants/";

class CityService{

        /**
         * Gets general location information, including search ID, place ID, description, travel advice, and things to do.
         * @param {string} nameString 
         * @param {LocationData} location 
         * @returns {LocationData} location with updated data
         */
        getCityInfo = (nameString, location = null) => {
            // enable code block when endpoint created
            return axios
                .get(GET_SEARCH_API+ nameString)
                .then(response => {
                    let rd = response.data;
                    
                    let thingsToDo = rd.thingsToDo
                        .split("|")
                        .map(ttd => ttd.trim());

                    let travelAdvice = [rd.travelAdvice]

                    if (location === null) location = new LocationData(rd.place);
                    
                    location._searchID = (rd.searchId);
                    location._placeID = (rd.locationId);
                    location._description = (rd.description);
                    location._travelAdvice = (travelAdvice);
                    location._thingsToDo = (thingsToDo);

                    return location;
                })
                .catch(e => { throw e; })
        }

        /**
        * Gets location hotel information.
        * @param {string} nameString 
        * @param {LocationData} location 
        * @returns {LocationData} location with updated data
        */
        getHotelInfo = (nameString, location = null) => {
            return axios
                .get(GET_HOTEL_API + 'findHotels?location=' + nameString)
                .then(response => {
                    let rd = response.data;
                    let latitude = rd[0]?.location.geoPoint.lat;
                    let longitude = rd[0]?.location.geoPoint.lng;
                    let hotelsList = [];

                    if (location === null) location = new LocationData(nameString);

                    if (latitude && longitude) location.setCoordinates({lat: latitude, lon: longitude});
                    for (let hotel of rd) {
                        let hLat = hotel.geoPoint.lat;
                        let hLon = hotel.geoPoint.lng;
                        hotelsList = [...hotelsList, new HotelInfo(
                            hotel.id, 
                            hotel.name, 
                            hotel.address, 
                            hotel.email, 
                            hotel.phone, 
                            hotel.stars, 
                            {lat: hLat, lon: hLon},
                            hotel.image.path,
                            hotel.rooms,
                            hotel.ratings
                            )];
                    }

                    location.setHotels(hotelsList);

                    return location;
                })
                .catch(e => { throw e; })
        }

        /**
        * Gets location restaurant information.
        * @param {string} nameString 
        * @param {LocationData} location 
        * @returns {LocationData} location with updated data
        */
        getRestaurantInfo = (nameString, location = null) => {
            return axios
                .get(GET_RESTAURANT_API + 'findRestaurants?location=' + nameString)
                .then(response => {

                    if (location === null) location = new LocationData(nameString);

                    let restaurantsArray = [];
                    for (let r of response.data) {
                        let rLat = r.geoPoint.lat;
                        let rLon = r.geoPoint.lng;

                        let restaurant = new RestaurantInfo(
                            r.id,
                            r.name,
                            r.address,
                            r.email,
                            r.phone,
                            r.ratings,
                            {lat: rLat, lon: rLon},
                            r?.image.path,
                            r.ratings
                        )
                        restaurantsArray.push(restaurant);
                    }

                    location.setRestaurants(restaurantsArray);
                    return location;

                })
                .catch(e => { throw e; })
        }


}

class HotelInfo {

    /**
     * 
     * @param {int} id The ID of the hotel in the database
     * @param {string} name The name of the hotel
     * @param {string} address The hotel's address
     * @param {string} email The hotel's email
     * @param {string} phone The hotel's main phone number
     * @param {number} starCount The hotel's rating, from 0-5
     * @param {{lat: float, lon: float}} coordinates The latitude and longitude of the hotel (GPS coordinates)
     * @param {string} imgSource path to a graphic for the hotel
     * @param {Object} rooms Object describing each available room
     * @param {Object} ratings Objects describing each rating
     */
    constructor(id, name, address, email, phone, starCount, coordinates, imgSource, rooms,ratings) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.email = email;
        this.phone = phone;
        this.starCount = starCount;
        this.coordinates = coordinates;
        this.imgSource = imgSource;
        this.rooms = rooms;
        this.ratings = ratings;
    }
}

class RestaurantInfo {

    /**
     * 
     * @param {int} id The ID of the restaurant in the database
     * @param {string} name The name of the restaurant
     * @param {string} address The restaurant's address
     * @param {string} email The restaurant's email
     * @param {string} phone The restaurant's main phone number
     * @param {number} starCount The restaurant's rating, from 0-5
     * @param {{lat: float, lon: float}} coordinates The latitude and longitude of the restaurant (GPS coordinates)
     * @param {string} imgSource path to a graphic for the restaurant
     * @param {Object} ratings Objects describing each rating
     */
    constructor(id, name, address, email, phone, starCount, coordinates, imgSource,ratings) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.email = email;
        this.phone = phone;
        this.starCount = starCount;
        this.coordinates = coordinates;
        this.imgSource = imgSource;
        this.ratings = ratings;
    }
}

export class LocationData {

    _name;
    _searchID;
    _placeID;
    _coordinates;
    _description;
    _hotels;
    _thingsToDo;
    _travelAdvice;
    _restaurants;

    /**
     * Default constructor
     * @param {string} name The name of the location - cannot be changed after construction
     */
    constructor(name) {
        this._name = name;
    }

    // getters

    /**
     * Returns the name of the Location instance
     * @returns {string}
     */
    getName() {
        return this._name;
    }

    /**
     * Returns the search ID
     * @returns {int}
     */
    getSearchID() {
        return this._searchID;
    }

    /**
     * Returns the place ID
     * @returns {string}
     */
    getPlaceID() {
        return this._placeID;
    }

    /**
     * Returns a coordinate pair that corresponds to GPS coordinates
     * @returns {{lat: float, lon: float}}
     */
    getCoordinates() {
        return this._coordinates;
    }

    /**
     * Returns the description for this location.
     * @returns {string}
     */
    getDescription() {
        return this._description;
    }

    /**
     * Returns a list of hotels available for this location.
     * @returns {[string]}
     */
    getHotels() {
        return this._hotels;
    }

    /**
     * Returns a list of things to do for this location.
     * @returns {[string]}
     */
    getThingsToDo() {
        return this._thingsToDo;
    }

    /**
     * Returns a list of travel advice notes for this location.
     * @returns {[string]}
     */
    getTravelAdvice() {
        return this._travelAdvice;
    }

    /**
     * Returns a list of restaurant objects for this location.
     * @returns {[RestaurantInfo]}
     */
    getRestaurants() {
        return this._restaurants;
    }

    // setters

    /**
     * Sets the search id field.
     * @param {int} value The number to set the ID to.
     * @returns {int} 1 on success, 0 if no change, -1 if failed.
     */
    setSearchID(value) {
        if (value === this._searchID) return 0;
        if (typeof value === 'number' && Number.isInteger(value)) {
            this._searchID = value;
            return 1;
        }
        return -1;
    }

    /**
     * Sets the place id field.
     * @param {string} value The string to set the ID to.
     * @returns {int} 1 on success, 0 if no change, -1 if failed.
     */
    setPlaceID(value) {
        if (value === this._placeID) return 0;
        if (typeof value === 'string') {
            this._placeID = value;
            return 1;
        }
        return -1;
    }

    /**
     * Sets the coordinates.
     * @param {{lat: float, lon: float}} value The string to set the coordinates to.
     * @returns {int} 1 on success, 0 if no change, -1 if failed.
     */
    setCoordinates(value) {
        if (typeof this._coordinates === 'object' && value?.lat === this._coordinates.lat && value?.lon === this._coordinates.lon) return 0;
        if (typeof value?.lat === 'number' && typeof value?.lon === 'number') {
            this._coordinates = value;
            return 1;
        }
        return -1;
    }

    /**
     * Sets the description.
     * @param {string} value The string to set the description to.
     * @returns {int} 1 on success, 0 if no change, -1 if failed.
     */
    setDescription(value) {
        if (value === this._description) return 0;
        if (typeof value === 'string') {
            this._description = value;
            return 1;
        }
        return -1;
    }

    /**
     * Sets the hotels list.
     * @param {[string]} value The array of strings to set the hotels list to.
     * @returns {int} 1 on success, -1 if failed.
     */
    setHotels(value) {
        if (typeof value === 'object') {
            this._hotels = value;
            return 1;
        }
        return -1;
    }

    /**
     * Sets the list of things to do.
     * @param {[string]} value The array of strings to set the things to do list to.
     * @returns {int} 1 on success, -1 if failed.
     */
    setThingsToDo(value) {
        if (typeof value === 'object') {
            this._thingsToDo = value;
            return 1;
        }
        return -1;
    }

    /**
     * Sets the list of travel advice tips.
     * @param {[string]} value The array of travel advice tips.
     * @returns {int} 1 on success, -1 if failed.
     */
    setTravelAdvice(value) {
        if (typeof value === 'object') {
            this._travelAdvice = value;
            return 1;
        }
        return -1;
    }

    /**
     * Sets the list of travel advice tips.
     * @param {[RestaurantInfo]} value The array of restaurants.
     * @returns {int} 1 on success, -1 if failed.
     */
    setRestaurants(value) {
        if (typeof value === 'object') {
            this._restaurants = value;
            return 1;
        }
        return -1;
    }

}

// old location class
// class CityData {

//     /**
//      * Provides an easy way of sorting through the search for city endpoint and organizing results
//      * @param {int} searchID the search ID of the resulting search
//      * @param {string} placeID the ID from the database of the location (Usually the country)
//      * @param {string} place the name of the city/place
//      * @param {string} description description of the city
//      * @param {[string]} travelAdvice additional advice
//      * @param {[string]} thingsToDo a list of things to do in the area
//      * @param {string|null} travelForm 
//      */
//     constructor(searchID, placeID, place, description, travelAdvice, thingsToDo, travelForm) {
//         this.searchID = searchID;
//         this.placeID = placeID;
//         this.place = place;
//         this.description = description;
//         this.travelAdvice = travelAdvice;
//         this.thingsToDo = thingsToDo;
//         this.travelForm = travelForm;
//     }
// }

export default new CityService();