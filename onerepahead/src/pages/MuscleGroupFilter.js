import React from 'react';

const MuscleGroupFilter = ({ muscleGroups, selectedMuscleGroup, onChange }) => {
  return (
    <div>
      <label htmlFor="muscleGroup">Filter by Muscle Group:</label>
      <select id="muscleGroup" value={selectedMuscleGroup} onChange={onChange}>
        <option value="all">All Muscle Groups</option>
        {muscleGroups.map((group) => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MuscleGroupFilter;