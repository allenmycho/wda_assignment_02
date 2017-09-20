import React from 'react';
import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyDKUElhDiSKjNCG5Um77s6qmsZy_YTp-ys",
    authDomain: "wda-facebook-auth.firebaseapp.com",
    databaseURL: "https://wda-facebook-auth.firebaseio.com",
    storageBucket: "wda-facebook-auth.appspot.com",
    messagingSenderId: "961775098930"
};

firebase.initializeApp(config);

export const ref = firebase.database().ref();
export const auth = firebase.auth;
export const provider = new firebase.auth.FacebookAuthProvider();

class Login extends React.Component {

    constructor(props,context) {
        super(props,context);
        this.state = {
            user: null,
        };
    }

    async login() {
        const result = await auth().signInWithPopup(provider)
        this.setState({user: result.user});
    }

    async logout() {
        await auth().signOut()
        this.setState({user: null});
    }

    async componentWillMount() {
        const user = await auth.onAuthStateChanged();
        if(user) this.setState({user})
    }

    render() {
        return (
            <div className="App">
                <p>{this.state.user ? `Hi, ${this.state.user.displayName}!` : 'Hi!'}</p>
                <button onClick={this.login.bind(this)}>
                    Login with Facebook
                </button>

                <button onClick={this.logout.bind(this)}>
                    Logout
                </button>


            </div>


        );
    }
}

export default Login;