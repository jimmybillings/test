import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../shared/services/api.service';
import { Api, ApiOptions } from '../../shared/interfaces/api.interface';
import {
  Collection, CollectionPaginationParameters, CollectionItems, CollectionItemMarkersUpdater,
  CollectionItemsResponse, CollectionAssetResponse
} from '../../shared/interfaces/collection.interface';
import { Asset, Pagination } from '../../shared/interfaces/common.interface';
import { SubclipMarkers } from '../../shared/interfaces/subclip-markers.interface';
import { Frame } from 'wazee-frame-formatter';
import { CommentService } from './comment.service';
import { Comments, Comment } from '../../shared/interfaces/common.interface';

@Injectable()
export class ActiveCollectionService {
  constructor(private apiService: ApiService, private commentService: CommentService) { }

  public load(parameters: CollectionPaginationParameters): Observable<Collection> {
    return this.combineCollectionWithAuxiliaryData(
      this.apiService.get(Api.Assets, 'collectionSummary/focused', { loadingIndicator: true }),
      parameters
    );
  }

  public set(collectionId: number, parameters: CollectionPaginationParameters): Observable<Collection> {
    return this.combineCollectionWithAuxiliaryData(
      this.apiService.put(Api.Assets, `collectionSummary/setFocused/${collectionId}`, { loadingIndicator: true }),
      parameters
    );
  }

  public loadPage(collectionId: number, parameters: CollectionPaginationParameters): Observable<CollectionItems> {
    return this.apiService.get(
      Api.Assets,
      `collectionSummary/assets/${collectionId}`,
      { parameters: this.convertToApiParameters(parameters), loadingIndicator: true }
    ).map(this.convertToCollectionItems);
  }

  public addAssetTo(activeCollection: Collection, asset: Asset, markers: SubclipMarkers): Observable<CollectionItems> {
    const assetInfo: object = {
      assetId: asset.assetId, timeStart: String(this.timeStartFrom(markers)), timeEnd: String(this.timeEndFrom(markers))
    };

    return this.apiService.post(
      Api.Identities, 'collection/focused/addAssets', { body: { list: [assetInfo] }, loadingIndicator: true }
    ).flatMap(() =>
      this.loadPage(activeCollection.id, { currentPage: 1, pageSize: activeCollection.assets.pagination.pageSize })
      );
  }

  public removeAssetFrom(activeCollection: Collection, asset: Asset): Observable<CollectionItems> {
    const pagination: Pagination = activeCollection.assets.pagination;

    // If we come from somewhere that doesn't know about collection UUIDs (like search results), then we
    // (somewhat questionably) just find any asset in the collection with this asset's same assetID and remove it.
    if (!asset.uuid) asset = activeCollection.assets.items.find(otherAsset => otherAsset.assetId === asset.assetId);

    return this.apiService.post(
      Api.Identities, `collection/focused/removeAssets`, { body: { list: [asset.uuid] }, loadingIndicator: true }
    ).flatMap(() =>
      this.loadPage(activeCollection.id, { currentPage: pagination.currentPage, pageSize: pagination.pageSize })
      );
  }

  public updateAssetMarkers(
    activeCollection: Collection, asset: Asset, updatedMarkers: SubclipMarkers
  ): Observable<CollectionItems> {
    const updater: CollectionItemMarkersUpdater = {
      uuid: asset.uuid,
      assetId: asset.assetId,
      timeStart: String(this.timeStartFrom(updatedMarkers)),
      timeEnd: String(this.timeEndFrom(updatedMarkers))
    };
    const pagination: Pagination = activeCollection.assets.pagination;

    return this.apiService.put(Api.Identities, `collection/focused/updateAsset`, { body: updater, loadingIndicator: true })
      .flatMap(response =>
        this.loadPage(activeCollection.id, { currentPage: pagination.currentPage, pageSize: pagination.pageSize })
      );
  }

  public timeStartFrom(markers: SubclipMarkers): number {
    return markers && markers.in ? this.toMilliseconds(markers.in) : -1;
  }

  public timeEndFrom(markers: SubclipMarkers): number {
    return markers && markers.out ? this.toMilliseconds(markers.out) : -2;
  }

  public addCommentTo(collection: Collection, comment: Comment): Observable<Comments> {
    return this.commentService.addCommentTo('collection', collection.id, comment)
      .flatMap(() => this.getCommentsFor(collection));
  }

  public editComment(collection: Collection, comment: Comment): Observable<Comments> {
    return this.commentService.editComment(comment)
      .flatMap(() => this.getCommentsFor(collection));
  }

  public removeComment(collection: Collection, commentId: number): Observable<Comments> {
    return this.commentService.removeComment(commentId)
      .flatMap(() => this.getCommentsFor(collection));
  }

  private combineCollectionWithAuxiliaryData(
    collection: Observable<Collection>,
    parameters: CollectionPaginationParameters): Observable<any> {
    return collection
      .flatMap((summaryResponse: Collection) => this.combineAssetsWith(summaryResponse, parameters))
      .flatMap((fullCollection: Collection) => this.combineCommentsWith(fullCollection));
  }

  private combineAssetsWith(collectionSummary: Collection, parameters: CollectionPaginationParameters): Observable<Collection> {
    return this.loadPage(collectionSummary.id, parameters)
      .map((assets: CollectionItems) => ({ ...collectionSummary, assets: assets }));
  }

  private combineCommentsWith(collection: Collection): Observable<Collection> {
    return this.getCommentsFor(collection).map((comments: Comments) => ({ ...collection, comments: comments }));
  }

  private getCommentsFor(collection: Collection): Observable<Comments> {
    return this.commentService.getCommentsFor('collection', collection.id);
  }

  private convertToApiParameters(parameters: CollectionPaginationParameters) {
    return {
      i: String(parameters.currentPage - 1), // Convert UI one-based page to API zero-based page.
      n: String(parameters.pageSize)
    };
  }

  private convertToCollectionItems(response: CollectionItemsResponse): CollectionItems {
    const convertedItems: Asset[] =
      (response.items || []).map(item => ({ ...item, timeStart: parseInt(item.timeStart), timeEnd: parseInt(item.timeEnd) }));

    return {
      items: convertedItems,
      pagination: {
        totalCount: response.totalCount || 0,
        currentPage: (response.currentPage || 0) + 1, // Convert API zero-based page to UI one-based page.
        pageSize: response.pageSize || 0,
        hasNextPage: response.hasNextPage || false,
        hasPreviousPage: response.hasPreviousPage || false,
        numberOfPages: response.numberOfPages || 0
      }
    };
  }

  private toMilliseconds(frame: Frame): number {
    return frame.asSeconds(3) * 1000;
  }
}
