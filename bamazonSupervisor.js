const inquirer = require('inquirer');
const colors = require('colors');
const table = require('table');
const myConnection = require('./functions.js');

/**
 * The object to export
 */
const bamazonSupervisor = {
    runBamazonSupervisor: function () {
        if (myConnection.user && myConnection.user.length > 0 && myConnection.user[0].user_type === "Supervisor") {
            runSupervisorMenu();
        } else {
            myConnection.user = [];
            inquirer.prompt([
                {
                    type: "input",
                    message: "Please enter your username: ".green.italic.bold,
                    name: "username"
                },
                {
                    type: "password",
                    message: "Please enter your password: ".gray.italic.bold,
                    name: "password"
                }
            ]).then(function (inquirer) {
                myConnection.loginUser("users WHERE username='" + inquirer.username + "' AND user_password='" + inquirer.password + "' AND user_type='Supervisor'", function (res) {
                    if (res.length > 0) {
                        myConnection.user = res;
                        console.log("\nLogin successful. Hello, ".yellow + res[0].username.toString().magenta.bold.italic + ".\n".yellow);
                        runSupervisorMenu();
                    } else {
                        console.log("\nUsername or password is incorrect.".red);
                        console.log("Please try again.\n".red);
                        bamazonSupervisor.runBamazonSupervisor();
                    }
                });
            });
        }
    }
}

/**
 * function to run to show supervisor menu
 */
function runSupervisorMenu() {
    inquirer.prompt([
        {
            type: "list",
            message: "Please select from menu: ".magenta.italic.bold,
            name: "menu",
            choices: ["View Product Sales By Department", "Create New Department", "View All Users", "Create User", "Exit"]
        }
    ]).then(function (inquirerResponse) {
        switch (inquirerResponse.menu) {
            case "View Product Sales By Department":
                viewDepartmentSales();
                break;
            case "Create New Department":
                addDepartment();
                break;
            case "View All Users":
                viewAllUsers();
                break;
            case "Create User":
                addUser();
                break;
            case "Exit":
                process.exit();
                break;
        }
    });
}

/**
 * function that shows sales per department
 */
function viewDepartmentSales() {
    var data = [],
        output,
        config;

    config = {
        columns: {
            2: {
                alignment: 'right'
            },
            3: {
                alignment: 'right'
            },
            4: {
                alignment: 'right'
            }
        }
    };
    data[0] = ["Department ID".cyan, "Department Name".cyan, "Over Head Cost ($)".cyan, "Products Sales ($)".cyan, "Total Profit ($)".cyan];
    let queryStr = "departments AS d INNER JOIN products AS p ON d.department_id=p.department_id GROUP BY department_id";
    let columns = "d.department_id, department_name, over_head_costs, SUM(product_sales) AS sales";

    myConnection.readFunction(columns, queryStr, function (res) {
        console.log("\n DEPARTMENTS".magenta);
        for (let i = 0; i < res.length; i++) {
            let profit = res[i].sales - res[i].over_head_costs;
            data[i + 1] = [res[i].department_id.toString().yellow, res[i].department_name, res[i].over_head_costs.toFixed(2), res[i].sales.toFixed(2), profit.toFixed(2)];
        }
        output = table.table(data, config);
        console.log(output);
        myConnection.goBack("Supervisor", bamazonSupervisor.runBamazonSupervisor);
    });
}

/**
 * function to add new department
 */
function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the new department name: ".green.italic.bold,
            name: "deptName"
        },
        {
            type: "input",
            message: "Please enter the over head cost: ".blue.italic.bold,
            name: "cost",
            validate: function (res) {
                if (Math.ceil(parseFloat(res))) {
                    return true;
                } else {
                    return "Please enter a number.".red;
                }
            }
        }
    ]).then(function (inquirer1) {
        myConnection.insertDatabase("departments", {
            department_name: inquirer1.deptName.trim(),
            over_head_costs: parseFloat(inquirer1.cost)
        }, "departments WHERE department_name='" + inquirer1.deptName.trim() + "'", function (res) {
            if (res.affectedRows) {
                console.log("\nSuccessfully added new department.".yellow);
                console.log("Added: ".yellow + inquirer1.deptName.yellow + "(Department Name) | $".yellow + inquirer1.cost + "(Over Head Cost)\n".yellow);
            }
            myConnection.goBack("Supervisor", bamazonSupervisor.runBamazonSupervisor);
        }, "Supervisor", bamazonSupervisor.runBamazonSupervisor);
    });
}

/**
 * function to add new user
 */
function addUser() {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the full name: ".green.italic.bold,
            name: "fullName"
        },
        {
            type: "input",
            message: "Please enter the username: ".blue.italic.bold,
            name: "username"
        },
        {
            type: "password",
            message: "Please enter the user password: ".green.italic.bold,
            name: "password"
        },
        {
            type: "list",
            message: "Please select user type: ".blue.italic.bold,
            name: "userType",
            choices: ["Manager","Supervisor"]
        }
    ]).then(function (inquirer1) {
        myConnection.insertDatabase("users", {
            full_name: inquirer1.fullName.trim(),
            username: inquirer1.username.trim(),
            user_password: inquirer1.password.trim(),
            user_type: inquirer1.userType.trim()
        }, "users WHERE username='" + inquirer1.username.trim() + "'", function (res) {
            if (res.affectedRows) {
                console.log("\nSuccessfully added new user.".yellow);
                console.log("Added: ".yellow + inquirer1.fullName.trim().yellow + " | ".yellow + inquirer1.username.trim()+" | "+inquirer1.userType.trim() + "\n".yellow);
            }
            myConnection.goBack("Supervisor", bamazonSupervisor.runBamazonSupervisor);
        }, "Supervisor", bamazonSupervisor.runBamazonSupervisor);
    });
}

/**
 * function that shows all users
 */
function viewAllUsers() {
    var data = [],
        output,
        config;

    config = {
        columns: {
        }
    };
    data[0] = ["User ID".cyan, "Full Name".cyan, "Username".cyan, "User Type".cyan];
    let queryStr = "users";
    let columns = "user_id, full_name, username, user_type";

    myConnection.readFunction(columns, queryStr, function (res) {
        console.log("\n Users".magenta);
        for (let i = 0; i < res.length; i++) {
            data[i + 1] = [res[i].user_id.toString().yellow, res[i].full_name, res[i].username, res[i].user_type];
        }
        output = table.table(data, config);
        console.log(output);
        myConnection.goBack("Supervisor", bamazonSupervisor.runBamazonSupervisor);
    });
}

module.exports = bamazonSupervisor;