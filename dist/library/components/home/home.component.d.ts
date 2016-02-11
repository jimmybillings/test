import { Router } from 'angular2/router';
import { CurrentUser } from '../../common/models/current-user.model';
import { UiConfig } from '../../common/config/ui.config';
export declare class Home {
    currentUser: CurrentUser;
    router: Router;
    uiConfig: UiConfig;
    ui: Object;
    constructor(currentUser: CurrentUser, router: Router, uiConfig: UiConfig);
}
