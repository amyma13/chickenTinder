import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { db, auth } from "./firebase";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";

function CreateAccount() {
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [error, setError] = useState('');

    const saltRounds = 10;

    const handleCreateAccount = async () => {
        // Handle the form submission logic here
        // You can save the user data to your database or perform any necessary actions

        // After account creation, you can navigate to another page, e.g., the homepage
        
        try {
            const findDoc = doc(db, "Users", username);
            const docUserInfo = await getDoc(findDoc);
            if (docUserInfo.exists()) {
                console.log("Username taken")
                setError("Username taken");
            }
            else {
                bcrypt.hash(password, saltRounds, async function(err, hash) {
                    if (err){
                        setError(err);
                        throw err;
                    } 
                    // Store the hash in your database
                    const ref = collection(db, "Users");
                    await setDoc(doc(ref, username), {
                    username: username,
                    password: hash,
                    city: city,
                    zipCode: zipCode,
                    name: username
                    });
                  });

                sessionStorage.setItem("username", username);

                history.push('/homepage');
            }
        }
        catch(error){
            console.log("Error uploading to database: "+error);
            setError("Error uploading to database: "+error);
        }


    };

    return (
        <div className="flex items-center justify-center" style={{ height: '100vh' }}>
            <div className="my-10 text-left">
                <h1 className="text-4xl font-semibold mb-4">
                    <span className="text-yellow-800">🐔 Chicken</span>T <span>🔥</span>
                </h1>

                <hr className="w-20 border-t-2 border-blue-500 mb-8" />

                <div className="bg-white rounded-lg shadow-lg p-8 w-96">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Username</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 p-2 rounded"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 p-2 rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">City</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 p-2 rounded"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Zip Code</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 p-2 rounded"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            required
                        />
                    </div>
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <button
                        className="bg-indigo-800 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
                        onClick={handleCreateAccount}
                    >
                        Create Account
                    </button>
                </div>
                <Link to="/" className="text-indigo-700 mt-4">Go Back</Link>
            </div>
        </div>
    );
}

export default CreateAccount;
