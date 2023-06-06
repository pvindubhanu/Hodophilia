import React, { useState, useEffect } from 'react'
import TestImage from "../../assets/images/restaurants/res1.jpg"
import { Link, Route, useNavigate, useLocation } from 'react-router-dom';
import { LoginContext } from '../../contexts/loginContext';
import { useContext } from 'react';

import Styles from "./css/restaurants.module.css"

const Hotels = ({location}) => {

    location = "Indianapolis"
    const [resList, setResList] = useState(null);
    const fetchRestaurants = () => {
        fetch(`http://localhost:8080/api/hotels/findHotels?location=${location}`)
        .then((res)=> res.json())
        .then((res) => setResList(res))
    }

    const currentuser = useContext(LoginContext);




    useEffect(() => {
        console.log(currentuser)
        if(resList === null) {
            fetchRestaurants()
        }
    }, [resList])
    

  return (
    <>
        <h1 className={Styles['title']}>Hotels</h1>
        {resList !== null &&
            resList.map((ele, index) => <div class="card" key={index}>
                <img src={TestImage} alt="Avatar" style={{width: "600px"}}/>
                <div class="container">
                    <h4><b>Name: {ele.name}</b></h4> 
                    <p>Phone: {ele.phone}</p> 
                    <p>Email: {ele.email}</p> 
                    <p>Address: {ele.address}</p> 
                    <p>Stars: {ele.stars}</p>
                    <p>Rooms: {ele.rooms.length} </p>
                    <p>
                        <Link style={{backgroundColor: "green", padding: "10px", color: "white"}} to="/hotel-booking" state={{...ele}}>Book Room</Link>
                    </p>
                </div>
            </div>
          )
        }
    </>
  )
}

export default Hotels