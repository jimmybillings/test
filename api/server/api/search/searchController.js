var Search = require('./searchModel');
var _ = require('lodash');

exports.get = function(req, res, next) {

  Search.get().then(function(response){
    res.send(response);
  });

};


