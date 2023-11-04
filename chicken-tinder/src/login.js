import React, { useState, useEffect } from 'react';
import './login.css';
import { Link, useHistory } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider, db } from "./firebase";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";


function Login() {
  const history = useHistory();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigateToCreateAccount = () => {
    history.push("/createAccount");
  };


  const loginWithoutGoogle = async () => {
    try {
      const findDoc = doc(db, "Users", username);
      const docUserInfo = await getDoc(findDoc);
      if (docUserInfo.exists()) {
        if (docUserInfo.data().password === password) {
          sessionStorage.setItem("username", username);
          setPassword("");
          history.push("/homepage")
        } else {
          setError("Wrong password")
        }
      }
      else {
        setError("User doesn't exist");
      }
    }
    catch (error) {
      setError("There is an error getting info from database: " + error)
    }
    //history.push('/homepage');
  };

  async function pushGoogleAccount(e) {
    // Your existing code
    console.log("pushed");
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        uploadToDB(user.email, user.displayName);

        //setUsername(user.email);
        sessionStorage.setItem("username", user.email);


        async function uploadToDB(emailEntered, displayName) {
          console.log("WE IN HERE");
          try {
            const findDoc = doc(db, "Users", auth.currentUser.email);
            const docUserInfo = await getDoc(findDoc);
            console.log("Doc Data:", docUserInfo.data());
            if (!docUserInfo.exists()) {
              console.log("USER DOESN'T EXIST");
              const ref = collection(db, "Users");
              await setDoc(doc(ref, emailEntered), {
                name: displayName,
                email: emailEntered
              });
            }


          }
          catch (error) {
            console.log("Uploading to database didn't work");
          }

        }
        console.log("WORK??")

        history.push('/homepage')

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
    <div className="flex items-center justify-center" style={{ height: '100vh' }}>
      <div className="my-10 text-center">
        <h1 className="text-4xl font-semibold mb-4 text-left">
          <span className="text-yellow-800">🐔 Chicken</span>T <span>🔥</span>
        </h1>

        <hr className="w-20 border-t-2 border-blue-500 mb-8" />

        <div className="bg-white rounded-lg shadow-lg p-8 w-96">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 text-left">Username</label>
            <input type="text" className="w-full border border-gray-300 p-2 rounded" id="username" onChange={(event) => setUsername(event.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 text-left">Password</label>
            <input type="password" className="w-full border border-gray-300 p-2 rounded" id="password" onChange={(event) => setPassword(event.target.value)} />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <button
            className="bg-indigo-800 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
            onClick={(event) => loginWithoutGoogle(event)}
          >
            Login
          </button>


          <p className="text-gray-600 text-center">
            Don't have an account?{' '}
            <button onClick={navigateToCreateAccount} className="hover:text-blue-500">
              Sign Up
            </button>
          </p>
        </div>

        <button
          className="border-gray-300 border text-black font-bold py-2 px-4 rounded mt-4"
          onClick={(event) => pushGoogleAccount(event)}
        >
          Sign in with Google
        </button>


      </div>
    </div>

  );


}

export default Login;

