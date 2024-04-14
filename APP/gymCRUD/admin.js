const readline = require('readline');
const pool = require('./db');

function handleAdmin(rl, callback) {
    console.log("\n--- Admin Login ---");
    rl.question('Enter your name to login: ', (name) => {
        loginAdmin(name, rl, callback);
    });
}




function loginAdmin(name, rl, callback) {
    pool.query('SELECT * FROM admin WHERE name = $1', [name], (err, result) => {
        if (err) {
            console.error('Error executing query', err.stack);
            handleAdmin(rl, callback); // Go back to login prompt on error
        } else if (result.rows.length > 0) {
            console.log(`Login successful for: ${name}`);
            adminMenu(rl, callback, name);
        } else {
            console.log('Invalid login, please try another name.');
            handleAdmin(rl, callback);
        }
    });
}

function adminMenu(rl, callback, name) {
    console.log("\n--- Admin Menu ---");
    console.log("1: Manage Rooms");
    console.log("2: Equipment Maintenance");
    console.log("3: Update Class Schedule");
    console.log("4: Process Payments");
    console.log("5: Exit");
    rl.question('Choose an option: ', (option) => {
        switch (option.toLowerCase()) {
            case '1':
            case 'manage rooms':
                manageRoomBookings(rl, callback, name);
                break;
            case '2':
            case 'equipment maintenance':
                equipmentCheck(rl, callback, name);
                break;
            case '3':
            case 'update class schedule':
                updateClassSchedule(rl, callback, name);
                break;
            case '4':
            case 'process payments':
                processPayments(rl, callback, name)
                break;
            case '5':
            case 'exit':
                rl.close();
                console.log('Exiting system. Goodbye!');
                process.exit();
                break;
            default:
                console.log('Invalid option.');
                handleAdmin(rl, callback);
        }
    });
}

function equipmentCheck(rl, callback, name) {
    pool.query('SELECT * FROM equipment', (err, result) => {
        if (err) {
            console.error('Error retrieving equipment', err.stack);
            adminMenu(rl, callback, email, name);
        } else {
            console.log('Available Equipment:');
            console.log('0: Exit');
            result.rows.forEach((row, index) => {
                console.log(`${index + 1}: ${row.equipment_type.padEnd(20)} - expiry date:  ${row.maintenance_date.padEnd(20)}`);
            });
            rl.question("Enter the number of the equipment you'd like to update: ", (number) => {
                number -= 1;
                if (number >= result.rows.length) {
                    console.log('invalid selection...')
                    equipmentCheck(rl, callback, name);
                } else {
                    if (number == -1)
                        adminMenu(rl, callback, name);
                    let selection = result.rows[number];
                    rl.question('Please update maintenance date in the form YYYY-MM-DD: ', (date) => {
                        pool.query(
                            `UPDATE equipment 
                                    SET 
                                        maintenance_date = $1 
                                    WHERE equipment_type = $2`, [date, selection.equipment_type], (err, result) => {
                            if (err) {
                                console.error('Error updating equipment', err.stack);
                                adminMenu(rl, callback, name);
                            } else {
                                console.log('Successfully updated equipment');
                                adminMenu(rl, callback, name);
                            }
                        });
                    });

                }
            });
        }
    })
}

function updateClassSchedule(rl, callback, name) {
    pool.query('SELECT * FROM schedule', (err, result) => {
        if (err) {
            console.error('Error retrieving schedules', err.stack);
            adminMenu(rl, callback, email, name);
        } else {
            console.log('Available Schedules:');
            result.rows.forEach((row, index) => {
                console.log(`${index + 1}: ${row.name.padEnd(10)} with ${row.trainer_name.padEnd(20)} from ${row.start_time} to ${row.end_time} on ${row.date} in room: ${row.room}`);
            });
            rl.question('Enter the number of the schedule you want to change: ', (number) => {
                number -= 1;
                if (number >= result.rows.length) {
                    console.log('invalid selection...')
                    manageRoomBookings(rl, callback, name);
                } else {
                    let selection = result.rows[number];
                    rl.question(`Enter new date in the form YYYY-MM-DD: `, (date) => {
                        rl.question(`Enter new start time: `, (startTime) => {
                            rl.question(`Enter new end time: `, (endTime) => {
                                pool.query(
                                    `UPDATE schedule 
                                    SET 
                                    date = $3, start_time = $4, end_time = $5 
                                    WHERE name = $1 AND room = $2 AND trainer_name = $6
                                `, [selection.name, selection.room, date, startTime, endTime, selection.trainer_name], (err, result) => {
                                    if (err) {
                                        console.error('Error updating schedule', err.stack);
                                        adminMenu(rl, callback, name);
                                    } else {
                                        console.log('Successfully updated schedule');
                                        adminMenu(rl, callback, name);
                                    }
                                });
                            });
                        });

                    });

                }
            });
        }
    });
}

function processPayments(rl, callback, name) {
    pool.query('SELECT p.*, m.email, m.name AS member_name FROM payment p JOIN member m ON p.member_id = m.member_id', (err, result) => {
        if (err) {
            console.error('Error retrieving payment records', err.stack);
            adminMenu(rl, callback, email, name);
        } else {
            console.log('Payment Records:');
            result.rows.forEach((row, index) => {
              
                console.log(`${index + 1}: Member Name: ${row.member_name.padEnd(15)} ID: ${row.member_id.toString().padEnd(2)} Email: ${row.email.padEnd(25)} Service: ${row.service}`);
            });
        }
    });
}

function manageRoomBookings(rl, callback, name) {

    pool.query('SELECT * FROM schedule', (err, result) => {
        if (err) {
            console.error('Error retrieving schedules', err.stack);
            adminMenu(rl, callback, email, name);
        } else {
            console.log('Available Schedules:');
            result.rows.forEach((row, index) => {
                console.log(`${index + 1}: ${row.name.padEnd(10)} with ${row.trainer_name.padEnd(20)} from ${row.start_time} to ${row.end_time} on ${row.date} in room: ${row.room}`);
            });
            rl.question('Enter the number of the schedule you want to change the room booking: ', (number) => {
                number -= 1;
                if (number >= result.rows.length) {
                    console.log('invalid selection...')
                    manageRoomBookings(rl, callback, name);
                } else {
                    let selection = result.rows[number];
                    rl.question('Please select a room to assign ', (room) => {
                        pool.query(
                            `UPDATE schedule 
                                SET 
                                    room = $1 
                                WHERE date = $2 AND start_time = $3 AND end_time = $4 AND trainer_name = $5`, [room, selection.date, selection.start_time, selection.end_time, selection.trainer_name], (err, result) => {
                            if (err) {
                                console.error('Error updating schedule', err.stack);
                                adminMenu(rl, callback, name);
                            } else {
                                console.log('Successfully updated schedule');
                                adminMenu(rl, callback, name);
                            }
                        });
                    });
                }
            });
        }
    });
}

module.exports = { handleAdmin };
