var router = require('express').Router();
var logger = require('../../util/logger');
var controller = require('./searchController');
var auth = require('../../auth/auth');
var checkUser = [auth.decodeToken(), auth.getFreshUser()];

// setup boilerplate route jsut to satisfy a request
// for building
// router.param('id', controller.params);
router.get('/index', controller.get);

// router.route('/')
//   .get(auth.decodeToken(), controller.get)
//   .post(controller.post)

// router.route('/:id')
//   .get(controller.getOne)
//   .put(checkUser, controller.put)
//   .delete(checkUser, controller.delete)

module.exports = router;
