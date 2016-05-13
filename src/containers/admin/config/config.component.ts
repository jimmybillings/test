import {Component} from 'angular2/core';
import {UiConfig} from '../../../common/config/ui.config';
import {ValuesPipe} from '../../../common/pipes/values.pipe';
import {FormBuilder, Validators, ControlGroup, FORM_DIRECTIVES, NgFor, NgIf, Control} from 'angular2/common';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {ConfigService} from './config.service';
@Component({
  selector: 'admin-config',
  templateUrl: 'containers/admin/config/config.html',
  pipes: [ValuesPipe],
  directives: [FORM_DIRECTIVES, NgFor, NgIf, MATERIAL_DIRECTIVES],
  providers: [ConfigService]
})

export class Config {

  public config: any;
  private configForm: ControlGroup;

  constructor(public uiConfig: UiConfig, public fb: FormBuilder, public configService: ConfigService) {}
  
  ngOnInit(): void {    
    this.uiConfig.get().subscribe(config => this.config = config);
    this.setForm();
  }
  
  public setForm(): void {
    this.configForm = this.fb.group({config: [JSON.stringify(this.config, undefined, 4), Validators.required]});
  }
  
  public onSubmit(form): void {
    this.configService.update(form.config)
      .subscribe((res) => {
        this.uiConfig.set(res.json());
        (<Control>this.configForm.controls['config']).updateValue(JSON.stringify(res.json(), undefined, 4));
      });
  }
}
