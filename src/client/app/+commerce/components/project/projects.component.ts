import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Project, QuoteType, FeeLineItem, FeeConfig, FeeConfigItem } from '../../../shared/interfaces/commerce.interface';
import { Capabilities } from '../../../shared/services/capabilities.service';
import { WzDialogService } from '../../../shared/modules/wz-dialog/services/wz.dialog.service';
import { FormFields } from '../../../shared/interfaces/forms.interface';
import { QuoteEditService } from '../../../shared/services/quote-edit.service';

@Component({
  moduleId: module.id,
  selector: 'projects-component',
  templateUrl: 'projects.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent {
  @Input() readOnly: boolean = false;
  @Input() config: any;
  @Input() projects: Array<Project>;
  @Input() userCan: Capabilities;
  @Input() includeFees: boolean = false;
  @Input() quoteType: QuoteType;
  @Output() projectsNotify: EventEmitter<Object> = new EventEmitter<Object>();
  private selectedProject: Project;

  constructor(private dialogService: WzDialogService, private quoteEditService: QuoteEditService) { }

  public projectsOtherThan(currentProject: Project) {
    return this.projects.filter(project => project.id !== currentProject.id);
  }

  public lineItemCountFor(project: any): number {
    return (project.lineItems || []).length;
  }

  public addProject(): void {
    this.projectsNotify.emit({ type: 'ADD_PROJECT' });
  }

  public onRemove(project: Project): void {
    this.projectsNotify.emit({ type: 'REMOVE_PROJECT', payload: project });
  }

  public onEdit(project: Project): void {
    this.selectProject(project);
    this.projectsNotify.emit({
      type: 'UPDATE_PROJECT',
      payload: Object.assign({ project: project, items: this.config.form.items })
    });
  }

  public addBulkOrderId() {
    this.projectsNotify.emit({ type: 'ADD_BULK_ORDER_ID' });
  }

  public editDiscount() {
    this.projectsNotify.emit({ type: 'EDIT_DISCOUNT' });
  }

  public onClickAddFeeButtonFor(project: Project): void {
    this.quoteEditService.feeConfig.subscribe(feeConfig => {
      this.dialogService.openFormDialog(
        this.initializeQuoteFeeFieldsFrom(feeConfig),
        { title: 'QUOTE.ADD_FEE.HEADER', submitLabel: 'QUOTE.ADD_FEE.SUBMIT' },
        (result: FeeLineItem) => this.addFeeTo(project, result)
      );
    });
  }

  public delegate(message: any): void {
    this.projectsNotify.emit(message);
  }

  public selectProject(project: Project) {
    this.selectedProject = project;
    this.config.form.items = this.config.form.items.map((item: any) => {
      item.value = this.selectedProject[item.name];
      return item;
    });
  }

  private initializeQuoteFeeFieldsFrom(feeConfig: FeeConfig): FormFields[] {
    // This is sort of bogus, because the fields are completely dependent on UI config to be "correct".
    // (Though it's no more bogus than expecting "this.config.addQuoteFee.items" to be present...)
    // We'll at least check to make sure the fields are found before we try to manipulate them.

    const fields: FormFields[] = JSON.parse(JSON.stringify(this.config.addQuoteFee.items));
    const feeTypeField: FormFields = fields.find(field => field.name === 'feeType');

    if (feeTypeField) {
      const options: string[] = feeConfig.items.map(configItem => configItem.name);
      feeTypeField.options = options.join(',');
      feeTypeField.value = options[0];

      const amountField: FormFields = fields.find(field => field.name === 'amount');

      if (amountField) {
        feeTypeField.slaveFieldName = 'amount';
        feeTypeField.slaveFieldValues = feeConfig.items.map(this.formatFeeConfigItemAmount);
        amountField.value = feeTypeField.slaveFieldValues[0];
      }
    }

    return fields;
  }

  private formatFeeConfigItemAmount = (configItem: FeeConfigItem) => {
    // Update this if we ever use anything but US dollars.
    return `${(configItem.amount || 0) * 100}` // 100 => '10000', .50 => '50', 0 => '0', undefined => '0'
      .replace(/(\d\d)$/, '.$1')               // 10000 => '100.00', '50' => '.50', '0' => '0'
      .replace(/^\./, '0.')                    // '100.00' => '100.00', '.50' => '0.50, '0' => '0'
      .replace(/^0$/, '0.00');                 // '100.00' => '100.00', '0.50' => '0.50', '0' => '0.00'
  }

  private addFeeTo(project: Project, fee: FeeLineItem) {
    this.projectsNotify.emit({
      type: 'ADD_QUOTE_FEE',
      payload: { project: project, fee: fee }
    });
  }
}
