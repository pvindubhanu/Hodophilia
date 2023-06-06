import React from "react";
import {ShareAltOutlined} from '@ant-design/icons'

import Styles from './css/list-itinerarySelect.module.css'

function ShareItem({action}) {
    return ( 
        <button className={Styles['icon']} onClick={action}>
            <ShareAltOutlined />
        </button>
     );
}

export default ShareItem;