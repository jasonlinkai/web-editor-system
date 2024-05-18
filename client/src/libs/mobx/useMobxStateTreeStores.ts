import React from "react";
import { IStore } from "./RootStore";
import { StoreContext } from "./MobxStateTreeProvider";

export function useStores(): IStore {
  const store = React.useContext(StoreContext);

  if (!store) {
    throw new Error("StoreProvider is not defined");
  }

  return store;
}