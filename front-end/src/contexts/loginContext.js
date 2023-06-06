import { createContext, useState } from "react";

// importing this for JSDoc to recognize it
// eslint-disable-next-line no-unused-vars
import { Itinerary } from "../services/itinerary";

export const LoginContext = createContext();

export const LoginContextProvider = (props) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [activeItinerary, setActiveItinerary] = useState(null);
    // TODO: may consider putting a JSX element hook here to store PFP image link

    /**
     * Logs in the user on the frontend - stores login credentials in the LoginContext
     *
     * @param {string} u Username
     * @param {string} e Email
     * @param {string[]} r An array of roles
     * @param {string} t JWT
     */
    const login = (u, e, r, t) => {
        setUsername(u);
        setEmail(e);
        setRoles(r);
        setToken(t);
    }

    const logout = () => {
        setUsername("");
        setEmail("");
        setRoles([]);
        setToken("");
        console.log("User logged out");
    }

    /**
     * Gives the user's active itinerary if one has been provided
     * @returns {Itinerary | null | undefined}
     */
    const getItinerary = () => {
        return activeItinerary;
    }

    /**
     * Sets the user's active itinerary
     * @param {Itinerary} itinerary 
     */
    const setItinerary = (itinerary) => {
        setActiveItinerary(itinerary);
    }

    return (
        <LoginContext.Provider value={{username, email, roles, token, login, logout, getItinerary, setItinerary}}>
            {props.children}
        </LoginContext.Provider>
    )
}