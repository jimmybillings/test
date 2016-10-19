import {
  inject,
  TestBed,
  Observable
} from '../../imports/test.imports';

import { RegisterComponent } from './register.component';
import { User } from '../services/user.data.service';
import { UiConfig } from '../../shared/services/ui.config';
import { DocumentService } from '../services/document.service';

const user: any = { emailAddress: 'jamesbonline@yahoo.com', firstName: 'james', lastName: 'billigns', password: '3978f324e14ac256b2994b754586e05f' };
export function main() {
  describe('Register Component', () => {

    const MockUiConfig = { get: () => { return Observable.of({ config: { someConfig: 'test' } }); } };
    const MockUser = { create: () => { return Observable.of(user); } };
    const MockDocumentService = { downloadActiveDocument: () => { return Observable.of('this is the document'); } };

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        { provide: User, useValue: MockUser },
        { provide: UiConfig, useValue: MockUiConfig },
        { provide: DocumentService, useValue: MockDocumentService },
        RegisterComponent
      ]
    }));

    it('Should get component config and assign to new instance variable',
      inject([RegisterComponent], (component: RegisterComponent) => {
        component.ngOnInit();
        expect(component.config).toEqual({ someConfig: 'test' });
      }));

    it('Should register new user and console log the response for now.',
      inject([RegisterComponent], (component: RegisterComponent) => {
        spyOn(component.user, 'create').and.callThrough();
        component.onSubmit(user);
        expect(component.user.create).toHaveBeenCalledWith(user);
        expect(component.successfullySubmitted).toEqual(true);
        expect(component.newUser).toEqual(user);
      }));
  });
}
