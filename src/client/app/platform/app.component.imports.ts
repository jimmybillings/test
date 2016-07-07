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
export {CollectionsComponent} from '../+collections/collections.component';
export {CollectionShowComponent} from '../+collections/collection-show.component';

// Services
export { CurrentUser} from '../shared/services/current-user.model';
export { UserPermission } from '../shared/services/permission.service';
export { ApiConfig} from '../shared/services/api.config';
export { UiConfig} from '../shared/services/ui.config';
export { SearchContext} from '../shared/services/search-context.service';
export { Authentication} from '../+user-management/services/authentication.data.service';
export { CollectionsService } from '../+collections/services/collections.service';
export { UiState} from '../shared/services/ui.state';
export { NotificationService } from '../shared/components/notification/notification.service';
export { ToastService } from '../shared/components/toast/toast.service';
export { ViewContainerService } from '../shared/services/view-container.service';

// Interfaces
export {ILang} from '../shared/interfaces/language.interface';
export { Collection, CollectionStore } from '../shared/interfaces/collection.interface';

// Pure Components
import { AppNavComponent} from '../shared/components/app-nav/app-nav.component';
import { FooterComponent} from '../shared/components/footer/footer.component';
import { NotificationComponent} from '../shared/components/notification/notification.component';
import { ToastComponent} from '../shared/components/toast/toast.component';
import { SearchBoxComponent} from '../shared/components/search-box/search-box.component';
import { BinTrayComponent} from '../shared/components/bin-tray/bin-tray.component';
import { CollectionFormComponent } from '../+collections/collection-form.component';
import { CollectionListDdComponent } from '../+collections/collections-list-dd.component';

export const APP_COMPONENT_DIRECTIVES = [
  AppNavComponent,
  FooterComponent,
  NotificationComponent,
  ToastComponent,
  SearchBoxComponent,
  BinTrayComponent,
  CollectionFormComponent,
  CollectionListDdComponent
];
