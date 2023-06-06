import { useNavigate } from 'react-router-dom';
import Styles from './css/hodophiliaLogo.module.css';

export default function Hodophilia() {

    const navigate = useNavigate();

    return (
        <button onClick={() => navigate('/')} className={Styles['home-anchor']}>
            <h2 className={Styles['hodophilia-logo']}>Hodophilia</h2>
        </button>
    )
}