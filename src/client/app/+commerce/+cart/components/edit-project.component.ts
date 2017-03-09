import { Component, Input, ChangeDetectionStrategy } from '@angular/core';


@Component({
	moduleId: module.id,
	selector: 'edit-project-component',
	template: `<div class="wz-dialog">
			<button md-icon-button md-dialog-close title="Close" type="button" class="close">
				<md-icon>close</md-icon>
			</button>
			<h1 md-dialog-title>
				{{ 'CART.PROJECTS.FORM.TITLE' | translate }}
			</h1>
			<md-dialog-content>
				<wz-form *ngIf="!readOnly" [items]="items" submitLabel="{{ 'CART.PROJECTS.FORM.SUBMIT_LABEL' | translate }}"
					(formSubmit)="dialog.close($event)">
				</wz-form>
			</md-dialog-content>
		</div>`,
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditProjectComponent {
	@Input() dialog: any;
	@Input() items: any;

}
