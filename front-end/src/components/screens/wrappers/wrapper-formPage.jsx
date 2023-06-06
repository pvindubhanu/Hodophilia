import React from 'react';

import Styles from '../../css/wrapper-formPage.module.css';

function PageWrapper({ children }) {
    return (
        <div id={Styles['pageWrapper']}>
            {children}
        </div>
    );
}

export default PageWrapper;