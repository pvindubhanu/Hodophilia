import axios from "axios";
import DefaultImage from '../assets/graphics/rough-horn-2146181_640.jpg'

const API_URL = "http://localhost:8080/api/search";

class SearchService {

    gatherLocations() {
        
        return axios
            .get(API_URL)
            .then(response => {
                // loop through and convert all returned data to SearchResult objects;
                // put objects into array, limit maxResults
                let returnArray = [];
                for (let place of response.data?.places) {
                    returnArray.push(place);
                }
                
                return returnArray;
            })
            .catch(e => {
                // returnArray.push(new SearchResult("No locations found", null, DefaultImage))
                console.warn("Connection to database failed: ", e);
                return null;
            })
    }

}

class SearchResult {

    // the hashtags make these variables private.
    // it is simpler for them to be read-only.
    #name;
    #location;
    #imageURL;

    constructor(name, location, imageURL) {
        this.#name = name;
        this.#location = location;
        this.#imageURL = imageURL;
    }

    getName() {
        return this.#name;
    }

    getLocation() {
        return this.#location;
    }

    getImageURL() {
        return this.#imageURL;
    }

    /* Returns true if the same item, false if not */
    compare(SearchRes) {
        if (!(SearchRes instanceof SearchResult)) return false;
        if (SearchRes.getName() !== this.#name) return false;
        if (SearchRes.getLocation() !== this.#location) return false;
        if (SearchRes.getImageURL() !== this.#imageURL) return false;
        return true;
    }

}

export default new SearchService();
