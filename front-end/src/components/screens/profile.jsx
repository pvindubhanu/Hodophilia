import { useContext, useEffect } from "react";
import PageWrapper from "./wrappers/wrapper-regularPage";
import { LoginContext } from "../../contexts/loginContext";
import { useNavigate } from "react-router-dom";
import ItinerarySelect from "../list-itinerarySelect";
import ItineraryDetails from "../list-itineraryDetails";
import CommentList from "../list_commentLines";

// import Styles from './css/profile.module.css'

export default function Profile(navpagestate) {

    const currentuser = useContext(LoginContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentuser.token === "") {
            navigate('/login');
        }
    }, [navigate, navpagestate]);
    

    return (
        <PageWrapper>
            <div>
                <h1>Welcome {currentuser.email}!</h1>
                <button onClick={() => navigate('/sharedItr')}> View Shared Itinerary</button>
            </div>

            <ItinerarySelect />
            <ItineraryDetails />

        </PageWrapper>
    )
}