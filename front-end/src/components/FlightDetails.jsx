import React, {useContext, useEffect, useState} from "react";
import {getSharedItineraryComments} from "../services/comments";
import {getAllSharedItinerary} from "../services/sharedItinerary";
import {LoginContext} from "../contexts/loginContext";
import FlightBookingsModuleCss from "./css/flightBookings.module.css";


function FlightDetails(availFlights) {

    return (
        <>
            <div className="MuiCardContent-root snipcss-Q8zPE">
                <div className={FlightBookingsModuleCss['MuiGrid-container'] + "MuiGrid-root"}>
                    <div
                        className={FlightBookingsModuleCss['MuiGrid-item MuiGrid-grid-xs-2'] + "MuiGrid-root"}>
                        <div
                            className={FlightBookingsModuleCss['MuiAvatar-root'] + "MuiAvatar-circle"}>
                            <img alt="Indigo"
                                 src="https://www.logosurfer.com/wp-content/uploads/2018/03/indigo-logo_0.png"
                                 className={FlightBookingsModuleCss['MuiAvatar-img']} />
                        </div>
                    </div>
                    <div
                        className={FlightBookingsModuleCss['MuiGrid-item makeStyles-textAlignCenter-14 MuiGrid-grid-xs-2'] + "MuiGrid-root"}>
                        <p className={FlightBookingsModuleCss['MuiTypography-root MuiTypography-body1 MuiTypography-alignCenter']}>
                            20:00
                        </p>
                        <span
                            className={FlightBookingsModuleCss['MuiTypography-root MuiTypography-caption']}>
        Mumbai
      </span>
                    </div>
                    <div
                        className={FlightBookingsModuleCss['MuiGrid-item makeStyles-textAlignCenter-14 MuiGrid-grid-xs-2'] + "MuiGrid-root"}>
                        <p className={FlightBookingsModuleCss['MuiTypography-root MuiTypography-body1']}>
                            Indigo
                        </p>
                        <span
                            className={FlightBookingsModuleCss['MuiTypography-root MuiTypography-caption']}>
        6E-278
      </span>
                        <br />
                        <span className={FlightBookingsModuleCss['MuiTypography-root MuiTypography-caption']}>
        No Stops
      </span>
                    </div>
                    <div
                        className={FlightBookingsModuleCss['MuiGrid-item makeStyles-textAlignCenter-14 MuiGrid-grid-xs-2'] + "MuiGrid-root"}>
                        <p className={FlightBookingsModuleCss['MuiTypography-root MuiTypography-body1']}>
                            22:00
                        </p>
                        <span
                            className={FlightBookingsModuleCss['MuiTypography-root MuiTypography-caption']}>
        New Delhi
      </span>
                    </div>
                    <div
                        className={FlightBookingsModuleCss['MuiGrid-item MuiGrid-grid-xs-4 makeStyles-textAlign-13'] + "MuiGrid-root"}>
                        <button
                            className={FlightBookingsModuleCss['MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary']}
                            tabIndex="0" type="button">
        <span className={FlightBookingsModuleCss['MuiButton-label']}>
          Rs. 4,355
        </span>
                            <span className={FlightBookingsModuleCss['MuiTouchRipple-root']}>
        </span>
                        </button>
                    </div>
                </div>
            </div>
        </>


    );
}

export default FlightDetails;