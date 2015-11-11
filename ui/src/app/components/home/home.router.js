export function homeRouter ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/components/home/home.html',
      controller: 'HomeController',
      controllerAs: 'main'
    })

  $urlRouterProvider.otherwise('/');
}