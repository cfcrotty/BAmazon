const inquirer = require('inquirer');
const colors = require('colors');
const table = require('table');
const myConnection = require('./functions.js');

/*
myConnection.startConnection();
myConnection.readFunction("products",function(res){
    console.log(res);
});
myConnection.endConnection();
*/
runBamazonManager();
const BamazonManager = {
    runBamazonManager: function () {
        inquirer.prompt([
            {
                type: "list",
                message: "Please select from menu: ".green.italic.bold,
                name: "menu",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
            }
        ]).then(function (inquirerResponse) {
            switch (inquirerResponse.menu) {
                case "View Products for Sale":
                    console.log("View Products for Sale");
                    break;
                case "View Low Inventory":
                    console.log("View Low Inventory");
                    break;
                case "Add to Inventory":
                    console.log("Add to Inventory");
                    break;
                case "Add New Product":
                    console.log("Add New Product");
                    break;
            }
        });
    }
}