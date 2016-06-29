import { Component, OnInit, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { UiConfig } from '../../shared/services/ui.config';
import { FormBuilder, Validators, ControlGroup, Control } from '@angular/common';
import { ConfigService } from '../services/config.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../shared/components/toast/toast.service';
import { IuiConfig } from '../../shared/interfaces/config.interface';
import { Subscription } from 'rxjs/Rx';
@Component({
  moduleId: module.id,
  selector: 'secret-config',
  templateUrl: 'secret-config.html',
  providers: [ConfigService, ToastService],
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
  @ViewChild('target', { read: ViewContainerRef }) target: any;
  private config: IuiConfig;
  private site: string;
  private configForm: ControlGroup;
  private sub: Subscription;
  constructor(public uiConfig: UiConfig,
    public toastService: ToastService,
    public fb: FormBuilder,
    public configService: ConfigService,
    public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.site = params['site'];
      this.configService.getUiConfig(this.site).subscribe((data: any) => {
        this.config = data;
        this.setForm();
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public setForm(): void {
    this.configForm = this.fb.group({ config: [JSON.stringify(this.config, undefined, 4), Validators.required] });
  }

  public onSubmit(form: any): void {
    this.configService.update(JSON.parse(form.config))
      .subscribe((res) => {
        this.toastService.createToast('ADMIN.CONFIG.UPDATE_SUCCESS_TOAST', 'success', 5000, this.target);
        this.uiConfig.set(res.json());
        (<Control>this.configForm.controls['config']).updateValue(JSON.stringify(res.json(), undefined, 4));
      }, (err) => {
        this.toastService.createToast(err._body, 'warn', 5000, this.target);
      });
  }
}