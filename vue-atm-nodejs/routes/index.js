var express = require('express');
var router = express.Router();
let common = require('./common');

router.get('/', function (req, res) {
  res.render('index', {
    title: 'Express'
  });
});

/**
 * 注册
 */
router.post("/user/reg", async (req,res) => {
  let data = req.body;
  
  var phoneUser = await common.queryPhone(data.phone);

  if(data.passwd == data.transactionPasswd){
    res.json({
      code: 1010,
      data: null
    })
    return;
  }

  //手机号是否被注册
  if(phoneUser) {
    res.json({
      code: 1003,
      data: null
    })
    return;
  }

  //用户名是否被注册
  var usernameUser = await common.queryUsername(data.username);
  console.info(usernameUser);
  if(usernameUser){
    res.json({
      code: 1009,
      data: null
    })
    return;
  }

  //身份证是否被注册
  var idCardUser = await common.queryIdCard(data.idCard);
  if(idCardUser) {
    res.json({
      code: 1004,
      data: null
    })
    return;
  }

  let user = [
    new Date().getTime(),
    data.username,
    data.passwd,
    data.phone,
    data.idCard,
    data.name,
    data.transactionPasswd
  ]
  await common.signUp(user);
  res.json({
    code: 0,
    data: null
  })
})

/**
 * 登录
 */
router.post("/user/login", async (req,res) => {
  let data = [req.body.username,req.body.passwd];
  let user = await common.signIn(data);
  //密码是否正确
  if(user == null) {
    res.json({
      code: 1001,
      data: null
    })
    return;
  }
  res.json({
    code: 0,
    data: user
  })
})

/**
 * 用户信息
 */
router.get("/user", async (req,res) => {
  let user = await common.queryUserById(req.query.id);
  res.json({
    code: 0,
    data: user
  })
})

/**
 * 余额
 */
router.get("/user/balance", async (req,res) => {
  let user = await common.queryUserById(req.query.id);
  res.json({
    code: 0,
    data: user.balance
  })
})

/**
 * 存款
 */
router.patch("/user/deposit", async (req,res) => {
  let data = [req.query.volume,req.query.id]
  await common.addBalance(data);
  let user = await common.queryUserById(req.query.id);
  res.json({
    code: 0,
    data: user.balance
  })
})

/**
 * 取款
 */
router.patch("/user/withdrawal", async (req,res) => {
  let user = await common.queryUserById(req.query.id);
  
  if(req.query.transactionPasswd != user.transactionPasswd){
    res.json({
      code: 1011,
      data: null
    })
    return;
  }

  //余额是否充足
  if(user.balance < req.query.volume){
    res.json({
      code: 1002,
      data: user.balance
    })
    return;
  }
  let data = [req.query.volume,req.query.id]
  await common.reduceBalance(data);
  user = await common.queryUserById(req.query.id);
  res.json({
    code: 0,
    data: user.balance
  })
})

/**
 * 转账
 */
router.put("/user", async (req,res) => {
  let data = req.body;

  let user = await common.queryUserById(data.id);
  //密码是否正确
  if(user.transactionPasswd != data.transactionPasswd){
    res.json({
      code: 1005,
      data: null
    })
    return;
  }
  //是否转账给自己
  if(data.phone == user.phone){
    res.json({
      code: 1008,
      data: null
    })
  }
  //余额是否充足
  if(user.balance < data.balance){
    res.json({
      code: 1002,
      data: user.balance
    })
    return;
  }

  var otherUser = await common.queryPhone(data.phone);
  //对方账号是否存在
  if(!otherUser) {
    res.json({
      code: 1006,
      data: null
    })
    return;
  }
  //对方姓名是否正确
  if(otherUser.name != data.name){
    res.json({
      code: 1007,
      data: null
    })
    return;
  }

  let addData = [data.balance,otherUser.id]
  let reduceData = [data.balance,data.id];
  await common.addBalance(addData);
  await common.reduceBalance(reduceData);
  let balanceUser = await common.queryUserById(user.id);
  res.json({
    code: 0,
    data: balanceUser.balance
  })
})


module.exports = router;
