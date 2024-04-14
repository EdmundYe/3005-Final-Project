const { Pool } = require('pg');
const readline = require('readline');


const pool = new Pool({
    user: 'egershte',  // Replace this with your OS username or 'postgres' if you want to use the default PostgreSQL user
    host: 'localhost',
    database: 'mydatabase',
    password: '',  // Leave this as an empty string if no password is set
    port: 5432,
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const getAllStudents = async () => {
    const res = await pool.query('SELECT * FROM students ORDER BY student_id');
    console.log('Retrieving all students:');
    console.log(res.rows);
};

const addStudent = async (first_name, last_name, email, enrollment_date) => {
    await pool.query('INSERT INTO students (first_name, last_name, email, enrollment_date) VALUES ($1, $2, $3, $4)', [first_name, last_name, email, enrollment_date]);
    console.log('Student added.');
};

const updateStudentEmail = async (student_id, new_email) => {
    await pool.query('UPDATE students SET email = $1 WHERE student_id = $2', [new_email, student_id]);
    console.log('Student email updated.');
};

const deleteStudent = async (student_id) => {
    await pool.query('DELETE FROM students WHERE student_id = $1', [student_id]);
    console.log('Student deleted.');
};

const mainMenu = () => {
    rl.question(`Please choose an operation:
    1. Get All Students
    2. Add a Student
    3. Update Student Email
    4. Delete a Student
    5. Exit
Enter a number: `, async (choice) => {
        switch (choice.trim()) {
            case '1':
                await getAllStudents();
                break;
            case '2':
                rl.question('Enter first name, last name, email, enrollment date (YYYY-MM-DD), separated by commas: ', async (input) => {
                    const [first_name, last_name, email, enrollment_date] = input.split(',').map(x => x.trim());
                    await addStudent(first_name, last_name, email, enrollment_date);
                    mainMenu();
                });
            
                break;
            case '3':
                rl.question('Enter student ID and new email, separated by a comma: ', async (input) => {
                    const [student_id, new_email] = input.split(',').map(x => x.trim());
                    await updateStudentEmail(parseInt(student_id), new_email);
                    mainMenu();
                });
                
                break;
            case '4':
                rl.question('Enter the student ID to delete: ', async (input) => {
                    await deleteStudent(parseInt(input.trim()));
                    mainMenu();
                });
                break;
           
            case '5':
                rl.close();
                return;
            default:
                console.log('Invalid choice, please enter a number between 1 and 5.');
                return;
        }
        mainMenu();
        //rl.close();
    });
};

rl.on('close', () => {
    console.log('Exiting the application. Goodbye!');
    process.exit(0);
});


mainMenu();

