\c onerepahead_login

-- CREATE TABLE muscle_group_rel(
--     id SERIAL NOT NULL PRIMARY KEY,
--     workouts_id INT,
--     FOREIGN KEY (workouts_id) REFERENCES workouts(id),
--     muscle_group VARCHAR(50)
-- );

INSERT INTO muscle_group_rel (workout_id,muscle_group) 
VALUES 
    (
        1, 'Chest'
    ),
    (
        2, 'Back'
    ),
    (
        3, 'Leg'
    ),
    (
        4, 'Cardio'
    ),
    (   
        5, 'Abs'
    ),
    (
        6, 'Cardio'
    )
   