import { Config } from '../../../common/config/config';
export declare class Header {
    currentUser: any;
    showFixed: boolean;
    ui: Object;
    constructor(ui: Config);
    ngOnInit(): void;
    showFixedHeader(offset: any): void;
}
