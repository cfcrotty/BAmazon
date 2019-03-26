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
    user: [],
    startConnection: function () {
        connection.connect(err => {
            if (err) throw err;
            //console.log("connected as id " + connection.threadId + "\n");
        });
    },

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