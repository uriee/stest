var exports = module.exports = {};
var { simpleQuery } = require('./utils.js');

/**
Fetches the list of Extarnal Files Links of the part from the Database
@param {Object} req -  The Request Object (param.part = PART(id), param.isqa = fetch QA related Files(Y) / fetch Files that are not related to QA(other) )
@param {Object} res - The Response Object
@return {Json}  # - number of the external file, File Name, Link(to the file on the fileserver), File Description
*/
exports.ext = function(req, res, fileServer) {

    const Q = `select cbt.dbo.CMT_REVEXTFILE.EXTFILENUM AS '#', 
                         cbt.dbo.CMT_REVEXTFILE.EXTFILENAME AS 'File Name', 
                         cbt.dbo.CMT_REVEXTFILE.EXTFILENAME AS 'Link', 
                         reverse( reverse(substring(reverse( '' + cbt.dbo.CMT_REVEXTFILE.EXTFILEDES ) , 1, 50) ) )  AS 'File Description'   
                         from cbt.dbo.REVISIONS  inner join cbt.dbo.CMT_REVDET  on ( cbt.dbo.CMT_REVDET.TDATE >=  DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                         and ( cbt.dbo.CMT_REVDET.FDATE <=  DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                         and ( cbt.dbo.CMT_REVDET.REV = cbt.dbo.REVISIONS.REV ) 
                         inner join cbt.dbo.CMT_REVEXTFILE  on ( cbt.dbo.CMT_REVEXTFILE.ACTIVE = 'Y' ) 
                         and ( cbt.dbo.CMT_REVEXTFILE.PRINTDOC = 'Y' ) 
                         and ( cbt.dbo.CMT_REVEXTFILE.ISQA = @parChar ) 
                         and ( cbt.dbo.CMT_REVEXTFILE.REVDET = cbt.dbo.CMT_REVDET.REVDET ) 
                         inner join cbt.dbo.PART  on ( cbt.dbo.PART.PART = cbt.dbo.REVISIONS.PART ) 
                         where ( cbt.dbo.REVISIONS.TILLDATE >=  DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                         and ( cbt.dbo.REVISIONS.FROMDATE <=  DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                         and ( cbt.dbo.REVISIONS.PART = @parInt )
                         order by cbt.dbo.CMT_REVEXTFILE.PRNORD `;
                      
    simpleQuery(Q, req.params.part, (req.params.isqa === 'Y' ? 'Y' : ''))
        .then(function(data, err) {
                if (err) {
                    console.log("get script Error: " + err);
                }
                data.recordset = data.recordset.map(function(ef) {
                    ef.Link = ef.Link.replace('Y:', fileServer);
                    ef.Link = ef.Link.replace('\\\\cbt-filesrv', fileServer);
                    ef.Link = '<a href="' + ef.Link + '"><img border="0" src="' + ef.Link + '" width="50" height="50" alt="מסמך חיצוני"></a>';
                    return ef;
                })
                res.json(data.recordset);
                return data.recordset;
        })
}