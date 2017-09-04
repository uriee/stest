var exports = module.exports = {};
var { simpleQuery } = require('./utils.js');
/**
Fetches the Extarnal Files Links of the part/act from the Database
@param {Object} req -  The Request Object (param.part = PART(id))
@param {Object} res - The Response Object
@return {Json}  Act Name, Act Description, File Description,Link (to the file on the fileserver), FromDate, tillDate
*/
exports.exttemp = function(req, res, fileServer) {

    const Q = `select cbt.dbo.ACT.ACTNAME AS 'Act Name',  cbt.dbo.ACT.ACTDES AS 'Act Description', cbt.dbo.CMT_TMPINSTRUCTIONS.DES AS 'file Description',  cbt.dbo.CMT_TMPINSTRUCTIONS.EXTFILENAME , 
                       cbt.dbo.CMT_TMPINSTRUCTIONS.FROMDATE AS 'FromDate',  cbt.dbo.CMT_TMPINSTRUCTIONS.TILLDATE AS 'TillDate'
                       from cbt.dbo.CMT_REVDET  inner join cbt.dbo.REVISIONS  on ( cbt.dbo.REVISIONS.REV = cbt.dbo.CMT_REVDET.REV ) 
                       inner join cbt.dbo.CMT_TMPINSTRUCTIONS  on ( cbt.dbo.CMT_TMPINSTRUCTIONS.FROMDATE <= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                       and ( cbt.dbo.CMT_TMPINSTRUCTIONS.TILLDATE >= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                       and ( cbt.dbo.CMT_TMPINSTRUCTIONS.REVDET = cbt.dbo.CMT_REVDET.REVDET ) 
                       inner join cbt.dbo.ACT  on ( cbt.dbo.ACT.ACT = cbt.dbo.CMT_TMPINSTRUCTIONS.ACT ) 
                       where ( cbt.dbo.REVISIONS.FROMDATE <= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                       and ( cbt.dbo.REVISIONS.TILLDATE >= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                       and ( cbt.dbo.REVISIONS.PART = @parInt ) 
                       and ( cbt.dbo.CMT_REVDET.FDATE <= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                       and ( cbt.dbo.CMT_REVDET.TDATE >= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                       order by 6 `;

    simpleQuery(Q, req.params.part)
      .then(function(data, err) {
                if (err) {
                    console.log("get script Error: " + err);
                }
                data.recordset = data.recordset.map(function(ef) {
                    var f = new Date((567993600 + ef.FromDate * 60) * 1000);
                    var t = new Date((567993600 + ef.TillDate * 60) * 1000);
                    ef.FromDate = f.toString().slice(0, 15);
                    ef.TillDate = t.toString().slice(0, 15);
                    ef.EXTFILENAME = ef.EXTFILENAME.replace('Y:', fileServer)
                    ef.Link = ef.EXTFILENAME.replace('cbt-filesrv', fileServer)
                    return ef;
                })
                res.json(data.recordset);
    });
}
