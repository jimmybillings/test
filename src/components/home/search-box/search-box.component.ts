// import {Component, Output, EventEmitter} from 'angular2/core';
import {Component} from 'angular2/core';
import {FormBuilder, Validators, ControlGroup, FORM_DIRECTIVES} from 'angular2/common';
import {Router} from 'angular2/router';

@Component({
  selector: 'search-box',
  templateUrl: 'components/home/search-box/search-box.html',
  directives: [FORM_DIRECTIVES]
})

export class SearchBox {
  // @Output() runSearch: EventEmitter<any> = new EventEmitter();

  private searchForm: ControlGroup;

  constructor(
    public fb: FormBuilder,
    public router: Router) {
  }
  
  ngOnInit(): void {
    this.setForm();
  }
 
  public setForm(): void {
    this.searchForm = this.fb.group({
      query: ['', Validators.required]
    });
  }
  
  public onSubmit(query: string): void {
    this.router.navigate(['/Search', {q: query}]);
  }
}
