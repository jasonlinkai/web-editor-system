import { v4 as uuid } from "uuid";
import {
  types as t,
  Instance,
  SnapshotIn,
  SnapshotOut,
  getSnapshot,
  detach,
  flow,
} from "mobx-state-tree";
import { AstNodeModel } from "./AstNodeModel";
import { SnippetAstNodeModel } from "./SnippetAstNodeModel";
import { EditorLayoutModel } from "./EditorLayoutModel";
import { getRandomColor, recursiveClearUuid } from "@/libs/utils";
import { httpGetUploadedImages, httpPostUploadImage, httpPostUploadPage } from "@/libs/http";
import {
  ContainerNodeType,
  SelfClosingNodeType,
  TextNodeType,
} from "@/libs/types";

import type { AstNodeModelSnapshotOutType, AstNodeModelType } from "./AstNodeModel";
import type { SnippetAstNodeModelType } from "./SnippetAstNodeModel";
import type { EditorLayoutModelType } from "./EditorLayoutModel";

export const EditorModel = t
  .model("EditorModel", {
    selectedAstNode: t.maybe(t.safeReference(AstNodeModel)),
    snippets: t.optional(t.array(SnippetAstNodeModel), []),
    editorLayout: t.optional(EditorLayoutModel, {}),
  })
  .volatile<{
    isLeftDrawerOpen: boolean;
    isRightDrawerOpen: boolean;
    isUploadModalVisible: boolean;
    images: Set<string>;
    isFetchImagesLoading: boolean;
    isUploadImageLoading: boolean;
    isImageGalleryModalVisible: boolean;
    isUploadPageLoading: boolean;
  }>(() => ({
    isLeftDrawerOpen: true,
    isRightDrawerOpen: true,
    isUploadModalVisible: false,
    images: new Set([]),
    isFetchImagesLoading: false,
    isUploadImageLoading: false,
    isImageGalleryModalVisible: false,
    isUploadPageLoading: false,
  }))
  .views((self) => {
    return {
      get displayImages() {
        return Array.from(self.images);
      },
    };
  })
  //
  // model mutator
  //
  .actions((self) => ({
    setSelectedAstNode(node: AstNodeModelType | undefined) {
      if (node) {
        if (!self.selectedAstNode) {
          self.selectedAstNode = node;
          node.setStyle(node.props.style);
          if (node.isTextNode) {
            node.setContent(node.content || "");
          }
        } else {
          if (node.uuid !== self.selectedAstNode.uuid) {
            self.selectedAstNode.setIsSelected(false);
            self.selectedAstNode.setStyle({});
            if (node.isTextNode) {
              node.setContent(node.content || "");
            }
            self.selectedAstNode = node;
            node.setStyle(getSnapshot(node.props.style));
          }
        }
      } else {
        if (!self.selectedAstNode) {
          self.selectedAstNode = undefined;
        } else {
          self.selectedAstNode.setIsSelected(false);
          self.selectedAstNode.setStyle({});
          if (self.selectedAstNode.isTextNode) {
            self.selectedAstNode.setContent(self.selectedAstNode.content || "");
          }
          self.selectedAstNode = undefined;
        }
      }
    },
    setEditorLayout(layout: EditorLayoutModelType) {
      self.editorLayout = layout;
    },
    deleteSnippet(snippet: SnippetAstNodeModelType) {
      detach(snippet);
    },
    pushToSnippets(snippet: AstNodeModelType) {
      const snapshot = getSnapshot(snippet);
      const clearedSnapshot = recursiveClearUuid(
        (JSON.parse(JSON.stringify(snapshot)) as AstNodeModelSnapshotOutType),
        undefined
      );
      SnippetAstNodeModel.create(clearedSnapshot);
      self.snippets.push(clearedSnapshot);
    },
  }))
  //
  // volatile setters
  //
  .actions((self) => {
    const setIsLeftDrawerOpen = (open: boolean) => {
      self.isLeftDrawerOpen = open;
    };
    const setIsRightDrawerOpen = (open: boolean) => {
      self.isRightDrawerOpen = open;
    };
    const setIsImageGalleryModalVisible = (v: boolean) => {
      self.isImageGalleryModalVisible = v;
    };
    const setIsUploadImageLoading = (v: boolean) => {
      self.isUploadImageLoading = v;
    };
    const setIsFetchImagesLoading = (v: boolean) => {
      self.isFetchImagesLoading = v;
    };
    const setImages = (images: string[]) => {
      self.images = new Set(images);
    };
    const setIsUploadModalVisible = (visible: boolean) => {
      self.isUploadModalVisible = visible;
    };
    const setIsUploadPageLoading = (v: boolean) => {
      self.isUploadPageLoading = v;
    };
    return {
      setIsLeftDrawerOpen,
      setIsRightDrawerOpen,
      setIsImageGalleryModalVisible,
      setIsUploadImageLoading,
      setIsFetchImagesLoading,
      setImages,
      setIsUploadModalVisible,
      setIsUploadPageLoading,
    };
  })
  //
  // node related methods
  //
  .actions((self) => {
    const deleteNode = (node: AstNodeModelType) => {
      detach(node);
    };
    const newContainerNode = () => {
      return AstNodeModel.create({
        uuid: uuid(),
        parent: undefined,
        type: ContainerNodeType.div,
        props: {
          style: {
            width: "300px",
            height: "300px",
            backgroundColor: getRandomColor(),
          },
        },
      });
    };
    const newImageNode = () => {
      const id = uuid();
      return AstNodeModel.create({
        uuid: id,
        parent: undefined,
        type: SelfClosingNodeType.img,
        props: {
          style: {
            width: "100px",
            height: "100px",
            backgroundColor: getRandomColor(),
          },
          attributes: {
            src: "",
            alt: id,
            crossOrigin: "anonymous",
          },
        },
      });
    };
    const newTextNode = () => {
      return AstNodeModel.create({
        uuid: uuid(),
        parent: undefined,
        type: TextNodeType.span,
        props: {
          style: {
            display: "block",
          },
        },
        content: "please enter text",
      });
    };
    return {
      deleteNode,
      newContainerNode,
      newImageNode,
      newTextNode,
    };
  })
  //
  // async actions
  //
  .actions((self) => {
    const uploadImage = flow(function* (formData: FormData) {
      self.setIsUploadImageLoading(true);
      try {
        const { data: imageUrl } = yield httpPostUploadImage(formData);
        self.images.add(imageUrl);
        self.setIsUploadImageLoading(false);
        return imageUrl;
      } catch (error) {
        console.error("Failed to fetch uploadImage", error);
        self.setIsUploadImageLoading(false);
        return "";
      }
    });
    const fetchImages = flow(function* () {
      self.setIsFetchImagesLoading(true);
      try {
        const { data: images } = yield httpGetUploadedImages();
        self.setImages(images);
        self.setIsFetchImagesLoading(false);
        return self.images;
      } catch (error) {
        console.error("Failed to fetch fetchImages", error);
        self.setIsFetchImagesLoading(false);
        return [];
      }
    });
    const uploadPage = flow(function* (json: string) {
      console.log('json', json);
      self.setIsUploadPageLoading(true);
      try {
        const { data } = yield httpPostUploadPage(json);
        self.setIsUploadPageLoading(false);
        return data;
      } catch (error) {
        console.error("Failed to fetch uploadImage", error);
        self.setIsUploadPageLoading(false);
        return "";
      }
    });
    return { uploadImage, fetchImages, uploadPage };
  })
  //
  // lifecycle callbacks
  //
  .actions((self) => {
    const afterCreate = () => {
      self.fetchImages();
    };
    const beforeAll = () => {
      console.log("self.images", self.images);
    };
    return {
      afterCreate,
      beforeAll,
    };
  });

export type EditorModelType = Instance<typeof EditorModel>;
export type EditorModelSnapshotInType = SnapshotIn<typeof EditorModel>;
export type EditorModelSnapshotOutType = SnapshotOut<typeof EditorModel>;
