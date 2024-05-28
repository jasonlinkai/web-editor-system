"use client";
import React from "react";
import {
  AstNodeModel,
  AstNodeModelSnapshotInType,
} from "source/libs/mobx/AstNodeModel";
import RenderNode from "./components/RenderNode";

interface RendererProps {
  ast: AstNodeModelSnapshotInType;
}
const Renderer: React.FC<RendererProps> = ({ ast }) => {
  if (!ast) {
    return <div>no ast node</div>;
  } else {
    const astNode = AstNodeModel.create(ast);
    return <RenderNode ast={astNode} />;
  }
};
export default Renderer;
