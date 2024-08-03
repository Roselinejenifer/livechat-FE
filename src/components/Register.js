import React, { useState } from 'react';
import axios from 'axios';
import "../App.css";
const Register = ({open,setOpen}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        // let baseUrl = process.env.REACT_APP_API_URL;
        e.preventDefault();
        try {
            const response = await axios.post(`https://live-chat-be.onrender.com/api/auth/register`, { username, password })
            // response.data.msg === 'User registered successfully' ? setError('User registered successfully') : setError('User already exists');
            // console.log(response.data)
            .then((response) => {
                if(response.data.msg === 'User registered successfully'){
                    sessionStorage.setItem('username', username);
                    // setOpen(true);
                    alert("User registered successfully")
                    alert("Please login to continue")

                }
            })
            .catch((error) => {
                console.log(error);
            })
        } catch (err) {
            setError('Registration failed');
        }
    };

    return (
        <div className='register'>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Register</button>
            {error && <p>{error}</p>}
        </form>
        {/* <button onClick={()=>{setOpen(true)}}>Login</button> */}
        </div>
        
    );
};

export default Register;
