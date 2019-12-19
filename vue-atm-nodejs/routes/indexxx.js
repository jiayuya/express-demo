var express = require('express');
var router = express.Router();
let mysql = require("mysql");
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'atm'
});
connection.connect()
/* GET home page. */

router.get('/', function (req, res, next) {

  res.render('index', {
    title: 'Express'
  });
});


//获取用户信息
router.get("/user", function (req, res) {
  var cardNum = req.session.cardNum
  console.info(cardNum+"----------------------")
  if (cardNum == undefined) {
    res.json({
      code: 0,
      data: null
    })
    return
  }
  var sql = "SELECT id 'id', phone'phone', login_passw 'loginPasswd', trade_passw 'tradePassw', username'username', card_num 'cardNum', fee'fee' FROM atm WHERE card_num = ?"
  var ersql = [cardNum]
  connection.query(sql, ersql, function (err, result) {
    console.log(result[0])

    res.json({
      code: 0,
      data: result[0]
    })
  })
});

//退出登录
router.get('/user/logout', function (req, res, next) {

  res.clearCookie('cardNum')
  res.json({
    code: 0,
    data: "成功"
  })
});

//转账
router.put('/user/transfer', function (req, res, next) {

  var currentUserCardNum = req.session.cardNum
  var sql = "SELECT id, phone, login_passw, trade_passw, username, card_num, fee FROM atm WHERE card_num = ? AND username = ?"
  var erSql = [req.body.cardNum, req.body.username]
  console.log(req.body.cardNum+"------------------"+req.body.username)
  connection.query(sql, erSql, function (err, result) {
    console.log(result[0])
    if (result[0] == null) {
      res.json({
        code: 201,
        data: "失败"
      })
      return
    }

    var asql = "UPDATE atm SET fee = (fee- ?) WHERE card_num = ?"
    var arSql = [req.body.money, currentUserCardNum]
    connection.query(asql, arSql, function (err, result) {
    })

    var bsql = "UPDATE atm SET fee = (fee+ ?) WHERE card_num = ?"
    var brSql = [req.body.money, req.body.cardNum]
    connection.query(bsql, brSql, function (err, result) {
    })

    res.json({
      code: 0,
      data: "成功"
    })

  })

});
//修改金额
router.put('/user', function (req, res, next) {
  //type: type,
  //money: this.money
  let type = req.body.type
  let money = req.body.money
  var cardNum = req.session.cardNum
  //取钱
  if (type == 1) {
    let sql = "SELECT id, phone, login_passw'loginPasswd', trade_passw'tradePassw', username, card_num'cardNum', fee'fee' FROM atm WHERE card_num = ?"
    let ersql = [cardNum]
    connection.query(sql, ersql, function (err, result) {
      console.log(result[0].fee)
      if (result[0].fee < money) {
        res.json({
          code: 201,
          data: null
        })
        return
      }else{
        var asql = "UPDATE atm SET fee = (fee- ?) WHERE card_num = ?"
        var arSql = [money, cardNum]
        connection.query(asql, arSql, function (err, result) { })
      }
      res.json({
        code: 0,
        data: "成功"
      })

    })
    
    //存钱
  } else {
    var bsql = "UPDATE atm SET fee = (fee+ ?) WHERE card_num = ?"
    var brSql = [money, cardNum]
    connection.query(bsql, brSql, function (err, result) {
    })
    res.json({
      code: 0,
      data: "成功"
    })
  }
  
});

//添加用户
router.post('/user', function (req, res, next) {
  let data = req.body

  let cardNum = parseInt(Math.random()*100000000+1)
  let sql = "INSERT INTO atm (card_num, id, phone, login_passw, trade_passw, username, fee) VALUES (?,?,?,?,?,?,0.0)"
  let erSql = [cardNum,data.id,data.phone,data.loginPassw,data.tradePassw,data.username]
  connection.query(sql, erSql, function (err, result) {
    res.json({
      code: 0,
      data: ''
    })
  })
});


//登录
router.get('/login', function (req, res, next) {
  let username = req.query.username
  let loginPassw = req.query.loginPassw
  console.log(username+"---------"+loginPassw)
  let sql = "SELECT id, phone, login_passw, trade_passw, username, card_num, fee FROM atm WHERE username = ? AND login_passw = ?"
  let erSql = [username,loginPassw]
  connection.query(sql, erSql, function (err, result) {
    if (result[0] == null) {
      res.json({
        code: 201,
        data: ''
      })
      return
    } else {
      cardNum = result[0].card_num
      req.session.cardNum = cardNum
      res.json({
        code: 0,
        data: "成功"
      })
    }
  })
});


module.exports = router;