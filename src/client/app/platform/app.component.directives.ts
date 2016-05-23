/*
 * These are globally available directives in any template
 */
import {ROUTER_DIRECTIVES} from '@angular/router';

// Components
import {AppNavComponent} from '../shared/components/app-nav/app-nav.component';
import {FooterComponent} from '../shared/components/footer/footer.component';
import {NotificationComponent} from '../shared/components/notification/notification.component';
import {SearchBoxComponent} from '../shared/components/search-box/search-box.component';
import {BinTrayComponent} from '../shared/components/bin-tray/bin-tray.component';
// application_directives: directives that are global through out the application
export const APP_COMPONENT_DIRECTIVES = [
  // ...ROUTER_DIRECTIVES,
  AppNavComponent,
  FooterComponent,
  NotificationComponent,
  SearchBoxComponent,
  BinTrayComponent,
  ROUTER_DIRECTIVES
];

