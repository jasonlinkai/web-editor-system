import {
  types as t,
  Instance,
  SnapshotIn,
  SnapshotOut,
} from "mobx-state-tree";

export const EditorLayoutModel = t.model({
  width: t.optional(t.string, "100%"),
});
export type EditorLayoutModelType = Instance<typeof EditorLayoutModel>;
export type EditorLayoutModelSnapshotInType = SnapshotIn<
  typeof EditorLayoutModel
>;
export type EditorLayoutModelSnapshotOutType = SnapshotOut<
  typeof EditorLayoutModel
>;
