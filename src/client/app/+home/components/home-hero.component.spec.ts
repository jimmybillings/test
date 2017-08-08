import { HomeHeroComponent } from './home-hero.component';

export function main() {
  describe('Home Hero Component', () => {
    let componentUnderTest: HomeHeroComponent;

    beforeEach(() => {
      componentUnderTest = new HomeHeroComponent(null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
