import { WzSelectComponent } from './wz.select.component';

export function main() {
  describe('WzSelect Component', () => {
    let componentUnderTest: WzSelectComponent;

    beforeEach(() => {
      componentUnderTest = new WzSelectComponent();
      componentUnderTest.options = [
        { name: 'master_copy', selected: true },
        { name: '1080i', selected: false },
        { name: '1080p', selected: false }
      ];
    });

    describe('onSelectOption', () => {
      it('toggles the selected property on the options', () => {
        componentUnderTest.onSelectOption({ name: '1080i', selected: false });

        expect(componentUnderTest.options).toEqual([
          { name: 'master_copy', selected: false },
          { name: '1080i', selected: true },
          { name: '1080p', selected: false }
        ]);
      });

      it('Returns the first transcode target if it doesnt find one thats selected', () => {
        componentUnderTest.options = [
          { name: 'master_copy', selected: false },
          { name: '1080i', selected: false },
          { name: '1080p', selected: false }
        ];
        spyOn(componentUnderTest.selectOption, 'emit');
        componentUnderTest.onSelectOption({ name: 'bogus', selected: false });
        expect(componentUnderTest.selectOption.emit).toHaveBeenCalledWith({ name: 'master_copy', selected: false });
      });

      it('emits an event', () => {
        spyOn(componentUnderTest.selectOption, 'emit');
        componentUnderTest.onSelectOption({ name: '1080i', selected: false });

        expect(componentUnderTest.selectOption.emit).toHaveBeenCalledWith({ name: '1080i', selected: true });
      });
    });


  });
}
