describe('controllers', () => {
  let vm;

  beforeEach(angular.mock.module('portalUi'));

  beforeEach(inject(($controller, HomeService) => {
    spyOn(HomeService, 'getTec').and.returnValue([{}, {}, {}, {}, {}]);

    vm = $controller('HomeController');
  }));

  it('should have a timestamp creation date', () => {
    expect(vm.creationDate).toEqual(jasmine.any(Number));
  });

  it('should define animate class after delaying timeout', inject($timeout => {
    $timeout.flush();
    expect(vm.classAnimation).toEqual('rubberBand');
  }));

  it('should define more than 5 awesome things', () => {
    expect(angular.isArray(vm.awesomeThings)).toBeTruthy();
    expect(vm.awesomeThings.length === 5).toBeTruthy();
  });
});
