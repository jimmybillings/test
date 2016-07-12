import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WzFormComponent } from '../../../shared/components/wz-form/wz.form.component';

@Component({
  moduleId: module.id,
  selector: 'admin-new',
  templateUrl: 'new.html',
  directives: [WzFormComponent]
})

export class NewComponent {
  @Input() formItems: any;
  @Input() resourceType: string;
  @Input() cmpRef: any;
  @Output() newResource = new EventEmitter();

  public onSubmit(formData: any): void {
    this.newResource.emit(formData);
    this.cmpRef.destroy();
  }

  public destroyComponent(): void {
   this.cmpRef.destroy();
  }
}

