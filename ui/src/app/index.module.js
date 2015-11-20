import '../../bower_components/wz_search/search.module'
import '../app/components/user/user.module'
import '../app/components/auth/auth.module'
import '../app/components/home/home.module'
import '../app/components/navbar/navbar.module'
import { config } from './index.config';
import { runBlock } from './index.run';

angular.module('portalUi', 
  [
  // Angular and Third Party Modules
  'ngTouch', 
  'ngSanitize', 
  'ngAria', 
  'ui.router', 
  'ngMaterial', 
  'ngMessages', 
  
  // Custom Modules for the Portal Application
  'portalUi.SearchModule', 
  'portalUi.UserModule', 
  'portalUi.AuthModule', 
  'portalUi.HomeModule', 
  'portalUi.NavBarModule'
  ]
)
.config(config)
.run(runBlock)

