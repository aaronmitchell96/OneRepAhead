import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../NavBar';

const SignupForm = () => {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [first_name, setFirstName] = useState('');
   const [last_name, setLastName] = useState('');
   const [age, setAge] = useState('');
   const [weight, setWeight] = useState('');
   const [height, setHeight] = useState('');
   const [error, setError] = useState('');

   const handleSignup = async () => {
       try {
           const response = await fetch('http://localhost:5000/api/register', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify({ username, password, first_name, last_name, age, weight, height }),
           });

           const data = await response.json();

           if (response.ok) {
               console.log('Registered successfully!', data);
               // You can redirect or display a success message here
               window.location.href = '/profile';
           } else {
               setError(data.message);
           }
       } catch (error) {
           console.error('Error signing up:', error);
       }
   };

   return (
       <div className="signup-form">
        <Navbar/>
           <h2>Sign Up</h2>
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
           <div>
               <input
                   type="text"
                   placeholder="First Name"
                   value={first_name}
                   onChange={(e) => setFirstName(e.target.value)}
               />
           </div>
           <div>
               <input
                   type="text"
                   placeholder="Last Name"
                   value={last_name}
                   onChange={(e) => setLastName(e.target.value)}
               />
           </div>
           <div>
               <input
                   type="text"
                   placeholder="Age"
                   value={age}
                   onChange={(e) => setAge(e.target.value)}
               />
           </div>
           <div>
               <input
                   type="text"
                   placeholder="Height"
                   value={height}
                   onChange={(e) => setHeight(e.target.value)}
               />
           </div>
           <div>
               <input
                   type="text"
                   placeholder="Weight"
                   value={weight}
                   onChange={(e) => setWeight(e.target.value)}
               />
           </div>
           <button onClick={handleSignup}>Sign Up</button>
       </div>
   );
};

export default SignupForm;