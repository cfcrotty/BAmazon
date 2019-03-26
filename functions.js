const mysql = require('mysql');
const inquirer = require('inquirer');
const colors = require('colors');

/**
 * database configuration
 */
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

/**
 * myConnection object to export
 */
const myConnection = {
    /**
     * user property used for logging in
     */
    user: [],
    /**
     * function to start connection to database
     */
    startConnection: function () {
        connection.connect(err => {
            if (err) throw err;
            //console.log("connected as id " + connection.threadId + "\n");
        });
    },
    /**
     * function to check duplicate then insert in database
     */
    insertDatabase: function (table, data, duplicateData, callback,goBackParam1,goBackParam2) {
        this.checkDuplicateFunction(duplicateData, function (res) {
            if (res[0].count > 0) {
                console.log("\nSorry! Duplicate data. Please use a different name.\n".red);
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
    /**
     * function to update database
     * @param {string} table table name
     * @param {string} data databse additional query
     * @param {function} callback callback function to run if update is successful
     */
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
    /**
     * function to select from database
     * @param {string} columns column names
     * @param {string} data databse additional query
     * @param {function} callback callback function to run if select is successful
     */
    readFunction: function (columns, data, callback) {
        connection.query("SELECT " + columns + " FROM " + data, (err, res) => {
            if (err) throw err;
            callback(res);
            // console.log(res.affectedRows + " products updated!\n");
        });
        //console.log(query.sql);
    },
    /**
     * function to check duplicates
     * @param {string} data databse additional query
     * @param {function} callback callback function to run
     */
    checkDuplicateFunction: function (data, callback) {
        connection.query("SELECT COUNT(*) AS count FROM " + data, (err, res) => {
            if (err) throw err;
            callback(res);
        });
    },
    /**
     * function to end database connection
     */
    endConnection: function () {
        connection.end();
    },
    /**
     * function used to go back to menus
     * @param {string} type user type(Manager or Supervisor)
     * @param {function} callback callback function to run
     */
    goBack: function (type, callback) {
        inquirer.prompt([
            {
                type: "list",
                message: "Please select from menu: ".magenta.italic.bold,
                name: "goBack",
                choices: [type + " Menu", "Main Menu", "Exit"]
            }
        ]).then(function (inquirerResponse) {
            console.log("\n");
            switch (inquirerResponse.goBack) {
                case type + " Menu":
                    callback();
                    break;
                case "Main Menu":
                    if (type!==myConnection.user[0].user_type) myConnection.user = [];
                    const Bamazon = require('./index.js');
                    Bamazon.runBamazon();
                    break;
                case "Exit":
                    process.exit();
                    break;

            }
        });
    },
    /**
     * function to login Manager or Supervisor
     * @param {string} data databse additional query
     * @param {function} callback callback function to run
     */
    loginUser: function(data,callback){
        connection.query("SELECT user_id, full_name, username, user_type FROM " + data, (err, res) => {
            if (err) throw err;
            callback(res);
            // console.log(res.affectedRows + " products updated!\n");
        });
        //console.log(query.sql);
    }
}
myConnection.startConnection();
module.exports = myConnection;