import { Component, Output, EventEmitter, Input, OnChanges, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Collection } from '../../shared/interfaces/collection.interface';
import { CurrentUser } from '../../shared/services/current-user.model';
import { UiConfig } from '../../shared/services/ui.config';
import { UiState } from '../../shared/services/ui.state';
import { Capabilities } from '../../shared/services/capabilities.service';
import { MdMenuTrigger } from '@angular/material';
import { TranscodeTarget } from '../../shared/interfaces/asset.interface';
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
	@ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;
	private assetsArr: Array<number> = [];

	ngOnChanges(changes: any): void {
		if (changes.asset) this.parseNewAsset(changes.asset);
		if (changes.collection) {
			this.assetsArr = changes.collection.currentValue.assets.items.map((x:any) => x.assetId);
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

	public addAssetToCart(assetId: any): void {
		this.addToCart.emit({ assetId: assetId, selectedTranscodeTarget: this.selectedTarget() });
	}

	public selectTarget(selectedTarget: TranscodeTarget) {
		this.asset.transcodeTargets = this.asset.transcodeTargets.map((target: TranscodeTarget) => {
			target.selected = (selectedTarget.name === target.name) ? true : false;
			return target;
		});
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

	private get formatMockOptions(): any {
		return this.mockOptions.attributeList.map((attr: any) => {
			attr.validChoices = this.mockOptions.validChildChoicesMap[attr.name].map((choice: string, index: number) => {
				return { name: choice, selected: false };
			});
			return attr;
		});
	}

	private get mockOptions(): any {
		return {
			'id': 2,
			'siteName': 'core',
			'name': 'Project Type',
			'displayName': 'Project Type',
			'attributeList': [
				{
				'name': 'Corporate or Government',
				'value': 'Corporate or Government',
				'amount': 0,
				'multiplier': false
				},
				{
				'name': 'Entertainment',
				'value': 'Entertainment',
				'amount': 0,
				'multiplier': false
				},
				{
				'name': 'Education',
				'value': 'Education',
				'amount': 0,
				'multiplier': false
				},
				{
				'name': 'Documentary or Editorial',
				'value': 'Documentary or Editorial',
				'amount': 0,
				'multiplier': false
				},
				{
				'name': 'Advertising',
				'value': 'Advertising',
				'amount': 0,
				'multiplier': false
				}
			],
			'priceModel': 'RightsManaged',
			'validChildChoicesMap': {
				'Corporate or Government': [
				'Digital Signage',
				'Institutional Installation',
				'Internal Presentation',
				'Internet and Mobile',
				'Personal Archive',
				'Single Project Use',
				'All Media'
				],
				'Entertainment': [
				'Broadcast and Cable TV',
				'Digital Signage',
				'Film Festival',
				'Internal Presentation',
				'Internet and Mobile',
				'Retail Display',
				'Single Project Use',
				'All Media'
				],
				'Education': [
				'Digital Signage',
				'Institutional Installation',
				'Internal Presentation',
				'Internet and Mobile',
				'Retail Display',
				'Single Project Use'
				],
				'Documentary or Editorial': [
				'Broadcast and Cable TV',
				'Film Festival',
				'Institutional Installation',
				'Internal Presentation',
				'Internet and Mobile',
				'Single Project Use',
				'All Media'
				],
				'Advertising': [
				'Broadcast and Cable TV',
				'Digital Signage',
				'Internal Presentation',
				'Internet and Mobile',
				'Retail Display',
				'Single Project Use',
				'All Media'
				]
			},
			'childId': 4
		};
	}
}
