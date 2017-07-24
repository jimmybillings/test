import { Common } from './common.functions';

export function main() {
  describe('Commone Functions', () => {

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

