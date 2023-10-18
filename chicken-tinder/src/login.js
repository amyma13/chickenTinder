import React, { useState, useEffect } from 'react';
import './login.css';  // You can remove this line if not needed
import { useHistory } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider, db } from "./firebase";
import { collection, doc, setDoc } from "firebase/firestore";

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState('');

  async function pushAccount(e) {
    // Your existing code
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-semibold mb-4">Chicken Tinder</h1>
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
          onClick={(event) => pushAccount(event)}
        >
          Login
        </button>

        <p className="text-gray-600 text-center">Don't have an account? <a href="#">Sign Up</a></p>
      </div>

      <button
        className="bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={(event) => pushAccount(event)}
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;
