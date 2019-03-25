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

    insertDatabase: function (table,data,callback) {
        var query = connection.query(
            "INSERT INTO "+table+" SET ?",
            data,
            (err, res) => {
                if (err) throw err;
                callback(res);
                //console.log(res.affectedRows + " products updated!\n");
            }
        );
        //console.log(query.sql);
    },

    updateDatabase: function (table,data,callback) {
        var query = connection.query(
            "UPDATE "+table+" SET ? WHERE ?",
            data,
            (err, res) => {
                if (err) throw err;
                callback(res);
                //console.log(res.affectedRows + " products updated!\n");
            }
        );
        //console.log(query.sql);
    },
    readFunction: function (data,callback) {
        connection.query("SELECT * FROM " + data, (err, res) => {
            if (err) throw err;
            callback(res);
           // console.log(res.affectedRows + " products updated!\n");
        });
        //console.log(query.sql);
    },
    endConnection: function () {
        connection.end();
    },
    goToMainMenu: function() {
        inquirer.prompt([
            {
                type: "confirm",
                message: "Do you want to go back to main Manager menu? ".green.italic.bold,
                name: "goToMain"
            }
        ]).then(function (inquirerResponse) {
            //go back to main
        });
    },
    goBack: function(question,callback) {
        inquirer.prompt([
            {
                type: "confirm",
                message: question.green.italic.bold,
                name: "goBack"
            }
        ]).then(function (inquirerResponse) {
            if (inquirerResponse.goBack) callback();
            else process.exit();
        });
    },
    runBamazon: function (){
    
    }

}

module.exports = myConnection;