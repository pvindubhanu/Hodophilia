import {React, useState} from "react";
import Stage02 from "./stage02";

import Styles from '../css/form-addLocation.module.css';
import FormSearchStyles from '../css/form-search.module.css'


const FLIGHTS_DISPLAY_RESULTS = 3;

function Stage03(props) { // after selected from

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const [flightTimes, setFlightTimes] = useState(
        ['03/21', '03/25', '03/28', '04/10', '04/13', '04/17', '04/24', '06/21', '06/23', '07/11', '07/14', '07/17', '09/08', '09/12', '09/21', '11/04', '11/07']
    );
    const [selectedFlight, setSelectedFlight] = useState(null);

    function getIndexOfNearestDate() {
        let ftM = flightTimes.map(item => {
            let month = item.split('/')[0];
            month = Number.parseInt(month);
            return month;
        })
        let dM = new Date().getMonth();
        for (let i = 0; i < ftM.length; i++) {
            if (ftM[i] >= dM) return i;
        }
        return 0;
    }

    // function selectFlight(index) {
    //     setSelectedFlight(
    //         <div className={Styles['selectedFlight']}>
    //             You've selected flight <span>{flightTimes[index]}</span>
    //         </div>
    //     )
    // }

    function selectFlight(index) {
        props.getFlight(flightTimes[index]);
    }

    return (
        <>
            <Stage02 
                id={props.id} 
                toName={props.toName} 
                getToLocation={props.getToLocation} 
                getFromLocation={props.getFromLocation} 
                />
            <h2>From: <b>{props.fromName}</b></h2>
            <div className={Styles['flightsSearch']}>
                <div className={Styles['flightsSearchInterior']}>

                    <h3 style={{ display: 'block', margin: '.8em 0' }}>Available flights</h3>
                    <div className={Styles['flightsSearchRow']}>
                        <h4>Narrow down results</h4>
                        <div className={FormSearchStyles['homepage-search']}>
                            <form className={FormSearchStyles['homepage-search-bar']}>
                                <div className={FormSearchStyles['homepage-search-bar-flex']}>
                                    <input type="date" autoComplete='off'></input>
                                </div>
                            </form>
                        </div>
                    </div>
                    <ul className={Styles['results']}>
                        {
                            flightTimes
                                .slice(getIndexOfNearestDate()) // grab the sub-list starting at the nearest date
                                .concat(flightTimes.slice(0, getIndexOfNearestDate())) // combine the full list
                                .slice(0, FLIGHTS_DISPLAY_RESULTS)
                                .map((time, index) => {
                                    let t = time + "/" + new Date().getFullYear();
                                    return (
                                        <li key={index}>
                                            {t}
                                            <button onClick={() => { props.getFlight(t) }}>Select flight</button>
                                        </li>
                                    )
                                })
                        }
                    </ul>

                </div>
            </div>
        </>
    )
}

export default Stage03;