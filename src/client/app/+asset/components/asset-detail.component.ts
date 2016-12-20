import { Component, Output, EventEmitter, Input, OnChanges, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Collection } from '../../shared/interfaces/collection.interface';
import { CurrentUser } from '../../shared/services/current-user.model';
import { UiConfig } from '../../shared/services/ui.config';
import { UiState } from '../../shared/services/ui.state';
import { Capabilities } from '../../shared/services/capabilities.service';
import { MdMenuTrigger } from '@angular/material';
import { TranscodeTarget, SubclipMarkers } from '../../shared/interfaces/asset.interface';
import { SearchContext } from '../../shared/services/search-context.service';

@Component({
	moduleId: module.id,
	selector: 'asset-detail',
	templateUrl: 'asset-detail.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetDetailComponent implements OnChanges {
	@Input() public asset: any;
	@Input() public currentUser: CurrentUser;
	@Input() public userCan: Capabilities;
	@Input() public uiConfig: UiConfig;
	@Input() public collection: Collection;
	@Input() public searchContext: SearchContext;
	@Input() public uiState: UiState;
	@Output() onAddToCollection = new EventEmitter();
	@Output() onRemoveFromCollection = new EventEmitter();
	@Output() onDownloadComp = new EventEmitter();
	@Output() addToCart = new EventEmitter();
	@Output() getPriceAttributes = new EventEmitter();
	@Output() calculatePrice = new EventEmitter();
	@Output() calculatePriceError = new EventEmitter();
	@ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;
	public subclipMarkers: SubclipMarkers = {};
	private assetsArr: Array<number> = [];

	ngOnChanges(changes: any): void {
		if (changes.asset) this.parseNewAsset(changes.asset);
		if (changes.collection) {
			this.assetsArr = changes.collection.currentValue.assets.items.map((x: any) => x.assetId);
		}
	}

	public alreadyInCollection(assetId: any): boolean {
		assetId = parseInt(assetId);
		return this.assetsArr.indexOf(assetId) > -1;
	}

	public addToCollection(collection: Collection, asset: any): void {
		asset.assetId = asset.value;
		this.onAddToCollection.emit({ 'collection': collection, 'asset': asset });
	}

	public removeFromCollection(collection: Collection, asset: any): void {
		asset.assetId = asset.value;
		this.onRemoveFromCollection.emit({ 'collection': collection, 'asset': asset });
	}

	public downloadComp(assetId: any, compType: any): void {
		this.onDownloadComp.emit({ 'compType': compType, 'assetId': assetId });
	}

	public addAssetToCart(assetId: any, pricingAttributes?: any): void {
		this.addToCart.emit({ assetId: assetId, selectedTranscodeTarget: this.selectedTarget() });
	}

	public selectTarget(selectedTarget: TranscodeTarget) {
		this.asset.transcodeTargets = this.asset.transcodeTargets.map((target: TranscodeTarget) => {
			target.selected = (selectedTarget.name === target.name) ? true : false;
			return target;
		});
	}

	public onSubclipMarkersChanged(markers: SubclipMarkers) {
		console.log(`New subclip markers: ${markers.in} - ${markers.out}`);
	}

	public onSubclipMarkersCleared() {
		console.log('Subclip markers cleared.');
	}

	public onCalculatePrice(attributes: any): void {
		this.calculatePrice.emit({ attributes: attributes, assetId: this.asset.assetId });
	}

	public onCalculatePriceError(): void {
		this.calculatePriceError.emit();
	}

	public getPricingAttributes(): void {
		if (this.asset.pricing.length > 0) return;
		this.getPriceAttributes.emit(this.asset.primary[3].value);
	}

	private selectedTarget() {
		return this.asset.transcodeTargets.filter((target: TranscodeTarget) => target.selected)[0].name;
	}

	private parseNewAsset(asset: any) {
		if (Object.keys(asset.currentValue.detailTypeMap.common).length > 0) {
			let targets = this.prepareNewTargets(asset.currentValue.transcodeTargets);
			this.asset = Object.assign({}, this.asset, asset.currentValue.detailTypeMap, { transcodeTargets: targets });
			delete this.asset.detailTypeMap;
		}
	}

	private prepareNewTargets(targets: TranscodeTarget[]) {
		return targets.map((target: any, index: any) => {
			return (index === 0) ? { name: target, selected: true } : { name: target, selected: false };
		});
	}
}
