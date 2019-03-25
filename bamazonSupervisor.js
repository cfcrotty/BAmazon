const inquirer = require('inquirer');
const colors = require('colors');
const table = require('table');
const myConnection = require('./functions.js');

const bamazonSupervisor = {
    runBamazonSupervisor: function () {
        inquirer.prompt([
            {
                type: "list",
                message: "Please select from menu: ".green.italic.bold,
                name: "menu",
                choices: ["View Product Sales By Department", "Create New Department"]
            }
        ]).then(function (inquirerResponse) {
            switch (inquirerResponse.menu) {
                case "View Product Sales By Department":
                    viewDepartmentSales();
                    break;
                case "Create New Department":
                    addDepartment();
                    break;
            }
        });
    }
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
    });
}

function addDepartment() {

}

module.exports = bamazonSupervisor;