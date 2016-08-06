/*
 * This is a manifest file for all imports needed in the app component.
 * This will make it easier to maintain across multiple portals.
 */

// Containers
export { UserManagementComponent } from '../+user-management/user-management.component';
export { HomeComponent } from '../+home/home.component';
export { ContentComponent } from '../+content/content.component';
export { SearchComponent } from '../+search/search.component';
export { AssetComponent } from '../+asset/asset.component';
export { AdminComponent } from '../+admin/admin.component';
export { CollectionsComponent } from '../+collection/+index/collections.component';
export { CollectionShowComponent } from '../+collection/+show/collection-show.component';

// Services
export { CurrentUser} from '../shared/services/current-user.model';
export { UserPermission } from '../shared/services/permission.service';
export { ApiConfig} from '../shared/services/api.config';
export { UiConfig} from '../shared/services/ui.config';
export { SearchContext} from '../shared/services/search-context.service';
export { Authentication} from '../+user-management/services/authentication.data.service';
export { CollectionsService } from '../+collection/services/collections.service';
export { UiState} from '../shared/services/ui.state';
export { WzNotificationService } from '../shared/components/wz-notification/wz.notification.service';
export { ActiveCollectionService} from '../+collection/services/active-collection.service';

// Interfaces
export { ILang} from '../shared/interfaces/language.interface';
export { Collection, CollectionStore } from '../shared/interfaces/collection.interface';

// Pure Components
import { AppNavComponent } from '../application/app-nav/app-nav.component';
import { FooterComponent } from '../application/footer/footer.component';
import { WzNotificationComponent } from '../shared/components/wz-notification/wz.notification.component';
import { WzSearchBoxComponent } from '../shared/components/wz-search-box/wz.search-box.component';
import { BinTrayComponent } from '../application/bin-tray/bin-tray.component';
import { CollectionListDdComponent } from '../+collection/components/collections-list-dd.component';

export const APP_COMPONENT_DIRECTIVES = [
  AppNavComponent,
  FooterComponent,
  WzNotificationComponent,
  WzSearchBoxComponent,
  BinTrayComponent,
  CollectionListDdComponent
];
