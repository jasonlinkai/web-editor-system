import {
  types as t,
  Instance,
  detach,
  SnapshotIn,
  SnapshotOut,
  flow,
  toGenerator,
} from "mobx-state-tree";
import { PageModel, PageModelType } from "./PageModel";
import { UserModel } from "./UserModel";
import {
  httpGetTestServer,
  httpPostLogout,
  httpGetPages,
  httpPostPage,
  httpDeletePage,
  httpPutPage,
  httpGetUser,
} from "../http";

export const RootStore = t
  .model("RootStore", {
    currentUser: t.maybe(UserModel),
    token: t.optional(t.string, ""),
    templates: t.optional(t.array(PageModel), []),
    pages: t.optional(t.array(PageModel), []),
    selectedPage: t.maybe(t.safeReference(PageModel)),
    inited: t.optional(t.boolean, false),
  })
  .volatile((self) => ({
    isTemplateGalleryModalVisible: false,
    isGetUserLoading: false,
    isFetchPagesLoading: false,
    isPostPageLoading: false,
    isDeletePageLoading: false,
    isPutPageLoading: false,
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
    const setInited = (inited: boolean) => {
      self.inited = inited;
    };
    const setToken = (token: string) => {
      self.token = token;
    };
    const setSelectedPage = (page: PageModelType | undefined) => {
      self.selectedPage = page;
    };
    const addPage = (page: PageModelType) => {
      self.pages.push(page);
    };
    const deletePage = (page: PageModelType) => {
      detach(page);
    };
    return {
      setInited,
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
    const setIsGetUserLoading = (v: boolean) => {
      self.isGetUserLoading = v;
    };
    const setIsFetchPagesLoading = (v: boolean) => {
      self.isFetchPagesLoading = v;
    };
    const setIsPostPageLoading = (v: boolean) => {
      self.isPostPageLoading = v;
    };
    const setIsPutPageLoading = (v: boolean) => {
      self.isPutPageLoading = v;
    };
    const setIsDeletePageLoading = (v: boolean) => {
      self.isDeletePageLoading = v;
    };
    return {
      setIsTemplateGalleryModalVisible,
      setIsGetUserLoading,
      setIsFetchPagesLoading,
      setIsPostPageLoading,
      setIsPutPageLoading,
      setIsDeletePageLoading,
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
        throw error;
      }
    });
    const ActionGetUser = flow(function* () {
      try {
        self.setIsGetUserLoading(true);
        const { data } = yield* toGenerator(httpGetUser());
        self.currentUser = UserModel.create(data);
        self.setIsGetUserLoading(false);
        return data;
      } catch (error) {
        self.setIsGetUserLoading(false);
        throw error;
      }
    });
    const ActionPostLogout = flow(function* () {
      try {
        const { data } = yield* toGenerator(httpPostLogout());
        return data;
      } catch (error) {
        throw error;
      }
    });
    const ActionGetPages = flow(function* () {
      try {
        self.setIsFetchPagesLoading(true);
        const { data: pages } = yield* toGenerator(httpGetPages());
        console.log('pages', pages);
        self.pages = (pages as any).map((page: any) => {
          page.ast = JSON.parse(page.ast);
          return page;
        });
        self.setIsFetchPagesLoading(false);
        return pages;
      } catch (error) {
        self.setIsFetchPagesLoading(false);
        throw error;
      }
    });
    const ActionPostPage = flow(function* (json: string) {
      self.setIsPostPageLoading(true);
      try {
        const { data } = yield* toGenerator(httpPostPage(json));
        self.setIsPostPageLoading(false);
        return data;
      } catch (error) {
        self.setIsPostPageLoading(false);
        throw error;
      }
    });
    const ActionPutPage = flow(function* (json: string) {
      self.setIsPutPageLoading(true);
      try {
        const { data } = yield* toGenerator(httpPutPage(json));
        self.setIsPutPageLoading(false);
        return data;
      } catch (error) {
        self.setIsPutPageLoading(false);
        throw error;
      }
    });
    const ActionDeletePage = flow(function* (id: number) {
      self.setIsDeletePageLoading(true);
      try {
        const { data } = yield* toGenerator(httpDeletePage(id));
        self.setIsDeletePageLoading(false);
        return data;
      } catch (error) {
        self.setIsDeletePageLoading(false);
        throw error;
      }
    });
    return {
      testServer,
      ActionGetUser,
      ActionPostLogout,
      ActionGetPages,
      ActionPostPage,
      ActionPutPage,
      ActionDeletePage,
    };
  });

export interface RootStoreType extends Instance<typeof RootStore> {}
export type RootStoreSnapshotInType = SnapshotIn<typeof RootStore>;
export type RootStoreSnapshotOutType = SnapshotOut<typeof RootStore>;
