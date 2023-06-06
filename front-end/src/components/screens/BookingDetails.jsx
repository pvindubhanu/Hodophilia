import React from 'react'
import { useLocation } from 'react-router-dom'

const BookingDetails = () => {
  const location = useLocation()
  const data = location.state;


  console.log(data)

  return (
    <div>
      <h1 style={{textAlign: "center"}}>Booking Details </h1>
      <h1>Flight Reservations</h1>
      <table style={{width:"80vw", margin: "auto auto", border: "1px solid black"}}>

            <tr style={{ border: "1px solid black"}}>
              <th>Passenger Name</th>
              <th>Passenger Email</th>
              <th>Passenger Phone</th>
              <th>Date of departure</th>
              <th>Departure City</th>
              <th>Arrival City</th>

            </tr>
            <tbody>
            {data.flightTickets.map((val, idx) => (
              <tr key={idx} style={{ border: "1px solid black"}}>
                <td>{val.passenger.firstName}</td>
                <td>{val.passenger.email}</td>
                <td>{val.passenger.phone}</td>
                <td>{val.flight.dateOfDeparture}</td>
                <td>{val.flight.departureCityLocation.name}</td>
                <td>{val.flight.arrivalCityLocation.name}</td>
              </tr>
            ))}
          </tbody>

      </table>
<br/><br/>
      <h1>Hotel Reservations</h1>
      <table style={{width:"80vw", margin: "auto auto", border: "1px solid black"}}>
            <tr style={{ border: "1px solid black"}}>
              <th>Hotel Name</th>
              <th>Checkin Date</th>
              <th>Checkout Date</th>
              <th>Contact Email</th>
              <th>Contact Phone</th>
              <th>Number of Adults</th>
              <th>Number of Children</th>
            </tr>
            <tbody>
            {data.hotelReservations.map((val, idx) => (
              <tr key={idx} style={{ border: "1px solid black"}}>
                <td>{val.hotel.name}</td>
                <td>{val.startDate}</td>
                <td>{val.endDate}</td>
                <td>{val.contactEmail}</td>
                <td>{val.contactPhone}</td>
                <td>{val.numOfAdult}</td>
                <td>{val.numOfChildren}</td>
              </tr>
            ))}
          </tbody>

      </table>
    </div>
  )
}

export default BookingDetails