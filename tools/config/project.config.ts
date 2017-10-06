import { join } from 'path';

import { SeedConfig } from './seed.config';
import { ExtendPackages } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  constructor() {
    super();
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      { src: 'pikaday/pikaday.js', inject: 'libs' },
      { src: 'clipboard/dist/clipboard.min.js', inject: 'libs' },
      { src: 'hammerjs/hammer.js', inject: 'libs' }
    ];

    this.APP_ASSETS = [
      { src: `${this.APP_SRC}/app/shared/components/wz-aspera-download/connectinstaller-4.js`, inject: true, vendor: false },
      { src: `${this.APP_SRC}/app/shared/components/wz-aspera-download/asperaweb-4.js`, inject: true, vendor: false }
    ];

    let additionalPackages: ExtendPackages[] = [
      {
        name: '@ngrx/store',
        path: 'node_modules/@ngrx/store/bundles/store.umd.min.js'
      },
      {
        name: '@ngrx/effects',
        path: 'node_modules/@ngrx/effects/bundles/effects.umd.min.js'
      },
      {
        name: '@ngrx/store-devtools',
        path: 'node_modules/@ngrx/store-devtools/bundles/store-devtools.umd.min.js'
      },
      {
        name: '@ngx-translate/core',
        path: 'node_modules/@ngx-translate/core/bundles/core.umd.js'
      },
      {
        name: '@ngx-translate/http-loader',
        path: 'node_modules/@ngx-translate/http-loader/bundles/http-loader.umd.js'
      },
      {
        name: 'wazee-frame-formatter',
        path: 'node_modules/wazee-frame-formatter/dist/index.js'
      },
      // {
      //   name: '@angular/material',
      //   path: 'node_modules/@angular/material/bundles/material.umd.js'
      // },
      // {
      //   name: '@angular/cdk',
      //   path: 'node_modules/@angular/cdk/bundles/cdk.umd.js'
      // },
      // {
      //   name: '@angular/cdk/stepper',
      //   path: 'node_modules/@angular/cdk/bundles/cdk-stepper.umd.js'
      // },
      // {
      //   name: '@angular/cdk/a11y',
      //   path: 'node_modules/@angular/cdk/bundles/cdk-a11y.umd.js'
      // },
      // {
      //   name: '@angular/cdk/bidi',
      //   path: 'node_modules/@angular/cdk/bundles/cdk-bidi.umd.js'
      // },
      // {
      //   name: '@angular/cdk/coercion',
      //   path: 'node_modules/@angular/cdk/bundles/cdk-coercion.umd.js'
      // },
      // {
      //   name: '@angular/cdk/collections',
      //   path: 'node_modules/@angular/cdk/bundles/cdk-collections.umd.js'
      // },
      // {
      //   name: '@angular/cdk/keycodes',
      //   path: 'node_modules/@angular/cdk/bundles/cdk-keycodes.umd.js'
      // },
      // {
      //   name: '@angular/cdk/observers',
      //   path: 'node_modules/@angular/cdk/bundles/cdk-observers.umd.js'
      // },
      // {
      //   name: '@angular/cdk/overlay',
      //   path: 'node_modules/@angular/cdk/bundles/cdk-overlay.umd.js'
      // },
      // {
      //   name: '@angular/cdk/platform',
      //   path: 'node_modules/@angular/cdk/bundles/cdk-platform.umd.js'
      // },
      // {
      //   name: '@angular/cdk/portal',
      //   path: 'node_modules/@angular/cdk/bundles/cdk-portal.umd.js'
      // },
      // {
      //   name: '@angular/cdk/rxjs',
      //   path: 'node_modules/@angular/cdk/bundles/cdk-rxjs.umd.js'
      // },
      // {
      //   name: '@angular/cdk/scrolling',
      //   path: 'node_modules/@angular/cdk/bundles/cdk-scrolling.umd.js'
      // },
      // {
      //   name: '@angular/cdk/table',
      //   path: 'node_modules/@angular/cdk/bundles/cdk-table.umd.js'
      // }
    ];

    this.addPackagesBundles(additionalPackages);
  }

}
