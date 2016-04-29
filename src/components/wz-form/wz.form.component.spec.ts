import {
TestComponentBuilder,
describe,
expect,
inject,
it,
beforeEachProviders
} from 'angular2/testing';

import {WzForm} from './wz.form.component';
import {Form} from './wz.form.model';

export function main() {
  describe('Form Component', () => {
    beforeEachProviders(() => [
      WzForm,
      Form
    ]);

    it('Should create instance of WzForm',
      inject([TestComponentBuilder], (tcb) => {
        tcb.createAsync(WzForm).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof WzForm).toBeTruthy();
        });
      })
    );
    
    it('Should create an angular form object on ngOnInit with the correct register keys.', 
      inject([WzForm], (form) => {
        form.items = items();
        form.ngOnInit();
        expect(Object.keys(form.form.value)).toEqual(['firstName','lastName','emailAddress','password']);
    }));
    
    it('Should return an array of items when passord a comma delimited string', 
      inject([WzForm], (form) => {
        let cities = 'London,New York,San Francisco,Denver,Paris,Rome,Sydney';
        expect(form.parseOptions(cities)).toEqual(['London', 'New York', 'San Francisco', 'Denver', 'Paris', 'Rome', 'Sydney']);
      })
    );
    
    it('Should cause a console error if the form is invalid', 
      inject([WzForm], (form) => {
        form.items = items();
        form.ngOnInit();
        spyOn(console, 'log');
        form.onSubmit(form.form);
        expect(console.log).toHaveBeenCalled();
      })
    );
    
    it('Should pass as a valid form object and send to parent object using the event emitter', 
      inject([TestComponentBuilder], (tcb) => {
        tcb.createAsync(WzForm).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          instance.items = validItems();
          instance.ngOnInit();
          instance.formSubmit.subscribe(x => { 
            expect(x.value).toEqual({ firstName: 'test', lastName: 'test', emailAddress: 'email@email.com', password: 'Test1233' });
          });
          instance.onSubmit(instance.form);
          expect(instance.form.valid).toBeTruthy();
        });
      })
    );
    
    
  });
  
  function items() {
    return [{'name':'firstName','label':'First Name','type':'text','value':'','validation':'REQUIRED'},{'name':'lastName','label':'Last Name','type':'text','value':'null','validation':'REQUIRED'},{'name':'emailAddress','label':'Email','type':'email','value':'null','validation':'EMAIL'},{'name':'password','label':'Password','type':'password','value':'null','validation':'PASSWORD'}];
  }
  
  function validItems() {
    return [{'name':'firstName','label':'First Name','type':'text','value':'test','validation':'REQUIRED'},{'name':'lastName','label':'Last Name','type':'text','value':'test','validation':'REQUIRED'},{'name':'emailAddress','label':'Email','type':'email','value':'email@email.com','validation':'EMAIL'},{'name':'password','label':'Password','type':'password','value':'Test1233','validation':'PASSWORD'}];
  }
}
