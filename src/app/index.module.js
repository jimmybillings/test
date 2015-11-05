
import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { HomeController } from '../app/components/home/home.controller';
import { UserController } from '../app/components/user/user.controller';
import { HomeService } from '../app/components/home/home.service';
import { NavbarDirective } from '../app/components/navbar/navbar.directive';

angular.module('portalUi', ['ngTouch', 'ngSanitize', 'ngAria', 'ui.router', 'ngMaterial'])
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('HomeService', HomeService)
  .controller('HomeController', HomeController)
  .controller('UserController', UserController)
  .directive('acmeNavbar', NavbarDirective)
