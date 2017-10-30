import * as gutil from 'gulp-util';
import { writeFile, mkdir } from 'fs';
import { join } from 'path';
import { argv } from 'yargs';
import Config from '../../config';

let section: string;
let skips: string[];
let path: string;

export = () => {
  validateInput();

  return mkdir(path, () => {
    makeFiles();
  });
}

const validateInput = (): void => {
  if (!argv['section']) {
    gutil.log('Please provide a store section name');
    process.exit(1);
  }

  section = kebab(argv['section']);
  path = join(Config.APP_SRC, 'app/store/', section);

  if (!argv['skip']) {
    gutil.log(`Creating all store files ${section}`);
    skips = [];
  } else {
    skips = parse(argv['skip']);
  }
}

const makeFiles = (): void => {
  makeActionFiles();
  makeEffectsFiles();
  makeStateFiles();
  makeServiceFiles();
}

const makeActionFiles = (): void => {
  const fullPath: string = join(path, `${section}.actions.ts`);
  const fullSpecPath: string = join(path, `${section}.actions.spec.ts`);

  if (skips.indexOf('actions') === -1) {
    writeFile(fullPath, actionFileFor(section), { flag: 'wx' }, (err) => {
      if (err) {
        gutil.log(gutil.colors.red(`Skipping ${fullPath}, it already exists`));
      } else {
        gutil.log(gutil.colors.green(`Created ${fullPath}`));
      }
    });
    if (skips.indexOf('specs') === -1) {
      writeFile(fullSpecPath, actionSpecFileFor(section), { flag: 'wx' }, (err) => {
        if (err) {
          gutil.log(gutil.colors.red(`Skipping ${fullSpecPath}, it already exists`));
        } else {
          gutil.log(gutil.colors.green(`Created ${fullSpecPath}`));
        }
      });
    }
  }
}

const makeEffectsFiles = (): void => {
  const fullPath: string = join(path, `${section}.effects.ts`);
  const fullSpecPath: string = join(path, `${section}.effects.spec.ts`);

  if (skips.indexOf('effects') === -1) {
    writeFile(fullPath, effectFileFor(section), { flag: 'wx' }, (err) => {
      if (err) {
        gutil.log(gutil.colors.red(`Skipping ${fullPath}, it already exists`));
      } else {
        gutil.log(gutil.colors.green(`Created ${fullPath}`));
      }
    });
    if (skips.indexOf('specs') === -1) {
      writeFile(fullSpecPath, effectSpecFileFor(section), { flag: 'wx' }, (err) => {
        if (err) {
          gutil.log(gutil.colors.red(`Skipping ${fullSpecPath}, it already exists`));
        } else {
          gutil.log(gutil.colors.green(`Created ${fullSpecPath}`));
        }
      });
    }
  }
}

const makeStateFiles = (): void => {
  const fullPath: string = join(path, `${section}.state.ts`);
  const fullSpecPath: string = join(path, `${section}.state.spec.ts`);

  if (skips.indexOf('state') === -1) {
    writeFile(fullPath, stateFileFor(section), { flag: 'wx' }, (err) => {
      if (err) {
        gutil.log(gutil.colors.red(`Skipping ${fullPath}, it already exists`));
      } else {
        gutil.log(gutil.colors.green(`Created ${fullPath}`));
      }
    });
    if (skips.indexOf('specs') === -1) {
      writeFile(fullSpecPath, stateSpecFileFor(section), { flag: 'wx' }, (err) => {
        if (err) {
          gutil.log(gutil.colors.red(`Skipping ${fullSpecPath}, it already exists`));
        } else {
          gutil.log(gutil.colors.green(`Created ${fullSpecPath}`));
        }
      });
    }
  }
}

const makeServiceFiles = (): void => {
  const fullPath: string = join(path, `${section}.service.ts`);
  const fullSpecPath: string = join(path, `${section}.service.spec.ts`);

  if (skips.indexOf('service') === -1) {
    writeFile(fullPath, serviceFileFor(section), { flag: 'wx' }, (err) => {
      if (err) {
        gutil.log(gutil.colors.red(`Skipping ${fullPath}, it already exists`));
      } else {
        gutil.log(gutil.colors.green(`Created ${fullPath}`));
      }
    });
    if (skips.indexOf('specs') === -1) {
      writeFile(fullSpecPath, serviceSpecFileFor(section), { flag: 'wx' }, (err) => {
        if (err) {
          gutil.log(gutil.colors.red(`Skipping ${fullSpecPath}, it already exists`));
        } else {
          gutil.log(gutil.colors.green(`Created ${fullSpecPath}`));
          gutil.log(gutil.colors.yellow('Don\'t forget to add to app.store, mock-app.store and shared.module!!'));
        }
      });
    }
  }
}

