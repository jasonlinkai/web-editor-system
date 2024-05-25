import React from "react";
import { RootStoreType } from "./RootStore";
import { StoreContext } from "./MobxStateTreeProvider";

export function useStores(): RootStoreType {
  const { store } = React.useContext(StoreContext);
  return store;
}

export function useStoresReload(): {
  reload: () => void;
} {
  const { reload } = React.useContext(StoreContext);
  return {
    reload,
  };
}
