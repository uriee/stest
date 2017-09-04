var exports = module.exports = {};
var { simpleQuery } = require('./utils.js');

/**
Fetches the part sons from the PARTARC Table in the Database
@param {Object} req -  The Request Object (param.part = PART(id) , param.type = 'R' / 'P')
@param {Oject} res - The Response Object
@return {Json}  Part Name, Part Description,  N` Of Intences
*/
exports.partarc = function(req, res) {

    const Q = `select cbt.dbo.PART.PARTNAME AS 'A', 
                        reverse( reverse(substring(reverse( '' + cbt.dbo.PART.PARTDES ) , 1, 50) ) ) AS 'B', 
                        (0.0 + ( convert(decimal(20,3), cbt.dbo.PARTARC.SONQUANT) )) AS 'C'
                        from cbt.dbo.PART  inner join cbt.dbo.PARTARC  on ( cbt.dbo.PARTARC.SON = cbt.dbo.PART.PART ) 
                        and ( cbt.dbo.PARTARC.PART = @parInt ) 
                        and ( cbt.dbo.PARTARC.RVTILLDATE >= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                        and ( cbt.dbo.PARTARC.RVFROMDATE <= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                        where ( cbt.dbo.PART.TYPE = @parChar )  `;
    simpleQuery(Q, req.params.part, req.params.type)
        .then(recordset =>  {
            var ret = recordset.recordset.map(x => { return { 'Part Name': x.A, 'Part Description': x.B, 'N` Of Intences': x.C.toString() } })
            res.json(ret)
            return ret
        })
        .catch(err => {
            if (err) {
                console.log("get script Error: " + err);
            }
        })

}