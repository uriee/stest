var exports = module.exports = {};
var { simpleQuery } = require('./utils.js');

/**
Fetches the part and partname from the Database
@param {Object} req -  The Request Object (param.part = PARTNAME)
@param {Oject} res - The Response Object
@return {Json}  part and partname 
*/
exports.part =  function(req, res) {

    const Q = `select cbt.dbo.PART.PART ,  cbt.dbo.PART.PARTNAME 
                        from cbt.dbo.PART  
                        where cbt.dbo.PART.PARTNAME = @parChar `;
                       
    simpleQuery(Q, 0, req.params.partname)
        .then(function(recordset, err) {
                if (err) {
                    console.log("get script Error: " + err);
                }
                res.json(recordset.recordset);
                console.log(Q)
                return recordset.recordset
            }).catch(function(x) { console.log(x); })
};
