
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'edit-line-item-component',
  template: `<div flex-gt-lg="100" flex-gt-md="100" flex-gt-sm="100" flex="100">
		<md-card class="wz-form-card md-elevation-z20">
			<button md-dialog-close md-icon-button title="close dialog" type="button" class="close"><md-icon>close</md-icon></button>
			<md-card-title>
				{{ 'ADMIN.' + currentComponent.toUpperCase() + '.' + translationStrings.title | translate }}
			</md-card-title>
			<md-card-content>
				<wz-form [items]="items" [submitLabel]="translationStrings.submitLabel" (formSubmit)="dialog.close($event)"></wz-form>
			</md-card-content>
		</md-card>
	</div>`,
  styles: [`md-card{padding: 0;
    box-shadow: none;}`],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditLineItemComponent {
  @Input() dialog: any;
  @Input() currentComponent: any;
  @Input() items: any;
  @Input() translationStrings: any;
}
