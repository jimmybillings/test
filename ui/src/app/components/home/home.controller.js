export class HomeController {
  constructor ($timeout, HomeService) {
    'ngInject';

    this.awesomeThings = [];
    this.classAnimation = '';
    this.creationDate = 1446179969392;

    this.getTec(HomeService);
  }

  getTec(HomeService) {
    this.awesomeThings = HomeService.getTec();
    this.awesomeThings.forEach((awesomeThing) => {
      awesomeThing.rank = Math.random();
    });
  }
}
