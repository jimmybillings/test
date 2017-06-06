import {
  Component, Input, Output, ViewChild,
  EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { FormFields } from '../../shared/interfaces/forms.interface';
import { WzFormComponent } from '../../shared/modules/wz-form/wz.form.component';
import { Capabilities } from '../../shared/services/capabilities.service';
import { SubclipMarkers } from '../../shared/interfaces/asset.interface';

@Component({
  moduleId: module.id,
  selector: 'asset-save-subclip',
  templateUrl: 'asset-save-subclip.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetSaveSubclipComponent {
  @Input() config: any;
  @Input() public userCan: Capabilities;
  @Input() collectionName: string;
  @Input() subclipMarkers: SubclipMarkers;
  @Output() onAddSubclipToCollection: EventEmitter<null> = new EventEmitter<null>();
  @Output() onAddSubclipToCart: EventEmitter<null> = new EventEmitter<null>();
  @Output() ontoggleSubclipPanel: EventEmitter<null> = new EventEmitter<null>();

  public showAssetSaveSubclip: boolean;
  public serverErrors: any;
  public formItems: Array<any> = [];

  @ViewChild(WzFormComponent) private wzForm: WzFormComponent;

  constructor(
    private changeDetector: ChangeDetectorRef) {
  }

  public addSubclipToCollection(comment: any): void {
    this.onAddSubclipToCollection.emit();
    this.clearAndClose();
  }

  public addSubclipToCart(): void {
    this.onAddSubclipToCart.emit();
    this.clearAndClose();
  }

  public clearAndClose(): void {
    this.formItems = this.clearForm();
    this.wzForm.resetForm();
    this.changeDetector.markForCheck();
    this.ontoggleSubclipPanel.emit();
  }

  private clearForm() {
    return this.formItems
      .map((field: FormFields) => {
        field.value = '';
        return field;
      });
  }

  private error(error: any) {
    this.serverErrors = error.json();
    this.changeDetector.markForCheck();
  }
}
