import React from "react";
import {CheckOutlined} from '@ant-design/icons'

import Styles from './css/list-itinerarySelect.module.css'

function CheckItem() {
    return (
        <button className={Styles['icon']}>
            <CheckOutlined />
        </button>
    );
}

export default CheckItem;