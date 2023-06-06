import React from "react";
import { DeleteOutlined } from '@ant-design/icons'

import Styles from './css/list-itinerarySelect.module.css'

function DeleteItem({action, displayDelete = true}) {
    return (
        <div>
            {displayDelete ?
                <button className={Styles['icon']} onClick={action}>
                    <DeleteOutlined />
                </button> : null
            }
        </div>

     );
}

export default DeleteItem;