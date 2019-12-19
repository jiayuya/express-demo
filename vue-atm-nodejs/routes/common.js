var { query } = require('../mysql');

//赋值
function assignment(result) { 
    return {
        id: result.id,
        username: result.username,
        passwd: result.passwd,
        phone: result.phone,
        balance: result.balance,
        idCard: result.id_card,
        name: result.name,
        transactionPasswd: result.transaction_passwd,
    }
}

//根据用户名获取用户信息
var queryUsername = async (username) =>{
    var sql = 'SELECT * FROM atm_jdbc WHERE username = ?';
    let user = await query(sql,username);
    if(user == null) return null;
    return assignment(user[0]);
}

//根据手机号获取用户信息
var queryPhone = async (phone) =>{
    var sql = 'SELECT * FROM atm_jdbc WHERE phone = ?';
    let user = await query(sql,phone);
    if(user == null) return null;
    return assignment(user[0]);
}

//根据身份证获取用户信息
var queryIdCard = async (id_card) =>{
    var sql = 'SELECT * FROM atm_jdbc WHERE id_card = ?';
    let user = await query(sql,id_card);
    if(user == null) return null;
    return assignment(user[0]);
}

//根据id获取用户信息
var queryUserById = async (id) =>{
    var sql = 'SELECT * FROM atm_jdbc WHERE id = ?';
    let user = await query(sql,id);
    if(user == null) return null;
    return assignment(user[0]);
}

//新增用户
var signUp = (user) =>{
    var sql = 'INSERT INTO atm_jdbc (id, username, passwd, phone, id_card, name, transaction_passwd) VALUES (?, ?, ?, ?, ?, ?, ?)';
    let bool = query(sql,user);
    return bool;
}

//验证登录
var signIn = async (erSql) =>{
    var sql = 'SELECT * FROM atm_jdbc WHERE username = ? and passwd = ?';
    var user = await query(sql,erSql);
    if(user == null) return null;
    return assignment(user[0]);
}

//增加余额
var addBalance = (erSql) =>{
    var sql = 'UPDATE atm_jdbc SET balance = balance + ? WHERE id = ?';
    let bool = query(sql,erSql);
    return bool;
}

//减少余额
var reduceBalance = (erSql) =>{
    var sql = 'UPDATE atm_jdbc SET balance = balance - ? WHERE id = ?';
    let bool = query(sql,erSql);
    return bool;
}

module.exports = {
    queryUsername,
    queryPhone,
    queryIdCard,
    queryUserById,
    signUp,
    signIn,
    addBalance,
    reduceBalance
}