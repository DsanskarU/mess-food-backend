const mysql = require('mysql2');

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'manager',
    database:'testdb'
});

db.connect((err) => {
    if(err){
        console.log("database connection failed ",err);
    }else{
        console.log("connected to mysql database");
    }
})

module.exports = db;