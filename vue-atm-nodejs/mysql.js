const mysql = require('mysql')
const pool = mysql.createPool({
  host     :  '122.51.129.115',
  user     :  'root',
  password :  '123456',
  database :  'atm'
})

// 接收一个sql语句 以及所需的values
// 这里接收第二参数values的原因是可以使用mysql的占位符 '?'
// 比如 query(`select * from my_database where id = ?`, [1])

let query = function( sql, values ) {
  // 返回一个 Promise
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {

          if ( err ) {
            reject( err )
          } else {
              console.info(rows);
              console.info("[]".search(rows) != -1);
              if("[]".indexOf(rows) != -1) {
                resolve( null )
              }else{
                resolve( rows )
              }
          }
          // 结束会话
          connection.release()
        })
      }
    })
  })
}

module.exports =  { query }