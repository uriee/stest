var exports = module.exports = {};
var { simpleQuery } = require('./utils.js');
/**
Fetches the part's Proccess including the HTML remarks 
@param {Object} req -  The Request Object (param.part = PART(id))
@param {Object} res - The Response Object
@return {Json} Details - HTML Remarks, Proccess Name
*/
exports.proc = function(req, res, fileServer) {

    const Q =   `select cbt.dbo.CMT_PROCACT.ACTORD AS 'Order', 
                cbt.dbo.ACT.ACTDES AS 'Desc',
                reverse( reverse(substring(reverse( '' + cbt.dbo.ACT.ACTDES ) , 1, 50) ) ) AS 'desc' , 
                coalesce( cbt.dbo.PROCACTTEXT.TEXT , '' ) AS "Text" 
                from cbt.dbo.REVISIONS  inner join cbt.dbo.CMT_REVDET  on ( cbt.dbo.CMT_REVDET.TDATE >= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                and ( cbt.dbo.CMT_REVDET.FDATE <= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                and ( cbt.dbo.CMT_REVDET.REV = cbt.dbo.REVISIONS.REV ) 
                inner join cbt.dbo.CMT_PROCACT  on ( cbt.dbo.CMT_PROCACT.REVDET = cbt.dbo.CMT_REVDET.REVDET ) 
                inner join cbt.dbo.ACT  on ( cbt.dbo.ACT.ACT = cbt.dbo.CMT_PROCACT.ACT ) 
                left outer join cbt.dbo.PROCACTTEXT  on ( cbt.dbo.PROCACTTEXT.REVDET = cbt.dbo.CMT_PROCACT.REVDET ) 
                and ( cbt.dbo.PROCACTTEXT.ACT = cbt.dbo.CMT_PROCACT.ACT ) and ( cbt.dbo.PROCACTTEXT.T$PROC = 0 ) 
                and ( coalesce( cbt.dbo.PROCACTTEXT.TEXTLINE , 0 ) = coalesce( cbt.dbo.PROCACTTEXT.TEXTLINE , 0 ) ) 
                where ( cbt.dbo.REVISIONS.PART = @parInt  ) 
                and ( cbt.dbo.REVISIONS.TILLDATE >= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                and ( cbt.dbo.REVISIONS.FROMDATE <= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) )  
                order by cbt.dbo.CMT_PROCACT.ACTORD , cbt.dbo.PROCACTTEXT.TEXTORD  `;

    simpleQuery(Q,req.params.part)
        .then(function(recordset, err) {
                if (err) {
                    console.log("get script Error: " + err);
                }
                console.log(recordset.recordset);
                var obj = recordset.recordset.reduce(function(agg, obj) {
                    console.log(obj);
                    if (obj.hasOwnProperty('Text')) {
                        var text = obj['Text'].split("").reverse().join("") + " "
                        if (agg.hasOwnProperty(obj.Order)) {
                            agg[obj.Order].text += text;
                        } else {
                            agg[obj.Order] = { des: obj.desc, text: text };
                        }
                    }

                    return agg;
                }, {});
                ret = {}
                ret.recordset = Object.keys(obj).map(function(o) { return { 'Details': obj[o].text.replace('src="Y:', 'src="' + fileServer), 'Proccess Name': obj[o].des } })
                res.json(ret.recordset);
        });
}