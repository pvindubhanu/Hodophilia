import React from "react"
import SearchForm from "../form-search"
import Stage01 from './stage01'


import Styles from '../css/form-addLocation.module.css';

function Stage02(props) { // after selected to location, before selected from


    return (
        <>
            <Stage01 
                id={props.id} 
                getToLocation={props.getToLocation} 
                />
            <div className={Styles['flights']}>
                <h2>To: <b>{props.toName}</b></h2>
                <div className={Styles['map']}>
                    Map should go here
                </div>
                <div className={Styles['flightsSearch']}>
                    <div className={Styles['flightsSearchInterior']}>
                        <h3>Flights</h3>
                        <SearchForm
                            placeholderSupplement="From..."
                            selectItemAction={props.getFromLocation}
                            clearSearch={true}
                        ></SearchForm>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Stage02;