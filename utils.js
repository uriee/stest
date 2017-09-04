var exports = module.exports = {};
var sql = require('mssql');
var { config } = require('./config.js');

/**
Makes a simple Query to the database (with only 1 integer key)
@param {String} query
@param {Int} parInt
@param {Int} parChar
@return {Object} the returned query output / an Error Object
*/
    
exports.simpleQuery = (query, parInt, parChar) => {

    return new sql.ConnectionPool(config).connect().then(pool =>  {
        return pool.request()
                .input('parInt', sql.Int, parInt)
                .input('parChar', sql.Char, parChar)
                .query(query).catch(err => {console.log("eee",err) })
    })
}

/**
Makes a Recursive Query to the database
@param {Int} key - a unique tree node identifier
@param {Int} level - needs to be set to 1 
@param {String} query - The SQL Query
@parap {Mssql Connection Object} pool
@return {Json} the returned query output
*/
const recursive = async function(key, level, query, pool) {
    try {
        let result = await pool.request()
            .input('key', sql.Int, key)
            .input('level', sql.Char, level.toString())
            .query(query)
        var data = result.recordset
        if (data.length != 0) {
            var rest = await data.map(async function(x) {
                var ret = await recursive(x.KEY, level + 1, query, pool)
                return ret;
            })
            return [].concat.apply(data, await Promise.all(rest)).filter((x) => x.length != 0);
        }
        return [];

    } catch (err) {
        console.log("error in recursive: ", err)
    }
}

/**
Recursive Query Dispatcher
@param {Int} key - a unique tree node identifier
@param {String} query - The SQL Query
@return {Json} the returned query output
*/
exports.recur = (key,query) => {
    return new sql.ConnectionPool(config).connect().then(pool =>  {
        return recursive(key,1,query,pool)
    }).catch(err => {console.log("error in recursive: ", err)})
}


