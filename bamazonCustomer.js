const inquirer = require('inquirer');
const colors = require('colors');
const table = require('table');
const myConnection = require('./functions.js');

const bamazonCustomer = {
    /**
     * Function to run the Bamazon Customer and displays all products available
     */
    runBamazonCustomer: function () {
        var tempData = [];
        var data = [],
            output,
            config;

        config = {
            columns: {
                2: {
                    alignment: 'right'
                }
            }
        };
        data[0] = ["Product ID".cyan, "Product Name".cyan, "Price ($)".cyan];
        myConnection.readFunction("*","products", function (res) {
            console.log("\n PRODUCTS".magenta);
            for (let i = 0; i < res.length; i++) {
                data[i + 1] = [res[i].item_id.toString().yellow, res[i].product_name, res[i].price.toFixed(2)];
                tempData.push(res[i].item_id);
            }
            output = table.table(data, config);
            console.log(output);
            getProductToBuy(tempData);
        });
    }
}

/**
 * Function to ask customer to enter the product item ID to buy
 * @param {array} data array of valid product item ID to buy
 */
function getProductToBuy(data) {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the product ID you want to purchase: ".green.italic.bold,
            name: "itemID",
            validate: function (res) {
                if (data.includes(parseInt(res))) {
                    return true;
                } else {
                    return "Please enter the product ID.".red;
                }
            }
        },
        {
            type: "input",
            message: "How many do you want? ".blue.italic.bold,
            name: "itemCount",
            validate: function (res) {
                if (Number.isInteger(parseInt(res)) && parseInt(res) > 0) {
                    return true;
                } else {
                    return "Please enter a number.".red;
                }
            }
        }
    ]).then(function (inquirerResponse) {
        let query = "products WHERE item_id=" + inquirerResponse.itemID;
        myConnection.readFunction("*",query, function (res) {
            if (res[0].stock_quantity >= parseInt(inquirerResponse.itemCount)) {
                myConnection.updateDatabase("products",[
                    { stock_quantity: res[0].stock_quantity - parseInt(inquirerResponse.itemCount) },
                    { item_id: inquirerResponse.itemID }
                ], function (response) {
                    if (response.affectedRows) {
                        let cost = (parseInt(inquirerResponse.itemCount) * res[0].price);
                        console.log("\nShopping Successful!".yellow);
                        console.log("You got ".magenta + inquirerResponse.itemCount.magenta + " " + res[0].product_name.magenta+" for $".magenta+cost.toString().magenta+".\n".magenta);
                        myConnection.updateDatabase("products",[
                            { product_sales: res[0].product_sales + (parseInt(inquirerResponse.itemCount) * res[0].price) },
                            { item_id: inquirerResponse.itemID }
                        ], function (updateResponse) { });
                    } else {
                        console.log("Error! Please try again later.\n".red);
                    }
                    selectAnotherProduct();
                });
            } else {
                console.log("Insufficient Quantity!\n".red);
                selectAnotherProduct();
            }
        });
    });
}

/**
 * Function that prompts if user wants to select another product
 */
function selectAnotherProduct() {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Do you want to shop for another product?".green.italic.bold,
            name: "selectAnother",
        }
    ]).then(function (inquirerResponse) {
        console.log();
        if (inquirerResponse.selectAnother) {
            bamazonCustomer.runBamazonCustomer();
        } else {
            console.log("Thank you for shopping with us.\n".yellow);
            myConnection.endConnection();
            process.exit();
        }
    });
}

module.exports = bamazonCustomer;