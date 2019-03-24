const mysql = require('mysql');
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

    insertDatabase: function (data,callback) {
        var query = connection.query(
            "INSERT INTO ? SET ?",
            data,
            (err, res) => {
                if (err) throw err;
                callback(res);
                //console.log(res.affectedRows + " products updated!\n");
            }
        );
        //console.log(query.sql);
    },

    updateDatabase: function (data,callback) {
        var query = connection.query(
            "UPDATE products SET ? WHERE ?",
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
    }
}
module.exports = myConnection;