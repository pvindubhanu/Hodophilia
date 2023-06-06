import axios from "axios";

const API_URL = "http://localhost:8080/auth/";

class AuthService {
    login(email, password) {
        return axios
            .post(API_URL + "login", {
                email,
                password
            });
    }

    register(name, email, password, securityQuestion1, securityQuestion2, mfa) {
        return axios.post(API_URL + "signup", {
            name,
            email,
            password,
            securityQuestion1,
            securityQuestion2,
            mfa
        });
    }
    
    verify(email, code) {
        return axios.post(API_URL + "verify", {
            email,
            code
        });
    }
    
    forgotPasswordEmail(email) {
        return axios.post(API_URL + "forgot_password", {
            email
        });
    }

    forgotPasswordSQs(email, securityQuestion1, securityQuestion2) {
        return axios.post(API_URL + "forgot_password_questions", {
            email,
            securityQuestion1,
            securityQuestion2
        });
    }
    
    resetPassword(token, password) {
        return axios.post(API_URL + "reset_password", {
            token,
            password
        });
    }
}

export default new AuthService();
