import { Pojo } from '../../../../shared/interfaces/common.interface';
import { WzFormPicklistComponent } from './wz-form-picklist.component';

export function main() {
  describe('Wz Form Picklist Component', () => {
    let componentUnderTest: WzFormPicklistComponent;

    beforeEach(() => {
      componentUnderTest = new WzFormPicklistComponent(null, null, null);
    });

    describe('onSelectSuggestion()', () => {
      it('Should emit a formSubmit event with a suggestion', () => {
        spyOn(componentUnderTest.selectContact, 'emit');
        componentUnderTest.onSelectChange({ id: 1, Account: 'some account' });
        expect(componentUnderTest.selectContact.emit).toHaveBeenCalledWith({ id: 1, Account: 'some account' });
      });
    });

    describe('set displayProperties()', () => {
      it('Should parse the properties into translation strings', () => {
        let mockProperties: Pojo = {
          'contactEmail': 'mjustus.wazee+invoice1@gmail.com',
          'field': [
            {
              'name': 'invoiceContact',
              'options': [
                {
                  'id': 7845,
                  'name': 'El contacto de la factura es Jane',
                  'emailAddress': 'mjustus.wazee+invoice1@gmail.com'
                }
              ],
              'label': 'Invoice contact name',
              'type': 'select',
              'value': {
                'id': 7845,
                'name': 'El contacto de la factura es Jane',
                'emailAddress': 'mjustus.wazee+invoice1@gmail.com'
              },
              'validation': 'REQUIRED'
            }
          ],
          'id': 7845
        };

        componentUnderTest.displayProperties = mockProperties;
        let parsedProperties: Pojo;
        componentUnderTest.labels.subscribe(labels => parsedProperties = labels);
        expect(parsedProperties).toEqual([{ 'label': 'QUOTE.EDIT.CONTACT_EMAIL_KEY', 'value': 'mjustus.wazee+invoice1@gmail.com' }]);
      });

      it('Should not error if an undefined input is passed to display properties', () => {
        let mockProperties: Pojo;
        let parsedProperties: Pojo;
        componentUnderTest.displayProperties = mockProperties;
        componentUnderTest.labels.subscribe(labels => parsedProperties = labels);
        expect(parsedProperties).toEqual([]);
      });
    });
  });
}