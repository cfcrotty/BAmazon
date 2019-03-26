const inquirer = require('inquirer');
const colors = require('colors');
const table = require('table');
const myConnection = require('./functions.js');

const bamazonSupervisor = {
    runBamazonSupervisor: function () {
        inquirer.prompt([
            {
                type: "input",
                message: "Please enter your username: ".green.italic.bold,
                name: "username"
            },
            {
                type: "password",
                message: "Please enter your password: ".green.italic.bold,
                name: "password"
            }
        ]).then(function (inquirer) {
            myConnection.loginUser("users WHERE username='"+inquirer.username+"' AND user_password='"+inquirer.password+"' AND user_type='Supervisor'",function(res){
                if (res.length>0) {
                    user = res;
                    console.log("\nLogin successful. Hello, ".yellow+res[0].username.toString().yellow+".\n".yellow);
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

function runSupervisorMenu(){
    inquirer.prompt([
        {
            type: "list",
            message: "Please select from menu: ".magenta.italic.bold,
            name: "menu",
            choices: ["View Product Sales By Department", "Create New Department","Exit"]
        }
    ]).then(function (inquirerResponse) {
        switch (inquirerResponse.menu) {
            case "View Product Sales By Department":
                viewDepartmentSales();
                break;
            case "Create New Department":
                addDepartment();
                break;
            case "Exit":
                process.exit();
                break;
        }
    });
}

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
    let queryStr = "departments AS d, products AS p WHERE d.department_id=p.department_id GROUP BY department_id";
    let columns = "d.department_id, department_name, over_head_costs, SUM(product_sales) AS sales";

    myConnection.readFunction(columns, queryStr, function (res) {
        console.log("\n DEPARTMENTS".magenta);
        for (let i = 0; i < res.length; i++) {
            let profit = res[i].sales - res[i].over_head_costs;
            data[i + 1] = [res[i].department_id.toString().yellow, res[i].department_name, res[i].over_head_costs.toFixed(2), res[i].sales.toFixed(2),profit.toFixed(2)];
        }
        output = table.table(data, config);
        console.log(output);
        myConnection.goBack("Supervisor", bamazonSupervisor.runBamazonSupervisor);
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the new department name: ".green.italic.bold,
            name: "deptName"
        }
    ]).then(function (inquirer1) {
        inquirer.prompt([
            {
                type: "input",
                message: "Please enter the over head cost: ".green.italic.bold,
                name: "cost",
                validate: function (res) {
                    if (Math.ceil(parseFloat(res))) {
                        return true;
                    } else {
                        return "Please enter a number.".red;
                    }
                }
            }
        ]).then(function (inquirer2) {
            //insert to database
            myConnection.insertDatabase("departments",{
                department_name: inquirer1.deptName.trim(),
                over_head_costs: parseFloat(inquirer2.cost)
            },"departments WHERE department_name='"+inquirer1.deptName.trim()+"'",function(res){
                if (res.affectedRows) {
                    console.log("\nSuccessfully added new department.".yellow);
                    console.log("Added: ".yellow+inquirer1.deptName.yellow+"(Department Name) | $".yellow+inquirer2.cost+"(Over Head Cost)\n".yellow);
                }
                myConnection.goBack("Supervisor", bamazonSupervisor.runBamazonSupervisor);
            },"Supervisor",bamazonSupervisor.runBamazonSupervisor);
        });
    });
}

module.exports = bamazonSupervisor;