import React from "react";
import { RootStoreType } from "./RootStore";
import { StoreContext } from "./MobxStateTreeProvider";

export function useStores(): RootStoreType {
  const store = React.useContext(StoreContext);

  if (!store) {
    throw new Error("StoreProvider is not defined");
  }

  return store;
}