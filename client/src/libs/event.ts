export enum EventNames {
  NAVIGATE = "NAVIGATE",
  LOGIN = "LOGIN",
}

export interface EventPayloadMap {
  [EventNames.NAVIGATE]: { path: string };
  [EventNames.LOGIN]: undefined;
}

export interface Event<T extends EventNames> {
  type: T;
  payload: EventPayloadMap[T];
}

export type EventCallback<T extends EventNames> = (
  payload: EventPayloadMap[T]
) => void;

export interface RegisterEventProps<T extends EventNames> {
  type: T;
  callback: EventCallback<T>;
}

// FIXME: callback type not correct.
const handlers: Partial<Record<EventNames, any>> = {};

const missingCallback = (type: EventNames) =>
  console.log(`eventName: ${type}: not match any callback.`);

export const dispatchEvent = <T extends EventNames>(event: Event<T>) => {
  const { type, payload } = event;
  const callback = handlers[type];
  return callback ? callback(payload) : missingCallback(type);
};

export const registerEvent = <T extends EventNames>({
  type,
  callback,
}: RegisterEventProps<T>) => {
  const enhencedCallback = (payload: EventPayloadMap[T]) => {
    console.log(
      `received eventName: ${type}, payload: ${JSON.stringify(payload)}`
    );
    callback(payload);
  };
  handlers[type] = enhencedCallback;
};

registerEvent<EventNames.LOGIN>({
  type: EventNames.LOGIN,
  callback: (payload) => {},
});

registerEvent<EventNames.NAVIGATE>({
  type: EventNames.NAVIGATE,
  callback: (payload) => {},
});
