import { CurrentUser } from './common/models/current-user.model';
import { ApiConfig } from './common/config/api.config';
export declare class AppComponent {
    currentUser: CurrentUser;
    private _apiConfig;
    constructor(currentUser: CurrentUser, _apiConfig: ApiConfig);
    ngOnInit(): void;
}
