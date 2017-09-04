var sql = require('mssql');
var {config} = require('./config.js');
var exports = module.exports = {};

/**
Fetches the Proccess of the serial from the Database
@param {Object} req -  The Request Object (param.serial = SERIAL(id))
@param {Oject} res - The Response Object
@return {Json}  Action Name, Action Description, N' of Completed, N' of defected, N' of MRB 
*/
exports.aline = function(req, res) {
    const Q = `select cbt.dbo.ACT.ACTNAME AS 'A',
               reverse( reverse(substring(reverse( '' + cbt.dbo.ACT.ACTDES ) , 1, 50) ) ) AS 'B' , 
         (0.0 + ( (0.0 + ( sum( (0.0 + ( convert(float, coalesce( cbt.dbo.ALINE.QUANT , 0 ) ) / 1000.000000 )) ) ))  )) AS C, 
         (0.0 + ( (0.0 + ( sum( (0.0 + ( convert(float, coalesce( cbt.dbo.ALINE.SQUANT , 0 ) ) / 1000.000000 )) ) ))  )) AS D, 
         (0.0 + ( (0.0 + ( sum( (0.0 + ( convert(float, coalesce( cbt.dbo.CMT_ALINE.MRBQUANT , 0 ) ) / 1000.000000 )) ) ))  )) AS E , 
         cbt.dbo.SERACT.POS 
         from cbt.dbo.SERIAL  inner join cbt.dbo.SERACT  on ( cbt.dbo.SERACT.SERIAL = cbt.dbo.SERIAL.SERIAL ) 
         inner join cbt.dbo.ACT  on ( cbt.dbo.ACT.ACT = cbt.dbo.SERACT.ACT ) 
         left outer join cbt.dbo.ALINE  on ( coalesce( cbt.dbo.ALINE.ACT , 0 ) = cbt.dbo.ACT.ACT ) and ( cbt.dbo.ALINE.SERIAL = cbt.dbo.SERIAL.SERIAL ) 
         left outer join cbt.dbo.CMT_ALINE  on ( cbt.dbo.CMT_ALINE.AL = coalesce( cbt.dbo.ALINE.AL , 0 ) ) 
         where ( cbt.dbo.ACT.ACT <> - ( 5 ) ) and ( cbt.dbo.SERIAL.SERIAL = @serial )  
         group by cbt.dbo.ACT.ACTNAME 
         , cbt.dbo.ACT.ACTDES 
         , cbt.dbo.SERACT.POS having count(*) > 0 
         order by 6 `;

    const pool1 = new sql.ConnectionPool(config, err => {
        return pool1.request()
            .input('serial', sql.Int, req.params.serial)
            .query(Q).then(function(recordset, err) {
                if (err) {
                    console.log("get script Error: " + err);
                }
                var ret = recordset.recordset.map(x => { return { 'Action Name': x.A, 'Action Description': x.B, Complete: x.C.toString(), Defected: x.D.toString(), MRB: x.E.toString() } })
                res.json(ret);
                return ret;
            }).catch(function(x) { console.log(x); })
    });
}