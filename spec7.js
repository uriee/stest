var exports = module.exports = {};
var { recur } = require('./utils.js');

/**
Fetches the Part's (P)roduced sons Recursivly (Full Tree)
@param {Object} req -  The Request Object (param.part = PART(id))
@param {Object} res - The Response Object
@return {Json} [{Level, Part Name, Part Description}]
*/
exports.spec7 = async function(req, res) {
    var query = `select  @level AS 'Level', 
    cbt.dbo.PART.PART AS 'KEY',   
    cbt.dbo.PART.PARTNAME , 
    cbt.dbo.PART.PARTDES , 
    cbt.dbo.PARTSPEC.SPEC7 
    from cbt.dbo.PARTARC  inner join cbt.dbo.PARTSPEC  on ( cbt.dbo.PARTSPEC.PART = cbt.dbo.PARTARC.SON ) 
    inner join cbt.dbo.PART on ( cbt.dbo.PART.PART = cbt.dbo.PARTARC.SON ) 
    where ( cbt.dbo.PARTSPEC.SPEC7 > rtrim(ltrim(reverse( '' ))) )
    and ( cbt.dbo.PARTARC.PART = @key ) 
    and ( cbt.dbo.PARTARC.FROMDATE <= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
    and ( cbt.dbo.PARTARC.TILLDATE >= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) )`

    var data = await recur(parseInt(req.params.part), query)
    res.json(data.map((x) => { return { Level: x.Level, 'Part Name': x.PARTNAME, 'Part Description': x.PARTDES } }))
}