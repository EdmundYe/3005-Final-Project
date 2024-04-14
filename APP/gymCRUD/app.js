const readline = require('readline');
const { handleMember } = require('./members');
const { handleTrainer } = require('./trainers');
const { handleAdmin } = require('./admin');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mainMenu() {
    console.log('\nWelcome to the Health and Fitness Club Management System!');
    console.log("1: Member");
    console.log("2: Trainer");
    console.log("3: Admin");
    console.log("4: Exit");
    rl.question('Select your role: ', (answer) => {
        switch (answer.toLowerCase()) {
            case '1':
            case 'member':
                handleMember(rl, mainMenu);
                break;
            case 'trainer':
            case '2':
                handleTrainer(rl, mainMenu);
                break;
            case 'admin':
            case '3':
                handleAdmin(rl, mainMenu);
                break;
            case 'exit':
            case '4':
                console.log('Thank you for using the system!');
                rl.close();
                break;
            default:
                console.log('Invalid option, please try again.');
                mainMenu();
        }
    });
}

mainMenu();
