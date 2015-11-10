var https = require('https');
var parser = require('xml2json');

exports.get = function() {

  // do a thing, possibly async, then…
  var options = {
    hostname: 'api.wzplatform.com',
    path: '/video/services/search/?keywords=%2BitemType%3Aclip&filter=%2Bphylum%3Atitle&page=1&pageSize=50&view=deep&filterString=allSearchable%3D%2BitemType%3Aclip%2F%2FluceneQuery%3Dcategory%3A%22Episodic+Television%22&sortBy=-ingestedDateTimeSort%3B-supplierTier%3B-quality&resultPageNumber=1&resultPageSize=10&auth=T3Delivery-api%3Adeliver-mAdre4ec%3A2c3afb058e344237a1f508c3fe39a06d',
    method: 'GET'
  };
    
  return new Promise(function(resolve, reject) {
    

    var req = https.request(options, function(res) {
      var str = '';

      res.on('data', function (chunk) {
          //console.log('BODY: ' + chunk);
           str += chunk;
       });

      res.on('end', function () {
        var options = {
          object: false,
          reversible: false,
          coerce: false,
          sanitize: true,
          trim: true,
          arrayNotation: false
        };
        var thejson = parser.toJson(str, options);
        resolve(thejson);   
      });
    });
      
    req.end();
  });
}

