import { React } from 'react';
import { CheckOutlined, ArrowRightOutlined } from '@ant-design/icons'

import Styles from './css/list-itinerarySelect.module.css'

function ActionItem({action, isActive, alt}) {

    function performAction() {
        // if (!isActive) action();
        action();
    }

    return ( 
        <div className={Styles['buttonContainer']}>
            <button className={Styles['icon']} alt={alt} onClick={performAction}>
                {isActive ? <CheckOutlined /> : <ArrowRightOutlined />}
            </button>
        </div>
     );
}

export default ActionItem;