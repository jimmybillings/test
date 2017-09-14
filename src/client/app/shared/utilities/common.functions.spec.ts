import { Common } from './common.functions';

export function main() {
  describe('Common Functions', () => {
    describe('setMarginTop', () => {
      let mockElement: any, mockDocument: any;

      beforeEach(() => {
        mockElement = {
          setAttribute: jasmine.createSpy('setAttribute')
        };

        mockDocument = {
          body: { getBoundingClientRect: () => ({ top: '-50' }) },
          getElementsByClassName: (string: string) => (string === 'invalidClass') ? [] : [mockElement]
        };
      });

      it('Should calculate a new marginTop that is offset by page scroll and set it to the element', () => {
        Common.setMarginTop('testClass', mockDocument);
        expect(mockElement.setAttribute).toHaveBeenCalledWith('style', 'margin-top: 50px');
      });

      it('Should not do anything if className element is not found on the page', () => {
        Common.setMarginTop('invalidClass', mockDocument);
        expect(mockElement.setAttribute).not.toHaveBeenCalled();
      });
    });


    describe('deletePropertiesFromObject', () => {
      it('Should remove the provided properties from a flat object', () => {
        let objectForTest = {
          id: 1,
          name: 'test',
          age: 3,
          createdOn: '10/10/2017',
          lastUpdated: '10/10/2017'
        };
        let propertiesToRemove: Array<string> = ['id', 'createdOn', 'lastUpdated'];
        Common.deletePropertiesFromObject(objectForTest, propertiesToRemove);

        expect(objectForTest).toEqual({ name: 'test', age: 3 });
      });

      it('Should only remove the provided properties if they exist', () => {
        let objectForTest: any = {
          id: 1,
          name: 'test',
          age: 3,
          createdOn: '10/10/2017',
          lastUpdated: '10/10/2017',
          someProp: null,
          anotherProp: undefined,
          lastProp: NaN
        };
        let propertiesToRemove: Array<string> = ['someProp', 'anotherProp', 'lastProp', 'notAProp'];
        Common.deletePropertiesFromObject(objectForTest, propertiesToRemove);

        expect(objectForTest).toEqual(objectForTest);
      });

      it('Should remove the provided properties from a deeply nested object', () => {
        let objectForTest = {
          id: 1,
          name: 'test',
          age: 3,
          createdOn: '10/10/2017',
          lastUpdated: '10/10/2017',
          subObject: {
            id: 1,
            name: 'test',
            age: 3,
            createdOn: '10/10/2017',
            lastUpdated: '10/10/2017',
            subObject: {
              id: 1,
              name: 'test',
              age: 3,
              createdOn: '10/10/2017',
              lastUpdated: '10/10/2017',
              subObject: {
                id: 1,
                name: 'test',
                age: 3,
                createdOn: '10/10/2017',
                lastUpdated: '10/10/2017'
              }
            }
          }
        };
        let propertiesToRemove: Array<string> = ['id', 'createdOn', 'lastUpdated'];
        Common.deletePropertiesFromObject(objectForTest, propertiesToRemove);

        expect(objectForTest).toEqual({
          name: 'test',
          age: 3, subObject: {
            name: 'test',
            age: 3,
            subObject: {
              name: 'test',
              age: 3,
              subObject: {
                name: 'test',
                age: 3
              }
            }
          }
        });
      });

      it(`Should remove the provided properties from a deeply nested object that 
      includes flat arrays and array of objects`, () => {
          let objectForTest = {
            id: 1,
            name: 'test',
            age: 3,
            createdOn: '10/10/2017',
            lastUpdated: '10/10/2017',
            flatArr: ['1', '2', '3'],
            arrOfObjects: [
              { id: 1, name: 'test', },
              { id: 1, name: 'test', },
              { id: 1, name: 'test', }],
            subObject: {
              id: 1,
              name: 'test',
              age: 3,
              createdOn: '10/10/2017',
              lastUpdated: '10/10/2017',
              flatArr: ['1', '2', '3'],
              arrOfObjects: [
                { id: 1, name: 'test', },
                { id: 1, name: 'test', },
                { id: 1, name: 'test', }],
              subObject: {
                id: 1,
                name: 'test',
                age: 3,
                createdOn: '10/10/2017',
                lastUpdated: '10/10/2017',
                flatArr: ['1', '2', '3'],
                arrOfObjects: [
                  { id: 1, name: 'test', },
                  { id: 1, name: 'test', },
                  { id: 1, name: 'test', }],
                subObject: {
                  id: 1,
                  name: 'test',
                  age: 3,
                  createdOn: '10/10/2017',
                  lastUpdated: '10/10/2017',
                  flatArr: ['1', '2', '3'],
                  arrOfObjects: [
                    { id: 1, name: 'test', },
                    { id: 1, name: 'test', },
                    { id: 1, name: 'test', }]
                }
              }
            }
          };
          let propertiesToRemove: Array<string> = ['id', 'createdOn', 'lastUpdated'];
          Common.deletePropertiesFromObject(objectForTest, propertiesToRemove);

          expect(objectForTest).toEqual({
            name: 'test',
            age: 3,
            flatArr: ['1', '2', '3'],
            arrOfObjects: [
              { name: 'test', },
              { name: 'test', },
              { name: 'test', }
            ],
            subObject: {
              name: 'test',
              age: 3,
              flatArr: ['1', '2', '3'],
              arrOfObjects: [
                { name: 'test', },
                { name: 'test', },
                { name: 'test', }
              ],
              subObject: {
                name: 'test',
                age: 3,
                flatArr: ['1', '2', '3'],
                arrOfObjects: [
                  { name: 'test', },
                  { name: 'test', },
                  { name: 'test', }
                ],
                subObject: {
                  name: 'test',
                  age: 3,
                  flatArr: ['1', '2', '3'],
                  arrOfObjects: [
                    { name: 'test', },
                    { name: 'test', },
                    { name: 'test', }
                  ]
                }
              }
            }
          });
        });
    });

  });
}

