import {
  beforeEachProvidersArray,
  inject,
  TestBed
} from '../../../imports/test.imports';

import { WzFormComponent } from './wz.form.component';

export function main() {
  describe('Form Component', () => {

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        WzFormComponent
      ]
    }));

    it('Should create an angular form object on ngOnInit with the correct register keys.',
      inject([WzFormComponent], (form: WzFormComponent) => {
        form.items = items();
        form.ngOnInit();
        expect(Object.keys(form.form.value)).toEqual(['firstName', 'lastName', 'emailAddress', 'password']);
      }));

    it('Should return an array of items when passord a comma delimited string',
      inject([WzFormComponent], (form: WzFormComponent) => {
        let cities = 'London,New York,San Francisco,Denver,Paris,Rome,Sydney';
        expect(form.parseOptions(cities)).toEqual(['London', 'New York', 'San Francisco', 'Denver', 'Paris', 'Rome', 'Sydney']);
      })
    );

    it('Should cause a console error if the form is invalid',
      inject([WzFormComponent], (form: WzFormComponent) => {
        form.items = items();
        form.ngOnInit();
        spyOn(console, 'log');
        form.onSubmit();
        expect(console.log).toHaveBeenCalled();
      })
    );

    // it('Should pass as a valid form object and send to parent object using the event emitter',
    //   inject([TestComponentBuilder], (tcb: any) => {
    //     tcb.createAsync(WzFormComponent).then((fixture: any) => {
    //       let instance = fixture.debugElement.componentInstance;
    //       instance.items = validItems();
    //       instance.ngOnInit();
    //       instance.formSubmit.subscribe((x: any) => {
    //         expect(x).toEqual({ firstName: 'test', lastName: 'test', emailAddress: 'email@email.com', password: 'Test1233' });
    //       });
    //       expect(instance.form.valid).toBeTruthy();
    //       instance.onSubmit(instance.form);
    //     });
    //   })
    // );

    it('Should show "indicates required field" when at least 1 form control is required',
      inject([WzFormComponent], (form: WzFormComponent) => {
        spyOn(form, 'isRequiredField').and.callThrough();
        form.items = items();
        expect(form.hasRequiredFields(form.items)).toEqual(true);
      }));
  });

  function items() {
    return [{ 'name': 'firstName', 'label': 'First Name', 'type': 'text', 'value': '', 'validation': 'REQUIRED' }, { 'name': 'lastName', 'label': 'Last Name', 'type': 'text', 'value': 'null', 'validation': 'REQUIRED' }, { 'name': 'emailAddress', 'label': 'Email', 'type': 'email', 'value': 'null', 'validation': 'EMAIL' }, { 'name': 'password', 'label': 'Password', 'type': 'password', 'value': 'null', 'validation': 'PASSWORD' }];
  }

  // function validItems() {
  //   return [{ 'name': 'firstName', 'label': 'First Name', 'type': 'text', 'value': 'test', 'validation': 'REQUIRED' }, { 'name': 'lastName', 'label': 'Last Name', 'type': 'text', 'value': 'test', 'validation': 'REQUIRED' }, { 'name': 'emailAddress', 'label': 'Email', 'type': 'email', 'value': 'email@email.com', 'validation': 'EMAIL' }, { 'name': 'password', 'label': 'Password', 'type': 'password', 'value': 'Test1233', 'validation': 'PASSWORD' }];
  // }
}
