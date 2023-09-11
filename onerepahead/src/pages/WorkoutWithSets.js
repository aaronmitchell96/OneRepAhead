import React, { useState } from 'react';

function WorkoutWithSets({ workout, onRemove, onAddSet }) {
  const [newSet, setNewSet] = useState({ reps: '', weight: '' });
  const [sets, setSets] = useState([]); // State to hold the sets

  const handleAddSet = () => {
    if (newSet.reps.trim() !== '' && newSet.weight.trim() !== '') {
      const updatedWorkout = {
        ...workout,
        sets: [{ ...newSet }], // Create a new set object and add it to the workout's sets array
      };
      onAddSet(workout.id, updatedWorkout.sets); // Notify the parent component of the update
      setSets([...sets, { ...newSet }]); // Create a new set object and add it to the local state
      setNewSet({ reps: '', weight: '' });
    }
  };

  return (
    <div className='dropped-workout'>
      <h3>{workout.name}</h3>
      <div className='sets-container'>
        {sets.map((set, index) => (
          <div key={index} className='set'>
            Set {index + 1}: Reps - {set.reps}, Weight - {set.weight}
          </div>
        ))}
      </div>
      <div className='add-set'>
        <input
          type='text'
          placeholder='Reps'
          value={newSet.reps}
          onChange={(e) => setNewSet({ ...newSet, reps: e.target.value })}
        />
        <input
          type='text'
          placeholder='Weight (lbs)'
          value={newSet.weight}
          onChange={(e) => setNewSet({ ...newSet, weight: e.target.value })}
        />
        <button onClick={handleAddSet}>Add Set</button>
      </div>
      <button onClick={() => onRemove(workout.id)}>Remove</button>
    </div>
  );
}

export default WorkoutWithSets;