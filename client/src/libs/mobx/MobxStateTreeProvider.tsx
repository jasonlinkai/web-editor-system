import React, { useCallback } from "react";

// import { connectReduxDevtools } from "mst-middlewares";

import { RootStoreType, RootStore } from "./RootStore";
import { applySnapshot, onSnapshot } from "mobx-state-tree";
import { pageTemplates } from "@/libs/templates";
import { v4 as uuid } from "uuid";
import { recursiveClearUuid } from "../utils";

export const SNAPSHOT_KEYS = {
  ROOT_STORE: "ROOT_STORE",
};

const getRootStoreSnapshotFromLocalStorage = () => {
  const memorizedRootStoreSnapshot = localStorage.getItem(
    SNAPSHOT_KEYS.ROOT_STORE
  );
  return memorizedRootStoreSnapshot
    ? JSON.parse(memorizedRootStoreSnapshot)
    : {
        pages: [],
        templates: pageTemplates.map((pageTemplate) => {
          return {
            ...pageTemplate,
            uuid: uuid(),
            ast: recursiveClearUuid(pageTemplate.ast),
          };
        }),
      };
};

const loadStore = () => {
  const rootStoreSnapshot = getRootStoreSnapshotFromLocalStorage();
  const store = RootStore.create(rootStoreSnapshot);
  const disposer = onSnapshot(store, (snapshot) => {
    localStorage.setItem(SNAPSHOT_KEYS.ROOT_STORE, JSON.stringify(snapshot));
  });
  return {
    disposer,
    store,
  };
};

const { disposer, store } = loadStore();

export const StoreContext = React.createContext<{
  store: RootStoreType;
  reload: () => void;
}>({
  store,
  reload: () => {},
});

if (process.env.NODE_ENV === "development") {
  /* tslint:disable-next-line */
  // connectReduxDevtools(require("remotedev"), store);
}

export const MobxStateTreeStoreProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const reload = useCallback(() => {
    localStorage.removeItem(SNAPSHOT_KEYS.ROOT_STORE);
    applySnapshot(store, getRootStoreSnapshotFromLocalStorage());
    return () => {
      disposer();
    };
  }, []);

  return (
    <StoreContext.Provider value={{ store, reload }}>
      {children}
    </StoreContext.Provider>
  );
};
