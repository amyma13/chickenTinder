import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function CreateAccount() {
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');

    const handleCreateAccount = () => {
        // Handle the form submission logic here
        // You can save the user data to your database or perform any necessary actions

        // After account creation, you can navigate to another page, e.g., the homepage
        history.push('/homepage');
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
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 p-2 rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">City</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 p-2 rounded"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Zip Code</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 p-2 rounded"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                        />
                    </div>

                    <button
                        className="bg-indigo-800 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
                        onClick={handleCreateAccount}
                    >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateAccount;
