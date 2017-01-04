import { Component, OnInit, OnDestroy } from '@angular/core';
import { UiConfig } from '../../shared/services/ui.config';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ConfigService } from '../services/config.service';
import { ActivatedRoute } from '@angular/router';
import { UiSubComponentsA } from '../../shared/interfaces/admin.interface';
import { Subscription } from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'secret-config',
  templateUrl: 'secret-config.html',
  styles: [`.secret-config {
              display: block;
              padding-top:40px;
            }
            textarea {
              width:100%;
              border: 2px solid lightgrey;
              padding:20px;
              display: block;
              unicode-bidi: embed;
              white-space: pre;
            }`
          ]
})

export class SecretConfigComponent implements OnInit, OnDestroy {
  public configForm: FormGroup;
  private config: UiSubComponentsA;
  private site: string;
  private routeSubscription: Subscription;

  constructor(public uiConfig: UiConfig,
    public fb: FormBuilder,
    public configService: ConfigService,
    public route: ActivatedRoute) { }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.site = params['site'];
      this.configService.showUiConfig(this.site)
        .take(1).subscribe((data: UiSubComponentsA) => {
          this.config = data;
          this.setForm();
      });
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  public setForm(): void {
    this.configForm = this.fb.group({ config: [JSON.stringify(this.config, undefined, 4), Validators.required] });
  }

  public onSubmit(form: string): void {
    this.configService.updateUiConfig(JSON.parse(form))
      .take(1).subscribe((res) => {
        this.uiConfig.set(res.json());
        (<FormControl>this.configForm.controls['config']).setValue(JSON.stringify(res.json(), undefined, 4));
      }, (err) => {
        // do something here
      });
  }
}
