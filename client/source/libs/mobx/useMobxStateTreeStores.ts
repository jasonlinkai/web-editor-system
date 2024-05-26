import React from "react";
import { RootStoreType } from "./RootStore";
import { StoreContext } from "./MobxStateTreeProvider";

export function useStores(): RootStoreType {
  const { store } = React.useContext(StoreContext);
  if (store === undefined) {
    throw Error('store in\'t inited');
  }
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
