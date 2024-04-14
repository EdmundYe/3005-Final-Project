const readline = require('readline');
const pool = require('./db');
const mainMenu = require('./app')

function handleMember(rl, callback) {
    console.log("\n--- Member Login ---");
    rl.question('Enter your email to login or type "register" to create a new account: ', (email) => {
        if (email.toLowerCase() === 'register') {
            registerMember(rl, callback);
        } else {
            loginMember(email, rl, callback);
        }
    });
}

async function loginMember(email, rl, callback) {
    pool.query('SELECT * FROM member WHERE email = $1', [email], async (err, result) => {
        if (err) {
            console.error('Error executing query', err.stack);
            handleMember(rl, callback);  // Retry or go back to initial prompt on error
        } else if (result.rows.length > 0) {
            console.log(`Login successful for: ${email}`);
            let id = await getMemberId(email);
            memberMenu(rl, callback, email, id);  // Proceed to member menu
        } else {
            console.log('Email not found. Please register.');
            registerMember(rl, callback);  // No user found, ask to register
        }
    });
}

function registerMember(rl, callback) {
    rl.question('Enter your email to register: ', (email) => {
        // First check if the email already exists
        pool.query('SELECT email FROM member WHERE email = $1', [email], (err, result) => {
            if (err) {
                console.error('Error checking if member exists', err.stack);
                loginMember(rl, callback); // Return to member menu on error
            } else if (result.rows.length > 0) {
                console.log('Email already registered. Please log in or use a different email.');
                loginMember(rl, callback); // Return to member menu if email exists
            } else {
                // Email not found, proceed with registration
                rl.question('Enter your name: ', (name) => {
                    pool.query('INSERT INTO member(email, name) VALUES($1, $2)', [email, name], async (err, result) => {
                        if (err) {
                            console.error('Error registering new member', err.stack);
                        } else {
                            console.log(`Registration successful for: ${email}`);
                        }
                        let id = await getMemberId(email)

                        manageProfile(rl, callback, email, id, true);

                        //memberMenu(rl, callback, email, id); // Return to member menu after attempting registration
                    });
                });
            }
        });
    });
}

function getMemberId(email) {
    return new Promise((resolve, reject) => {
        // Define the SQL query to execute
        const query = 'SELECT member_id FROM member WHERE email = $1';

        // Execute the query with the provided email
        pool.query(query, [email], (err, result) => {
            if (err) {
                console.error('Error executing query to get member ID:', err);
                reject(err);
            } else if (result.rows.length > 0) {
                // Successfully found the member, resolve the promise with the member ID
                resolve(result.rows[0].member_id);
            } else {
                // No member found with that email, resolve the promise with null
                resolve(null);
            }
        });
    });
}

function memberMenu(rl, callback, email, memberId) {
    console.log("\n--- Member Menu ---");
    console.log("1: View Dashboard");
    console.log("2: Manage Profile");
    console.log("3: Schedule");
    console.log("4: Exit");
    rl.question('Choose an option: ', (option) => {
        switch (option.toLowerCase()) {
            case '1':
            case 'view dashboard':
                viewDashboard(rl, callback, email, memberId)
                break;
            case '2':
            case 'manage profile':
                manageProfile(rl, callback, email, memberId, false);
                break;
            case '3':
            case 'schedule':
                console.log('Scheduling...');
                schedule(rl, callback, email, memberId);
                break;

            case '4':
            case 'exit':
                rl.close();
                console.log('Exiting system. Goodbye!');
                process.exit();

            default:
                console.log('Invalid option.');
                memberMenu(rl, callback);
        }
    });
}

function viewDashboard(rl, callback, email, member_id) {
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



    // Query to get all exercises
    const exercisesQuery = `SELECT name FROM exercises;`;

    // Execute profile query
    pool.query(profileQuery, [member_id], (err, profileResult) => {
        if (err) {
            console.error('Error retrieving profile information', err.stack);
            memberMenu(rl, callback, email, member_id);  // Ensure member_id is passed back for menu navigation
        } else if (profileResult.rows.length > 0) {
            console.log('Profile Information:');
            const profile = profileResult.rows[0];
            console.log(`Name: ${profile.name}, Email: ${profile.email}`);
            console.log(`Member ID: ${profile.member_id}, Weight: ${profile.weight}, Height: ${profile.height}, Gender: ${profile.gender}, Age: ${profile.age}, Goal Weight: ${profile.goal_weight}`);

            // Execute exercises query
            pool.query(exercisesQuery, (err, exercisesResult) => {
                if (err) {
                    console.error('Error retrieving exercises information', err.stack);
                } else {
                    console.log('List of Exercises:');
                    exercisesResult.rows.forEach((exercise, index) => {
                        console.log(`${index + 1}. ${exercise.name}`);
                    });
                }
                memberMenu(rl, callback, email, member_id);  // Navigate back to menu
            });
        } else {
            console.log("No profile data available.");
            memberMenu(rl, callback, email, member_id);
        }
    });
}

