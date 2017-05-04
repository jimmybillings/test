import { Component, Input, ChangeDetectionStrategy, OnInit, Output, EventEmitter } from '@angular/core';
import { CollectionLinkComponent } from '../../+collection/components/collection-link.component';
import { CollectionFormComponent } from './components/collection-form.component';
import { WzDialogService } from '../../shared/modules/wz-dialog/services/wz.dialog.service';
import { WzEvent } from '../../shared/interfaces/common.interface';

@Component({
  moduleId: module.id,
  selector: 'collection-tray',
  templateUrl: 'collection-tray.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CollectionTrayComponent implements OnInit {
  @Input() uiState: any;
  @Input() uiConfig: any;
  @Input() collection: any;
  @Output() onOpenSnackbar = new EventEmitter();
  public pageSize: string;

  constructor(private dialogService: WzDialogService) { }

  ngOnInit() {
    this.uiConfig.get('global').take(1).subscribe((config: any) => {
      this.pageSize = config.config.pageSize.value;
    });
  }

  public getAssetsForLink(): void {
    this.dialogService.openComponentInDialog({
      componentType: CollectionLinkComponent,
      inputOptions: { assets: this.collection.assets.items }
    });
  }

  public createCollection() {
    this.uiConfig.get('collection').take(1).subscribe((config: any) => {
      this.dialogService.openComponentInDialog({
        componentType: CollectionFormComponent,
        inputOptions: {
          fields: config.config,
        },
        outputOptions: [{
          event: 'collectionSaved',
          callback: (event: WzEvent) => true,
          closeOnEvent: true
        }]
      });
    });
  }

  public assetParams(asset: any) {
    return Object.assign({},
      asset.uuid ? { uuid: asset.uuid } : null,
      asset.timeStart ? { timeStart: asset.timeStart } : null,
      asset.timeEnd ? { timeEnd: asset.timeEnd } : null
    );
  }
}
