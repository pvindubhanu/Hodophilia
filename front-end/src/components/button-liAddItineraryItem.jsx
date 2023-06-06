import { React } from 'react';
import { CalendarOutlined, CalendarFilled, PropertySafetyFilled } from '@ant-design/icons'

import Styles from './css/list-itinerarySelect.module.css'

function AddItineraryItem({style, action, isActive, alt}) {

    function performAction() {
        if (!isActive) action();
        // action();
    }

    return ( 
        <div className={Styles['buttonContainer']} >
            <button className={Styles['icon']} style={style} alt={alt} onClick={performAction}>
                {isActive ? <CalendarFilled /> : <CalendarOutlined />}
            </button>
        </div>
     );
}

export default AddItineraryItem;