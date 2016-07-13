import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { WzFormComponent } from '../../shared/components/wz-form/wz.form.component';

@Component({
  moduleId: module.id,
  selector: 'admin-edit',
  templateUrl: 'edit.html',
  directives: [WzFormComponent]
})

export class EditComponent implements OnInit {
  @Input() resource: any;
  @Input() formItems: any;
  @Input() cmpRef: any;
  @Output() updatedResource = new EventEmitter();

  ngOnInit(): void {
    this.formItems.forEach((item: any) => {
      item.value = this.resource[item.name];
    });
  }

  public onSubmit(formData: any): void {
    Object.assign(this.resource, formData);
    this.updatedResource.emit(this.resource);
    this.cmpRef.destroy();
  }

  public destroyComponent(): void {
   this.cmpRef.destroy();
  }
}
