import { types as t, Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree";
import { AstNodeModel } from "./AstNodeModel";

export const SnippetEnhencedModel = t
  .model("SnippetEnhencedModel", {
    alias: t.optional(t.string, ""),
  })
  .actions((self) => {
    const setAlias = (alias: string) => {
      self.alias = alias;
    };
    return { setAlias };
  });
export type SnippetEnhencedModelType = Instance<typeof SnippetEnhencedModel>;
export type SnippetEnhencedModelSnapshotInType = SnapshotIn<
  typeof SnippetEnhencedModel
>;
export type SnippetEnhencedModelSnapshotOutType = SnapshotOut<
  typeof SnippetEnhencedModel
>;

export const SnippetAstNodeModel = t
  .compose(AstNodeModel, SnippetEnhencedModel)
  .actions((self) => {
    const afterCreate = () => {
      if (!self.alias) {
        self.alias = self.uuid;
      }
    };
    return {
      afterCreate,
    };
  });
export type SnippetAstNodeModelType = Instance<typeof SnippetAstNodeModel>;
export type SnippetAstNodeModelSnapshotInType = SnapshotIn<
  typeof SnippetAstNodeModel
>;
export type SnippetAstNodeModelSnapshotOutType = SnapshotOut<
  typeof SnippetAstNodeModel
>;
