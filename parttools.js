var exports = module.exports = {};
var { simpleQuery } = require('./utils.js');
/**
Fetches the part sons (tools only) from the PARTARC Table in the Database
@param {Object} req -  The Request Object (param.part = PART(id))
@param {Object} res - The Response Object
@return {Json}  Part Name, Part Description, Act Name, Act Description
*/
exports.parttools = function(req, res) {

    const Q = `select cbt.dbo.PART.PARTNAME ,  cbt.dbo.PART.PARTDES ,  cbt.dbo.ACT.ACTNAME ,  cbt.dbo.ACT.ACTDES  
                       from cbt.dbo.PARTARC  inner join cbt.dbo.PART  on ( cbt.dbo.PART.PART = cbt.dbo.PARTARC.SON ) 
                       inner join cbt.dbo.ACT  on ( cbt.dbo.ACT.ACT = cbt.dbo.PARTARC.ACT ) 
                       where ( cbt.dbo.PARTARC.TILLDATE >= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                       and ( cbt.dbo.PARTARC.FROMDATE <= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                       and ( convert(decimal(20,3), cbt.dbo.PARTARC.SONQUANT) = 1.000 ) 
                       and ( cbt.dbo.PARTARC.SONACT = - ( 4 ) ) 
                       and ( cbt.dbo.PARTARC.COEF = 1.000000000 ) 
                       and ( cbt.dbo.PARTARC.OP = 'C' ) 
                       and ( cbt.dbo.PARTARC.PART = @parInt ) `;

     simpleQuery(Q, req.params.part)
      .then(function(recordset, err) {
                if (err) {
                    console.log("get script Error: " + err);
                }
                var ret = recordset.recordset.map(x => { return { 'Part Name': x.PARTNAME, 'Part Description': x.PARTDES, 'Act Name': x.ACTNAME, 'Act Description': x.ACTDES } })
                res.json(ret);
                return ret;
      });
}