function manageProfile(rl, callback, email, member_id, new_member) {
    console.log("Updating your profile. Please enter the following information:");

    rl.question('Enter weight (in kg): ', (weight) => {
        rl.question('Enter height (in cm): ', (height) => {
            rl.question('Enter gender (Male/Female/Other): ', (gender) => {
                rl.question('Enter age: ', (age) => {
                    rl.question('Enter goal weight (in kg): ', (goalWeight) => {

                        let query;
                        const values = [weight, height, gender, age, goalWeight, member_id];

                        if (new_member) {
                            // Use INSERT for a new member
                            query = `
                                INSERT INTO profile 
                                (member_id, weight, height, gender, age, goal_weight)
                                VALUES ($6, $1, $2, $3, $4, $5)
                            `;
                        } else {
                            // Use UPDATE for an existing member
                            query = `
                                UPDATE profile 
                                SET 
                                    weight = $1, 
                                    height = $2, 
                                    gender = $3, 
                                    age = $4, 
                                    goal_weight = $5
                                WHERE member_id = $6
                            `;
                        }



                        pool.query(query, values, (err, result) => {
                            if (err) {
                                console.error('Error updating profile', err.stack);
                            } else {
                                console.log('Profile updated successfully.');
                            }
                            memberMenu(rl, callback, email, member_id); // Ensure to pass member_id back to menu
                        });
                    });
                });
            });
        });
    });
}

function schedule(rl, callback, email, member_id) {
    listSchedules(rl, callback, email, member_id);
}
function listSchedules(rl, callback, email, member_id) {
    pool.query('SELECT * FROM schedule', (err, result) => {
        if (err) {
            console.error('Error retrieving schedules', err.stack);
            memberMenu(rl, callback, email, member_id);
        } else {
            console.log('Available Schedules:');
            result.rows.forEach((row, index) => {
                console.log(`${index + 1}: ${row.name.padEnd(10)} with ${row.trainer_name.padEnd(20)} from ${row.start_time} to ${row.end_time} on ${row.date} in room: ${row.room}`);
            });
            promptToBookSchedule(rl, callback, email, member_id, result.rows.length);
        }
    });
}

function promptToBookSchedule(rl, callback, email, member_id, totalRows) {
    rl.question('Enter the number of the schedule you want to book: ', (number) => {
        const scheduleIndex = parseInt(number) - 1; // Convert to zero-based index

        if (isNaN(scheduleIndex)) {
            console.log("Invalid input. Please enter a valid number.");
            listSchedules(rl, callback, email, member_id, totalRows);
            return;
        }

        pool.query('SELECT * FROM member_schedule', (err, result) => {
            if (err || scheduleIndex >= totalRows) {
                console.error('Invalid schedule selection', err ? err.stack : "");
                listSchedules(rl, callback, email, member_id, totalRows);
                return;
            }

            pool.query('SELECT * FROM schedule', (err2, result2) => {



                const schedule = result2.rows[scheduleIndex];
                //console.log(schedule);


                // Assuming a transaction is needed because we are performing two operations that must succeed or fail together
                pool.query('BEGIN', async (err) => {
                    if (err) {
                        console.error('Error starting transaction', err.stack);
                        return;
                    }
                    try {
                        // Insert the booking into Member_Schedule
                        await pool.query(
                            'INSERT INTO Member_Schedule (Member_ID, Start_Time, End_Time, Date, Name, Trainer_Name, Equipment_Type, Room) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                            [member_id, schedule.start_time, schedule.end_time, schedule.date, schedule.name, schedule.trainer_name, schedule.equipment_type, schedule.room]
                        );

                        await pool.query(
                            'INSERT INTO payment (member_id, service) VALUES ($1, $2)',
                            [member_id, schedule.name]
                        );

                        // Delete the schedule entry from the table
                        await pool.query('DELETE FROM schedule WHERE date = $1 AND start_time = $2 AND end_time = $3 AND trainer_name = $4', [schedule.date, schedule.start_time, schedule.end_time, schedule.trainer_name]);

                        // Commit the transaction
                        await pool.query('COMMIT');
                        console.log(`Successfully booked ${schedule.name} with ${schedule.trainer_name} on ${(schedule.date)}. Schedule has been removed.`);
                        memberMenu(rl, callback, email, member_id);
                    } catch (bookingError) {
                        // Rollback in case of error
                        await pool.query('ROLLBACK');
                        console.error('Failed to book and remove schedule', bookingError.stack);
                        memberMenu(rl, callback, email, member_id);
                    }
                });
            });
        });
    });
}


module.exports = { handleMember };
