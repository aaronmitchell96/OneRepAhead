import React, { useState, useEffect } from 'react';
import Navbar from '../NavBar';
import '../stylesheets/Workouts.css' 
import WorkoutRecorder from './WorkoutRecorder';
import MuscleGroupFilter from './MuscleGroupFilter';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all');
  const [availableMuscleGroups, setAvailableMuscleGroups] = useState([]);
  const [draggedWorkout, setDraggedWorkout] = useState(null);
  

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const apiUrl = selectedMuscleGroup === 'all'
          ? 'http://localhost:5000/api/exercises'
          : `http://localhost:5000/api/exercises/${selectedMuscleGroup}`;
  
        const response = await fetch(apiUrl);
        const data = await response.json();
        setWorkouts(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    }
    async function fetchMuscleGroups() {
      try {
        const response = await fetch('http://localhost:5000/api/muscleGroups'); // Your API endpoint for muscle groups
        const data = await response.json();
        setAvailableMuscleGroups(data);
      } catch (error) {
        console.error('Error fetching muscle groups:', error);
      }
    }

    fetchWorkouts();
    fetchMuscleGroups();
  }, [selectedMuscleGroup]);

  const [flippedWorkoutId, setFlippedWorkoutId] = useState(null);

  const handleCardClick = (workoutId) => {
    setFlippedWorkoutId(workoutId === flippedWorkoutId ? null : workoutId);
  };

  const handleDragStart = (e, workout) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(workout));
    setDraggedWorkout(workout);
  };

  const handleDragEnd = () => {
    setDraggedWorkout(null);
  };

  const handleMuscleGroupChange = (event) => {
    setSelectedMuscleGroup(event.target.value);
  };

  

  return (
    <div>
      <Navbar />
      <h1>Workout Selector</h1>
      <MuscleGroupFilter
        muscleGroups={availableMuscleGroups}
        selectedMuscleGroup={selectedMuscleGroup}
        onChange={handleMuscleGroupChange}
      />
      <div className='workout-selector'>
        {workouts.map((workout) => (
          <div
            key={workout.id}
            className={`workout-card ${flippedWorkoutId === workout.id ? 'flipped' : ''}`}
            onClick={() => handleCardClick(workout.id)}
            draggable
            onDragStart={(e) => handleDragStart(e, workout)}
            onDragEnd={handleDragEnd}
          >
            <div className='workout-card-inner'>
              <div className='front'>
                <h2>{workout.name}</h2>
              </div>
              <div className='back'>
                <p>Difficulty: {workout.difficulty}</p>
                <p>{workout.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <WorkoutRecorder />
    </div>
  );
}

export default Workouts;