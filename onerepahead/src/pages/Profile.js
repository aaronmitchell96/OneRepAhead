import Navbar from "../NavBar";
import React, { useState, useEffect } from 'react';
import { useAuthUser } from "react-auth-kit";
import SavedWorkouts from "./SavedWorkouts";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [savedWorkouts, setSavedWorkouts] = useState([]);
    const auth = useAuthUser();
    const userId = auth().id;

    useEffect(() => {
        // Fetch user data based on userId
        fetch(`http://localhost:5000/api/users/${userId}`)
            .then(response => response.json())
            .then(userData => setUser(userData))
            .catch(error => console.error('Error fetching user:', error));
    }, [userId]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile">
            <Navbar />
            <h2>Profile Page</h2>
            <h1>Welcome {user.first_name}</h1>

            <SavedWorkouts/>
        </div>
    );
};

export default Profile;