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
import { httpGetTestServer, httpGetPages, httpPostPage } from "../http";

export const RootStore = t
  .model("RootStore", {
    token: t.optional(t.string, ""),
    templates: t.optional(t.array(PageModel), []),
    pages: t.optional(t.array(PageModel), []),
    selectedPage: t.maybe(t.safeReference(PageModel)),
  })
  .volatile((self) => ({
    isTemplateGalleryModalVisible: false,
    isFetchPagesLoading: false,
    isPostPageLoading: false,
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
    const setIsFetchImagesLoading = (v: boolean) => {
      self.isFetchPagesLoading = v;
    };
    const setIsPostPageLoading = (v: boolean) => {
      self.isPostPageLoading = v;
    };
    return {
      setIsTemplateGalleryModalVisible,
      setIsFetchImagesLoading,
      setIsPostPageLoading,
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
        return "";
      }
    });
    const fetchPages = flow(function* () {
      try {
        self.setIsFetchImagesLoading(true);
        const { data: pages } = yield* toGenerator(httpGetPages());
        self.pages = (pages as any).map((page: any) => {
          page.ast = JSON.parse(page.ast);
          return page;
        });
        self.setIsFetchImagesLoading(false);
        return pages;
      } catch (error) {
        console.error("Failed to fetch pages", error);
        self.setIsFetchImagesLoading(false);
        return [];
      }
    });
    const postPage = flow(function* (json: string) {
      self.setIsPostPageLoading(true);
      try {
        const { data } = yield* toGenerator(httpPostPage(json));
        self.setIsPostPageLoading(false);
        return data;
      } catch (error) {
        console.error("Failed to fetch uploadImage", error);
        self.setIsPostPageLoading(false);
        throw error;
      }
    });
    return {
      testServer,
      fetchPages,
      postPage,
    };
  });

export interface RootStoreType extends Instance<typeof RootStore> {}
export type RootStoreSnapshotInType = SnapshotIn<typeof RootStore>;
export type RootStoreSnapshotOutType = SnapshotOut<typeof RootStore>;
