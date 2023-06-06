import Styles from './css/graphic-starRating.module.css';
import { MAX_RATING } from '../constants/rating';

function StarRating({rating}) {

    let cssRating = 100 - ((rating / MAX_RATING) * 100);
    console.log(cssRating);

    return ( 
        <div 
            className={Styles['starRating']}
            style={{backgroundPositionX: `${cssRating}%`}}    
        ></div>
     );
}

export default StarRating;