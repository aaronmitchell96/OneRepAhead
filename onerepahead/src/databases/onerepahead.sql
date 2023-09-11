\c onerepahead_login

-- CREATE TABLE saved_workouts (
--   id SERIAL PRIMARY KEY,
--   user_id INT REFERENCES users(id),
--   workout_name VARCHAR(255),
--   exercise_order INTEGER[],
--   sets json
-- );

CREATE TABLE saved_workout_sets (
  id SERIAL PRIMARY KEY,
  saved_workout_id INT REFERENCES saved_workouts(id),
  sets json,
  saved_date DATE DEFAULT CURRENT_DATE
);