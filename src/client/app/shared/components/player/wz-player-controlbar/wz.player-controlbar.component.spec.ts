import { WzPlayerControlbarComponent } from './wz.player-controlbar.component';
import { WzPlayerRequest } from '../wz.player.interface';

export function main() {
  describe('Wz Player Controlbar Component', () => {
    let componentUnderTest: WzPlayerControlbarComponent;

    beforeEach(() => {
      componentUnderTest = new WzPlayerControlbarComponent();
      componentUnderTest.request.emit = jasmine.createSpy('request emitter');
    });

    describe('forward()', () => {
      it('forwards request events', () => {
        const mockRequest: WzPlayerRequest = {} as WzPlayerRequest;

        componentUnderTest.forward(mockRequest);

        expect(componentUnderTest.request.emit).toHaveBeenCalledWith(mockRequest);
      });
    });
  });
}
