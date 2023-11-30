import React, { useState } from 'react'
import './LoginSignup.css'
import Button from 'react-bootstrap/Button';
// import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



const LoginSignup = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedSite, setSelectedSite] = useState('');
    const [selectedUserSites, setSelectedUserSites] = useState(null);
    const navigate = useNavigate();



    function handleUsername(event) {
        setUsername(event.target.value);
        const uName_input = event.target.value;
        // console.log(uName_input)
        const requestData = {
            username: uName_input,
            // Add other data as needed
        };
    
        fetch(`https://github.modernland.co.id/api/v1/user/site-user/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add any other headers if needed
            },
            body: JSON.stringify(requestData),
        })
        .then((response) => {
            if (response.ok) {
                return response.json(); // Parse the JSON response
            } else {
                throw new Error('User not found');
            }
        })
        .then((data) => {
            // Check if the 'result' array is present in the response
            if (data && data.result) {
                // Assuming 'result' is an array of sites
                const sites = data.result;

                // Update your state or perform other actions with the data
                setSelectedUserSites(sites);
            } else {
                // Handle the case where the expected data structure is not present
                throw new Error('Invalid response format');
            }
        })
        .catch((error) => {
            console.error('Error fetching user details:', error);
            // Display an alert or error message as needed
        });
    }
    function handlePassword(event) {
        setPassword(event.target.value);
    }
    function handleSite(event) {
        setSelectedSite(event.target.value);
    }

    function handleLoginSubmit() {
        const data = {
            username : username,
            password : password,
            site     : selectedSite,
        }

        const url = "https://github.modernland.co.id/api/v1/login"
        fetch(url, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify(data)
        })
        .then((response) => {
            if (response.ok) {
                return response.json(); // Parse the JSON response
            } else {
                throw new Error('User not found');
            }
        })
        .then((data) => {
            // Check if the 'result' array is present in the response
            if (data && data.result) {
          
              // Call the onLogin callback to update the App state
              onLogin(data.result);
              
              const newValue = data.result;
              
              // Simpan data di localStorage
              localStorage.setItem('dataUser', JSON.stringify(newValue));
              const isLogin = localStorage.setItem('Login', true);
              // Redirect to the new page upon successful login
              navigate('/Home'); // Change '/dashboard' to your desired route
            } else {
              // Handle the case where the expected data structure is not present
              throw new Error('Invalid response format');
            }
          })
          
        .catch((error) => {
            console.error('Error fetching user details:', error);
            // Display an alert or error message as needed
        });
    }


    
    
    return (
        <div className="container">
            <div className="header">
                <div className="text">Modernland</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="label">
                    Username
                </div>
                <div className="input">
                    <input type="text" onChange={handleUsername} placeholder='Username'/>
                </div>
                <div className="label">
                    Password
                </div>
                <div className="input">
                    <input type="password" onChange={handlePassword} placeholder='Password'/>
                </div>
                <div className="label">
                    Site
                </div>
                <div className="input">
                    <select className="input" value={selectedSite} onChange={handleSite} required>
                        <option value="" disabled hidden>Select site</option>
                        {/* Tampilkan Site secara dinamik berdasarkan selected user */}
                        {selectedUserSites &&
                            selectedUserSites.map((site) => (
                                <option key={site.id} value={site.code}>{site.name}</option>
                            ))}
                    </select>                    
                </div>
                <div className="button">
                    <Button variant="primary" onClick={handleLoginSubmit}>Sign In</Button>{' '}
                </div>
            </div>
        </div>
    )
}

export default LoginSignup