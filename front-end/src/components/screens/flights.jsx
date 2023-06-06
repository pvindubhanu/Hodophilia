import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../contexts/loginContext";
import FlightBookingService from '../../services/flightbooking';
import moment from "moment/moment";

function Flights() {

    const currentuser = useContext(LoginContext);
    const navigate = useNavigate();

    const [ errorMsg, setErrorMsg ] = useState(null);
    const [ fromInput, setFromInput ] = useState("");
    const [ toInput, setToInput ] = useState("");
    const [ departInput, setDepartInput ] = useState(""); // input type date returns format YYYY-MM-DD
    const [ selectedFlight, selectFlight ] = useState(null);

    const [ availableFlights, setAvailableFlights ] = useState([]);

    const excludeKeys = ['id', 'departureCity', 'arrivalCity'];

    function gatherFlights() {
        if (!(fromInput && toInput && departInput)) {
            setErrorMsg(<p>Please enter all fields.</p>);
        }
        else {
            setErrorMsg(null);
            FlightBookingService.gatherLocations(fromInput, toInput, moment(departInput).format('MM/DD/YYYY'))
                .then((result) => {
                    setAvailableFlights(result);
                })
                .catch(e => setErrorMsg(<p>{e}</p>))
        }
    }

    const [ fnameInput, setFnameInput ] = useState("")
    const [ lnameInput, setLnameInput ] = useState("")
    const [ emailInput, setEmailInput ] = useState("")
    const [ phoneInput, setPhoneInput ] = useState("")

    function confirmBooking() {
        if (!(fnameInput && lnameInput && emailInput && phoneInput && selectedFlight)) {
            let missingList = [];
            if (!fnameInput) missingList.push('First name')
            if (!lnameInput) missingList.push('Last name')
            if (!emailInput) missingList.push('Email')
            if (!phoneInput) missingList.push('Phone')
            if (!selectedFlight) missingList.push('a selected flight')
            // let errorMessage =  ? 
            setErrorMsg(
            (missingList.length > 1) ?
                <p>Missing {missingList.slice(0, missingList.length - 1).join(', ')}, and {missingList[missingList.length - 1]}</p>
                :
                <p>Missing {missingList[0]}</p>
            )
        }
        else if (!currentuser.getItinerary()) {
            setErrorMsg(<p>You must be logged in and have an active itinerary to perform this operation.</p>);
            return;
        }
        else {
            console.log(fnameInput, lnameInput, emailInput, phoneInput, selectedFlight)
            FlightBookingService.completeReservation(currentuser, selectedFlight.id, fnameInput, lnameInput, emailInput, phoneInput, currentuser.getItinerary().itineraryId)
                .then((response) => {
                    navigate('/profile');
                })
                .catch((e) => {
                    setErrorMsg(<p>There was an error processing your request. See console for details.</p>)
                    console.error("Booking request error: ", e);
                })
        }
    }

    return ( 
        <>
        <div>
            {errorMsg}
            <input 
                type="text" 
                value={fromInput} 
                onInput={(e) => setFromInput(e.target.value)} 
                name="from" 
                placeholder="From" 
                />
            <input 
                type="text" 
                value={toInput} 
                onInput={(e) => setToInput(e.target.value)} 
                name="to" 
                placeholder="To" 
                />
            <input 
                type="date" 
                value={departInput} 
                onInput={(e) => {setDepartInput(e.target.value)}} 
                name="depart" 
                placeholder="Departure date" 
                />
            <button onClick={gatherFlights}>Find flights</button>
        </div>

        <ul>
            {
                availableFlights.map((flightObj, index) => {
                    return (
                        <li key={index}>
                            {
                                Object.keys(flightObj).map((flightDetail) => {
                                    if (!excludeKeys.includes(flightDetail)) 
                                    return (
                                        <span>
                                            {
                                                flightObj[flightDetail]?.name || flightObj[flightDetail]
                                            }
                                        </span>
                                    )
                                    // return null;
                                    else return null;
                                })
                            }
                            <button onClick={() => selectFlight(flightObj)}>Book flight</button>
                        </li>
                    )
                })
            }
        </ul>

        {selectedFlight && (
            <div>
                <input 
                    type="text"
                    name="firstname"
                    placeholder="First name"
                    value={fnameInput}
                    onInput={(e) => {setFnameInput(e.target.value)}}
                    />
                <input 
                    type="text"
                    name="lastname"
                    placeholder="Last name"
                    value={lnameInput}
                    onInput={(e) => {setLnameInput(e.target.value)}}
                    />
                <input 
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={emailInput}
                    onInput={(e) => {setEmailInput(e.target.value)}}
                    />
                <input 
                    type="phone"
                    name="phone"
                    placeholder="Phone #"
                    value={phoneInput}
                    onInput={(e) => {setPhoneInput(e.target.value)}}
                    />
                <button
                    onClick={confirmBooking}
                    >
                    Confirm booking
                </button>
            </div>
        )}
        </>
    );
}

export default Flights;