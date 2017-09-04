var exports = module.exports = {};
var { simpleQuery } = require('./utils.js');
/**
Fetches the HTML of the Temporary Instructions from the Database
@param {Object} req -  The Request Object (param.part = PART(id))
@param {Object} res - The Response Object
@return {Json}  Action Name, Details (HTML)
*/
exports.tempi = function(req, res) {

        const Q = `select cbt.dbo.ACT.ACTNAME AS 'desc', 
                       reverse( reverse(substring(reverse( '' + cbt.dbo.CMT_TMPINSTEXT.TEXT ) , 1, 150) ) )  AS 'Text' , 
                        cbt.dbo.CMT_TMPINSTEXT.INSTRUCTION AS 'Order',  cbt.dbo.CMT_TMPINSTEXT.TEXTORD  
                       from cbt.dbo.REVISIONS  inner join cbt.dbo.CMT_REVDET  on ( cbt.dbo.CMT_REVDET.TDATE >= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                       and ( cbt.dbo.CMT_REVDET.FDATE <= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) and ( cbt.dbo.CMT_REVDET.REV = cbt.dbo.REVISIONS.REV ) 
                       inner join cbt.dbo.CMT_TMPINSTRUCTIONS  on ( cbt.dbo.CMT_TMPINSTRUCTIONS.REVDET = cbt.dbo.CMT_REVDET.REVDET ) 
                       inner join cbt.dbo.CMT_TMPINSTEXT  on ( cbt.dbo.CMT_TMPINSTEXT.INSTRUCTION = cbt.dbo.CMT_TMPINSTRUCTIONS.INSTRUCTION ) 
                       inner join cbt.dbo.ACT  on ( cbt.dbo.ACT.ACT = cbt.dbo.CMT_TMPINSTRUCTIONS.ACT ) 
                       where ( cbt.dbo.REVISIONS.FROMDATE <= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                       and ( cbt.dbo.REVISIONS.TILLDATE >= DATEDIFF(minute,\'01-01-1988 00:00\',getdate()) ) 
                       and ( cbt.dbo.REVISIONS.PART = @parInt ) 
                       order by 3 , 4 `;

        simpleQuery(Q,req.params.part)
          .then(function(recordset, err) {
              if (err) {
                  console.log("get script Error: " + err);
              }
              var obj = recordset.recordset.reduce(function(agg, obj) {
                  console.log(obj);
                  if (obj.hasOwnProperty('Text')) {
                      var text = obj['Text'].split("").reverse().join("")
                      if (agg.hasOwnProperty(obj.Order)) {
                          agg[obj.Order].text += text;
                      } else {
                          agg[obj.Order] = { des: obj.desc, text: text };
                      }
                  }
                  return agg;
              }, {});
              ret = {}
              ret.recordset = Object.keys(obj).map(function(o) { return { 'Action Name': obj[o].des, 'Details': obj[o].text } })
              res.json(ret.recordset);
        })
}