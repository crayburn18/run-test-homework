const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


const employee = [];

const managerInfo = [{
    type: "input",
    name: "name",
    message: "Enter name.",
}, 
{
    type: "input",
    name: "id",
    message: "Enter ID#.",

}, 
{
    type: "input",
    name: "email",
    message: "Enter email.",
}, 
{
    type: "input",
    name: "officeNumber",
    message: "Enter office number.",
}];

const addNewEmployee = [
    {
        type: "list",
        name: "role",
        message: "Select a new team member.",
        choices: ["Engineer", "Intern", "None"]
    }
];

const engineerInfo = [{
    type: "input",
    name: "name",
    message: "Enter name.",
}, 
{
    type: "input",
    name: "id",
    message: "Enter ID#.",
}, 
{
    type: "input",
    name: "email",
    message: "Enter email.",
}, 
{
    type: "input",
    name: "github",
    message: "Enter GitHub username.",
}];

const internInfo = [{
    type: "input",
    name: "name",
    message: "Enter name.",
}, 
{
    type: "input",
    name: "id",
    message: "Enter ID#.",
},
{
    type: "input",
    name: "email",
    message: "Enter email.",
}, 
{
    type: "input",
    name: "schoolName",
    message: "Enter school.",
}];

function initalize() {
    return inquirer.prompt(managerInfo)
        .then(res => {
            const manager = new Manager(res.name, res.id, res.email, res.officeNumber);
            employee.push(manager);
        });
};

function buildTeam() {
    return inquirer.prompt(addNewEmployee)
        .then(addTeam => {
            if (addTeam.role === "Engineer") {
                return inquirer.prompt(engineerInfo)
                    .then(res => {
                        const engineer = new Engineer(res.name, res.id, res.email, res.github);
                        employee.push(engineer);
                        return buildTeam();
                    });
            } else if (addTeam.role === "Intern") {
                return inquirer.prompt(internInfo)
                    .then(res => {
                        const intern = new Intern(res.name, res.id, res.email, res.schoolName)
                        employee.push(intern);
                        return buildTeam()
                    });
            } else {
                console.log("Added Member")
            }
        })
};

async function init() {
    try {
        await initalize();
        await buildTeam();
        
        const renderInfo = render(employee);
            if (fs.existsSync(OUTPUT_DIR)) {
                fs.writeFile(outputPath, renderInfo, (err) => {
                    if (err) throw err;
                });
            } else {
                fs.mkdirSync(OUTPUT_DIR)
                fs.writeFile(outputPath, renderInfo, (err) => {
                    if (err) throw err;
                });
            }
        
    } catch (err) {
            console.log("Found error: " + err)
        }
}

init();