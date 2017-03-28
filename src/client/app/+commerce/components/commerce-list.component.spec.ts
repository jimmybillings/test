import { CommerceListComponent } from './commerce-list.component';

export function main() {
  describe('Order Item List Component', () => {
    let componentUnderTest: CommerceListComponent;

    beforeEach(() => {
      componentUnderTest = new CommerceListComponent();
    });

    describe('Instance of component', () => {
      it('Should be true', () => {
        expect(componentUnderTest instanceof CommerceListComponent).toBeTruthy();
      });
    });

  });
};

