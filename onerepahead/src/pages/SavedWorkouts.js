import React, { useState, useEffect } from 'react';
import { useAuthUser, useIsAuthenticated} from "react-auth-kit";
import { useNavigate } from 'react-router-dom';
import Navbar from '../NavBar';
import '../stylesheets/SavedWorkouts.css'

function SavedWorkouts() {
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [exerciseNames, setExerciseNames] = useState({});
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [sets, setSets] = useState([]);
  const navigate = useNavigate();
  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const userId = isAuthenticated ? auth().id : null;

  useEffect(() => {
    async function fetchSavedWorkouts() {
      try {
        const response = await fetch(`http://localhost:5000/api/saved-workouts/${userId}`);
        const data = await response.json();
        setSavedWorkouts(data);
      } catch (error) {
        console.error('Error fetching saved workouts:', error);
      }
    }

    async function fetchExerciseNames() {
      try {
        const response = await fetch('http://localhost:5000/api/exercises');
        const data = await response.json();

        // Create a mapping of exercise IDs to exercise names
        const exerciseNameMapping = {};
        data.forEach((exercise) => {
          exerciseNameMapping[exercise.id] = exercise.name;
        });

        setExerciseNames(exerciseNameMapping);
      } catch (error) {
        console.error('Error fetching exercise names:', error);
      }
    }

    fetchSavedWorkouts();
    fetchExerciseNames();
  }, [userId]);

  async function fetchSets(workoutId) {
      try {
        const response = await fetch(`http://localhost:5000/api/saved-workouts/${workoutId}/sets`);
        if (response.ok) {
          const data = await response.json();
          console.log('SETS',data)
          localStorage.setItem('selectedWorkoutSets', JSON.stringify(data));
        } else {
          console.error('Failed to fetch sets for workout.');
        }
      } catch (error) {
        console.error('Error fetching sets:', error);
      }
    }

  const handleWorkoutClick = (workoutId) => {
    // Toggle the expanded workout
    setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId);
  };

  const handleRemoveWorkout = async (workoutId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/remove-workout/${workoutId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Workout removed successfully from the database, update the state
        setSavedWorkouts(savedWorkouts.filter((workout) => workout.id !== workoutId));
      } else {
        console.error('Failed to remove workout.');
      }
    } catch (error) {
      console.error('Error removing workout:', error);
    }
  };

  const handleDoWorkoutClick = (workout) => {
    let id = 0;
    const workoutFormatted = [];
    const sets = null;
    console.log(' workout:' + JSON.stringify(workout))
    console.log('exercise names', exerciseNames)
    fetchSets(workout.id)
    workout.exercise_order.map((workout_id) => {
      workoutFormatted.push({ id : id, name : exerciseNames[workout_id]})
      id++;
    })
    console.log('wf', workoutFormatted)
    // Redirect to the "/workouts" page
    localStorage.setItem('selectedWorkout', JSON.stringify(workoutFormatted));
    localStorage.setItem('selectedWorkoutSets', workout.id);
    navigate(`/workouts`);
  };

  return (
    <div className="saved-workouts-container">
      <h1>Saved Workouts</h1>
      <div className="workout-list">
        {savedWorkouts.map((workout) => (
          <div className={`workout-box ${expandedWorkout === workout.id ? 'expanded' : ''}`} key={workout.id} onClick={() => handleWorkoutClick(workout.id)}>
            <h2>{workout.workout_name}</h2>
            <button onClick={() => handleDoWorkoutClick(workout)}>Do Workout</button>
            {expandedWorkout === workout.id && (
              <div className="exercise-list">
                <h3>Exercise Order:</h3>
                <ul>
                  {workout.exercise_order.map((exerciseId, index) => (
                    <li key={exerciseId}>
                      <span className="exercise-name">{exerciseNames[exerciseId]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
             <button onClick={() => handleRemoveWorkout(workout.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedWorkouts;