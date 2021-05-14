import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import firebase from "firebase";
import 'firebase/firestore'
import 'firebase/auth'

firebase.initializeApp({
    apiKey: "AIzaSyBVWjtzmLenPfVW0WMi6l2bjfi2eM0nzxc",
    authDomain: "chat-fddc5.firebaseapp.com",
    projectId: "chat-fddc5",
    storageBucket: "chat-fddc5.appspot.com",
    messagingSenderId: "488830618123",
    appId: "1:488830618123:web:6aa8c8d0480a59f4ed550e"
    }
);

export const Context = createContext(null)

const auth = firebase.auth()
const firestore = firebase.firestore()


ReactDOM.render(
    <Context.Provider value={{
        firebase,
        auth,
        firestore
    }}>
        <App />
    </Context.Provider>,
  document.getElementById('root')
);

