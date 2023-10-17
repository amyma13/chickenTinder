import React from 'react';
import './login.css';
import { useHistory } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore"; 

function Login() {
  const history = useHistory();

  const navigateToHomePage = () => {
    
    console.log('Navigating to the homepage');
    // You can implement the navigation logic here
    //history.push('/homepage');
  };

    function pushAccount(e){
        e.preventDefault();
        console.log("pushed");
        // signInWithPopup(auth, provider)
        // .then((result) => {
        // // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // // The signed-in user info.
        // const user = result.user;
        // // IdP data available using getAdditionalUserInfo(result)
        // // ...
        // }).catch((error) => {
        // // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // // The email of the user's account used.
        // const email = error.customData.email;
        // // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // // ...
        // });
    }

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form>
        <div className="input-container">
          <label>Email:</label>
          <input type="text" id="email" />
        </div>
        <div className="input-container">
          <label>Password:</label>
          <input type="password" id="password" />
        </div>
        <button className="login-button" onClick={(e) => pushAccount(e)}>
          Login
        </button>
      </form>
      <p>
        Don't have an account? <a href="#">Create Account</a>
      </p>
    </div>
  );
}

export default Login;
