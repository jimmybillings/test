var router = require('express').Router();

// api router will mount other routers
// for all our resources
router.use('/users', require('./user/userRoutes'));
router.use('/posts', require('./post/postRoutes'));
router.use('/search', require('./search/searchRoutes'));

module.exports = router;
