import { Component, Input, ChangeDetectionStrategy } from '@angular/core';


@Component({
  moduleId: module.id,
  selector: 'edit-project-component',
  template: `<div flex-gt-lg="100" flex-gt-md="100" flex-gt-sm="100" flex="100">
		<md-card class="wz-form-card md-elevation-z20">
			<button md-dialog-close md-icon-button title="close dialog" type="button" class="close"><md-icon>close</md-icon></button>
			<md-card-title>
				{{ 'CART.PROJECTS.FORM.TITLE' | translate }}
			</md-card-title>
			<md-card-content>
				<wz-form *ngIf="!readOnly" [items]="items" submitLabel="{{ 'CART.PROJECTS.FORM.SUBMIT_LABEL' | translate }}"
					(formSubmit)="dialog.close($event)"></wz-form>
			</md-card-content>
		</md-card>
	</div>`,
  styles: [
    'md-card{ box-shadow: none; padding: 0;}'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditProjectComponent {
  @Input() dialog: any;
  @Input() items: any;

}
