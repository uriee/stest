var exports = module.exports = {};
var { simpleQuery } = require('./utils.js');

/**
Fetches the Part's Sons Locations 
@param {Object} req -  The Request Object (param.part = PART(id))
@param {Object} res - The Response Object
@return {Json} [{Part Name, Part Description, Location, To Location, Quantity}]
*/
exports.locations = function(req, res) {

    const Q = `select cbt.dbo.PART.PARTNAME AS 'Part Name', 
                     reverse( reverse(substring(reverse( '' + cbt.dbo.PART.PARTDES ) , 1, 50) ) ) AS 'Part Description', 
                     cbt.dbo.LOCATIONS.LOCATION AS 'Location', 
                     cbt.dbo.LOCATIONS.TOLOCATION AS 'To Location', 
                     cbt.dbo.LOCATIONS.QUANT AS 'Quantity'
                     from cbt.dbo.REVISIONS  inner join cbt.dbo.LOCATIONS  on ( cbt.dbo.LOCATIONS.PART = @parInt ) 
                     and ( cbt.dbo.LOCATIONS.PART = cbt.dbo.REVISIONS.PART ) 
                     and ( cbt.dbo.LOCATIONS.REV = cbt.dbo.REVISIONS.REV ) 
                     inner join cbt.dbo.PART  on ( cbt.dbo.PART.PART = cbt.dbo.LOCATIONS.SON ) 
                     where ( cbt.dbo.REVISIONS.TILLDATE > DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                     and ( cbt.dbo.REVISIONS.FROMDATE <= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) )
                      `;
    simpleQuery(Q,req.params.part)
        .then(function(recordset, err) {
                if (err) {
                    console.log("get script Error: " + err);
                }
                res.json(recordset.recordset);
        })
}