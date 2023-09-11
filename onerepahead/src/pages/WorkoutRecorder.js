import React, { useState } from 'react';
import WorkoutWithSets from './WorkoutWithSets';
import { useAuthUser, useIsAuthenticated} from "react-auth-kit";
import { useActionData } from 'react-router-dom';

function WorkoutRecorder() {
  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const userId = isAuthenticated ? auth().id : null;
  const savedSelectedWorkout = localStorage.getItem('selectedWorkout');
  console.log('ls', JSON.parse(savedSelectedWorkout))
  const [droppedWorkouts, setDroppedWorkouts] = useState(
    savedSelectedWorkout ? JSON.parse(savedSelectedWorkout) : []
  );

  console.log('dw',droppedWorkouts)
  const handleDrop = (e) => {
    e.preventDefault();
    const workoutData = JSON.parse(e.dataTransfer.getData('text/plain'));
    // Add an initial empty sets array to the workout
    setDroppedWorkouts([...droppedWorkouts, { ...workoutData, sets: [] }]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveWorkout = (workoutId) => {
    const updatedWorkouts = droppedWorkouts.filter((workout) => workout.id !== workoutId);
    setDroppedWorkouts(updatedWorkouts);
  };

  const handleAddSet = (workoutId, newSet) => {
    // Update the sets of the specific workout
    const updatedWorkouts = droppedWorkouts.map((workout) => {
      if (workout.id === workoutId) {
        return { ...workout, sets: [...workout.sets, newSet] };
      }
      return workout;
    });

    setDroppedWorkouts(updatedWorkouts);
  };

  const handleSaveWorkouts = () => {
    // Prompt the user to enter a name for the workout
    const workoutName = prompt("Enter a name for your workout:");
  
    if (!workoutName) {
      // Handle the case where the user cancels the prompt or enters an empty name
      alert("Workout name cannot be empty.");
      return;
    }
  
    // Create an array to hold each workout with its sets
    const combinedWorkout = droppedWorkouts.map((workout) => ({
      exerciseId: workout.id,
      exerciseName: workout.name,
      sets: workout.sets,
    }));
    
    const workoutData = {
      userId: userId,
      workoutName, 
      exercises: combinedWorkout,
    };
    
    // Log the combined workout array to the console to check its content
    console.log("Combined Workout:", workoutData);
  

    // Send the combined workout array to the backend
    saveWorkoutToBackend(workoutData);
  
    // Reset the droppedWorkouts state
    setDroppedWorkouts([]);
  
    alert("Workout saved successfully.");
  };

 const saveWorkoutToBackend = async (workoutData) => {
  try {
    const response = await fetch(`http://localhost:5000/api/save-workout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workoutData),
    });

    if (response.ok) {
      // Handle success (e.g., show a success message)
      console.log('Workout saved successfully.');
    } else {
      // Handle errors (e.g., show an error message)
      console.error('Failed to save workout.');
    }
  } catch (error) {
    console.error('Error saving workout:', error);
  }
};

  return (
    <div className='workout-recorder'>
      <h2>Workout Recorder</h2>
      <div className='drop-area' onDrop={handleDrop} onDragOver={handleDragOver}>
        {droppedWorkouts.map((workout) => (
          <WorkoutWithSets
            key={workout.id}
            workout={workout}
            onRemove={handleRemoveWorkout}
            onAddSet={handleAddSet}
          />
      
        ))}
      </div>
      <button onClick={handleSaveWorkouts}>Save Workouts</button>
    </div>
  );
}

export default WorkoutRecorder;