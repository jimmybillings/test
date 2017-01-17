import { Component, Input, ChangeDetectionStrategy, OnInit, Output, EventEmitter } from '@angular/core';
import { CollectionLinkComponent } from '../../+collection/components/collection-link.component';
import { MdDialog, MdDialogRef } from '@angular/material';

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

  constructor(private dialog: MdDialog) { }

  ngOnInit() {
    this.uiConfig.get('global').take(1).subscribe((config: any) => {
      this.pageSize = config.config.pageSize.value;
    });
  }

  public getAssetsForLink(): void {
    let dialogRef: MdDialogRef<any> = this.dialog.open(CollectionLinkComponent);
    dialogRef.componentInstance.assets = this.collection.assets.items;
  }
}
