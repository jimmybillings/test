import { CurrentUser } from '../../common/models/current-user.model';
export declare class AppComponent {
    currentUser: CurrentUser;
    constructor(currentUser: CurrentUser);
    ngOnInit(): void;
}
