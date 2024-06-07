import { types as t, Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree";

export const EditorLayoutModel = t
  .model({
    maxWidth: t.optional(t.number, 1440),
    width: t.optional(t.string, "768px"),
  })
  .actions((self) => {
    const setMaxWidth = (maxWidth: number) => {
      self.maxWidth = maxWidth;
    };
    const setWidth = (width: string) => {
      self.width = width;
    };
    return {
      setMaxWidth,
      setWidth,
    };
  });
export type EditorLayoutModelType = Instance<typeof EditorLayoutModel>;
export type EditorLayoutModelSnapshotInType = SnapshotIn<
  typeof EditorLayoutModel
>;
export type EditorLayoutModelSnapshotOutType = SnapshotOut<
  typeof EditorLayoutModel
>;
