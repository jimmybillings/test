import { ProjectsComponent } from './projects.component';

export function main() {
  describe('Projects Component', () => {
    let componentUnderTest: ProjectsComponent;

    beforeEach(() => {
      componentUnderTest = new ProjectsComponent();
    });

    describe('projectsOtherThan()', () => {
      it('returns projects other than the one specified', () => {
        let project1: any = { id: '1' };
        let project2: any = { id: '2' };
        let project3: any = { id: '3' };
        componentUnderTest.projects = [project1, project2, project3];

        expect(componentUnderTest.projectsOtherThan(project2))
          .toEqual([project1, project3]);
      });
    });

    describe('lineItemCountFor()', () => {
      it('returns the number of lineitems in the project', () => {
        let project: any = { lineItems: [{}, {}, {}] };

        expect(componentUnderTest.lineItemCountFor(project)).toBe(3);
      });

      it('returns zero if the project has no lineItems defined', () => {
        let project: any = {};

        expect(componentUnderTest.lineItemCountFor(project)).toBe(0);
      });
    });

    describe('addProject()', () => {
      it('emits the proper request event', () => {
        componentUnderTest.projectsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({ type: 'ADD_PROJECT' });
          });

        componentUnderTest.addProject();
      });
    });

    describe('remove()', () => {
      it('emits the proper request event', () => {
        let project: any = { some: 'project' };

        componentUnderTest.projectsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({ type: 'REMOVE_PROJECT', payload: project });
          });

        componentUnderTest.remove(project);
      });
    });

    describe('edit()', () => {
      it('emits the proper request event', () => {
        let project: any = { a: 'b', c: 'd', e: 'f' };

        componentUnderTest.config = {
          form: {
            items: [
              { name: 'a', value: 'x' },
              { name: 'c', value: 'x' },
              { name: 'e', value: 'x' }
            ]
          }
        };

        componentUnderTest.projectsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({
              type: 'UPDATE_PROJECT', payload: {
                project: { a: 'b', c: 'd', e: 'f' },
                items: [{ name: 'a', value: 'b' }, { name: 'c', value: 'd' }, { name: 'e', value: 'f' }]
              }
            });
          });

        componentUnderTest.edit(project);
      });
    });

    describe('delegate()', () => {
      it('forwards events', () => {
        componentUnderTest.projectsNotify
          .subscribe((event: Object) => {
            expect(event).toEqual({ some: 'event' });
          });

        componentUnderTest.delegate({ some: 'event' });
      });
    });

    describe('selectProject()', () => {
      it('updates its config form items', () => {
        let project: any = { a: 'b', c: 'd', e: 'f' };

        componentUnderTest.config = {
          form: {
            items: [
              { name: 'a', value: 'x' },
              { name: 'c', value: 'x' },
              { name: 'e', value: 'x' }
            ]
          }
        };

        componentUnderTest.selectProject(project);

        expect(componentUnderTest.config.form.items).toEqual([
          { name: 'a', value: 'b' },
          { name: 'c', value: 'd' },
          { name: 'e', value: 'f' }
        ]);
      });
    });
  });
};
