import React from "react";

// import { connectReduxDevtools } from "mst-middlewares";

import { IStore, RootStore } from "./RootStore";
import { onSnapshot } from "mobx-state-tree";
import { pageTemplates } from "@/libs/templates";
import { v4 as uuid } from "uuid";
import { recursiveClearUuid } from "../utils";

export const SNAPSHOT_KEYS = {
  ROOT_STORE: "ROOT_STORE",
};

const memorizedRootStoreSnapshot = localStorage.getItem(
  SNAPSHOT_KEYS.ROOT_STORE
);

const store = RootStore.create(
  memorizedRootStoreSnapshot
    ? JSON.parse(memorizedRootStoreSnapshot)
    : {
        pages: JSON.parse(JSON.stringify(pageTemplates)),
        templates: pageTemplates.map((pageTemplate) => {
          return {
            ...pageTemplate,
            uuid: uuid(),
            ast: recursiveClearUuid(pageTemplate.ast),
          }
        }),
      }
);

export const StoreContext = React.createContext<IStore>(store);

if (process.env.NODE_ENV === "development") {
  /* tslint:disable-next-line */
  // connectReduxDevtools(require("remotedev"), store);
}

onSnapshot(store, (snapshot) => {
  localStorage.setItem(SNAPSHOT_KEYS.ROOT_STORE, JSON.stringify(snapshot));
});

export const MobxStateTreeStoreProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};
