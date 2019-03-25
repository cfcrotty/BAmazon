const inquirer = require('inquirer');
const colors = require('colors');
const bamazonCustomer = require('./bamazonCustomer.js');
const BamazonManager = require('./BamazonManager.js');
const bamazonSupervisor = require('./bamazonSupervisor.js');

function runBamazon() {
    inquirer.prompt([
        {
            type: "list",
            message: "Please select a from menu:".green.italic.bold,
            name: "mainMenu",
            choices: ["Customer", "Manager", "Supervisor"]
        }
    ]).then(function (inquirerResponse) {
        switch (inquirerResponse.mainMenu) {
            case "Customer":
                bamazonCustomer.runBamazonCustomer();
                break;
            case "Manager":
                BamazonManager.runBamazonManager();
                break;
            case "Supervisor":
                bamazonSupervisor.runBamazonSupervisor();
                break;
        }
    });
}

runBamazon();