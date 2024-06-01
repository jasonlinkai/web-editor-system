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

export type MetaModelType = Instance<typeof MetaModel>;
export type MetaModelSnapshotInType = SnapshotIn<typeof MetaModel>;
export type MetaModelSnapshotOutType = SnapshotOut<typeof MetaModel>;

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
    onSnapshotDisposerAst: IDisposer | undefined;
    onSnapshotDisposerMeta: IDisposer | undefined;
    canSaveSnapshot: boolean;
    snapshots: {
      ast: AstNodeModelSnapshotOutType;
      meta: MetaModelSnapshotOutType;
    }[];
    snapshotsIndex: number;
  }>(() => ({
    onSnapshotDisposerAst: undefined,
    onSnapshotDisposerMeta: undefined,
    canSaveSnapshot: true,
    snapshots: [],
    snapshotsIndex: 0,
  }))
  .views<{
    canUndo: boolean;
    canRedo: boolean;
  }>((self) => ({
    get canUndo() {
      return self.snapshotsIndex - 1 >= 0;
    },
    get canRedo() {
      return self.snapshotsIndex + 1 <= self.snapshots.length - 1;
    },
  }))
  .actions((self) => {
    const setId = (id: number) => {
      self.id = id;
    };
    const setAst = (ast: AstNodeModelSnapshotInType) => {
      self.ast = AstNodeModel.create(ast);
    };
    const setMetaByKeyValue = ({
      key,
      value,
    }: {
      key: MetaEnum;
      value: string;
    }) => {
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

    const addSnapshot = (snapshot: {
      ast: AstNodeModelSnapshotOutType;
      meta: MetaModelSnapshotOutType;
    }) => {
      if (self.snapshotsIndex !== self.snapshots.length - 1) {
        // 快照位置不在最新，代表有回退過，進入這個方法則代表收到新的異動。
        // 我們捨棄比現在索引位置還新的快照
        self.snapshots = self.snapshots.slice(
          0,
          self.snapshotsIndex + 1
        );
      }
      self.snapshots = [...self.snapshots, snapshot];
      self.snapshotsIndex = self.snapshots.length - 1;
    };

    const undoAst = () => {
      if (self.canUndo) {
        const prev = self.snapshotsIndex - 1;
        self.snapshotsIndex = prev;
        const prevAstSnapshot = self.snapshots[prev];
        self.canSaveSnapshot = false;
        applySnapshot(self.ast, prevAstSnapshot.ast);
        applySnapshot(self.meta, prevAstSnapshot.meta);
      }
    };

    const redoAst = () => {
      if (self.canRedo) {
        const next = self.snapshotsIndex + 1;
        self.snapshotsIndex = next;
        const nextAstSnapshot = self.snapshots[next];
        self.canSaveSnapshot = false;
        applySnapshot(self.ast, nextAstSnapshot.ast);
        applySnapshot(self.meta, nextAstSnapshot.meta);
      }
    };

    return {
      setCanSaveSnapshot,
      addSnapshot,
      undoAst,
      redoAst,
    };
  })
  .actions((self) => {
    // 保存每次ast的異動
    self.onSnapshotDisposerAst = onSnapshot(self.ast, (snapshot) => {
      if (self.canSaveSnapshot) {
        self.addSnapshot({
          ast: snapshot,
          meta: getSnapshot(self.meta),
        });
      } else {
        self.setCanSaveSnapshot(true);
      }
    });
    self.onSnapshotDisposerMeta = onSnapshot(self.meta, (snapshot) => {
      if (self.canSaveSnapshot) {
        self.addSnapshot({
          ast: getSnapshot(self.ast),
          meta: snapshot,
        });
      } else {
        self.setCanSaveSnapshot(true);
      }
    });

    // 當model create時 保存初始化的snapshot
    const afterCreate = () => {
      self.snapshots = [
        {
          ast: getSnapshot(self.ast),
          meta: getSnapshot(self.meta),
        },
      ];
    };

    const beforeDestroy = () => {
      if (self.onSnapshotDisposerAst) {
        self.onSnapshotDisposerAst();
      }
      if (self.onSnapshotDisposerMeta) {
        self.onSnapshotDisposerMeta();
      }
    };
    return { afterCreate, beforeDestroy };
  });

export type PageModelType = Instance<typeof PageModel>;
export type PageModelSnapshotInType = SnapshotIn<typeof PageModel>;
export type PageModelSnapshotOutType = SnapshotOut<typeof PageModel>;
