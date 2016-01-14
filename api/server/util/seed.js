var User = require('../api/user/userModel');
var Post = require('../api/post/postModel');
var _ = require('lodash');
var logger = require('./logger');

logger.log('Seeding the Database');

var users = [
  {username: 'Jimmylo', password: 'test', street: '18 gables', city: 'Los Angeles', state: 'CA', country: 'USA'},
  {username: 'Xoko', password: 'test', street: '18 gables', city: 'Los Angeles', state: 'CA', country: 'USA'},
  {username: 'katamon', password: 'test', street: '18 gables', city: 'Los Angeles', state: 'CA', country: 'USA'}
];

var posts = [
  {title: 'Learn angular 2 today', text: 'Angular to is so dope'},
  {title: '10 reasons you should love IE7', text: 'IE7 is so amazing'},
  {title: 'Why we switched to Go', text: 'go is dope'}
];

var createDoc = function(model, doc) {
  return new Promise(function(resolve, reject) {
    new model(doc).save(function(err, saved) {
      return err ? reject(err) : resolve(saved);
    });
  });
};

var cleanDB = function() {
  logger.log('... cleaning the DB');
  var cleanPromises = [User, Post]
    .map(function(model) {
      return model.remove().exec();
    });
  return Promise.all(cleanPromises);
}

var createUsers = function(data) {

  var promises = users.map(function(user) {
    return createDoc(User, user);
  });

  return Promise.all(promises)
    .then(function(users) {
      return _.merge({users: users}, data || {});
    });
};


var createPosts = function(data) {

  var newPosts = posts.map(function(post, i) {
    post.author = data.users[i]._id;
    return createDoc(Post, post);
  });

  return Promise.all(newPosts)
    .then(function(savedPosts) {
      return 'Seeded DB with 3 Posts, 3 Users';
    });
};

cleanDB()
  .then(createUsers)
  .then(createPosts)
  .then(logger.log.bind(logger))
  .catch(logger.log.bind(logger));
