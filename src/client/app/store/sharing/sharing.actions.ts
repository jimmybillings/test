import { Action } from '@ngrx/store';

import { SubclipMarkers } from '../../shared/interfaces/subclip-markers';
import { Pojo } from '../../shared/interfaces/common.interface';

export class ActionFactory {
  public createAssetShareLink(assetId: number, subclipMarkers: SubclipMarkers): CreateAssetShareLink {
    return new CreateAssetShareLink(assetId, subclipMarkers);
  }

  public emailAssetShareLink(assetId: number, subclipMarkers: SubclipMarkers, parameters: Pojo): EmailAssetShareLink {
    return new EmailAssetShareLink(assetId, subclipMarkers, parameters);
  }
}

export class InternalActionFactory extends ActionFactory {
  public createAssetShareLinkSuccess(link: string): CreateAssetShareLinkSuccess {
    return new CreateAssetShareLinkSuccess(link);
  }
}

export class CreateAssetShareLink implements Action {
  public static readonly Type = '[Sharing] Create Asset Share Link';
  public readonly type = CreateAssetShareLink.Type;
  constructor(public readonly assetId: number, public readonly subclipMarkers: SubclipMarkers) { }
}

export class CreateAssetShareLinkSuccess implements Action {
  public static readonly Type = '[Sharing] Create Asset Share Link Success';
  public readonly type = CreateAssetShareLinkSuccess.Type;
  constructor(public readonly link: string) { }
}

export class EmailAssetShareLink implements Action {
  public static readonly Type = '[Sharing] Email Asset Share Link';
  public readonly type = EmailAssetShareLink.Type;
  constructor(
    public readonly assetId: number, public readonly subclipMarkers: SubclipMarkers, public readonly parameters: Pojo
  ) { }
}

export type Any = CreateAssetShareLink | CreateAssetShareLinkSuccess | EmailAssetShareLink;
