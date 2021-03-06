import { Action } from '@ngrx/store';
import { ApiErrorResponse } from '../../shared/interfaces/api.interface';
import { DeliveryOptions, DeliveryOption } from '../../shared/interfaces/asset.interface';
import { Asset } from '../../shared/interfaces/common.interface';
import { SubclipMarkers } from '../../shared/interfaces/subclip-markers';

export class ActionFactory {
  public load(asset: Asset): Load {
    return new Load(asset);
  }

  public download(option: DeliveryOption): Download {
    return new Download(option);
  }

  public downloadViaAspera(option: DeliveryOption): DownloadViaAspera {
    return new DownloadViaAspera(option);
  }

  public deliver(assetId: number, option: DeliveryOption, markers: SubclipMarkers): Deliver {
    return new Deliver(assetId, option, markers);
  }
}

export class InternalActionFactory extends ActionFactory {
  public loadSuccess(options: DeliveryOptions): LoadSuccess {
    return new LoadSuccess(options);
  }

  public loadFailure(error: ApiErrorResponse): LoadFailure {
    return new LoadFailure(error);
  }

  public deliverySuccess(orderId: number): DeliverySuccess {
    return new DeliverySuccess(orderId);
  }

  public deliveryFailure(error: ApiErrorResponse): DeliveryFailure {
    return new DeliveryFailure(error);
  }
}

export class Load implements Action {
  public static readonly Type = '[Delivery Options] Load';
  public readonly type = Load.Type;
  constructor(public readonly activeAsset: Asset) { }
}

export class LoadSuccess implements Action {
  public static readonly Type = '[Delivery Options] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly options: DeliveryOptions) { }
}

export class LoadFailure implements Action {
  public static readonly Type = '[Delivery Options] Load Failure';
  public readonly type = LoadFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export class Download implements Action {
  public static readonly Type = '[Delivery Options] Download';
  public readonly type = Download.Type;
  constructor(public readonly option: DeliveryOption) { }
}

export class DownloadViaAspera implements Action {
  public static readonly Type = '[Delivery Options] Download Via Aspera';
  public readonly type = DownloadViaAspera.Type;
  constructor(public readonly option: DeliveryOption) { }
}

export class Deliver implements Action {
  public static readonly Type = '[Delivery Options] Deliver Asset';
  public readonly type = Deliver.Type;
  constructor(
    public readonly assetId: number,
    public readonly option: DeliveryOption,
    public readonly markers?: SubclipMarkers
  ) { }
}

export class DeliverySuccess implements Action {
  public static readonly Type = '[Delivery Options] Delivery Success';
  public readonly type = DeliverySuccess.Type;
  constructor(public readonly orderId: number) { }
}

export class DeliveryFailure implements Action {
  public static readonly Type = '[Delivery Options] Delivery Failure';
  public readonly type = DeliveryFailure.Type;
  constructor(public readonly error: ApiErrorResponse) { }
}

export type Any = Load | LoadSuccess | LoadFailure | Download | Deliver | DeliverySuccess | DeliveryFailure | DownloadViaAspera;
