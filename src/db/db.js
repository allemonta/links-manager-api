const mysql = require('mysql2/promise');

var db_settings = {
    connectionLimit: 100,
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || 'links-manager',
    multipleStatements: true
}

var pool = mysql.createPool(db_settings)

const query = (queryString, callback) => {
    pool.getConnection((err, connection) => {
        if (err)
            callback(err, undefined)

        connection.query(queryString, (err, result, fields) => {
            connection.release()
            return callback(err, result)
        })
    })
}

const queryPromise = (queryString) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err)
                return resolve({err, result: undefined})
    
            connection.query(queryString, (err, result, fields) => {
                connection.release()
                return resolve({err, result})
            })
        })
    })     
}

module.exports = {
    query,
    queryPromise,
    pool
}