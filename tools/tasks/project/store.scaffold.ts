import * as gutil from 'gulp-util';
import { writeFileSync, mkdir } from 'fs';
import { join } from 'path';
import { argv } from 'yargs';
import Config from '../../config';

let section: string;
let skips: string[];
let path: string;

export = () => {
  validateInput();

  return mkdir(path, () => {
    makeFilesFor(path, section, skips);
  });
}

const validateInput = (): void => {
  if (!argv['section']) {
    gutil.log('Please provide a store section name');
    process.exit(1);
  }
  section = kebab(argv['section']);
  path = join(Config.APP_SRC, 'app/store/', section);
  if (!argv['section']) {
    gutil.log(`Creating all store files ${section}`);
    skips = [];
  } else {
    skips = parse(argv['skip']);
  }
}

const makeFilesFor = (path: string, section: string, skips: string[]): void => {
  if (skips.indexOf('actions') === -1) {
    makeActionFiles(path, section, skips);
  }

  if (skips.indexOf('effects') === -1) {
    makeEffectsFiles(path, section, skips);
  }

  if (skips.indexOf('state') === -1) {
    makeStateFiles(path, section, skips);
  }

  if (skips.indexOf('state') === -1) {
    makeServiceFiles(path, section, skips);
  }
}

const makeActionFiles = (path: string, section: string, skips: string[]): void => {
  writeFileSync(join(path, `${section}.actions.ts`), actionFileFor(section));
  gutil.log(`created ${join(path, `${section}.actions.ts`)}`);
  if (skips.indexOf('specs') === -1) {
    writeFileSync(join(path, `${section}.actions.spec.ts`), actionSpecFileFor(section));
    gutil.log(`created ${join(path, `${section}.actions.spec.ts`)}`);
  }
}

const makeEffectsFiles = (path: string, section: string, skips: string[]): void => {
  writeFileSync(join(path, `${section}.effects.ts`), effectFileFor(section));
  gutil.log(`created ${join(path, `${section}.effects.ts`)}`);
  if (skips.indexOf('specs') === -1) {
    writeFileSync(join(path, `${section}.effects.spec.ts`), effectSpecFileFor(section));
    gutil.log(`created ${join(path, `${section}.effects.spec.ts`)}`);
  }
}

const makeStateFiles = (path: string, section: string, skips: string[]): void => {
  writeFileSync(join(path, `${section}.state.ts`), stateFileFor(section));
  gutil.log(`created ${join(path, `${section}.state.ts`)}`);
  if (skips.indexOf('specs') === -1) {
    writeFileSync(join(path, `${section}.state.spec.ts`), stateSpecFileFor(section));
    gutil.log(`created ${join(path, `${section}.state.spec.ts`)}`);
  }
}

const makeServiceFiles = (path: string, section: string, skips: string[]): void => {
  writeFileSync(join(path, `${section}.service.ts`), serviceFileFor(section));
  gutil.log(`created ${join(path, `${section}.service.ts`)}`);
  if (skips.indexOf('specs') === -1) {
    writeFileSync(join(path, `${section}.service.spec.ts`), serviceSpecFileFor(section));
    gutil.log(`created ${join(path, `${section}.service.spec.ts`)}`);
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
  const capitalizedSectionName = capitalize(section);

  return `import { ActionFactory, InternalActionFactory } from './${section}.actions';
import { ActionsSpecHelper } from '../spec-helpers/actions.spec-helper';

  export function main() {
    describe('${capitalizedSectionName} Actions', () => {
      let actionsSpecHelper: ActionsSpecHelper = new ActionsSpecHelper();
    });
  }
`;
}

const effectFileFor = (section: string): string => {
  const className: string = classNameFor(section);
  const serviceName: string = serviceNameFor(className);
  const effectsName: string = effectsNameFor(className);

  return `import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { AppStore } from '../../app.store';
import { ${serviceName} } from './${section}.service';

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
  const capitalizedSectionName = capitalize(section);

  return `import { ${effectsName} } from './${section}.effects';
import * as ${actionsName} from './${section}.actions';
import { EffectsSpecHelper, EffectTestParameters } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('${capitalizedSectionName} Effects', () => {
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
  const capitalizedSectionName = capitalize(section);
  const className: string = classNameFor(section);
  const serviceName: string = serviceNameFor(className);

  return `import { ${serviceName} } from './${section}.service';
import { MockApiService, mockApiMatchers } from '../spec-helpers/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';

export function main() {
  describe('${capitalizedSectionName} Service', () => {
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
  const capitalizedSectionName = capitalize(section);
  const stateName = stateNameFor(className);
  const actionsName: string = actionsNameFor(className);

  return `import * as ${stateName} from './${section}.state';
import * as ${actionsName} from './${section}.actions';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('${capitalizedSectionName} Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      actions: ${actionsName},
      state: ${stateName},
    });
  });
}
`;
}
