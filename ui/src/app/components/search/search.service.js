export class SearchService {
  constructor ($http) {
    'ngInject';
    this.$http = $http;
    this.results = {}
    this.params = {
      keywords: "+itemType:clip",
      page: "1",
      pageSize:"50",
      resultPageNumber:"1",
      resultPageSize:"50"
    };
  }

  index() {
    return this.$http.get('http://localhost:3000/api/search/index', {'params': this.params})
      .then(function(response){
      this.results = response;
    }.bind(this));
  }

  getResults() {
    return this.results;
  }
}
