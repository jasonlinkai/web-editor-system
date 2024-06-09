"use client";
import { observer } from "mobx-react-lite";
import React from "react";
import { AstNodeModelType } from "source/libs/mobx/AstNodeModel";

interface RenderNodeProps {
  ast: AstNodeModelType;
}

const RenderNode: React.FC<RenderNodeProps> = observer(({ ast }) => {
  if (!ast) return null;
  const node = ast;
  const { type, props, children } = node;
  let renderChildren;
  if (node.isContainerNode) {
    renderChildren = Array.isArray(children) ? children : [children];
    renderChildren = renderChildren.map((child) => {
      return <RenderNode key={child.uuid} ast={child} />;
    });
  } else if (node.isTextNode) {
    renderChildren = node.content;
  } else if (node.isSelfClosingNode) {
    renderChildren = undefined;
  }

  return React.createElement(
    type,
    {
      ...props.attributes,
      style: props.style,
      className: props.className,
    },
    renderChildren
  );
});
export default RenderNode;
