import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MdDialogConfig } from '@angular/material';

import { WzFormDialogComponent } from '../components/wz.form-dialog.component';
import { WzDialogService } from './wz.dialog.service';

export function main() {
  describe('Wz Dialog Service', () => {
    let serviceUnderTest: WzDialogService;
    let mockDialogRef: any;
    let mockDialog: any;
    let mockComponentInstance: any;

    beforeEach(() => {
      mockComponentInstance = {};

      mockDialogRef = {
        componentInstance: mockComponentInstance,
        close: jasmine.createSpy('close'),
        afterClosed: () => 'thingReturnedByAfterClosed'
      };

      mockDialog = {
        open: jasmine.createSpy('open').and.returnValue(mockDialogRef)
      };

      serviceUnderTest = new WzDialogService(mockDialog);
    });

    describe('openNotification()', () => {
      it('should open a dialog', () => {
        serviceUnderTest.openNotification({}, {});
        expect(mockDialog.open).toHaveBeenCalled();
      });
    });

    describe('openFormDialog', () => {
      let formSubmitSubject: Subject<any>;
      let formCancelSubject: Subject<any>;

      beforeEach(() => {
        formSubmitSubject = new Subject<any>();
        formCancelSubject = new Subject<any>();

        mockComponentInstance.submit = formSubmitSubject.asObservable();
        mockComponentInstance.cancel = formCancelSubject.asObservable();
      });

      it('opens a dialog with the expected inner component', () => {
        serviceUnderTest.openFormDialog([], {}, null, null);

        expect(mockDialog.open).toHaveBeenCalledWith(WzFormDialogComponent, jasmine.any(Object));
      });

      it('returns the value of dialogRef\'s afterClosed method', () => {
        expect(serviceUnderTest.openFormDialog([], {}, null, null)).toEqual('thingReturnedByAfterClosed');
      });

      it('passes the form fields to the component', () => {
        serviceUnderTest.openFormDialog([{ a: 'field' }, { another: 'field' }] as any, {}, null, null);

        expect(mockComponentInstance.formItems).toEqual([{ a: 'field' }, { another: 'field' }]);
      });

      describe('component options', () => {
        it('has default values', () => {
          serviceUnderTest.openFormDialog([], {}, null, null);

          expect(mockComponentInstance.title).toBeUndefined();
          expect(mockComponentInstance.submitLabel).toEqual('Submit');
          expect(mockComponentInstance.cancelLabel).toEqual('Cancel');
          expect(mockComponentInstance.displayCancelButton).toBe(false);
          expect(mockComponentInstance.autocomplete).toEqual('on');
        });

        it('can override the dialog title', () => {
          serviceUnderTest.openFormDialog([], { title: 'My Dialog' }, null, null);

          expect(mockComponentInstance.title).toEqual('My Dialog');
        });

        it('can override the submit button label', () => {
          serviceUnderTest.openFormDialog([], { submitLabel: 'Do it already!' }, null, null);

          expect(mockComponentInstance.submitLabel).toEqual('Do it already!');
        });

        it('can override the cancel button label', () => {
          serviceUnderTest.openFormDialog([], { cancelLabel: 'Never mind' }, null, null);

          expect(mockComponentInstance.cancelLabel).toEqual('Never mind');
        });

        it('can choose to display the cancel button', () => {
          serviceUnderTest.openFormDialog([], { displayCancelButton: true }, null, null);

          expect(mockComponentInstance.displayCancelButton).toBe(true);
        });

        it('can override the autocomplete value', () => {
          serviceUnderTest.openFormDialog([], { autocomplete: 'field1 field2' }, null, null);

          expect(mockComponentInstance.autocomplete).toEqual('field1 field2');
        });
      });

      describe('dialog display options', () => {
        it('has default values', () => {
          serviceUnderTest.openFormDialog([], {}, null, null);

          expect(mockDialog.open).toHaveBeenCalledWith(WzFormDialogComponent, { disableClose: true, position: { top: '10%' } });
        });

        it('can override disableClose', () => {
          serviceUnderTest.openFormDialog([], { dialogConfig: { disableClose: false } }, null, null);

          expect(mockDialog.open).toHaveBeenCalledWith(WzFormDialogComponent, { disableClose: false, position: { top: '10%' } });
        });

        it('can override the top position', () => {
          serviceUnderTest.openFormDialog([], { dialogConfig: { position: { top: '42%' } } }, null, null);

          expect(mockDialog.open).toHaveBeenCalledWith(WzFormDialogComponent, { disableClose: true, position: { top: '42%' } });
        });

        it('can add a height', () => {
          serviceUnderTest.openFormDialog([], { dialogConfig: { height: '500px' } }, null, null);

          expect(mockDialog.open)
            .toHaveBeenCalledWith(WzFormDialogComponent, { disableClose: true, position: { top: '10%' }, height: '500px' });
        });

        it('can add a left position', () => {
          serviceUnderTest.openFormDialog([], { dialogConfig: { position: { left: '17%' } } }, null, null);

          expect(mockDialog.open)
            .toHaveBeenCalledWith(WzFormDialogComponent, { disableClose: true, position: { left: '17%', top: '10%' } });
        });

        it('can override and add several properties at once', () => {
          const dialogConfig: MdDialogConfig = {
            disableClose: false, height: '300px', width: '900px', position: { left: '23%', top: '5%' }
          };

          serviceUnderTest.openFormDialog([], { dialogConfig: dialogConfig }, null, null);

          expect(mockDialog.open).toHaveBeenCalledWith(WzFormDialogComponent, dialogConfig);
        });
      });

      describe('when the form is submitted', () => {
        it('closes the dialog', () => {
          serviceUnderTest.openFormDialog([], {}, null, null);
          formSubmitSubject.next({});

          expect(mockDialogRef.close).toHaveBeenCalled();
        });

        it('can handle a null onSubmit callback', () => {
          serviceUnderTest.openFormDialog([], {}, null, null);

          expect(() => formSubmitSubject.next({})).not.toThrow();
        });

        it('calls the onSubmit callback with a result', () => {
          const callback: jasmine.Spy = jasmine.createSpy('callback');

          serviceUnderTest.openFormDialog([], {}, callback, null);
          formSubmitSubject.next({ x: 37 });

          expect(callback).toHaveBeenCalledWith({ x: 37 });
        });
      });

      describe('when the form is canceled', () => {
        it('closes the dialog', () => {
          serviceUnderTest.openFormDialog([], {}, null, null);
          formCancelSubject.next({});

          expect(mockDialogRef.close).toHaveBeenCalled();
        });

        it('can handle a null onCancel callback', () => {
          serviceUnderTest.openFormDialog([], {}, null, null);

          expect(() => formCancelSubject.next({})).not.toThrow();
        });

        it('can handle an undefined onCancel callback', () => {
          serviceUnderTest.openFormDialog([], {}, null);

          expect(() => formCancelSubject.next({})).not.toThrow();
        });

        it('calls the onCancel callback', () => {
          const callback: jasmine.Spy = jasmine.createSpy('callback');

          serviceUnderTest.openFormDialog([], {}, null, callback);
          formCancelSubject.next();

          expect(callback).toHaveBeenCalledWith(undefined);
        });
      });
    });
  });
}
