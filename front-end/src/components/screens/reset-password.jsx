import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';

import REDIRECT_TIMEOUT from '../../constants/redirect';
import placeholderText from '../../constants/formPlaceholder';
import auth from '../../services/auth';
import PageWrapper from './wrappers/wrapper-formPage';

import LoginFormCSS from '../css/form-loginSignup.module.css';

export default function VerifyLogin() {

    const redirectTo = '/login';

    const navigate = useNavigate();
    
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    
    const providedToken = searchParams.get('token');
    
    function handlePasswordInput(e) {
        setPassword(e.target.value);
    }
    
    function handlePasswordConfirmInput(e) {
        setPassword2(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (password === password2) {
            // console.log("Sending: \ntoken: " + providedToken + "\npassword: " + password);
            auth.resetPassword(providedToken, password)
                .then(response => {
                    console.log(response);
                    setSuccessMsg(`You have successfully changed passwords!`);
                    setTimeout(() => {
                        navigate(redirectTo);
                    }, REDIRECT_TIMEOUT)
                })
                .catch(e => {
                    console.error(e);
                    setErrorMsg("Code is incorrect.");
                })
                
        }
        else { // passwords do not match
            setErrorMsg("Passwords do not match.");
        }
    }

    function createFormTemplate(children) {
        return (
            <PageWrapper>
                <h1>Reset Password</h1>
                <form className={LoginFormCSS['login-signup']} onSubmit={handleSubmit}>
                    {children}
                </form>
            </PageWrapper>
        )
    }

    return (
        createFormTemplate(
            (
                <>
                    {
                        errorMsg && (
                            <p className={LoginFormCSS['errorMsg']}>{errorMsg}</p>
                        )
                    }
                    {
                        successMsg && (
                            <p>{successMsg}</p>
                        )
                    }
                    <label>
                        Enter new password
                        <input type="password" name="newPassword" placeholder={placeholderText("password")} value={password} onChange={handlePasswordInput}></input>
                    </label>
                    <label>
                        Re-enter new password
                        <input type="password" name="newPassword" placeholder={placeholderText("password again")} value={password2} onChange={handlePasswordConfirmInput}></input>
                    </label>
                    <input type="submit" value="Submit"></input>
                </>
            )
        )
    )
}