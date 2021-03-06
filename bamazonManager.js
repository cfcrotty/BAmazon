const inquirer = require('inquirer');
const colors = require('colors');
const table = require('table');
const myConnection = require('./functions.js');

var tempData = [];

/**
 * The object to export
 */
const BamazonManager = {
    runBamazonManager: function () {
        if (myConnection.user && myConnection.user.length > 0 && myConnection.user[0].user_type === "Manager") {
            runManagerMenu();
        } else {
            myConnection.user = [];
            inquirer.prompt([
                {
                    type: "input",
                    message: "Please enter your username: ".blue.italic.bold,
                    name: "username"
                },
                {
                    type: "password",
                    message: "Please enter your password: ".gray.italic.bold,
                    name: "password"
                }
            ]).then(function (inquirer) {
                myConnection.loginUser("users WHERE username='" + inquirer.username + "' AND user_password='" + inquirer.password + "' AND user_type='Manager'", function (res) {
                    if (res.length > 0) {
                        myConnection.user = res;
                        console.log("\nLogin successful. Hello, ".yellow + res[0].username.toString().magenta.bold.italic + ".\n".yellow);
                        runManagerMenu();
                    } else {
                        console.log("\nUsername or password is incorrect.".red);
                        console.log("Please try again.\n".red);
                        BamazonManager.runBamazonManager();
                    }
                });
            });
        }
    }
}

/**
 * function to show manager menu
 */
function runManagerMenu() {
    inquirer.prompt([
        {
            type: "list",
            message: "Please select from menu: ".magenta.italic.bold,
            name: "menu",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
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
                addNewProduct()
                break;
            case "Exit":
                process.exit();
                break;
        }
    });
}

/**
 * Function to show all products
 * @param {boolean} isLow true to show low inventory, false to show all products
 * @param {boolean} isGoBack true to show manager menu, false to not show manager menu
 * @param {function} callback callback function to run if there is result
 */
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
    data[0] = ["Product ID".cyan, "Product Name".cyan, "Department Name".cyan, "Price ($)".cyan, "Quantity".cyan];
    if (isLow) strLow = " AND stock_quantity<5";
    myConnection.readFunction("*", "products as p,departments as d WHERE p.department_id=d.department_id" + strLow, function (res) {
        console.log("\n PRODUCTS".magenta);
        for (let i = 0; i < res.length; i++) {
            data[i + 1] = [res[i].item_id.toString().yellow, res[i].product_name, res[i].department_name, res[i].price.toFixed(2), res[i].stock_quantity];
            tempData.push(res[i].item_id);
        }
        output = table.table(data, config);
        console.log(output);
        callback(res);
        if (isGoBack) myConnection.goBack("Manager", BamazonManager.runBamazonManager);
    });
}

/**
 * function to add to inventory or stock quantity
 */
function addToInventory() {
    viewProducts(false, false, function (queryRes) {
        inquirer.prompt([
            {
                type: "input",
                message: "Please enter the product ID you want to update: ".green.italic.bold,
                name: "itemID",
                validate: function (res) {
                    if (tempData.includes(parseInt(res))) {
                        return true;
                    } else {
                        return "Please enter the product ID.".red;
                    }
                }
            }
        ]).then(function (inquirerResponse) {
            myConnection.readFunction("*", "products WHERE item_id=" + parseInt(inquirerResponse.itemID), function (productRes) {
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Please enter the additional product quantity".blue.italic.bold + "(greater than 4): ".red.italic.bold,
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
                            console.log("\nUpdate Successful!".yellow);
                            console.log(productRes[0].product_name.magenta + " has ".magenta + (productRes[0].stock_quantity + parseInt(inquirerRes.itemCount)) + " count.\n".magenta);
                        } else {
                            console.log("Error! Please try again later.".red);
                        }
                        myConnection.goBack("Manager", BamazonManager.runBamazonManager);
                    });
                });
            });
        });
    });
}

/**
 * function to add new product
 */
function addNewProduct() {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the product name: ".green.italic.bold,
            name: "name",
        },
        {
            type: "input",
            message: "Please enter the price: ".blue.italic.bold,
            name: "price",
            validate: function (res) {
                if (Math.ceil(parseFloat(res))) {
                    return true;
                } else {
                    return "Please enter a number.".red;
                }
            }
        },
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
    ]).then(function (inquirer1) {
        var tempDept = [];
        var tempStr = [];
        myConnection.readFunction("*", "departments", function (departments) {
            for (let i = 0; i < departments.length; i++) {
                tempStr.push(departments[i].department_id + " | " + departments[i].department_name);
                tempDept.push(departments[i].department_id);
            }
            inquirer.prompt([
                {
                    type: "list",
                    message: "Please select a department: ".blue.italic.bold,
                    name: "deptID",
                    choices: tempStr
                }
            ]).then(function (inquirer2) {
                var deptID = inquirer2.deptID.substr(0, inquirer2.deptID.indexOf(" | "));
                myConnection.insertDatabase("products",
                    { product_name: inquirer1.name.trim(), department_id: parseInt(deptID), price: parseFloat(inquirer1.price), stock_quantity: parseInt(inquirer1.quantity), is_active: true, product_sales: 0 }, "products WHERE product_name='" + inquirer1.name.trim() + "' AND department_id=" + parseInt(deptID), function (res) {
                        console.log("\nSuccessfully added new product.".yellow);
                        console.log("Added: ".yellow + inquirer1.name.trim().yellow + " | $".yellow + inquirer1.price + " | ".yellow + inquirer1.quantity + "(quantity) | ".yellow + inquirer2.deptID.substr(inquirer2.deptID.indexOf(" | ") + 3, inquirer2.deptID.length - 1) + "(department)\n".yellow);
                        myConnection.goBack("Manager", BamazonManager.runBamazonManager);
                    }, "Manager", BamazonManager.runBamazonManager);
            });
        });
    });
}

module.exports = BamazonManager;