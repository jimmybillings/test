import { HomeHeroComponent } from './home-hero.component';

export function main() {
  xdescribe('Home Hero Component', () => {
    let componentUnderTest: HomeHeroComponent;

    beforeEach(() => {
      componentUnderTest = new HomeHeroComponent(null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
