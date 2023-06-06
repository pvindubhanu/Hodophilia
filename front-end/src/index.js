import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import 'normalize.css';
import './global.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './tailwind.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* The start of our application */}
  </React.StrictMode>
);
