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
      { name: '@ngrx/store', path: 'node_modules/@ngrx/store/bundles/store.umd.min.js' },
      { name: '@ngrx/effects', path: 'node_modules/@ngrx/effects/bundles/effects.umd.min.js' },
      { name: '@ngrx/store-devtools', path: 'node_modules/@ngrx/store-devtools/bundles/store-devtools.umd.min.js' },
      { name: '@ngx-translate/core', path: 'node_modules/@ngx-translate/core/bundles/core.umd.js' },
      { name: '@ngx-translate/http-loader', path: 'node_modules/@ngx-translate/http-loader/bundles/http-loader.umd.js' }
    ];

    this.addPackagesBundles(additionalPackages);
  }
}
