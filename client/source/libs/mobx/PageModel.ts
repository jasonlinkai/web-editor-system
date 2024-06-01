import {
  types as t,
  Instance,
  getSnapshot,
  applySnapshot,
  onSnapshot,
  IDisposer,
  SnapshotIn,
  SnapshotOut,
} from "mobx-state-tree";
import {
  AstNodeModel,
  AstNodeModelSnapshotInType,
  AstNodeModelSnapshotOutType,
} from "./AstNodeModel";
import { EditorModel } from "./EditorModel";
import { MetaEnum } from "../types";

export const MetaModel = t.model("MetaModel", {
  description: t.optional(t.string, ""),
  keywords: t.optional(t.string, ""),
  author: t.optional(t.string, ""),
  theme: t.optional(t.string, ""),
  ogTitle: t.optional(t.string, ""),
  ogType: t.optional(t.string, ""),
  ogImage: t.optional(t.string, ""),
  ogUrl: t.optional(t.string, ""),
  ogDescription: t.optional(t.string, ""),
  twitterCard: t.optional(t.string, ""),
  twitterTitle: t.optional(t.string, ""),
  twitterDescription: t.optional(t.string, ""),
  twitterImage: t.optional(t.string, ""),
  canonical: t.optional(t.string, ""),
});

export const PageModel = t
  .model("PageModel", {
    id: t.maybeNull(t.number),
    uuid: t.identifier,
    title: t.string,
    ast: AstNodeModel,
    meta: t.optional(MetaModel, {}),
    //
    editor: t.optional(EditorModel, {}),
  })
  .volatile<{
    onSnapshotDisposer: IDisposer | undefined;
    canSaveSnapshot: boolean;
    astSnapshots: AstNodeModelSnapshotOutType[];
    astSnapshotsIndex: number;
  }>(() => ({
    onSnapshotDisposer: undefined,
    canSaveSnapshot: true,
    astSnapshots: [],
    astSnapshotsIndex: 0,
  }))
  .views<{
    canUndo: boolean;
    canRedo: boolean;
  }>((self) => ({
    get canUndo() {
      return self.astSnapshotsIndex - 1 >= 0;
    },
    get canRedo() {
      return self.astSnapshotsIndex + 1 <= self.astSnapshots.length - 1;
    },
  }))
  .actions((self) => {
    const setId = (id: number) => {
      self.id = id;
    };
    const setAst = (ast: AstNodeModelSnapshotInType) => {
      self.ast = AstNodeModel.create(ast);
    };
    const setMetaByKeyValue = ({ key, value }: { key: MetaEnum; value: string }) => {
      self.meta = {
        ...self.meta,
        [key]: value,
      };
    };
    return {
      setId,
      setAst,
      setMetaByKeyValue,
    };
  })
  .actions((self) => {
    const setCanSaveSnapshot = (v: boolean) => {
      self.canSaveSnapshot = v;
    };

    const addAstSnapshot = (astSnapshot: AstNodeModelSnapshotOutType) => {
      if (self.astSnapshotsIndex !== self.astSnapshots.length - 1) {
        // 快照位置不在最新，代表有回退過，進入這個方法則代表收到新的異動。
        // 我們捨棄比現在索引位置還新的快照
        self.astSnapshots = self.astSnapshots.slice(
          0,
          self.astSnapshotsIndex + 1
        );
      }
      self.astSnapshots = [...self.astSnapshots, astSnapshot];
      self.astSnapshotsIndex = self.astSnapshots.length - 1;
    };

    const undoAst = () => {
      if (self.canUndo) {
        const prev = self.astSnapshotsIndex - 1;
        self.astSnapshotsIndex = prev;
        const prevAstSnapshot = self.astSnapshots[prev];
        self.canSaveSnapshot = false;
        applySnapshot(self.ast, prevAstSnapshot);
      }
    };

    const redoAst = () => {
      if (self.canRedo) {
        const next = self.astSnapshotsIndex + 1;
        self.astSnapshotsIndex = next;
        const nextAstSnapshot = self.astSnapshots[next];
        self.canSaveSnapshot = false;
        applySnapshot(self.ast, nextAstSnapshot);
      }
    };

    return {
      setCanSaveSnapshot,
      addAstSnapshot,
      undoAst,
      redoAst,
    };
  })
  .actions((self) => {
    // 保存每次ast的異動
    self.onSnapshotDisposer = onSnapshot(self.ast, (snapshot) => {
      if (self.canSaveSnapshot) {
        self.addAstSnapshot(snapshot);
      } else {
        self.setCanSaveSnapshot(true);
      }
    });

    // 當model create時 保存初始化的snapshot
    const afterCreate = () => {
      self.astSnapshots = [getSnapshot(self.ast)];
    };

    const beforeDestroy = () => {
      if (self.onSnapshotDisposer) {
        self.onSnapshotDisposer();
      }
    };
    return { afterCreate, beforeDestroy };
  });

export type PageModelType = Instance<typeof PageModel>;
export type PageModelSnapshotInType = SnapshotIn<typeof PageModel>;
export type PageModelSnapshotOutType = SnapshotOut<typeof PageModel>;