const serviceNameFor = (className: string): string => {
  return `${className}Service`;
}

const effectsNameFor = (className: string): string => {
  return `${className}Effects`;
}

const actionsNameFor = (className: string): string => {
  return `${className}Actions`;
}

const stateNameFor = (className: string): string => {
  return `${className}State`;
}

const classNameFor = (section: string): string => {
  return section.split('-').map(capitalize).join('');
}

const capitalize = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const actionTypeFor = (section: string): string => {
  return section.split('-').map(capitalize).join(' ');
}

const describeHeaderFor = (section: string): string => {
  return actionTypeFor(section);
}

const kebab = (s: string): string => {
  return s.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase();
}

const parse = (skips: string): string[] => {
  return skips.split(',');
}

const actionFileFor = (section: string): string => {
  const actionType: string = actionTypeFor(section);

  return `import { Action } from '@ngrx/store';

export class ActionFactory { }

export class InternalActionFactory extends ActionFactory { }

export class SomeAction implements Action {
  public static readonly Type = '[${actionType}] Some Action';
  public readonly type = SomeAction.Type;
}

export type Any = SomeAction;
`;
}

const actionSpecFileFor = (section: string): string => {
  const describeHeader = describeHeaderFor(section);

  return `import { ActionFactory, InternalActionFactory } from './${section}.actions';
import { ActionsSpecHelper } from '../spec-helpers/actions.spec-helper';

export function main() {
  describe('${describeHeader} Actions', () => {
    let actionsSpecHelper: ActionsSpecHelper = new ActionsSpecHelper();
  });
}
`;
}

const effectFileFor = (section: string): string => {
  const className: string = classNameFor(section);
  const serviceName: string = serviceNameFor(className);
  const effectsName: string = effectsNameFor(className);
  const actionsName: string = actionsNameFor(className);

  return `import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { AppStore } from '../../app.store';
import { ${serviceName} } from './${section}.service';
import * as ${actionsName} from './${section}.actions';

@Injectable()
export class ${effectsName} {
  constructor(private actions: Actions, private store: AppStore, private service: ${serviceName}) { }
}
`;
}

const effectSpecFileFor = (section: string): string => {
  const className: string = classNameFor(section);
  const effectsName: string = effectsNameFor(className);
  const actionsName: string = actionsNameFor(className);
  const describeHeader = describeHeaderFor(section);

  return `import { ${effectsName} } from './${section}.effects';
import * as ${actionsName} from './${section}.actions';
import { EffectsSpecHelper, EffectTestParameters } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('${describeHeader} Effects', () => {
    const effectsSpecHelper: EffectsSpecHelper = new EffectsSpecHelper();

    function instantiator(): ${effectsName} {
      return new ${effectsName}(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService
      );
    }
  });
}
`;
}

const serviceFileFor = (section: string): string => {
  const capitalizedSectionName = capitalize(section);
  const className: string = classNameFor(section);
  const serviceName: string = serviceNameFor(className);

  return `import { Injectable } from '@angular/core';

import { FutureApiService } from '../api/api.service';
import { Api } from '../../shared/interfaces/api.interface';

@Injectable()
export class ${serviceName} {
  constructor(private apiService: FutureApiService) { }
}
`;
}

const serviceSpecFileFor = (section: string): string => {
  const className: string = classNameFor(section);
  const serviceName: string = serviceNameFor(className);
  const describeHeader = describeHeaderFor(section);

  return `import { ${serviceName} } from './${section}.service';
import { MockApiService, mockApiMatchers } from '../spec-helpers/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';

export function main() {
  describe('${describeHeader} Service', () => {
    let serviceUnderTest: ${serviceName}, mockApiService: MockApiService;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApiService = new MockApiService();
      serviceUnderTest = new ${serviceName}(mockApiService.injector);
    });
  });
}
`;
}

const stateFileFor = (section: string): string => {
  const className: string = classNameFor(section);
  const actionsName: string = actionsNameFor(className);

  return `import * as ${actionsName} from './${section}.actions';

export interface State { }

export const initialState: State = { };

export function reducer(state: State = initialState, action: ${actionsName}.Any): State {
  if (state === null) state = initialState;

  switch (action.type) {

    default: {
      return state;
    }

  }
}
`;
}

const stateSpecFileFor = (section: string): string => {
  const className: string = classNameFor(section);
  const describeHeader = describeHeaderFor(section);
  const stateName = stateNameFor(className);
  const actionsName: string = actionsNameFor(className);

  return `import * as ${stateName} from './${section}.state';
import * as ${actionsName} from './${section}.actions';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('${describeHeader} Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      actions: ${actionsName},
      state: ${stateName},
    });
  });
}
`;
}
