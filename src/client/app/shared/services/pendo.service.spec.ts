import { PendoService } from './pendo.service';

declare var pendo: any;

export function main() {
  describe('Pendo Service', () => {
    let serviceUnderTest: PendoService;
    let mockUser: any;

    beforeEach(() => {
      serviceUnderTest = new PendoService();
      mockUser = {
        accountId: 1,
        id: 25,
        firstName: 'ross',
        lastName: 'edfort',
        siteName: 'core',
        emailAddress: 'ross.edfort@wazeedigital.com'
      };
    });

    // it('has an initialize method that calls pendo.initialize', () => {
    //   serviceUnderTest.initialize(mockUser);

    //   expect(pendo.initialize).toHaveBeenCalledWith({
    //     apiKey: '7e5da402-5d29-41b0-5579-6e149b0a28f2',
    //     visitor: { id: 'core-25-ross-edfort', email: 'ross.edfort@wazeedigital.com' },
    //     account: { id: 'core-1' }
    //   });
    // });
  });
}
