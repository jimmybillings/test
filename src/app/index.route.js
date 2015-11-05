export function routerConfig ($stateProvider, $urlRouterProvider, $httpProvider) {
  'ngInject';
  $httpProvider.interceptors.push('AuthTokenInterceptor');
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/components/home/home.html',
      controller: 'HomeController',
      controllerAs: 'main'
    })

  $urlRouterProvider.otherwise('/');
}
