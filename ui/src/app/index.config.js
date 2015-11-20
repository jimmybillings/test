export function config ($logProvider, $mdThemingProvider) {
  'ngInject';
  
  // Enable log
  $logProvider.debugEnabled(true);

  $mdThemingProvider.theme('default')
  .primaryPalette('deep-orange', {
      'default': '800', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '500', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '700', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': '900' // use shade A100 for the <code>md-hue-3</code> class
    })
  .accentPalette('blue-grey');

}
