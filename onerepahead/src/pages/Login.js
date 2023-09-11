import Navbar from "../NavBar";

import React, { useState } from 'react';
import { useSignIn, useIsAuthenticated, useAuthUser, getCookie} from 'react-auth-kit'

const LoginForm = () => {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');

   const signIn = useSignIn()

   const handleLogin = async () => {

       try {
           const response = await fetch('http://localhost:5000/api/login', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify({ username, password }),
           });

           const data = await response.json();
           console.log(data)
           signIn({
            token: data.token,
            expiresIn: 30,
            tokenType: "Bearer",
            authState: { id: data.id,
                        username: data.username 
                    }
           })

           if (response.ok) {
               // Successful login logic here
                console.log('Logged in successfully!', data)
               window.location.href = `/profile`
           }
       } catch (error) {
           console.error('Error logging in:', error);
       }
   };

   return (
       <div className="login-form">
        <Navbar/>
           <h2>Login</h2>
           {error && <p className="error">{error}</p>}
           <div>
               <input
                   type="text"
                   placeholder="Username"
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
               />
           </div>
           <div>
               <input
                   type="password"
                   placeholder="Password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
               />
           </div>
           <button onClick={handleLogin}>Login</button>
       </div>
   );
};

export default LoginForm;