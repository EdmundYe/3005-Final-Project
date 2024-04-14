const readline = require('readline');
const pool = require('./db');

function handleTrainer(rl, callback) {
    console.log("\n--- Trainer Login ---");
    rl.question('Enter your name to login: ', (name) => {
        loginTrainer(name, rl, callback);
    });
}

function loginTrainer(name, rl, callback) {
    pool.query('SELECT * FROM trainer WHERE name = $1', [name], (err, result) => {
        if (err) {
            console.error('Error executing query', err.stack);
            handleTrainer(rl, callback); // Go back to login prompt on error
        } else if (result.rows.length > 0) {
            console.log(`Login successful for: ${name}`);
            trainerMenu(rl, callback, name);
        } else {
            console.log('Invalid login, please try another name.');
            handleTrainer(rl, callback);
        }
    });
}

function trainerMenu(rl, callback, name) {

    console.log("\n--- Trainer Menu ---");
    console.log("1: Set Availability");
    console.log("2: View Member Profile");
    console.log("3: Exit");
    rl.question('Choose an option: ', (option) => {
        switch (option.toLowerCase()) {
            case '1':
            case 'set availability':

                setAvailability(rl, callback, name);

                break;
            case '2':
            case 'view member profile':
                viewMember(rl, callback, name);  // Recursive call to show the menu again
                break;
            case '3':
            case 'exit':
                rl.close();
                console.log('Exiting system. Goodbye!');
                process.exit();
                break;
            default:
                console.log('Invalid option.');
                handleTrainer(rl, callback);
        }
    });
}

function viewMember(rl, callback, name) {
    rl.question(`Enter member name: `, (member) => {
        pool.query('SELECT * FROM member WHERE name = $1', [member], (err, result) => {
            if (err) {
                console.error('Error executing query', err.stack);
                handleTrainer(rl, callback, name); // Go back to login prompt on error
            } else {
                let member_id = result.rows[0]?.member_id;
                //console.log(member_id);
                // Query to get profile information for a specific member
                const profileQuery = `
                    SELECT 
                    m.name,
                    m.email,
                    p.weight,
                    p.height,
                    p.gender,
                    p.age,
                    p.goal_weight
                    FROM 
                        member m
                    JOIN 
                        profile p ON m.member_id = p.member_id
                    WHERE 
                        m.member_id = $1;
                `;

                // Execute profile query
                pool.query(profileQuery, [member_id], (err, profileResult) => {
                    if (err) {
                        console.error('Error retrieving profile information', err.stack);
                      
                    } else if (profileResult.rows.length > 0) {
                        console.log('Profile Information:');
                        const profile = profileResult.rows[0];
                        console.log(`Name: ${profile.name}, Email: ${profile.email}`);
                        console.log(`Member ID: ${member_id}, Weight: ${profile.weight}, Height: ${profile.height}, Gender: ${profile.gender}, Age: ${profile.age}, Goal Weight: ${profile.goal_weight}`);

                    }
                    trainerMenu(rl, callback, name);  // Ensure member_id is passed back for menu navigation
                });

            }
        });
    });
}

function setAvailability(rl, callback, name) {
    //get clock in / clock out
    pool.query('SELECT * FROM trainer WHERE name = $1', [name], (err, result) => {
        if (err) {
            console.error('Error executing query', err.stack);
            handleTrainer(rl, callback, name); // Go back to login prompt on error
        } else {
            let clockin = result.rows[0].clock_in, clockout = result.rows[0].clock_out;
            // Prompt user to enter start and end times
            rl.question(`Enter exercise name: `, (exercise) => {
                rl.question(`Enter Date in the form YYYY-MM-DD: `, (date) => {
                    rl.question(`Enter start time (between ${clockin} and ${clockout}): `, (startTime) => {
                        rl.question(`Enter end time (between ${clockin} and ${clockout}): `, (endTime) => {
                            rl.question(`Enter room number: `, (room) => {
                                // Validate start and end times

                                // Insert availability into the database
                                pool.query('INSERT INTO schedule (start_time, end_time, date, trainer_name, name, room) VALUES ($1, $2, $3, $4, $5, $6)', [startTime, endTime, date, name, exercise, room], (err, result) => {
                                    if (err) {
                                        console.error('Error setting availability', err.stack);
                                    } else {
                                        console.log('Schedule set successfully.');
                                    }
                                    trainerMenu(rl, callback, name); // Return to trainer menu
                                });

                            });
                        });
                    });
                });
            });
        }
    });

}


module.exports = { handleTrainer };
