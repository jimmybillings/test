import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
import { WzFormComponent } from '../../shared/components/wz-form/wz.form.component';

@Component({
  moduleId: module.id,
  selector: 'admin-new',
  templateUrl: 'new.html',
  directives: [WzFormComponent],
  pipes: [TranslatePipe]
})

export class NewComponent {
  @Input() formItems: any;
  @Input() resourceType: string;
  @Output() updatedResource = new EventEmitter();
  @Output() removeEditComponent = new EventEmitter();

  public onSubmit(formData: any): void {
    console.log(formData);
  }

  public destroyComponent(): void {
   console.log('destroy');
  }
}

