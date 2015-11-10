describe('service HomeService', () => {
  beforeEach(angular.mock.module('portalUi'));

  it('should be registered', inject(HomeService => {
    expect(HomeService).not.toEqual(null);
  }));

  describe('getTec function', () => {
    it('should exist', inject(HomeService => {
      expect(HomeService.getTec).not.toBeNull();
    }));

    it('should return array of object', inject(HomeService => {
      const data = HomeService.getTec();
      expect(data).toEqual(jasmine.any(Array));
      expect(data[0]).toEqual(jasmine.any(Object));
      expect(data.length > 5).toBeTruthy();
    }));
  });
});
