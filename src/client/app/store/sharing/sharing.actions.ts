import { Action } from '@ngrx/store';

import { SubclipMarkers } from '../../shared/interfaces/subclip-markers';
import { AssetShareParameters, CollectionShareParameters } from '../../shared/interfaces/common.interface';

export class ActionFactory {
  public createAssetShareLink(assetId: number, subclipMarkers: SubclipMarkers): CreateAssetShareLink {
    return new CreateAssetShareLink(assetId, subclipMarkers);
  }

  public emailAssetShareLink(assetId: number, markers: SubclipMarkers, parameters: AssetShareParameters): EmailAssetShareLink {
    return new EmailAssetShareLink(assetId, markers, parameters);
  }

  public emailCollectionShareLink(collectionId: number, parameters: CollectionShareParameters): EmailCollectionShareLink {
    return new EmailCollectionShareLink(collectionId, parameters);
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
  constructor(public readonly assetId: number, public readonly markers: SubclipMarkers) { }
}

export class CreateAssetShareLinkSuccess implements Action {
  public static readonly Type = '[Sharing] Create Asset Share Link Success';
  public readonly type = CreateAssetShareLinkSuccess.Type;
  constructor(public readonly link: string) { }
}

export class EmailCollectionShareLink implements Action {
  public static readonly Type = '[Sharing] Email Collection Share Link';
  public readonly type = EmailCollectionShareLink.Type;
  constructor(
    public readonly collectionId: number,
    public readonly parameters: CollectionShareParameters
  ) { }
}

export class EmailAssetShareLink implements Action {
  public static readonly Type = '[Sharing] Email Asset Share Link';
  public readonly type = EmailAssetShareLink.Type;
  constructor(
    public readonly assetId: number,
    public readonly markers: SubclipMarkers,
    public readonly parameters: AssetShareParameters
  ) { }
}

export type Any = CreateAssetShareLink | CreateAssetShareLinkSuccess | EmailAssetShareLink | EmailCollectionShareLink;