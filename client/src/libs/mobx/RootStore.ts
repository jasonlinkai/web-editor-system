import {
  types as t,
  Instance,
  detach,
  getSnapshot,
  SnapshotIn,
  SnapshotOut,
  flow,
  toGenerator,
} from "mobx-state-tree";
import { PageModel, PageModelType } from "./PageModel";
import { v4 as uuid } from "uuid";
import { recursiveClearUuid } from "../utils";
import { httpGetTestServer } from "../http";

export const RootStore = t
  .model("RootStore", {
    token: t.optional(t.string, ""),
    templates: t.optional(t.array(PageModel), []),
    pages: t.optional(t.array(PageModel), []),
    selectedPage: t.maybe(t.safeReference(PageModel)),
  })
  .volatile((self) => ({
    isTemplateGalleryModalVisible: false,
  }))
  .views((self) => {
    return {
      get isAuthenticated() {
        return self.token !== "";
      },
    };
  })
  //
  // model mutators
  //
  .actions((self) => {
    const setToken = (token: string) => {
      self.token = token;
    };
    const setSelectedPage = (page: PageModelType | undefined) => {
      self.selectedPage = page;
    };
    const addPage = (page: PageModelType) => {
      const copyedSnapshot = JSON.parse(JSON.stringify(getSnapshot(page)));
      copyedSnapshot.uuid = uuid();
      copyedSnapshot.ast = recursiveClearUuid(copyedSnapshot.ast);
      self.pages.push(copyedSnapshot);
    };
    const deletePage = (page: PageModelType) => {
      detach(page);
    };
    return {
      setToken,
      setSelectedPage,
      addPage,
      deletePage,
    };
  })
  //
  // volatile mutators
  //
  .actions((self) => {
    const setIsTemplateGalleryModalVisible = (v: boolean) => {
      self.isTemplateGalleryModalVisible = v;
    };
    return {
      setIsTemplateGalleryModalVisible,
    };
  })
  //
  // async action
  //
  .actions((self) => {
    const testServer = flow(function* () {
      try {
        const { data } = yield* toGenerator(httpGetTestServer());
        return data;
      } catch (error) {
        console.error("Failed to fetch testServer", error);
        return '';
      }
    });
    return {
      testServer,
    };
  });

export interface RootStoreType extends Instance<typeof RootStore> {}
export type RootStoreSnapshotInType = SnapshotIn<typeof RootStore>;
export type RootStoreSnapshotOutType = SnapshotOut<typeof RootStore>;
