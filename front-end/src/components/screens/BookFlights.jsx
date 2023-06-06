import React, {useContext, useState} from "react";
import ironManImage from "../../assets/icons/ironman.jpeg";
import bookingsBG from "../../assets/graphics/bookingsBG.png"
import {LoginContext} from "../../contexts/loginContext";
import {useNavigate} from "react-router-dom";
import FlightBookingService from "../../services/flightbooking";

import moment from 'moment';
import {MDBBtn, MDBCard, MDBCardBody, MDBRipple, MDBTextArea} from "mdb-react-ui-kit";
import SharedItrModuleCss from "../css/sharedItrPage.module.css";
import FlightBookingsModuleCss from "../css/flightBookings.module.css";
import DeleteItem from "../button-liDelete";
import Styles from "../css/navbar.module.css";
import CommentContainer from "../CommentContainer";
import FlightDetails from "../FlightDetails";

// import Navbar from "components/Navbars/AuthNavbar.js";
// import Footer from "components/Footers/Footer.js";

export default function BookFlights() {
    const currentuser = useContext(LoginContext);
    const navigate = useNavigate();

    const [ errorMsg, setErrorMsg ] = useState(null);
    const [ fromInput, setFromInput ] = useState("");
    const [ toInput, setToInput ] = useState("");
    const [ departInput, setDepartInput ] = useState(""); // input type date returns format YYYY-MM-DD
    const [ selectedFlight, selectFlight ] = useState(null);

    const [ availableFlights, setAvailableFlights ] = useState([]);

    const excludeKeys = ['id', 'departureCity', 'arrivalCity'];
    const [curFactor, setCurFactor] = useState(1)

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
            {/*<Navbar transparent />*/}
            <main className="profile-page">
                <section className="relative block h-500-px">
                    <div
                        className="absolute top-0 w-full h-full bg-center bg-cover"
                        style={{
                            backgroundImage:
                                "url('https://www.brides.com/thmb/a9234cdfkmZzCTdSbtE4TrkjcgU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Stocksy_txp7236a1481lh200_Medium_988764-5f120837070345a3bd7a39908c86b0bd.jpg')",
                        }}
                    >
            <span
                id="blackOverlay"
                className="w-full h-full absolute opacity-50 bg-black"
            ></span>
                    </div>
                    <div
                        className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
                        style={{ transform: "translateZ(0)" }}
                    >
                        <svg
                            className="absolute bottom-0 overflow-hidden"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="none"
                            version="1.1"
                            viewBox="0 0 2560 100"
                            x="0"
                            y="0"
                        >
                            <polygon
                                className="text-blueGray-200 fill-current"
                                points="2560 0 2560 100 0 100"
                            ></polygon>
                        </svg>
                    </div>
                </section>
                <section className="relative py-16 bg-blueGray-200">
                    <div className="container mx-auto px-4">
                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                            <div className="px-6">

                                <div className="text-center mt-12">
                                    <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                                        Book your flight!
                                    </h3>
                                    <div className="mr-4 p-3 text-center">
                                        {errorMsg}
                                        <div className="flex flex-row justify-content-around my-4">
                                        <div className="mx-4 flex w-16">
                                            <div className="flex flex-col">
                                            <span className="mr-auto text-sm text-blueGray-400">
                                              From
                                            </span>
                                        <input
                                            type="text"
                                            value={fromInput}
                                            onInput={(e) => setFromInput(e.target.value)}
                                            name="from"
                                            placeholder="From"
                                        />
                                            </div>
                                        </div >
                                        <div className="mx-4 flex w-16">
                                            <div className="flex flex-col">
                                            <span className="mr-auto text-sm text-blueGray-400">
                                              To
                                            </span>
                                        <input
                                            type="text"
                                            value={toInput}
                                            onInput={(e) => setToInput(e.target.value)}
                                            name="to"
                                            placeholder="To"
                                        />
                                            </div>
                                        </div>
                                        <div className="mx-4 flex w-16">
                                            <div className="flex flex-col">
                                            <span className="mr-auto text-sm text-blueGray-400">
                                              Departure Date
                                            </span>
                                        <input
                                            type="date"
                                            value={departInput}
                                            onInput={(e) => {setDepartInput(e.target.value)}}
                                            name="depart"
                                            placeholder="Departure date"
                                        />
                                            </div>
                                        </div>
                                        <div className={FlightBookingsModuleCss['flight-bookings-button']}>
                                        <button onClick={gatherFlights}>Find flights</button>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                                        <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>{" "}
                                        
                                    </div>
                                </div>

                                <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                                    <div className="flex flex-wrap justify-center">
                                        <div className="w-full lg:w-9/12 px-4">
                                            <ul>
                                                {
                                                    availableFlights.map((flightObj, index) => {
                                                        return (
                                                            // <FlightDetails availFlights = {flightObj} />

                                                            <MDBCard className={FlightBookingsModuleCss['flight-bookings-card']}>
                                                                <MDBCardBody>
                                                                    {/*<div className="d-flex justify-content-between text-center">*/}
                                                                    {/*    <div className="d-flex mb-3">*/}
                                                                    {/*        <div>*/}
                                                                    {/*            <div className="d-flex justify-content-center">*/}
                                                                    {/*            </div>*/}
                                                                    {/*        </div>*/}

                                                                    {/*        <div>*/}
                                                                    {/*            <div className="d-flex">*/}
                                                                    {/*                <div className={SharedItrModuleCss['shared-user-name']} >*/}
                                                                    {/*                    <div className="text-dark mb-0">*/}
                                                                    {/*                        /!*<strong> {testimonial.created_user_email}</strong>*!/*/}
                                                                    {/*                    </div>*/}
                                                                    {/*                </div>*/}


                                                                    {/*                /!*<button className={Styles['icon']} onClick={deleteItem(index)} disabled={enableDeleteButton(testimonial.created_user_email)} >*!/*/}
                                                                    {/*                /!*    <DeleteOutlined />*!/*/}
                                                                    {/*                /!*</button>*!/*/}
                                                                    {/*            </div>*/}
                                                                    {/*            /!*<a*!/*/}
                                                                    {/*            /!*    href="#"*!/*/}
                                                                    {/*            /!*    className="text-muted d-block"*!/*/}
                                                                    {/*            /!*    style={{ marginTop: "-6px" }}*!/*/}
                                                                    {/*            /!*>*!/*/}
                                                                    {/*            /!*    <small>Just now</small>*!/*/}
                                                                    {/*            /!*</a>*!/*/}
                                                                    {/*        </div>*/}
                                                                    {/*    </div>*/}
                                                                    {/*</div>*/}


                                                                    <div>
                                                                        <ul className={`${Styles['itinerarySection']} ${Styles['itinerarySelect']}`}>
                                                                            <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                                                                                <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>{" "}
                                                                            <div className="flex flex-row justify-content-around my-4" >
                                                                            <div className="text-dark mb-0">
                                                                                {/*<div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">*/}
                                                                                {/*    <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>{" "}*/}
                                                                                    <li key={index} >{flightObj["operatingAirlines"]} </li>
                                                                                <div className="flex flex-row justify-content-around mx-2">
                                                                                    <span className="mr-auto text-sm text-blueGray-400 font-normal"> Flight Number: </span>
                                                                                    <li key={index} > {flightObj["flightNumber"]} </li>
                                                                                </div>
                                                                                {/*</div>*/}
                                                                            </div>
                                                                            <div className="text-dark mb-0">
                                                                                <span className="mr-auto text-sm text-blueGray-400"> Departure City </span>
                                                                                <strong> <li key={index} > {flightObj["departureCityLocation"].name} </li> </strong>
                                                                            </div>
                                                                            <div className="text-dark mb-0">
                                                                                <span className="mr-auto text-sm text-blueGray-400"> Arrival City </span>
                                                                                <strong><li key={index} > {flightObj["arrivalCityLocation"].name} </li></strong>
                                                                            </div>
                                                                                <div className="text-dark mb-0">
                                                                                    <strong><li key={index} > {curFactor ? Math.round(flightObj["ticketPrice"] * curFactor* 100)/100 : flightObj["ticketPrice"] }
                                                                                    {/* onChange={(e) => setBookingDetails({...bookingDetails, curFactor: e.target.value, curSumbol: e.target.key})} */}
                                                                                   {" "}
                                                                                    <select defaultValue={1} onChange={(e) => setCurFactor(e.target.value)}>
                                                                                        <option key={"USD"} value={1}>USD</option>
                                                                                        <option key={"EUR"} value={0.948666}>EUR</option>
                                                                                        <option key={"CAD"} value={1.367711}>CAD</option>
                                                                                        <option key={"AUD"} value={1.472285}>AUD</option>
                                                                                        <option key={"INR"} value={82.47037}>INR</option>
                                                                                        <option key={"YEN"} value={136.529687}>YEN</option>
                                                                                        <option key={"YAN"} value={6.957382}>YAN</option>
                                                                                        </select>
                                                                                        </li></strong>
                                                               
                                                                               
                                                                
                                                                                </div>
                                                                                <button onClick={() => selectFlight(flightObj)} className={FlightBookingsModuleCss['flight-bookings-button1']} style={{display: "inline-block"}}>
                                                                                    Book flight
                                                                                </button>
                                                                            </div>
                                                                            </div>


                                                                            {/*<li key={index} >{flightObj["flightNumber"]} - {flightObj["operatingAirlines"]}</li>*/}
                                                                            {/*<li key={index} >Trip Starts on {flightObj["dateOfDeparture"]} for ${flightObj["ticketPrice"]}</li>*/}
                                                                            {/*<li key={index} >From {flightObj["departureCityLocation"].name} to {flightObj["arrivalCityLocation"].name}</li>*/}
                                                                        </ul>
                                                                    </div>
                                                                </MDBCardBody>

                                                            </MDBCard>






                                                            //                                                         Object.keys(flightObj).map((flightDetail) => {
                                        //                                 if (!excludeKeys.includes(flightDetail))
                                        //                                     return (
                                        //                                         <span>
                                        //     {
                                        //         flightObj[flightDetail]?.name || flightObj[flightDetail]
                                        //         // flightObj["operatingAirlines"]
                                        //     }
                                        // </span>
                                        //                                     )
                                        //                                 // return null;
                                        //                                 else return null;
                                        //                             })

                                                        )
                                                    })
                                                }
                                            </ul>


                                        </div>
                                    </div>
                                </div>
                                <div className="mt-10 py-10 text-center">
                                    <div className="flex flex-wrap justify-center">
                                        <div className="w-full lg:w-9/12 px-4">
                                            {selectedFlight && (

                                                <div>
                                                    <MDBCard className={FlightBookingsModuleCss['flight-bookings-card1']}>
                                                        <MDBCardBody>
                                                            <div className="mr-4 p-3 text-center">
                                                                <div className="flex flex-col justify-content-around mx-2">
                                                                    <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                                                                        <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>{" "}
                                                                    <div className="">
                                                                        <div className={FlightBookingsModuleCss['row'] + "flex flex-row justify-content-around mx-4"}>
                                                                            <div className={FlightBookingsModuleCss['col-25']}>
                                            <span className={FlightBookingsModuleCss['input_label'] + "mr-auto text-sm text-blueGray-400"}>
                                              First name
                                            </span>
                                                                            </div>
                                                                            <div className={FlightBookingsModuleCss['col-75 input_text']}>
                                                                            <input
                                                                                type="text"
                                                                                name="firstname"
                                                                                placeholder="First name"
                                                                                value={fnameInput}
                                                                                onInput={(e) => {setFnameInput(e.target.value)}}
                                                                            />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="">
                                                                        <div className={FlightBookingsModuleCss['row'] + "flex flex-row justify-content-around mx-4"}>
                                                                            <div className={FlightBookingsModuleCss['col-25']}>
                                            <span className={FlightBookingsModuleCss['input_label'] + "mr-auto text-sm text-blueGray-400"}>
                                              Last name
                                            </span>
                                                                            </div>
                                                                            <div className={FlightBookingsModuleCss['col-75 input_text']}>
                                                                            <input
                                                                                type="text"
                                                                                name="lastname"
                                                                                placeholder="Last name"
                                                                                value={lnameInput}
                                                                                onInput={(e) => {setLnameInput(e.target.value)}}
                                                                            />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="">
                                                                        <div className={FlightBookingsModuleCss['row'] + "flex flex-row justify-content-around mx-4"}>
                                                                            <div className={FlightBookingsModuleCss['col-25']}>
                                            <span className={FlightBookingsModuleCss['input_label'] + "mr-auto text-sm text-blueGray-400"}>
                                              Email
                                            </span>
                                                                            </div>
                                                                            <div className={FlightBookingsModuleCss['col-75 input_text']}>
                                                                            <input
                                                                                type="email"
                                                                                name="email"
                                                                                placeholder="Email"
                                                                                value={emailInput}
                                                                                onInput={(e) => {setEmailInput(e.target.value)}}
                                                                            />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="">
                                                                        <div className={FlightBookingsModuleCss['row'] + "flex flex-row justify-content-around mx-4"}>
                                                                            <div className={FlightBookingsModuleCss['col-25']}>
                                            <span className="mr-auto text-sm text-blueGray-400">
                                              Phone
                                            </span>
                                                                            </div>
                                                                            <div className={FlightBookingsModuleCss['col-75']}>
                                                                            <input
                                                                                type="phone"
                                                                                name="phone"
                                                                                placeholder="Phone #"
                                                                                value={phoneInput}
                                                                                onInput={(e) => {setPhoneInput(e.target.value)}}
                                                                            />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className={FlightBookingsModuleCss['flight-bookings-button1']}>
                                                                        <button onClick={confirmBooking}> Confirm booking </button>
                                                                    </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </MDBCardBody>
                                                    </MDBCard>

                                                </div>
                                            )}
                                            {/*<a*/}
                                            {/*    href="#pablo"*/}
                                            {/*    className="font-normal text-lightBlue-500"*/}
                                            {/*    onClick={(e) => e.preventDefault()}*/}
                                            {/*>*/}
                                            {/*    Display something!*/}
                                            {/*</a>*/}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>
            </main>
            {/*<Footer />*/}
        </>
    );
}
