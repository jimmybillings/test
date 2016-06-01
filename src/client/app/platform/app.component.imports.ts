/*
 * This is a manifest file for all imports needed in the app component. 
 * This will make it easier to maintain across multiple portals. 
 */

// Containers
export {UserManagementComponent} from '../+user-management/user-management.component';
export {HomeComponent} from '../+home/home.component';
export {ContentComponent} from '../+content/content.component';
export {SearchComponent} from '../+search/search.component';
export {AssetComponent} from '../+asset/asset.component';
export {AdminComponent} from '../+admin/admin.component';
export {CollectionComponent} from '../+collections/collection.component';

// Services
export { CurrentUser} from '../shared/services/current-user.model';
export { ApiConfig} from '../shared/services/api.config';
export { UiConfig} from '../shared/services/ui.config';
export { SearchContext} from '../shared/services/search-context.service';
export { Authentication} from '../+user-management/services/authentication.data.service';

// Interfaces
export {ILang} from '../shared/interfaces/language.interface';

// Pure Components
import {AppNavComponent} from '../shared/components/app-nav/app-nav.component';
import {FooterComponent} from '../shared/components/footer/footer.component';
import {NotificationComponent} from '../shared/components/notification/notification.component';
import {SearchBoxComponent} from '../shared/components/search-box/search-box.component';
import {BinTrayComponent} from '../shared/components/bin-tray/bin-tray.component';

// Angular
import {ROUTER_DIRECTIVES} from '@angular/router';

export const APP_COMPONENT_DIRECTIVES = [
  AppNavComponent,
  FooterComponent,
  NotificationComponent,
  SearchBoxComponent,
  BinTrayComponent,
  ROUTER_DIRECTIVES
];

