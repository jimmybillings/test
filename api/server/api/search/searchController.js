var Search = require('./searchModel');
var _ = require('lodash');

exports.get = function(req, res, next) {

  var params = {
    filter: "+family:website",
    view:"deep",
    filterString:'filterString=allSearchable=description:tree description:frog',
    sortBy:"-ingestedDateTimeSort;-supplierTier;-quality",
    auth:"T3Delivery-api:deliver-mAdre4ec:2c3afb058e344237a1f508c3fe39a06d"
  };

  _.merge(req.query, params)

  Search.get(req.query).then(function(response){
    res.send(response);
  });

};


