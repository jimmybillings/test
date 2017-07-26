import { ActionReducer } from '@ngrx/store';

// TODO: When all reducers have been updated and are using addFutureStandardReducerTestsFor():
// 1) remove this function
// 2) rename addFutureStandardReducerTestsFor() to addStandardReducerTestsFor()
// 3) (hopefully this is automatic via the editor, but if not...)
//    update all calls in the rest of the codebase from addFutureStandardReducerTestsFor() to addStandardReducerTestsFor().
export function addStandardReducerTestsFor(
  reducer: ActionReducer<any>,
  actionType: string,
  initialState: any,
  payload: any = { some: 'payload' },
  currentState: any = initialState
) {
  describe('Reducer (standard tests)', () => {
    it('does not fail with a null current state', () => {
      expect(() => reducer(null, { type: actionType, payload: payload })).not.toThrow();
    });

    it('does not directly mutate the current state', () => {
      const currentStateSnapshot: string = JSON.stringify(currentState);

      reducer(currentState, { type: actionType, payload: payload });

      expect(JSON.stringify(currentState)).toEqual(currentStateSnapshot);
    });
  });
}

export function addFutureStandardReducerTestsFor(
  reducer: ActionReducer<any>,
  actionType: string,
  initialState: any,
  payload: any = { some: 'payload' },
  currentState: any = initialState
) {
  describe('Reducer (standard tests)', () => {
    it('does not fail with a null current state', () => {
      expect(() => reducer(null, { type: actionType, payload: payload })).not.toThrow();
    });

    it('has test parameters sufficient to prove lack of mutation', () => {
      const newState = reducer(currentState, { type: actionType, payload: payload });

      if (JSON.stringify(newState) === JSON.stringify(currentState)) {
        throw new Error(
          'The test payload does not result in a difference between states for this reducer, '
          + 'so we cannot determine whether the reducer could mutate the previous state. '
          + '(If this reducer does not take a payload, you can send in a currentState instead.)'
        );
      }

      expect(true).toBe(true);
    });

    it('does not directly mutate the current state', () => {
      const currentStateSnapshot: string = JSON.stringify(currentState);

      reducer(currentState, { type: actionType, payload: payload });

      expect(JSON.stringify(currentState)).toEqual(currentStateSnapshot);
    });

    it('does not directly mutate the initial state when there was a previous state', () => {
      const initialStateSnapshot: string = JSON.stringify(initialState);

      reducer(currentState, { type: actionType, payload: payload });

      expect(JSON.stringify(initialState)).toEqual(initialStateSnapshot);
    });

    it('does not directly mutate the initial state when there was not a previous state', () => {
      const initialStateSnapshot: string = JSON.stringify(initialState);

      reducer(undefined, { type: actionType, payload: payload });

      expect(JSON.stringify(initialState)).toEqual(initialStateSnapshot);
    });

    it('protects the previous state from changes to the returned state', () => {
      const newState = reducer(currentState, { type: actionType, payload: payload });

      expect(preserves(currentState, 'previous', newState)).toBe(true);
    });

    it('protects the initial state from changes to the returned state when there was a previous state', () => {
      const newState = reducer(currentState, { type: actionType, payload: payload });

      expect(preserves(initialState, 'initial', newState)).toBe(true);
    });

    it('protects the initial state from changes to the returned state when there was not a previous state', () => {
      const newState = reducer(undefined, { type: actionType, payload: payload });

      expect(preserves(initialState, 'initial', newState)).toBe(true);
    });
  });
}

//// END OF TESTS - UTILITY METHODS FOLLOW

function preserves(
  previousState: any, previousStateName: string, newState: any,
  propertyPath: string = 'state', previousStateSnapshot: string = JSON.stringify(previousState)
): boolean {
  if (Array.isArray(newState)) {
    return preservesArrayIn(previousState, previousStateName, newState, propertyPath, previousStateSnapshot);
  }

  if (newState === Object(newState)) {
    return preservesObjectIn(previousState, previousStateName, newState, propertyPath, previousStateSnapshot);
  }

  return preservesValueIn(previousState, previousStateName, newState, propertyPath, previousStateSnapshot);
}

function preservesArrayIn(
  previousState: any, previousStateName: string, array: any[], propertyPath: string, previousStateSnapshot: string
): boolean {
  array.push('evil mutation');

  verifyPreservationOf(previousState, previousStateSnapshot,
    `'${propertyPath}' array in the ${previousStateName} state is changed when pushing an element to it in the new state`);

  array.pop();

  for (const index in array) {
    if (!preserves(previousState, previousStateName, array[index], `${propertyPath}[${index}]`, previousStateSnapshot)) {
      return false;
    }
  }

  return true;
}

function preservesObjectIn(
  previousState: any, previousStateName: string, object: any, propertyPath: string, previousStateSnapshot: string
): boolean {
  object['evil mutation'] = 'evil mutation';

  verifyPreservationOf(previousState, previousStateSnapshot,
    `'${propertyPath}' object in the ${previousStateName} state is changed when adding a property to it in the new state`);

  delete object['evil mutation'];

  for (var key of Object.keys(object)) {
    if (!preserves(previousState, previousStateName, object[key], `${propertyPath}.${key}`, previousStateSnapshot)) {
      return false;
    }
  }

  return true;
}

function preservesValueIn(
  previousState: any, previousStateName: string, value: any, propertyPath: string, previousStateSnapshot: string
): boolean {
  const valueBeforeMutation = value;
  value = 'evil mutation';

  verifyPreservationOf(previousState, previousStateSnapshot,
    `'${propertyPath}' value in the ${previousStateName} state is changed when changing it in the new state`);

  value = valueBeforeMutation;

  return true;
}

function verifyPreservationOf(previousState: any, previousStateSnapshot: string, errorMessage: string) {
  if (JSON.stringify(previousState) !== previousStateSnapshot) throw new Error(errorMessage);
}
