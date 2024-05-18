import { types as t, Instance, detach, getSnapshot } from "mobx-state-tree";
import { PageModel, PageModelType } from "./PageModel";
import { v4 as uuid } from "uuid";
import { recursiveClearUuid } from "../utils";

export const RootStore = t
  .model("RootStore", {
    templates: t.optional(t.array(PageModel), []),
    pages: t.optional(t.array(PageModel), []),
    selectedPage: t.maybe(t.safeReference(PageModel)),
  })
  .volatile((self) => ({
    isTemplateGalleryModalVisible: false,
  }))
  //
  // model mutators
  //
  .actions((self) => {
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
  });

export interface IStore extends Instance<typeof RootStore> {}
