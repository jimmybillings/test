export class SearchController {
  constructor (SearchService) {
    'ngInject';
    this.SearchService = SearchService
    this.index();
  }

  index() {
    this.SearchService.index();
  }
}
