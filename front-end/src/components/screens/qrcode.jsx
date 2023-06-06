import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import PageWrapper from './wrappers/wrapper-formPage';
import FormStyles from '../css/form-loginSignup.module.css';

export default function QRCode() {

    const navigate = useNavigate();
    let navigateLocation = '/login';

    const location = useLocation();
    const [image] = useState(location.state?.qrCode || "");

    function handleReturn(e) {
        e.preventDefault();
        navigate(navigateLocation);
    }

    return (
        <PageWrapper>
            <h1>QR Code</h1>
            <img src={image} alt="QR Code"></img>
            <br></br>
            <button className={FormStyles['formButton']} onClick={handleReturn}>Return to {navigateLocation.substring(1)}</button>
        </PageWrapper>
    )
}