export class SearchService {
  constructor ($http) {
    'ngInject';
    this.$http = $http;
    this.results = {}
  }

  index() {
    return this.$http.get('http://localhost:3000/api/search/index')
      .then(function(response){
      this.results = response;
    }.bind(this));
  }

  getResults() {
    return this.results;
  }
}
