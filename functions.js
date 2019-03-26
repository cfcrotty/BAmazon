const mysql = require('mysql');
const inquirer = require('inquirer');
const colors = require('colors');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});
const myConnection = {
    startConnection: function () {
        connection.connect(err => {
            if (err) throw err;
            //console.log("connected as id " + connection.threadId + "\n");
        });
    },

    insertDatabase: function (table, data, duplicateData, callback,goBackParam1,goBackParam2) {
        this.checkDuplicateFunction(duplicateData, function (res) {
            if (res[0].count > 0) {
                console.log("\nSorry! Duplicate data. Please use a different name.".red);
                myConnection.goBack(goBackParam1,goBackParam2);
            } else {
                var query = connection.query(
                    "INSERT INTO " + table + " SET ?",
                    data,
                    (err, res) => {
                        if (err) throw err;
                        callback(res);
                        //console.log(res.affectedRows + " products updated!\n");
                    }
                );
                //console.log(query.sql);
            }
        });
    },

    updateDatabase: function (table, data, callback) {
        var query = connection.query(
            "UPDATE " + table + " SET ? WHERE ?",
            data,
            (err, res) => {
                if (err) throw err;
                callback(res);
                //console.log(res.affectedRows + " products updated!\n");
            }
        );
        //console.log(query.sql);
    },
    readFunction: function (columns, data, callback) {
        connection.query("SELECT " + columns + " FROM " + data, (err, res) => {
            if (err) throw err;
            callback(res);
            // console.log(res.affectedRows + " products updated!\n");
        });
        //console.log(query.sql);
    },
    checkDuplicateFunction: function (data, callback) {
        connection.query("SELECT COUNT(*) AS count FROM " + data, (err, res) => {
            if (err) throw err;
            callback(res);
        });
    },
    endConnection: function () {
        connection.end();
    },
    goBack: function (type, callback) {
        inquirer.prompt([
            {
                type: "list",
                message: "Please select from menu: ".magenta.italic.bold,
                name: "goBack",
                choices: [type + " Menu", "Main Menu", "Exit"]
            }
        ]).then(function (inquirerResponse) {
            switch (inquirerResponse.goBack) {
                case type + " Menu":
                    callback();
                    break;
                case "Main Menu":
                    const Bamazon = require('./index.js');
                    Bamazon.runBamazon();
                    break;
                case "Exit":
                    process.exit();
                    break;

            }
        });
    }
}
myConnection.startConnection();
module.exports = myConnection;