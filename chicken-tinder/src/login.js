import React, { useState, useEffect } from 'react';
import './login.css';  // You can remove this line if not needed
import { useHistory } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider, db } from "./firebase";
import { collection, doc, setDoc } from "firebase/firestore";

/*TODO
regular login button should work
sign up button should do something
*/


function Login() {
  const history = useHistory();
  const [email, setEmail] = useState('');

  async function pushAccount(e) {
    console.log("pushed");
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        uploadToDB(user.email, user.displayName);

        async function uploadToDB(emailEntered, displayName) {
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
    <div className="flex items-center justify-center" style={{ height: '100vh' }}>
      <div className="my-10 text-center">
        <h1 className="text-4xl font-semibold mb-4">
          <span className="text-yellow-800">🐔 Chicken</span>T <span>🔥</span>
        </h1>

        <hr className="w-20 border-t-2 border-blue-500 mb-8" />

        <div className="bg-white rounded-lg shadow-lg p-8 w-96">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <input type="text" className="w-full border border-gray-300 p-2 rounded" id="username" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input type="password" className="w-full border border-gray-300 p-2 rounded" id="password" />
          </div>

          <button
            className="bg-indigo-800 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
          >
            Login
          </button>


          <p className="text-gray-600 text-center">
            Don't have an account?{' '}
            <a href="#" className="hover:text-blue-500">
              Sign Up
            </a>
          </p>
        </div>

        <button
          className="border-gray-300 border text-black font-bold py-2 px-4 rounded mt-4"
          onClick={(event) => pushAccount(event)}
        >
          Sign in with Google
        </button>

      </div>
    </div>

  );


}

export default Login;