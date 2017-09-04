var exports = module.exports = {};
var { simpleQuery } = require('./utils.js');

/**
Fetches the part and part revisions data from the Database
@param {Object} req -  The Request Object
@param {Object} res - The Response Object
@return {Json}  Part Description, Revision Number, Revision Description, SubRevision Number, SubRevision Description, SPEC4
*/
exports.part_part = function(req, res) {

    const Q = `select cbt.dbo.PART.PARTNAME AS 'Part Name', 
                        reverse( reverse(substring(reverse( '' + cbt.dbo.PART.PARTDES ) , 1, 50) ) ) AS 'Part Description' , 
                        cbt.dbo.REVISIONS.REVNUM AS 'Revision Number', 
                        reverse( reverse(substring(reverse( '' + cbt.dbo.REVISIONS.REVDES ) , 1, 50) ) )  AS 'Revision Description', 
                        cbt.dbo.CMT_REVDET.REVNAME AS 'SubRevision Number', 
                        reverse(substring(reverse( '' + cbt.dbo.CMT_REVDET.REVDES ) , 1, 50) )  AS 'SubRevision Description', 
                        cbt.dbo.PARTSPEC.SPEC4 
                        from cbt.dbo.PART  inner join cbt.dbo.CMT_REVDET  on ( cbt.dbo.CMT_REVDET.TDATE >= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                        and ( cbt.dbo.CMT_REVDET.FDATE <= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                        inner join cbt.dbo.REVISIONS  on ( cbt.dbo.REVISIONS.REV = cbt.dbo.CMT_REVDET.REV ) 
                        inner join cbt.dbo.PARTSPEC  on ( cbt.dbo.PARTSPEC.PART = cbt.dbo.PART.PART ) 
                        where ( cbt.dbo.REVISIONS.FROMDATE <= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                        and ( cbt.dbo.REVISIONS.TILLDATE >= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                        and ( cbt.dbo.REVISIONS.PART = cbt.dbo.PART.PART ) 
                        and ( cbt.dbo.PART.PART = @parInt ) `;

    simpleQuery(Q, req.params.part)
        .then(function(recordset, err) {
                if (err) {
                    console.log("get script Error: " + err);
                }
                res.json(recordset.recordset);
            }).catch(err=> { console.log(err); })
}