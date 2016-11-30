import { WzTranscodeSelectComponent } from './wz.transcode-select.component';

export function main() {
  describe('Transcode Select Component', () => {
    let componentUnderTest: WzTranscodeSelectComponent;

    beforeEach(() => {
      componentUnderTest = new WzTranscodeSelectComponent();
      componentUnderTest.transcodeTargets = [
        { name: 'master_copy', selected: true },
        { name: '1080i', selected: false },
        { name: '1080p', selected: false }
      ];
    });

    describe('onSelectTarget', () => {
      it('toggles the selected property on the targets', () => {
        componentUnderTest.onSelectTarget({ name: '1080i', selected: false });

        expect(componentUnderTest.transcodeTargets).toEqual([
          { name: 'master_copy', selected: false },
          { name: '1080i', selected: true },
          { name: '1080p', selected: false }
        ]);
      });

      it('Returns the first transcode target if it doesnt find one thats selected', () => {
        componentUnderTest.transcodeTargets = [
          { name: 'master_copy', selected: false },
          { name: '1080i', selected: false },
          { name: '1080p', selected: false }
        ];
        spyOn(componentUnderTest.selectTarget, 'emit');
        componentUnderTest.onSelectTarget({ name: 'bogus', selected: false });
        expect(componentUnderTest.selectTarget.emit).toHaveBeenCalledWith({ name: 'master_copy', selected: false });
      });

      it('emits an event', () => {
        spyOn(componentUnderTest.selectTarget, 'emit');
        componentUnderTest.onSelectTarget({ name: '1080i', selected: false });

        expect(componentUnderTest.selectTarget.emit).toHaveBeenCalledWith({ name: '1080i', selected: true });
      });
    });


  });
}