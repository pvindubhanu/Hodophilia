import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { LoginContext } from '../../contexts/loginContext';

import REDIRECT_TIMEOUT from '../../constants/redirect';
import auth from '../../services/auth';

import PageWrapper from './wrappers/wrapper-formPage';

import FormCSS from '../css/form-loginSignup.module.css';

export default function VerifyLogin() {

    const redirectTo = '/'; // 2 seconds before redirect

    const location = useLocation();
    const navigate = useNavigate();
    const context = useContext(LoginContext);
    const providedEmail = location.state?.email;

    const [code, setCode] = useState(0);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    function handleNumberChange(e) {
        setCode(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        auth.verify(providedEmail, code)
            .then(response => {
                console.log(response);
                context.login(null, providedEmail, [], response.data.accessToken);
                setSuccessMsg(`User ${providedEmail} has successfully logged in!`);
                setTimeout(() => {
                    navigate(redirectTo);
                }, REDIRECT_TIMEOUT)
            })
            .catch(e => {
                setErrorMsg("Code is incorrect.");
            })
    }

    return (
        <PageWrapper>
            <h1>Verify Login</h1>
            <form className={FormCSS['login-signup']} onSubmit={handleSubmit}>
                {
                    errorMsg && (
                    <p className={FormCSS['errorMsg']}>{errorMsg}</p>
                    )
                }
                {
                    successMsg && (
                        <p>{successMsg}</p>
                    )
                }
                <label>
                    Enter your code
                    <input type="number" min="0" max="999999" name="code" value={code} onChange={handleNumberChange}></input>
                </label>
                <input type="submit" value="Submit"></input>
            </form>
        </PageWrapper>
    )
}