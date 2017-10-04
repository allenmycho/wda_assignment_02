import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import firebase from 'firebase';
import {BrowserRouter} from 'react-router-dom';

var config = {
    apiKey: "AIzaSyBrY3SiOpLlt42Wnta1PkyNV_t3ecpxKKk",
    authDomain: "weekninermit.firebaseapp.com",
    databaseURL: "https://weekninermit.firebaseio.com",
    projectId: "weekninermit",
    storageBucket: "weekninermit.appspot.com",
    messagingSenderId: "529293666294"
};
firebase.initializeApp(config);


ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
