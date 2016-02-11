import { Router, RouteParams } from 'angular2/router';
import { AssetData } from '../../common/services/asset.data.service';
import { Asset } from '../../common/interfaces/asset.interface';
export declare class Search {
    private _router;
    routeParams: RouteParams;
    _assetData: AssetData;
    assets: Asset[];
    errorMessage: string;
    private _params;
    constructor(_router: Router, routeParams: RouteParams, _assetData: AssetData);
    ngOnInit(): void;
    searchAssets(): void;
}
