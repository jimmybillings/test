import { Action } from '@ngrx/store';

import {
  CollectionPaginationParameters, Collection, CollectionItems, CollectionItemMarkersUpdater, CollectionItemsResponse
} from '../../shared/interfaces/collection.interface';
import { Asset, Comment, Comments } from '../../shared/interfaces/common.interface';
import { SubclipMarkers } from '../../shared/interfaces/subclip-markers.interface';

const defaultPagination: CollectionPaginationParameters = { currentPage: 1, pageSize: 100 };

export class ActionFactory {
  public load(pagination: CollectionPaginationParameters = defaultPagination): Load {
    return new Load(pagination);
  }

  public set(collectionId: number, pagination: CollectionPaginationParameters = defaultPagination): Set {
    return new Set(collectionId, pagination);
  }

  public loadPage(pagination: CollectionPaginationParameters = defaultPagination): LoadPage {
    return new LoadPage(pagination);
  }

  public addAsset(asset: Asset, markers?: SubclipMarkers): AddAsset {
    return new AddAsset(asset, markers);
  }

  public removeAsset(asset: Asset): RemoveAsset {
    return new RemoveAsset(asset);
  }

  public updateAssetMarkers(asset: Asset, markers: SubclipMarkers): UpdateAssetMarkers {
    return new UpdateAssetMarkers(asset, markers);
  }

  public addComment(comment: Comment): AddComment {
    return new AddComment(comment);
  }

  public editComment(comment: Comment): EditComment {
    return new EditComment(comment);
  }

  public reset(): Reset {
    return new Reset();
  }
};

export class InternalActionFactory extends ActionFactory {
  public loadSuccess(activeCollection: Collection): LoadSuccess {
    return new LoadSuccess(activeCollection);
  }

  public setSuccess(activeCollection: Collection): SetSuccess {
    return new SetSuccess(activeCollection);
  }

  public loadPageSuccess(currentPageItems: CollectionItems): LoadPageSuccess {
    return new LoadPageSuccess(currentPageItems);
  }

  public addAssetSuccess(currentPageItems: CollectionItems): AddAssetSuccess {
    return new AddAssetSuccess(currentPageItems);
  }

  public removeAssetSuccess(currentPageItems: CollectionItems): RemoveAssetSuccess {
    return new RemoveAssetSuccess(currentPageItems);
  }

  public updateAssetMarkersSuccess(currentPageItems: CollectionItems): UpdateAssetMarkersSuccess {
    return new UpdateAssetMarkersSuccess(currentPageItems);
  }

  public addCommentSuccess(comments: Comments): AddCommentSuccess {
    return new AddCommentSuccess(comments);
  }

  public editCommentSuccess(comments: Comments): EditCommentSuccess {
    return new EditCommentSuccess(comments);
  }
};

export class Load implements Action {
  public static readonly Type = '[Active Collection] Load';
  public readonly type = Load.Type;
  constructor(public readonly pagination: CollectionPaginationParameters) { }
}

export class LoadSuccess implements Action {
  public static readonly Type = '[Active Collection] Load Success';
  public readonly type = LoadSuccess.Type;
  constructor(public readonly activeCollection: Collection) { }
}

export class Set implements Action {
  public static readonly Type = '[Active Collection] Set';
  public readonly type = Set.Type;
  constructor(public readonly collectionId: number, public readonly pagination: CollectionPaginationParameters) { }
}

export class SetSuccess implements Action {
  public static readonly Type = '[Active Collection] Set Success';
  public readonly type = SetSuccess.Type;
  constructor(public readonly activeCollection: Collection) { }
}

export class LoadPage implements Action {
  public static readonly Type = '[Active Collection] Load Page';
  public readonly type = LoadPage.Type;
  constructor(public readonly pagination: CollectionPaginationParameters) { }
}

export class LoadPageSuccess implements Action {
  public static readonly Type = '[Active Collection] Load Page Success';
  public readonly type = LoadPageSuccess.Type;
  constructor(public readonly currentPageItems: CollectionItems) { }
}

export class AddAsset implements Action {
  public static readonly Type = '[Active Collection] Add Asset';
  public readonly type = AddAsset.Type;
  constructor(public readonly asset: Asset, public readonly markers: SubclipMarkers) { }
}

export class AddAssetSuccess implements Action {
  public static readonly Type = '[Active Collection] Add Asset Success';
  public readonly type = AddAssetSuccess.Type;
  constructor(public readonly currentPageItems: CollectionItems) { }
}

export class RemoveAsset implements Action {
  public static readonly Type = '[Active Collection] Remove Asset';
  public readonly type = RemoveAsset.Type;
  constructor(public readonly asset: Asset) { }
}

export class RemoveAssetSuccess implements Action {
  public static readonly Type = '[Active Collection] Remove Asset Success';
  public readonly type = RemoveAssetSuccess.Type;
  constructor(public readonly currentPageItems: CollectionItems) { }
}

export class UpdateAssetMarkers implements Action {
  public static readonly Type = '[Active Collection] Update Asset Markers';
  public readonly type = UpdateAssetMarkers.Type;
  constructor(public readonly asset: Asset, public readonly markers: SubclipMarkers) { }
}

export class UpdateAssetMarkersSuccess implements Action {
  public static readonly Type = '[Active Collection] Update Asset Markers Success';
  public readonly type = UpdateAssetMarkersSuccess.Type;
  constructor(public readonly currentPageItems: CollectionItems) { }
}

export class AddComment implements Action {
  public static readonly Type = '[Active Collection] Add Comment';
  public readonly type = AddComment.Type;
  constructor(public readonly comment: Comment) { }
}

export class EditComment implements Action {
  public static readonly Type = '[Active Collection] Edit Comment';
  public readonly type = EditComment.Type;
  constructor(public readonly comment: Comment) { }
}

export class AddCommentSuccess implements Action {
  public static readonly Type = '[Active Collection] Add Comment Success';
  public readonly type = AddCommentSuccess.Type;
  constructor(public readonly activeCollectionComments: Comments) { }
}

export class EditCommentSuccess implements Action {
  public static readonly Type = '[Active Collection] Edit Comment Success';
  public readonly type = EditCommentSuccess.Type;
  constructor(public readonly activeCollectionComments: Comments) { }
}

export class Reset implements Action {
  public static readonly Type = '[Active Collection] Reset';
  public readonly type = Reset.Type;
}

export type Any = Load | LoadSuccess | Set | SetSuccess | LoadPage | LoadPageSuccess | AddAsset | AddAssetSuccess | RemoveAsset
  | RemoveAssetSuccess | UpdateAssetMarkers | UpdateAssetMarkersSuccess | AddComment | AddCommentSuccess | EditComment
  | EditCommentSuccess | Reset;
