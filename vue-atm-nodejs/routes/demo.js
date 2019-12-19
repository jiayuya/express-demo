var router = require('express').Router();
var mysql = require('mysql')
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '123456',
    database : 'atm'
  });
connection.connect()

module.exports = router