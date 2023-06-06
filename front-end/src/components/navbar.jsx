import HodophiliaLogo from './hodophiliaLogo';
import { useContext } from 'react';
import { LoginContext } from '../contexts/loginContext';
import { useNavigate } from 'react-router-dom';

import Styles from './css/navbar.module.css';

export default function Navbar() {
    const user = useContext(LoginContext);
    const navigate = useNavigate();
    return (
        <nav className={Styles["nav"]}>
            <HodophiliaLogo />
            {(user.email !== "") ?
                <button className={Styles['userPageLink']} onClick={() => navigate('/profile')}>
                    
                    <div className={Styles['nameDetails']}>
                        <img 
                            src={require('../assets/icons/ironman.jpeg')} 
                            alt='pfp' 
                            className={Styles['nameImage']}
                            />
                        <p className={Styles["nav-username"]}>{user.email}</p>
                        <p className={Styles['nav-itinerary']}>
                            {
                                ((user.getItinerary()) && (
                                    <>{user.getItinerary().itineraryName}</>
                                )) 
                                ||
                                (
                                    <>Choose itinerary...</>
                                )
                            }
                        </p>
                    </div>
                    <button
                        // style={{backgroundColor: 'black', padding: '10px', borderRadius: '20px'}}
                        className={Styles["nav-logout"]}
                        onClick={() => {user.logout()}}
                    >
                        Logout
                    </button>
                </button>
            :
                <ul>
                    <li>
                        <button onClick={() => navigate('/login')}>Login</button>
                    </li>
                    <li>
                        <button className={Styles['signup']} onClick={() => navigate('/signup')}>Signup</button>
                    </li>
                </ul>
            }
        </nav>
    )
}