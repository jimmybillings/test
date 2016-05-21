import {Component, OnInit} from '@angular/core';
import {UiConfig} from '../../shared/services/ui.config';
import {ValuesPipe} from '../../shared/pipes/values.pipe';
import {FormBuilder, Validators, ControlGroup, FORM_DIRECTIVES, Control} from '@angular/common';
import {ConfigService} from './config.service';

@Component({
  selector: 'admin-config',
  templateUrl: 'app/+admin/+config/config.html',
  pipes: [ValuesPipe],
  directives: [FORM_DIRECTIVES],
  providers: [ConfigService]
})

export class ConfigComponent implements OnInit {

  public config: any;
  private configForm: ControlGroup;

  constructor(public uiConfig: UiConfig, public fb: FormBuilder, public configService: ConfigService) { }

  ngOnInit(): void {
    this.uiConfig.get().subscribe(config => this.config = config);
    this.setForm();
  }

  public setForm(): void {
    this.configForm = this.fb.group({ config: [JSON.stringify(this.config, undefined, 4), Validators.required] });
  }

  public onSubmit(form: any): void {
    this.configService.update(form.config)
      .subscribe((res) => {
        this.uiConfig.set(res.json());
        (<Control>this.configForm.controls['config']).updateValue(JSON.stringify(res.json(), undefined, 4));
      });
  }
}
