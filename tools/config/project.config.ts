import { join } from 'path';

import { SeedConfig } from './seed.config';
// import { ExtendPackages } from './seed.config.interfaces';

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
      { src: 'hammerjs/hammer.js', inject: 'libs'}
    ];

    this.APP_ASSETS = [
      { src: `${this.APP_SRC}/app/shared/components/wz-aspera-download/connectinstaller-4.js`, inject: true, vendor: false },
      { src: `${this.APP_SRC}/app/shared/components/wz-aspera-download/asperaweb-4.js`, inject: true, vendor: false }
    ];
  }

}
