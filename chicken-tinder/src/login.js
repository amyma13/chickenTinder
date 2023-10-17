import React, { useState, useEffect } from 'react';
import './login.css';
import { useHistory } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider, db } from "./firebase";
import { collection, doc, setDoc } from "firebase/firestore"; 


function Login() {
  const history = useHistory();


    const [email, setEmail] = useState('');

    async function pushAccount(e){

        console.log("pushed");
        signInWithPopup(auth, provider)
        .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        
        uploadToDB(user.email, user.displayName);

        async function uploadToDB (emailEntered, displayName){
            console.log("WE IN HERE");
            const ref = collection(db, "Users");

        await setDoc(doc(ref, emailEntered), {
            name: displayName,
            email: emailEntered
        });
        setEmail(emailEntered);
        }
        
        history.push('/homepage');
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        });
        
    }

  return (
    <div className="login-container">
      {/* <h1>Login</h1>
        <div className="input-container">
          <label>Email:</label>
          <input type="text" id="email" />
        </div>
        <div className="input-container">
          <label>Password:</label>
          <input type="password" id="password" />
        </div> */}
        <button className="login-button" onClick={(event) => pushAccount(event)}>
          Sign in with Google
        </button>
      {/* <p>
        Don't have an account? <a href="#">Create Account</a>
      </p> */}
    </div>
  );
}

export default Login;
