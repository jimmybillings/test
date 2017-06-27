import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'license-agreement-component',
  templateUrl: 'license-agreement.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LicenseAgreementComponent implements OnInit {
  ngOnInit() {
    console.log('Go get the license agreement data');
  }
}
