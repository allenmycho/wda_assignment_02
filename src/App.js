import React, { Component } from 'react';
import logo from './logo.svg';
import Login from './auth/Login';
import ApiApp from './ApiApp';
import NavBar from './NavBar';
import './App.css';
import { Navbar, Jumbotron, Button } from 'react-bootstrap';

class App extends Component {
    render() {
        return (
            <div class="container">
                <NavBar />
                <div class="row">
                    <div class="col-md-4 col-md-offset-4">
                        <Login />
                        <ApiApp />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;