import * as gutil from 'gulp-util';
import { writeFileSync, mkdir } from 'fs';
import { join } from 'path';
import { argv } from 'yargs';
import Config from '../../config';

export = () => {
  gutil.log(argv);
  const section: string = kebab(argv['section']);
  const path: string = join(Config.APP_SRC, 'app/store/', section);

  return mkdir(path, () => {
    writeFileSync(join(path, `${section}.actions.ts`), actionFileFor(section));
    writeFileSync(join(path, `${section}.effects.ts`), effectFileFor(section));
    writeFileSync(join(path, `${section}.service.ts`), serviceFileFor(section));
    writeFileSync(join(path, `${section}.state.ts`), stateFileFor(section));
  });
}

const actionFileFor = (section: string) => {
  const actionType: string = actionTypeFrom(section);

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

const effectFileFor = (section: string) => {
  const className: string = classNameFrom(section);
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

const serviceFileFor = (section: string) => {
  const className: string = classNameFrom(section);
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

const stateFileFor = (section: string) => {
  const className: string = classNameFrom(section);
  const actionsName: string = actionsNameFrom(className);

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

const serviceNameFor = (className: string): string => {
  return `${className}Service`;
}

const effectsNameFor = (className: string): string => {
  return `${className}Effects`;
}

const actionsNameFrom = (className: string): string => {
  return `${className}Actions`;
}

const classNameFrom = (section: string): string => {
  return section.split('-').map(capitalize).join('');
}

const capitalize = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const actionTypeFrom = (section: string): string => {
  return section.split('-').map(capitalize).join(' ');
}

const kebab = (s: string): string => {
  gutil.log(`\n\n${s}\n\n`);
  return s.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase();
}
