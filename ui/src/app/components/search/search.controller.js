export class SearchController {
  constructor (SearchService) {
    'ngInject';
    this.SearchService = SearchService
    this.index();
  }

  index() {
    this.SearchService.index();
  }

  clipRendition(rendition) {
    let bestRendition;
    bestRendition = (rendition.url) ? rendition.url :
      rendition.filter(function(rend){
        if (rend.purpose === "Thumbnail" && rend.size === "Large") {
            return rend;
        }
      })[0].url;
    return bestRendition || '';
  }
}
