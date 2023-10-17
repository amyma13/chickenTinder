import React from 'react';
import './login.css';
import { useHistory } from 'react-router-dom';

function Login() {
  const history = useHistory();

  const navigateToHomePage = () => {
    console.log('Navigating to the restaurant list');
    // You can implement the navigation logic here
    history.push('/homepage');
  };

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
        <button className="login-button" onClick={navigateToHomePage}>
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
