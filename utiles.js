var exports = module.exports = {};
var sql = require('mssql');
var {config} = require('./config.js');

/**
Makes a simple Query to the database (with only 1 integer key)
@param {Int} key 
@param {String} query
@return {Json} the returned query output
*/
exposts.simpleQuery = async function(key, query) {
    try {
        const pool = await new sql.ConnectionPool(config, async err => {
            let result = await pool.request()
                .input('key', sql.Int, key)
                .query(query)
            return result.recordset
        })
        return pool;
    } catch (err) {
        console.log("error in query: ", err, query)
    }
}


/**
Makes a Recursive Query to the database
It Works only on Queries that return the PART field
@param {Int} part
@param {Int} level - needs to be set to 0 
@param {String} query
@parap {Mssql Connection Object} pool
@return {Json} the returned query output
*/
exports.recursive = async function(part, level, query, pool) {
    try {
        let result = await pool.request()
            .input('part', sql.Int, part)
            .input('level', sql.Char, level.toString())
            .query(query)
        var data = result.recordset
        if (data.length != 0) {
            var rest = await data.map(async function(x) {
                var ret = await recursive(x.PART, level + 1, query, pool)
                return ret;
            })
            return [].concat.apply(data, await Promise.all(rest)).filter((x) => x.length != 0);
        }
        return [];

    } catch (err) {
        console.log("error in recursive: ", err)
    }
}