import React, { useState, useEffect } from 'react'
import TestImage from "../../assets/images/restaurants/res1.jpg"
import Styles from "./css/restaurants.module.css"

const Restaurants = ({location}) => {

    location = "Indianapolis"
    const [resList, setResList] = useState(null);
    const fetchRestaurants = () => {
        fetch(`http://localhost:8080/api/restaurants/findRestaurants?location=${location}`)
        .then((res)=> res.json())
        .then((res) =>setResList(res))
    }

    useEffect(() => {
        if(resList === null) {
            fetchRestaurants()
        }
    }, [resList])
    

  return (
    <>
        <h1 className={Styles['title']}>Restaurants</h1>
        {resList !== null &&
            resList.map((ele, index) => <div class="card" key={index}>
                <img src={TestImage} alt="Avatar" style={{width: "600px"}}/>
                <div class="container">
                    <h4><b>Name: {ele.name}</b></h4> 
                    <p>Phone: {ele.phone}</p> 
                    <p>Email: {ele.email}</p> 
                    <p>Address: {ele.address}</p> 
                    <p>Ratings: {ele.ratings}</p>
                </div>
            </div>
          )
        }
    </>
  )
}

export default Restaurants