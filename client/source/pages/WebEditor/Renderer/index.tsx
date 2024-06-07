"use client";
import styles from "./Renderer.module.scss";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { AstNodeModel, AstNodeModelType } from "source/libs/mobx/AstNodeModel";
import { useStores } from "source/libs/mobx/useMobxStateTreeStores";
import RenderNode from "./components/RenderNode";
import {
  ComponentNodeType,
  ContainerNodeType,
  SelfClosingNodeType,
  TextNodeType,
} from "source/libs/types";
import Icons from "@/editor-components/Icons";
import clsx from "clsx";

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
  const { ast, editor } = selectedPage;
  useStores();
  const {
    selectedAstNode,
    setSelectedAstNode,
    newContainerNode,
    newImageNode,
    newTextNode,
    newCarouselNode,
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
  ) => void = useCallback((ev, node) => {
    ev.stopPropagation();
    ev.dataTransfer.effectAllowed = "move";
    ev.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: "move node",
        data: "",
      })
    );
  }, []);

  const handleOnDragOver: (
    ev: React.DragEvent,
    node: AstNodeModelType
  ) => void = useCallback((ev, node) => {
    ev.preventDefault();
    ev.stopPropagation();
    ev.dataTransfer.dropEffect = "move";
  }, []);

  const handleOnDragLeave: (
    ev: React.DragEvent,
    node: AstNodeModelType
  ) => void = useCallback((ev, node) => {
    ev.preventDefault();
    ev.stopPropagation();
  }, []);

  const handleOnDrop: (ev: React.DragEvent, node: AstNodeModelType) => void =
    useCallback(
      (ev, node) => {
        ev.stopPropagation();
        const jsonData = ev.dataTransfer.getData("application/json");
        const { type, data } = JSON.parse(jsonData);
        let newNode;
        const insertIndex = findInsertIndex(
          ev.target as HTMLElement,
          ev.clientX,
          ev.clientY
        );
        if (type === "move node") {
          // 防止元素把自己移入自己的操作
          if (selectedAstNode && selectedAstNode?.uuid !== node.uuid) {
            newNode = node.moveToChildren(selectedAstNode, insertIndex);
          }
        } else if (type === "add new node") {
          if (data.nodeType === ContainerNodeType.div) {
            newNode = newContainerNode();
          } else if (data.nodeType === TextNodeType.span) {
            newNode = newTextNode();
          } else if (data.nodeType === SelfClosingNodeType.img) {
            newNode = newImageNode();
          } else if (data.nodeType === ComponentNodeType.carousel) {
            newNode = newCarouselNode();
          }
          node.addToChildren(newNode, insertIndex);
        } else if (type === "add new node from snippets") {
          newNode = AstNodeModel.create(data);
          node.addToChildren(newNode, insertIndex);
        }
        if (newNode) {
          setSelectedAstNode(newNode);
          node.setIsDragOvered(false);
          (newNode as AstNodeModelType).setIsSelected(true);
        }
      },
      [
        selectedAstNode,
        newContainerNode,
        newImageNode,
        newTextNode,
        newCarouselNode,
        setSelectedAstNode,
      ]
    );
  return (
    <div id="renderer" className={styles.renderer}>
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
  const editArea = useRef<HTMLDivElement>(null);
  const resizerIndicatorStartXRef = useRef<number>(0);
  const [isResizerIndicatorHolded, setIsResizerIndicatorHolded] =
    useState(false);
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const { editor } = selectedPage;
  useLayoutEffect(() => {
    const resizeHandler = () => {
      if (editArea.current) {
        const nextMaxWidth = editArea.current.clientWidth - 20 - 30;
        editor.editorLayout.setMaxWidth(editArea.current.clientWidth - 20 - 30);
        if (
          Number(editor.editorLayout.width.replace("px", "")) > nextMaxWidth
        ) {
          editor.editorLayout.setWidth(`${nextMaxWidth}px`);
        }
      }
    };
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [editor]);
  return (
    <div
      id="editArea"
      ref={editArea}
      className={styles.rendererWithWrap}
      onResize={() => {
        if (editArea.current) {
          editor.editorLayout.setMaxWidth(
            editArea.current.clientWidth - 20 - 30
          );
        }
      }}
    >
      <div
        id="resizer"
        className={styles.resizer}
        style={{ ...editor.editorLayout }}
      >
        <Renderer />
      </div>
      <div
        draggable={false}
        className={clsx({
          [styles.resizerIndicator]: true,
          [styles.resizerIndicatorHolded]: isResizerIndicatorHolded,
        })}
        onMouseUp={() => {
          setIsResizerIndicatorHolded(false);
        }}
        onMouseDown={(e) => {
          if (editor.selectedAstNode) {
            editor?.setSelectedAstNode(undefined);
          }
          resizerIndicatorStartXRef.current = e.clientX;
          setIsResizerIndicatorHolded(true);
        }}
        onMouseLeave={(e) => {
          setIsResizerIndicatorHolded(false);
        }}
        onMouseMove={(e) => {
          if (isResizerIndicatorHolded) {
            const movemoent = resizerIndicatorStartXRef.current - e.clientX;
            resizerIndicatorStartXRef.current = e.clientX;

            const prevEditorLayoutWidth = editor.editorLayout.width.replace(
              "px",
              ""
            );
            const nextCalculateWidth =
              Number(prevEditorLayoutWidth) - movemoent * 2;

            const nextEditorLayoutWidth =
              nextCalculateWidth > editor.editorLayout.maxWidth
                ? editor.editorLayout.maxWidth
                : nextCalculateWidth;

            editor.editorLayout.setWidth(`${nextEditorLayoutWidth}px`);
          }
        }}
      >
        <Icons.MdDragIndicator></Icons.MdDragIndicator>
      </div>
    </div>
  );
});

export default RendererWithWrap;
