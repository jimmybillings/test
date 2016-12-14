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

	private get mockOptions(): any {
		return {
			'list': [
				{
					'lastUpdated': '2016-11-10T19:46:26Z',
					'createdOn': '2016-11-10T19:46:26Z',
					'lastModifiedBy': {
						'siteName': 'core',
						'userIdentifier': 'admin@wazeedigital.com-core',
						'fromHost': '50.155.246.247'
					},
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
				},
				{
					'lastUpdated': '2016-11-10T18:22:47Z',
					'createdOn': '2016-11-10T18:22:47Z',
					'lastModifiedBy': {
						'siteName': 'core',
						'userIdentifier': 'admin@wazeedigital.com-core',
						'fromHost': '38.140.32.90'
					},
					'id': 4,
					'siteName': 'core',
					'name': 'Distribution',
					'displayName': 'Distribution',
					'attributeList': [
						{
							'name': 'Broadcast and Cable TV and Internet',
							'value': 'Broadcast and Cable TV and Internet',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'All Media',
							'value': 'All Media',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Broadcast and Cable TV',
							'value': 'Broadcast and Cable TV',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Personal Archive',
							'value': 'Personal Archive',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Film Festival',
							'value': 'Film Festival',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Internet and Mobile',
							'value': 'Internet and Mobile',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Internal Presentation',
							'value': 'Internal Presentation',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Digital Signage',
							'value': 'Digital Signage',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Single Project Use',
							'value': 'Single Project Use',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Institutional Installation',
							'value': 'Institutional Installation',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Retail Display',
							'value': 'Retail Display',
							'amount': 0,
							'multiplier': false
						}
					],
					'priceModel': 'RightsManaged'
				},
				{
					'lastUpdated': '2016-09-07T23:20:49Z',
					'createdOn': '2016-09-07T23:20:49Z',
					'id': 6,
					'siteName': 'core',
					'name': 'Use',
					'displayName': 'Use',
					'attributeList': [
						{
							'name': '\'Feature Film/Title Sequence, End Credits\'',
							'value': '\'Feature Film/Title Sequence, End Credits\'',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Corporate Communications',
							'value': 'Corporate Communications',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Music Video',
							'value': 'Music Video',
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
							'name': 'Concert/Live Entertainment Show',
							'value': 'Concert/Live Entertainment Show',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Promotion',
							'value': 'Promotion',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Feature',
							'value': 'Feature',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Concert/Entertainment Show',
							'value': 'Concert/Entertainment Show',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Episodic/Title Sequence',
							'value': 'Episodic/Title Sequence',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Educational Print Media',
							'value': 'Educational Print Media',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Print',
							'value': 'Print',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Public Service',
							'value': 'Public Service',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Multiple Location Exhibit',
							'value': 'Multiple Location Exhibit',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Single Location Exhibit',
							'value': 'Single Location Exhibit',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Feature Film/Trailer',
							'value': 'Feature Film/Trailer',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': '(Playback) Feature Film',
							'value': '(Playback) Feature Film',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Public Broadcasting Program',
							'value': 'Public Broadcasting Program',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Independent Film',
							'value': 'Independent Film',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Event Highlight',
							'value': 'Event Highlight',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'All Media',
							'value': 'All Media',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Personal',
							'value': 'Personal',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Publications',
							'value': 'Publications',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Broadcast Re-Air',
							'value': 'Broadcast Re-Air',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Pilot Only',
							'value': 'Pilot Only',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Broadcast News',
							'value': 'Broadcast News',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Educational Programming',
							'value': 'Educational Programming',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Film (Straight to DVD)',
							'value': 'Film (Straight to DVD)',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'YouTube Claiming',
							'value': 'YouTube Claiming',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Episodic Program',
							'value': 'Episodic Program',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Film Festival',
							'value': 'Film Festival',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': '(Playback) Episodic Program',
							'value': '(Playback) Episodic Program',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': '(Playback) Independent Film',
							'value': '(Playback) Independent Film',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Political Advertising',
							'value': 'Political Advertising',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Gaming',
							'value': 'Gaming',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Internal Pitch/Review',
							'value': 'Internal Pitch/Review',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': '\'Promotional, Commercial, Advertisement\'',
							'value': '\'Promotional, Commercial, Advertisement\'',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Feature Film',
							'value': 'Feature Film',
							'amount': 0,
							'multiplier': false
						}
					],
					'priceModel': 'RightsManaged'
				},
					{
						'lastUpdated': '2016-09-07T23:20:49Z',
						'createdOn': '2016-09-07T23:20:49Z',
						'id': 1,
						'siteName': 'core',
						'name': 'Territory',
						'displayName': 'Territory',
						'attributeList': [
							{
								'name': 'National',
								'value': 'National',
								'amount': 0,
								'multiplier': false
							},
							{
								'name': 'Regional/Local',
								'value': 'Regional/Local',
								'amount': 0,
								'multiplier': false
							},
							{
								'name': 'Local',
								'value': 'Local',
								'amount': 0,
								'multiplier': false
							},
							{
								'name': 'Worldwide',
								'value': 'Worldwide',
								'amount': 0,
								'multiplier': false
							},
							{
								'name': 'Regional',
								'value': 'Regional',
								'amount': 0,
								'multiplier': false
							}
						],
						'priceModel': 'RightsManaged'
					},
				{
					'lastUpdated': '2016-09-07T23:20:49Z',
					'createdOn': '2016-09-07T23:20:49Z',
					'id': 5,
					'siteName': 'core',
					'name': 'Term',
					'displayName': 'Term',
					'attributeList': [
						{
							'name': 'Up To 3 Months',
							'value': 'Up To 3 Months',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Up To 7 Days',
							'value': 'Up To 7 Days',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Up To 10 Years',
							'value': 'Up To 10 Years',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Up To 6 Months',
							'value': 'Up To 6 Months',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'One Time',
							'value': 'One Time',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Up To 2 Years',
							'value': 'Up To 2 Years',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Up To 1 Year',
							'value': 'Up To 1 Year',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Perpetuity',
							'value': 'Perpetuity',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Up To 5 Years',
							'value': 'Up To 5 Years',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Up To 30 Days',
							'value': 'Up To 30 Days',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Up To 14 Days',
							'value': 'Up To 14 Days',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Up To 1 Day',
							'value': 'Up To 1 Day',
							'amount': 0,
							'multiplier': false
						}
					],
					'priceModel': 'RightsManaged'
				},
				{
					'lastUpdated': '2016-09-07T23:20:49Z',
					'createdOn': '2016-09-07T23:20:49Z',
					'id': 3,
					'siteName': 'core',
					'name': 'Price Format',
					'displayName': 'Price Format',
					'attributeList': [
						{
							'name': 'SD',
							'value': 'SD',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'DV',
							'value': 'DV',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Low',
							'value': 'Low',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Medium',
							'value': 'Medium',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'HD',
							'value': 'HD',
							'amount': 0,
							'multiplier': false
						},
						{
							'name': 'Audio',
							'value': 'Audio',
							'amount': 0,
							'multiplier': false
						}
					],
					'priceModel': 'RightsManaged'
				}
			]
		};
	}
}
