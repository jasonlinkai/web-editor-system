import styles from "./Renderer.module.scss";
import React, { useCallback } from "react";
import { observer } from "mobx-react-lite";
import { AstNodeModel, AstNodeModelType } from "@/libs/mobx/AstNodeModel";
import { useStores } from "@/libs/mobx/useMobxStateTreeStores";
import RenderNode from "./components/RenderNode";
import { ContainerNodeType, SelfClosingNodeType, TextNodeType } from "@/libs/types";

const findInsertIndex = (
  container: HTMLElement,
  dragX: number,
  dragY: number
) => {
  const children = Array.from(container.children);
  let newIndex = children.length - 1;
  for (let i = 0; i < children.length; i++) {
    const childRect = children[i].getBoundingClientRect();
    // 判斷鼠標位置是否在子元素的左側
    if (
      dragX < childRect.left + childRect.width / 2 &&
      dragY < childRect.top + childRect.height / 2
    ) {
      newIndex = i;
      break;
    }
    newIndex = i + 1;
  }
  return newIndex;
};

const Renderer: React.FC = observer(() => {
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const { ast, editor } = selectedPage;useStores();
  const {
    selectedAstNode,
    setSelectedAstNode,
    newContainerNode,
    newImageNode,
    newTextNode,
  } = editor;

  const handleOnClick: (ev: React.MouseEvent, node: AstNodeModelType) => void =
    useCallback(
      (e, node) => {
        e.stopPropagation();
        setSelectedAstNode(node);
      },
      [setSelectedAstNode]
    );

  const handleOnDragStart: (
    ev: React.DragEvent,
    node: AstNodeModelType
  ) => void = useCallback(
    (ev, node) => {
      ev.stopPropagation();
      ev.dataTransfer.effectAllowed = "move";
      ev.dataTransfer.setData(
        "application/json",
        JSON.stringify({
          type: "move node",
          data: "",
        })
      );
    },
    []
  );

  const handleOnDragOver: (
    ev: React.DragEvent,
    node: AstNodeModelType
  ) => void = useCallback((ev, node) => {
    ev.preventDefault();
    ev.stopPropagation();
    ev.dataTransfer.dropEffect = "move";
    node.setIsDragOvered(true);
  }, []);

  const handleOnDragLeave: (
    ev: React.DragEvent,
    node: AstNodeModelType
  ) => void = useCallback((ev, node) => {
    ev.preventDefault();
    ev.stopPropagation();
    node.setIsDragOvered(false);
  }, []);

  const handleOnDrop: (ev: React.DragEvent, node: AstNodeModelType) => void =
    useCallback(
      (ev, node) => {
        ev.stopPropagation();
        // 防止元素把自己移入自己的操作
        const jsonData = ev.dataTransfer.getData("application/json");
        const { type, data } = JSON.parse(jsonData);
        let newNode;
        const insertIndex = findInsertIndex(
          ev.target as HTMLElement,
          ev.clientX,
          ev.clientY
        );
        if (type === "move node") {
          if (selectedAstNode && selectedAstNode?.uuid === node.uuid) {
            newNode = node.moveToChildren(selectedAstNode, insertIndex);
          }
        } else if (type === "add new node") {
          if (data.nodeType === ContainerNodeType.div) {
            newNode = newContainerNode();
          } else if (data.nodeType === TextNodeType.span) {
            newNode = newTextNode();
          } else if (data.nodeType === SelfClosingNodeType.img) {
            newNode = newImageNode();
          }
          node.addToChildren(newNode, insertIndex);
        } else if (type === "add new node from snippets") {
          newNode = AstNodeModel.create(data);
          node.addToChildren(newNode, insertIndex);
        }
        setSelectedAstNode(newNode);
        (newNode as AstNodeModelType).setIsSelected(true);
      },
      [
        selectedAstNode,
        newContainerNode,
        newImageNode,
        newTextNode,
        setSelectedAstNode,
      ]
    );
  return (
    <div className={styles.renderer}>
      <RenderNode
        ast={ast}
        isEditMode={true}
        handleOnClick={handleOnClick}
        handleOnDragStart={handleOnDragStart}
        handleOnDragOver={handleOnDragOver}
        handleOnDragLeave={handleOnDragLeave}
        handleOnDrop={handleOnDrop}
      />
    </div>
  );
});

const RendererWithWrap = observer(() => {
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const { editor } = selectedPage;
  return <div className={styles.rendererWithWrap}>
    <div className={styles.resizer} style={{...editor.editorLayout}}>
      <Renderer />
    </div>
  </div>;
});

export default RendererWithWrap;
