import './index.css';
import {Helmet} from 'react-helmet'
import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {NavBar, MyApp} from './App';
import {
    BrowserRouter,
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import "bootstrap-icons/font/bootstrap-icons.css";


const TITLE = 'Collaborative Platform';

ReactDOM.render(<>
        <Helmet>
            <title>{TITLE}</title>
        </Helmet>
        <React.StrictMode>
            <BrowserRouter>
                <NavBar/>
                <MyApp/>
            </BrowserRouter>
        </React.StrictMode>
    </>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
