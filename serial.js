var exports = module.exports = {};
var { simpleQuery } = require('./utils.js');
/**
Fetches the  of the Temporary Instructions from the Database
@param {Object} req -  The Request Object (param.serialname = SERIAL.SERIALNAME))
@param {Object} res - The Response Object
@return {Json}  [{PART, PARTNAME, SERIAL, SERIALNAME}]
*/
exports.serial = function(req, res) {

    const Q = `SELECT PART.PART , PART.PARTNAME , SERIAL.SERIAL, SERIAL.SERIALNAME
                       FROM PART,SERIAL
                       WHERE PART.PART = SERIAL.PART
                       AND SERIAL.SERIALNAME = @parChar`;

    simpleQuery(Q, 0, req.params.serialname)
      .then(function(recordset, err) {
                if (err) {
                    console.log("getSerialName Error: " + err);
                }
                res.json(recordset.recordset);
            }).catch(function(x) { console.log(x); })
}