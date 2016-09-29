import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '../services/translate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'translation-component',
  templateUrl: 'translation-component.html',
  styles: [`.translation {
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

export class TranslationComponent implements OnInit, OnDestroy {
  public sites: Array<string>;
  public langs: Array<string>;
  private strings: any;
  private site: string;
  private lang: string;
  private trStringForm: FormGroup;
  private routeSubscription: Subscription;

  constructor(
    public fb: FormBuilder,
    public trService: TranslateService,
    public route: ActivatedRoute,
    public router: Router) {
    this.sites = ['core', 'cnn', 'augusta', 'bbcws', 'usopen', 'commerce', 'usta-usopen', 'hbo-boxing', 'wpt'];
    this.langs = ['en', 'fr', 'de'];
  }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.site = params['site'];
      this.lang = params['lang'];
      this.trService.getTrStrings(this.site, this.lang)
        .take(1).subscribe((data: any) => {
          this.strings = data;
          this.setForm();
        });
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  public goToSite(site: string): void {
    this.router.navigate(['admin/translations/', site, this.lang]);
  }

  public goToLang(lang: string): void {
    this.router.navigate(['admin/translations/', this.site, lang]);
  }

  public setForm(): void {
    this.trStringForm = this.fb.group({ text: [JSON.stringify(this.strings, undefined, 4), Validators.required] });
  }

  public onSubmit(event: any): void {
    event.preventDefault();
    this.trService.put(this.trStringForm.value.text, this.site, this.lang)
      .take(1).subscribe(res => {
        res.take(1).subscribe((data: any) => {
          (<FormControl>this.trStringForm.controls['text']).setValue(data.json().text);
        });
      }, (err) => {
        // do something here
      });
  }
}
