import { QuoteCapabilities } from './quote.capabilities';

export function main() {
  describe('Quote Capabilities', () => {
    let capabilitiesUnderTest: QuoteCapabilities, mockCurrentUserService: any;

    beforeEach(() => {
      capabilitiesUnderTest = new QuoteCapabilities(mockCurrentUserService);
    });

    describe('administerQuotes', () => {
      let hasPermissions: boolean;

      beforeEach(() => {
        mockCurrentUserService = { hasPermission: () => hasPermissions };
      });

      it('should return false if the user does not have the permissions', () => {
        hasPermissions = false;
        expect(new QuoteCapabilities(mockCurrentUserService).administerQuotes()).toBe(false);
      });

      it('should return true if the user has the permissions', () => {
        hasPermissions = true;
        expect(new QuoteCapabilities(mockCurrentUserService).administerQuotes()).toBe(true);
      });
    });
  });
}
