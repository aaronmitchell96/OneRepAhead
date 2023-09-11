const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cors = require('cors')


const app = express();
const PORT = process.env.PORT || 5000;

// Example user database (replace this with a proper database in a real application)
const pool = new Pool({
    user: 'aaron',
    host: 'localhost',
    database: 'onerepahead_login',
    password: '@Amitch1711',
    port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

//LOGIN AND LOGOUT CAPABILITIES

app.post('/api/register', async (req, res) => {
    const { username, password, first_name, last_name, age, height, weight } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Check if the username already exists in the database
   const checkQuery = 'SELECT * FROM users WHERE username = $1';
   const existingUser = await pool.query(checkQuery, [username]);

   if (existingUser.rows.length > 0) {
       return res.status(400).json({ message: 'Username already exists.' });
   }


    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = 'INSERT INTO users (username, password, first_name, last_name, age, height, weight) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    try {
        await pool.query(query, [username, hashedPassword, first_name, last_name, age, height, weight]);
        res.json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }

});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
 
    const query = 'SELECT * FROM users WHERE username = $1';
    try {
        const result = await pool.query(query, [username]);
        const user = result.rows[0];
 
        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }
 
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password.' });
        }
 
        // Create and send a JWT token
        const token = jwt.sign({ username: user.username }, 'secret_key', { expiresIn: '1h' });
        res.json({ token, username, id: user.id });
    } catch (error) {        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
 });

 // Retrieve user by ID
app.get('/api/users/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const result = await pool.query(query, [userId]);
  
      const user = result.rows[0];
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Retrieve all users
  app.get('/api/users', async (req, res) => {
    try {
      const query = 'SELECT * FROM users';
      const result = await pool.query(query);
  
      const users = result.rows;
      if (users) {
        res.json(users);
      } else {
        res.status(404).json({ message: 'Users not found' });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Retrieve workouts based on selected muscle group
  app.get('/api/workouts', async (req, res) => {
    const selectedMuscleGroup = req.query.muscleGroup;
  
    let workouts;
    if (!selectedMuscleGroup || selectedMuscleGroup === 'all') {
      workouts = await pool.query('SELECT * FROM workouts');
    } else {
      workouts = await pool.query(
        'SELECT w.* FROM workouts w JOIN muscle_group_rel m ON w.id = m.workout_id WHERE m.muscle_group = $1',
        [selectedMuscleGroup]
      );
    }
  
    res.json(workouts.rows);
  });

  app.get('/api/exercises', async (req, res) => {
    try {
      const query = 'SELECT * FROM exercises'; // Change 'exercises' to your actual table name
      const result = await pool.query(query);
      const exercises = result.rows;
      res.json(exercises);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Retrieve distinct muscle groups
  app.get('/api/muscleGroups', async (req, res) => {
    try {
      const response = await pool.query('SELECT DISTINCT muscle_group FROM muscle_group_rel');
      const muscleGroups = response.rows.map(row => row.muscle_group);
      res.json(muscleGroups);
    } catch (error) {
      console.error('Error fetching muscle groups:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/exercises/:muscleGroup', async (req, res) => {
    const muscleGroup = req.params.muscleGroup;
  
    if (!muscleGroup || muscleGroup === 'all') {
      // If 'muscleGroup' is not provided or is 'all', fetch all workouts
      try {
        const workouts = await pool.query('SELECT * FROM exercises');
        res.json(workouts.rows);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      // If a specific 'muscleGroup' is provided, filter workouts by that group
      try {
        const query = `
          SELECT w.* 
          FROM exercises w 
          JOIN muscle_group_rel m ON w.id = m.workout_id 
          WHERE m.muscle_group = $1`;
        const workouts = await pool.query(query, [muscleGroup]);
        res.json(workouts.rows);
      } catch (error) {
        console.error('Error fetching workouts by muscle group:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  });
  
  // Create a new saved workout for a user
  app.post('/api/save-workout', async (req, res) => {
    const { workoutName, exercises, userId } = req.body;
  
    try {
      // Insert the workout data into the 'saved_workouts' table
      const insertWorkoutQuery =
        'INSERT INTO saved_workouts (user_id, workout_name, exercise_order) VALUES ($1, $2, $3) RETURNING id';
      const exerciseOrder = exercises.map((exercise) => exercise.exerciseId);
  
      const workoutResult = await pool.query(insertWorkoutQuery, [
        userId,
        workoutName,
        exerciseOrder,
      ]);
      const workoutId = workoutResult.rows[0].id;
  
      // Create an array to store all sets for this workout
      const allSets = exercises.map((exercise) => exercise.sets);
  
      // Insert all sets into the 'saved_workout_sets' table as an array
      const insertSetsQuery =
        'INSERT INTO saved_workout_sets (saved_workout_id, sets) VALUES ($1, $2)';
      const sets = JSON.stringify(allSets);
  
      await pool.query(insertSetsQuery, [workoutId, sets]);
  
      res.json({ message: 'Workout saved successfully.', workoutId });
    } catch (error) {
      console.error('Error saving workout:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });

  app.get('/api/saved-workouts/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Query the database to retrieve saved workouts for the specified user
      const query =
        'SELECT saved_workouts.id, saved_workouts.workout_name, saved_workouts.exercise_order, saved_workout_sets.sets ' +
        'FROM saved_workouts ' +
        'LEFT JOIN saved_workout_sets ON saved_workouts.id = saved_workout_sets.saved_workout_id ' +
        'WHERE saved_workouts.user_id = $1';
  
      const result = await pool.query(query, [userId]);
  
      // Transform the result to group sets by workout
      const workouts = {};
      result.rows.forEach((row) => {
        const { id, workout_name, exercise_order, sets } = row;
  
        if (!workouts[id]) {
          workouts[id] = {
            id,
            workout_name,
            exercise_order,
            sets: [],
          };
        }
  
        if (sets) {
          workouts[id].sets.push(sets);
        }
      });
  
      // Convert the workouts object into an array
      const workoutsArray = Object.values(workouts);
  
      res.json(workoutsArray);
    } catch (error) {
      console.error('Error fetching saved workouts:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/saved-workouts/:workoutId/sets', async (req, res) => {
    const workoutId = req.params.workoutId;
  
    try {
      // Query the database to retrieve all sets for the specified saved workout
      const query = 'SELECT sets, saved_date FROM saved_workout_sets WHERE saved_workout_id = $1';
      const result = await pool.query(query, [workoutId]);
  
      // Return the sets as JSON
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching sets for saved workout:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.delete('/api/remove-workout/:workoutId', async (req, res) => {
    const workoutId = req.params.workoutId;
  
    try {
      // Perform a database query to remove the workout
      const deleteWorkoutQuery = 'DELETE FROM saved_workouts WHERE id = $1';
      const deleteWorkoutResult = await pool.query(deleteWorkoutQuery, [workoutId]);
  
      if (deleteWorkoutResult.rowCount === 1) {
        // Successfully removed the workout
        res.status(200).json({ message: 'Workout removed successfully.' });
      } else {
        // The workout with the specified ID was not found
        res.status(404).json({ message: 'Workout not found.' });
      }
    } catch (error) {
      console.error('Error removing workout:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  