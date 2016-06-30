import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
import { WzFormComponent } from '../../shared/components/wz-form/wz.form.component';

@Component({
  moduleId: module.id,
  selector: 'admin-edit',
  templateUrl: 'edit.html',
  directives: [WzFormComponent],
  pipes: [TranslatePipe]
})

export class EditComponent implements OnInit {
  @Input() resource: any;
  @Input() formItems: any;
  @Input() resourceType: string;
  @Output() updatedResource = new EventEmitter();
  @Output() removeEditComponent = new EventEmitter();

  ngOnInit(): void {
    this.formItems.forEach((item: any) => {
      item.value = this.resource[item.name];
    });
  }

  public onSubmit(formData: any): void {
    console.log(formData);
    Object.assign(this.resource, formData);
  }

  public destroyComponent(): void {
   console.log('destroy');
  }
}
