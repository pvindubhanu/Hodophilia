import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useRef } from "react";

import AuthService from '../services/auth';
import { LoginContext } from "../contexts/loginContext";
import * as SecurityQuestions from '../constants/securityQuestions';
import REDIRECT_TIMEOUT from "../constants/redirect";
import placeholderText from "../constants/formPlaceholder";

import Styles from './css/form-loginSignup.module.css';
import { useEffect } from "react";

export default function LoginSignupForm({ isSignup }) {

    const context = useContext(LoginContext);

    const ref = useRef(null);
    const executeScroll = () => ref.current?.scrollIntoView({behavior: 'smooth'});
    useEffect(() => {
        if (!isSignup) executeScroll()
    }, [isSignup]);

    const [nameInput, setNameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [secQuestion1, setSecQuestion1] = useState("");
    const [secQuestion2, setSecQuestion2] = useState("");
    const [mfa, setMFA] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [successMsg, setSuccessMsg] = useState("");

    let navigate = useNavigate();

    function handleNameChange(e) {
        setNameInput(e.target.value);
    }

    function handleEmailChange(e) {
        setEmailInput(e.target.value);
    }

    function handlePasswordChange(e) {
        setPasswordInput(e.target.value);
    }

    function handleSQ1Change(e) {
        setSecQuestion1(e.target.value);
    }

    function handleSQ2Change(e) {
        setSecQuestion2(e.target.value);
    }

    function handleMFAChange(e) {
        console.log(e.target.checked);
        setMFA(e.target.checked);
    }

    function handleSubmitError(e) {
        let message = e.response.data?.message || "Unknown error.";
        let messages = message.split('\n');
        setErrorMessages([...messages]);
    }

    function forgotPassword(e) {
        e.preventDefault();
        navigate('/account-recovery', {
            state: {
                emailInput
            }
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        setSuccessMsg("");
        setErrorMessages([]);

        let redirectURL = '/';
        let redirectOptions = {};

        if (isSignup) {
            let signupPromise = AuthService.register(nameInput, emailInput, passwordInput, secQuestion1, secQuestion2, mfa)
                .then((response) => {
                    if (response.data?.mfa === true) {
                        redirectURL = '/qrcode';
                        redirectOptions = {
                            state: {
                                qrCode: response.data.secretImageUri
                            }
                        }
                        setSuccessMsg(`${nameInput}, you are being redirected to 2FA sign up with email: ${emailInput}`)
                    }
                    else {
                        setSuccessMsg(`${nameInput}, you have successfully signed up with email: ${emailInput}!`)
                    }
                    console.log(response)
                })
            signupPromise.catch(e => {console.log("signupPromiseCatch error:", e); handleSubmitError(e)})
            signupPromise.then(() => {
                setTimeout(() => {
                    navigate(redirectURL, redirectOptions);
                }, REDIRECT_TIMEOUT)
            })
        }
        else { // if user is logging in

            let loginPromise = AuthService.login(emailInput, passwordInput)
                .then((response) => {
                    console.log(response);
                    if (response.data?.message === "") { // the user has opted for 2fa
                        redirectURL = '/verifylogin';
                        redirectOptions = {
                            state: {
                                email: emailInput
                            }
                        }
                    }
                    else if (response.data?.accessToken) {
                        context.login(null, emailInput, [], response.data.accessToken); // TODO: fill first field or remove it
                        console.log("Successfully logged in!");
                        setSuccessMsg(`You have successfully logged in, ${emailInput}!`);
                    }
                    else throw new Error("accessToken field not included in AuthService response.")
                });
            loginPromise.catch(e => handleSubmitError(e))
            loginPromise.then (() => {
                    setTimeout(() => {
                        navigate(redirectURL, redirectOptions);
                    }, REDIRECT_TIMEOUT)
                })

        }

    }

    // these fields are JSX expressions generated based on
    // whether user is accessing this form from the signup page
    let newAccountField = null;
    let nameFields = null;
    let securityQuestions = null;
    let forgotPasswordButton = null;

    // generates the additional JSX
    if (!isSignup) {
        newAccountField = (
            <p>Don't have an account? Click <Link to="../signup">Here</Link> to create a new account.</p>
        );
        forgotPasswordButton = (
            <button onClick={forgotPassword}>Forgot password</button>
        )
    }
    else { // if this is the signup page
        newAccountField = (
            <p>Already have an account? Click <Link to="../login">Here</Link> to sign in.</p>
        );
        nameFields = (
            <label>
                Name
                <input type="text" name="name" placeholder={placeholderText("name")} value={nameInput} onChange={handleNameChange} autoComplete={(isSignup) ? "new-password" : "off"} />
            </label>
        );
        securityQuestions = (
            <>
                <h2>Security Questions</h2>
                <label>
                    {SecurityQuestions.SECURITY_QUESTION_1}
                    <input type="text" name="sq1" placeholder={placeholderText("security question 1")} value={secQuestion1} onChange={handleSQ1Change} autoComplete={(isSignup) ? "new-password" : "off"} />
                </label>
                <label>
                    {SecurityQuestions.SECURITY_QUESTION_2}
                    <input type="text" name="sq2" placeholder={placeholderText("security question 2")} value={secQuestion2} onChange={handleSQ2Change} autoComplete={(isSignup) ? "new-password" : "off"} />
                </label>
                <label>
                    Multifactor authentication
                    <input type="checkbox" name="enableMFA" onChange={handleMFAChange} autoComplete="new-password" />
                </label>
            </>
        );
    }

    return (
        <>
            <div ref={ref} style={{width: 0, height: 0, padding: 0, margin: 0}}></div>
            <form className={Styles["login-signup"]} onSubmit={handleSubmit}>
                {(successMsg) && (
                    <p className={Styles["successMsg"]}>{successMsg}</p>
                )}
                {errorMessages.map((msg, index) => {
                    return (
                        <p
                            key={`ErrorNo-${index.toString()}`}
                            className={Styles["errorMsg"]}
                        >
                            {msg}
                        </p>
                    )
                })}
                {(
                    isSignup &&
                    <h2>General</h2>
                )}
                {nameFields}
                <label>
                    Email
                    <input type="email" size="50" name="Email" placeholder={placeholderText("email")} value={emailInput} onChange={handleEmailChange} autoComplete={(isSignup) ? "new-password" : "off"} required />
                </label>
                <label>
                    Password
                    <input type="password" name="Password" placeholder={placeholderText("password")} value={passwordInput} onChange={handlePasswordChange} autoComplete={(isSignup) ? "new-password" : "off"} />
                </label>
                {securityQuestions}
                {forgotPasswordButton}
                <input type="submit" value="Submit" />
            </form>
            {newAccountField}
        </>
    )
}