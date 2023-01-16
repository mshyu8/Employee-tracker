
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');




const PORT = process.env.PORT || 3001;
const app = express();


app.use(express.urlencoded({ extended: false}));
app.use(express.json());


const db = mysql.createConnection (
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'workplace_db'
  },
  console.log(`Connected to the database!!!`)
);

function showOptions() {
    inquirer
    .prompt([
      {
        type: 'list',
        message: `What would you like to do?`,
        name: 'options',
        choices: ['View All Employees', 'Add Employee', `Update Employee Role`, 'View All Roles', 'Add Role', `View All Departments`, `Add Department`, `Quit`]
      }
    ])  
  
    .then((response) => {
      if (response.options === 'View All Employees'){
        viewEmployees();
      } else if (response.options === 'Add Employee') {
        addEmployee();
      } else if (response.options === `Update Employee Role`) {
        updateEmployeeRole();
      } else if (response.options === 'View All Roles') {
        viewRoles();
      } else if (response.options === 'Add Role') {
        addRole();
      } else if (response.options === `View All Departments`) {
        viewDepartments();
      } else if (response.options === `Add Department`) {
        addDepartment();
      } else if (response.options === 'Quit') {
        process.exit()
      }
    });
  };

  const addEmployee = () => {

    db.query('SELECT id, title FROM role', (err, results) => {

        let roleChoices = [];
        let roleIDs = [];

        for(i = 0; i < results.length; i++) {
            role = results[i].title;
            roleID = results[i].id;
            roleChoices.push(role);
            roleIDs.push(roleID)
        };

        let managerChoices = [];
        let managerIDs = [];

        db.query('SELECT first_name, last_name, id FROM employee', (err, results) => {

            for (i = 0; i < results.length; i++) {
                let firstName = results[i].first_name
                let lastName = results[i].last_name
                let employee = firstName + ' ' + lastName
                let id = results[i].id
                managerChoices.push(employee)
                managerIDs.push(id)
            };
            managerChoices.push('No Manager')
        });

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'What is this employees first name?'
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'What is this employees last name'
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is this employees role?',
                    choices: roleChoices
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Who is this employees manager?',
                    choices: managerChoices
                }

            ])

            .then((response) => {
                const firstName = response.firstName;
                const lastName = response.lastName;
                const role = response.role;
                const manager = response.manager;
                let role_id = 0;
                let manager_id = 0;

                for (i = 0; i < roleChoices.length; i++) {
                    if (roleChoices[i] === role) {
                        role_id = roleIDs[i]
                    };
                };

                for (i = 0; i<managerChoices.length; i++) {
                    if ('No Manager' === manager) {
                        manager_id = null;
                    } else if (managerChoices[i] === manager) {
                        manager_id = managerIDs[i]
                    };
                };

                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', ${role_id}, ${manager_id})`, async (err, results) => {

                    await showOptions();
                });

            });
    });
  };


  const updateEmployeeRole = () => {

    let employeeChoices = [];
    let employeeRoles = [];

    db.query('SELECT first_name, last_name, id, role_id FROM employee', (err, results) => {

        for( i = 0; i < results.length; i++) {
            let firstName = results[i].first_name
            let lastName = results[i].last_name
            let employee = firstName + ' ' + lastName
            let id = results[i].id
            employeeChoices.push(employee)
            employeeRoles.push(id)
        };
    });

    let roleChoices = []
    let roleIDs = []

    db.query('SELECT title, id FROM role', (err, results) => {

        for (i = 0; i < results.length; i++) {
            role = results[i].title
            roleID = results[i].id
            roleChoices.push(role)
            roleIDs.push(roleID)
        };

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Which employees role do you want to update?',
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'Which role do you want to assign?',
                    choices: roleChoices
                }
            ])

            .then((response) => {
                const employee = response.employee;
                const role = response.role;
                let employeeID = 0;
                let newID = 0;

                for(i = 0; i < roleChoices.length; i++) {
                    if (roleChoices[i] === role) {
                        newID = roleIDs[i]
                    };
                };

                db.query(`UPDATE employee SET role_id=${newID} WHERE id=${employeeID};`, async (err, results) => {

                    await showOptions();
                });
            });
    });
  };


  const addDepartment = () => {
    inquirer    
        .prompt([
            {
                type: 'input',
                name: 'newDepartment',
                message: 'What is the name of this Department'
            }
        ])

        .then((response) => {
            const newDepartment = response.newDepartment;

            db.query(`INSERT INTO department (name) VALUE ('${newDepartment}')`, async (err, results) => {

                await showOptions();

            });
        });
  };

  const addRole = () => {

    db.query('SELECT id, name FROM department', (err, results) => {

        let deptChoices = []
        let deptIDs = []

        for (i = 0; i < results.length; i++) {
            department = results[i].name;
            deptID = results[i].id;
            deptChoices.push(department);
            deptIDs.push(deptID);
        };

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'role',
                    message: 'What is the roles title?'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary of the role?'
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Which department does this role belong to?',
                    choices: deptChoices
                }
            ])

            .then((response) => {
                const role = response.role;
                const salary = response.salary;
                const departmentName = response.department;
                let department = 0;

                for (i = 0; i < deptChoices.length; i++) {
                    if(deptChoices[i] === departmentName) {
                        department = deptIDs[i]
                    };
                };

                db.query(`INSET INTO role (title, salary, department_id) VALUE ('${role}', '${salary}', '${department}')`, async (err, results) => {
                    
                    await showOptions();
                });
            });
    });
  };

  const viewDepartments = () => {

    db.query('SELECT * FROM department', async (err, results) => {

        console.log('--------------------------------')

        await console.table(results);
        await showOptions();
    });
  };

  const viewRoles = () => {
    db.query('SELECT role.id AS id, role.title AS title, department.name as department, role.salary AS salary FROM department JOIN role ON role.department_id = department.id;', async (err, results) => {
        console.log(`---------------------`)
        await console.table(results);
        await showOptions();
    });
  };

  const viewEmployees = () => {
    db.query(`SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS title, department.name as department, role.salary AS salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee m ON employee.manager_id = m.id ORDER BY employee.id;`, async (err, results) => {

        console.log(`------------------`)
        await console.table(results);
        await showOptions();
    });
  };

  showOptions();
