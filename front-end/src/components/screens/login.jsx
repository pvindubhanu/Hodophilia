import { useState } from 'react';

import PageWrapper from './wrappers/wrapper-formPage.jsx';
import LoginWith from '../button-loginWith.jsx';
import InputForm from '../form-loginSignup.jsx';

import GoogleSVG from '../../assets/icons/Google_ G _Logo.svg';
import FacebookSVG from '../../assets/icons/Facebook_f_logo_(2019).svg';
import EmailSVG from '../../assets/icons/email-svgrepo-com.svg';

export default function Login() {


    const [showEmailLogin, setShowEmailLogin] = useState(false);

    const displayEmailLogin = () => {
        setShowEmailLogin(!showEmailLogin); // toggles email login field
    }



    let emailLoginForm = null;
    if (showEmailLogin) {
        emailLoginForm = (
            <>
                <hr />
                <InputForm />
            </>
        )
    }

    return (
        <PageWrapper>
            <h1>Login</h1>
            <LoginWith icon={GoogleSVG} href="http://localhost:8080/oauth2/authorize/google?redirect_uri=http://localhost:3000/oauth2/redirect">Google</LoginWith>
{/*             <LoginWith icon={FacebookSVG}>Facebook</LoginWith> */}
            <LoginWith icon={EmailSVG} onClick={displayEmailLogin}>Email</LoginWith>
            {emailLoginForm}
        </PageWrapper>
    );
}

