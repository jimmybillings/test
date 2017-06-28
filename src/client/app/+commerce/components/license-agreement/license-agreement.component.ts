import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'license-agreement-component',
  templateUrl: 'license-agreement.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LicenseAgreementComponent {
  @Input() licenses: any;
}
