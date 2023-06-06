import React, { useState, useEffect, useContext } from 'react'
import TestImage from "../../assets/images/restaurants/res1.jpg"
import { useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from '../../contexts/loginContext';
import Styles from "./css/restaurants.module.css"


const HotelBookingForm = (token) => {
    const [bookingDetails, setBookingDetails] = useState(null);
    const location = useLocation();
    const data = location.state;
    const user = useContext(LoginContext);
    const navigate = useNavigate()
    const handleBooking = (token) => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
            body: JSON.stringify({checkInDate:bookingDetails.checkInDate, checkOutDate: bookingDetails.checkOutDate, contactEmail: bookingDetails.contactEmail, 
                contactPhone: bookingDetails.contactPhone, numOfAdult: parseInt(bookingDetails.numOfAdult), 
                numOfChildren: parseInt(bookingDetails.numOfChildren), roomId: parseInt(bookingDetails.roomId), 

                hotelId: data.id, itineraryId: user.getItinerary().itineraryId})
        };
        if(bookingDetails !== null) {

            fetch('http://localhost:8080/api/hotels/reservation/completeReservation', requestOptions)
            .then(res => res.json())
            .then(res => {
                alert("Success")
                navigate("/")
            })
            .catch((error)=> alert(error.message))

        }
    }

    
    return (
        <>
            <div class={Styles['card']} style={{height: "500px", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "30px"}}>
                <div>Checkin Date: <input type="date" onChange={(e) => setBookingDetails({...bookingDetails, checkInDate: e.target.value})}/> </div>
                <div>Checkout Date: <input type="date" onChange={(e) => setBookingDetails({...bookingDetails, checkOutDate: e.target.value})}/></div>
                <div>Number of adults: <input type="number" onChange={(e) => setBookingDetails({...bookingDetails, numOfAdult: e.target.value})}/></div>
                <div>Number of children: <input type="number" onChange={(e) => setBookingDetails({...bookingDetails, numOfChildren: e.target.value})}/></div>
                <div>Contact Phone: <input type="phone" onChange={(e) => setBookingDetails({...bookingDetails, contactPhone: e.target.value})}/></div>
                <div>Contact Email: <input type="email" onChange={(e) => setBookingDetails({...bookingDetails, contactEmail: e.target.value})}/> </div> 
                <div>Select Room
                    <select onChange={(e) => { setBookingDetails({...bookingDetails, roomId: e.target.value , curFactor: 1})}}>      
                            <option key={-1} value={-1} > Select a value</option>
                            { 
                                data.rooms.map((ele, idx) => 
                                    <option key={ele.idx} value={ele.id}> {ele.description}</option>
                                )
                            }
                    </select>
                </div> 
                <div>

                    Price: {bookingDetails?.roomId ? (Math.round(data.rooms.filter(ele => ele.id == bookingDetails?.roomId)[0].price * bookingDetails?.curFactor* 100) / 100).toFixed(2) : "Please select room"} {' '}
                    <select defaultValue={1} onChange={(e) => setBookingDetails({...bookingDetails, curFactor: e.target.value, curSumbol: e.target.key})}>
                        <option key={"USD"} value={1}>USD</option>
                        <option key={"EUR"} value={0.948666}>EUR</option>
                        <option key={"CAD"} value={1.367711}>CAD</option>
                        <option key={"AUD"} value={1.472285}>AUD</option>
                        <option key={"INR"} value={82.47037}>INR</option>
                        <option key={"YEN"} value={136.529687}>YEN</option>
                        <option key={"YAN"} value={6.957382}>YAN</option>

                    </select>
                </div>
               <button style={{backgroundColor: "green", padding: "10px", color: "white"}} onClick={()=> handleBooking(user.token)}>Confirm Booking</button>
              
            </div>
        </>
    )
}

export default HotelBookingForm