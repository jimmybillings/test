import { Action } from '@ngrx/store';

import { Quote, AssetLineItem } from '../../shared/interfaces/commerce.interface';
import { Asset } from '../../shared/interfaces/common.interface';
import { ApiErrorResponse } from '../../shared/interfaces/api.interface';
import { SubclipMarkers } from '../../shared/interfaces/subclip-markers';
import { Pojo } from '../../shared/interfaces/common.interface';

export class ActionFactory {
  public load(): Load {
    return new Load();
  }

  public delete(): Delete {
    return new Delete();
  }

  public editLineItemFromDetails(uuid: string, markers: SubclipMarkers, attributes: Pojo): EditLineItemFromDetails {
    return new EditLineItemFromDetails(uuid, markers, attributes);
  }

  public removeAsset(asset: Asset): RemoveAsset {
    return new RemoveAsset(asset);
  }

  public addCustomPriceToLineItem(lineItem: AssetLineItem, price: number): AddCustomPriceToLineItem {
    return new AddCustomPriceToLineItem(lineItem, price);
  }

  // Move this to internal action factory when quote is fully "effected"
  public loadSuccess(quote: Quote): LoadSuccess {
    return new LoadSuccess(quote);
  }
}

export class InternalActionFactory extends ActionFactory {
  public loadFailure(error: ApiErrorResponse): LoadFailure {
    return new LoadFailure(error);
  }

  public deleteSuccess(quote: Quote): DeleteSuccess {
    return new DeleteSuccess(quote);
  }

  public deleteFailure(error: ApiErrorResponse): DeleteFailure {
    return new DeleteFailure(error);
  }

  public editLineItemFromDetailsSuccess(quote: Quote): EditLineItemFromDetailsSuccess {
    return new EditLineItemFromDetailsSuccess(quote);
  }

  public editLineItemFromDetailsFailure(error: ApiErrorResponse): EditLineItemFromDetailsFailure {
    return new EditLineItemFromDetailsFailure(error);
  }

  public removeAssetSuccess(quote: Quote): RemoveAssetSuccess {
    return new RemoveAssetSuccess(quote);
  }

  public removeAssetFailure(error: ApiErrorResponse): RemoveAssetFailure {
    return new RemoveAssetFailure(error);
  }

  public addCustomPriceToLineItemSuccess(quote: Quote): AddCustomPriceToLineItemSuccess {
    return new AddCustomPriceToLineItemSuccess(quote);
  }

  public addCustomPriceToLineItemFailure(error: ApiErrorResponse): AddCustomPriceToLineItemFailure {
    return new AddCustomPriceToLineItemFailure(error);
  }
}

export class Load implements Action {
  public static readonly Type = '[Quote Edit] Load';
  public readonly type = Load.Type;
}

export class LoadSuccess implements Action {
  public static readonly Type = '[Quote Edit] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly quote: Quote) { }
}

export class LoadFailure implements Action {
  public static readonly Type = '[Quote Edit] Load Failure';
  public readonly type = LoadFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export class Delete implements Action {
  public static readonly Type = '[Quote Edit] Delete';
  public readonly type = Delete.Type;
}

export class DeleteSuccess implements Action {
  public static readonly Type = '[Quote Edit] Delete Success';
  public readonly type = DeleteSuccess.Type;
  constructor(public readonly quote: Quote) { }
}

export class DeleteFailure implements Action {
  public static readonly Type = '[Quote Edit] Delete Failure';
  public readonly type = DeleteFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export class EditLineItemFromDetails implements Action {
  public static readonly Type = '[Quote Edit] Edit Line Item From Details';
  public readonly type = EditLineItemFromDetails.Type;
  constructor(public readonly uuid: string, public readonly markers: SubclipMarkers, public readonly attributes: Pojo) { }
}

export class EditLineItemFromDetailsSuccess implements Action {
  public static readonly Type = '[Quote Edit] Edit Line Item From Details Success';
  public readonly type = EditLineItemFromDetailsSuccess.Type;
  constructor(public readonly quote: Quote) { }
}

export class EditLineItemFromDetailsFailure implements Action {
  public static readonly Type = '[Quote Edit] Edit Line Item From Details Failure';
  public readonly type = EditLineItemFromDetailsFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export class RemoveAsset implements Action {
  public static readonly Type = '[Quote Edit] Remove Asset';
  public readonly type = RemoveAsset.Type;
  constructor(public readonly asset: Asset) { }
}

export class RemoveAssetSuccess implements Action {
  public static readonly Type = '[Quote Edit] Remove Asset Success';
  public readonly type = RemoveAssetSuccess.Type;
  constructor(public readonly quote: Quote) { }
}

export class RemoveAssetFailure implements Action {
  public static readonly Type = '[Quote Edit] Remove Asset Failure';
  public readonly type = RemoveAssetFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export class AddCustomPriceToLineItem implements Action {
  public static readonly Type = '[Quote Edit] Add Custom Price To LineItem';
  public readonly type = AddCustomPriceToLineItem.Type;
  constructor(public readonly lineItem: AssetLineItem, public readonly price: number) { }
}

export class AddCustomPriceToLineItemSuccess implements Action {
  public static readonly Type = '[Quote Edit] Add Custom Price To LineItem Success';
  public readonly type = AddCustomPriceToLineItemSuccess.Type;
  constructor(public readonly quote: Quote) { }
}

export class AddCustomPriceToLineItemFailure implements Action {
  public static readonly Type = '[Quote Edit] Add Custom Price To LineItem Failure';
  public readonly type = AddCustomPriceToLineItemFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export type Any =
  Load | LoadSuccess | LoadFailure |
  Delete | DeleteSuccess | DeleteFailure |
  EditLineItemFromDetails | EditLineItemFromDetailsSuccess | EditLineItemFromDetailsFailure |
  RemoveAsset | RemoveAssetSuccess | RemoveAssetFailure |
  AddCustomPriceToLineItem | AddCustomPriceToLineItemSuccess | AddCustomPriceToLineItemFailure;
