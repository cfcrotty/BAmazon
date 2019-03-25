const inquirer = require('inquirer');
const colors = require('colors');
const table = require('table');
const myConnection = require('./functions.js');

var tempData = [];

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
                    viewProducts(false, true, function () { });
                    break;
                case "View Low Inventory":
                    viewProducts(true, true, function () { });
                    break;
                case "Add to Inventory":
                    addToInventory();
                    break;
                case "Add New Product":
                    console.log("Add New Product");
                    addNewProduct()
                    break;
            }
        });
    }
}

function viewProducts(isLow, isGoBack, callback) {
    var strLow = "";
    var data = [],
        output,
        config;

    config = {
        columns: {
            3: {
                alignment: 'right'
            },
            4: {
                alignment: 'right'
            }
        }
    };
    data[0] = ["Item ID".cyan, "Item Name".cyan, "Department Name".cyan, "Price ($)".cyan, "Quantity".cyan];
    if (isLow) strLow = " AND stock_quantity<5";
    myConnection.readFunction("*","products as p,departments as d WHERE p.department_id=d.department_id" + strLow, function (res) {
        console.log("\n PRODUCTS".magenta);
        for (let i = 0; i < res.length; i++) {
            data[i + 1] = [res[i].item_id.toString().yellow, res[i].product_name, res[i].department_name, res[i].price.toFixed(2), res[i].stock_quantity];
            tempData.push(res[i].item_id);
        }
        output = table.table(data, config);
        console.log(output);
        callback(res);
        if (isGoBack) myConnection.goBack("Do you want to go back to Manager menu? ", BamazonManager.runBamazonManager);
    });
}

function addToInventory() {
    viewProducts(false, false, function (queryRes) {
        inquirer.prompt([
            {
                type: "input",
                message: "Please enter the product item ID you want to update: ".green.italic.bold,
                name: "itemID",
                validate: function (res) {
                    if (tempData.includes(parseInt(res))) {
                        return true;
                    } else {
                        return "Please enter the item ID.".red;
                    }
                }
            }
        ]).then(function (inquirerResponse) {
            myConnection.readFunction("*","products WHERE item_id=" + parseInt(inquirerResponse.itemID), function (productRes) {
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Please enter the additional product quantity".green.italic.bold + "(greater than 4): ".red.italic.bold,
                        name: "itemCount",
                        validate: function (res) {
                            if (Number.isInteger(parseInt(res)) && parseInt(res) >= 5) {
                                return true;
                            } else {
                                return "Please enter a number greater than 4.".red;
                            }
                        }
                    }
                ]).then(function (inquirerRes) {
                    myConnection.updateDatabase("products", [
                        { stock_quantity: parseInt(productRes[0].stock_quantity) + parseInt(inquirerRes.itemCount) },
                        { item_id: inquirerResponse.itemID }
                    ], function (response) {
                        if (response.affectedRows) {
                            console.log("Update Successful!".yellow);
                            console.log(productRes[0].product_name.yellow + " has ".yellow + (productRes[0].stock_quantity + parseInt(inquirerRes.itemCount)) + " count.".yellow);
                        } else {
                            console.log("Error! Please try again later.".red);
                        }
                        myConnection.goBack("Do you want to go back to Manager menu? ", BamazonManager.runBamazonManager);
                    });
                });
            });
        });
    });
}

function addNewProduct() {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the product name: ".green.italic.bold,
            name: "name",
        }
    ]).then(function (inquirer1) {
        inquirer.prompt([
            {
                type: "input",
                message: "Please enter the price: ".green.italic.bold,
                name: "price",
                validate: function (res) {
                    if (Math.ceil(parseFloat(res))) {
                        return true;
                    } else {
                        return "Please enter a number.".red;
                    }
                }
            }
        ]).then(function (inquirer2) {
            inquirer.prompt([
                {
                    type: "input",
                    message: "Please enter the product quantity".green.italic.bold + "(greater than 4): ".red.italic.bold,
                    name: "quantity",
                    validate: function (res) {
                        if (Number.isInteger(parseInt(res)) && parseInt(res) >= 5) {
                            return true;
                        } else {
                            return "Please enter a number greater than 4.".red;
                        }
                    }
                }
            ]).then(function (inquirer3) {
                var tempDept = [];
                var tempStr = [];
                myConnection.readFunction("*","departments", function (departments) {
                    for (let i = 0; i < departments.length; i++) {
                        tempStr.push(departments[i].department_id + " | " + departments[i].department_name);
                        tempDept.push(departments[i].department_id);
                    }
                    inquirer.prompt([
                        {
                            type: "list",
                            message: "Please select a department: ".green.italic.bold,
                            name: "deptID",
                            choices: tempStr
                        }
                    ]).then(function (inquirer4) {
                        var deptID = inquirer4.deptID.substr(0, inquirer4.deptID.indexOf(" | "));
                        myConnection.insertDatabase("products",
                            { product_name: inquirer1.name.trim(), department_id: parseInt(deptID), price: parseFloat(inquirer2.price), stock_quantity: parseInt(inquirer3.quantity), is_active: true, product_sales: 0 }, function (res) {
                                console.log("Successfully added new product.");
                                console.log("Added: " + inquirer1.name.trim() + " | $" + inquirer2.price + " | " + inquirer3.quantity + "(quantity) | " + inquirer4.deptID.substr(inquirer4.deptID.indexOf(" | ") + 3, inquirer4.deptID.length - 1) + "(department)");
                            });
                            myConnection.goBack("Do you want to go back to Manager menu? ", BamazonManager.runBamazonManager);
                    });
                });
            });
        });
    });
}

//BamazonManager.runBamazonManager();
module.exports = BamazonManager;