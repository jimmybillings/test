var https = require('https');
var parser = require('xml2json');
var queryString = require('querystring');

exports.get = (params) => {

  var options = {
    hostname: 'api.wzplatform.com',
    path: '/video/services/search/?'+queryString.stringify(params),
    method: 'GET'
  };

  return new Promise(function(resolve, reject) {
    
    console.log(options.path)
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
          sanitize: false,
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

