export class HomeController {
  constructor ($timeout, HomeService) {
    'ngInject';

    this.awesomeThings = [];
    this.classAnimation = '';
    this.creationDate = 1446179969392;

    this.activate($timeout, HomeService);
  }

  activate($timeout, HomeService) {
    this.getTec(HomeService);
    $timeout(() => {
      this.classAnimation = 'rubberBand';
    }, 4000);
  }

  getTec(HomeService) {
    this.awesomeThings = HomeService.getTec();

    angular.forEach(this.awesomeThings, (awesomeThing) => {
      awesomeThing.rank = Math.random();
    });
  }
}
