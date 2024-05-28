"use client";
import React, { useCallback, useEffect, useState } from "react";

// import { connectReduxDevtools } from "mst-middlewares";

import { RootStoreType, RootStore } from "./RootStore";
import { applySnapshot, onSnapshot } from "mobx-state-tree";
import { pageTemplates } from "source/libs/templates";
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
        currentUser: {},
        pages: [],
        templates: (
          JSON.parse(JSON.stringify(pageTemplates)) as typeof pageTemplates
        ).map((pageTemplate) => {
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

export const StoreContext = React.createContext<{
  store: RootStoreType | undefined;
  reload: () => void;
}>({
  store: undefined,
  reload: () => {},
});

if (process.env.NODE_ENV === "development") {
  /* tslint:disable-next-line */
  // connectReduxDevtools(require("remotedev"), store);
}

export const MobxStateTreeStoreProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [store, setStore] = useState<RootStoreType | undefined>(undefined);
  const init = useCallback(() => {
    const { disposer, store } = loadStore();
    setStore(store);
    return () => {
      disposer();
    };
  }, []);
  const reload = useCallback(() => {
    if (store) {
      localStorage.removeItem(SNAPSHOT_KEYS.ROOT_STORE);
      applySnapshot(store, getRootStoreSnapshotFromLocalStorage());
    }
  }, [store]);
  useEffect(() => {
    init();
  }, [init]);
  if (!store) return null;
  return (
    <StoreContext.Provider value={{ store, reload }}>
      {children}
    </StoreContext.Provider>
  );
};
