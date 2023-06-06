import React from 'react';

import Styles from '../../css/wrapper-formPage.module.css';

function sharedItrWrapper({ children }) {
    return (
        <div id={Styles['sharedItineraryPageWrapper']}>
            {children}
        </div>
    );
}

export default sharedItrWrapper;