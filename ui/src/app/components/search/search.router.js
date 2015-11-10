export function searchRouter ($stateProvider) {
  'ngInject';
  $stateProvider
    .state('search', {
      url: '/search',
      abstract: true,
      template: '<ui-view/>',
      replace: true
    })
    .state('search.index', {
      url: '/index',
      templateUrl: 'app/components/search/index.html',
      controller: 'SearchController',
      controllerAs: 'vm'
    });
}
