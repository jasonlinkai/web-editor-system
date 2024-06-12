"use client";
import styles from "./Renderer.module.scss";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ReactDom from "react-dom";
import { observer } from "mobx-react-lite";
import { AstNodeModel, AstNodeModelType } from "source/libs/mobx/AstNodeModel";
import { useStores } from "source/libs/mobx/useMobxStateTreeStores";
import RenderNode from "./components/RenderNode";
import {
  ContainerNodeType,
  SelfClosingNodeType,
  TextNodeType,
} from "source/libs/types";
import Icons from "@/editor-components/Icons";
import clsx from "clsx";

enum IframePostMessageEventType {
  "TRIGGER_SHORTCUT_DELETE_SELECTED_NODE" = "TRIGGER_SHORTCUT_DELETE_SELECTED_NODE",
  "TRIGGER_SHORTCUT_UNDO" = "TRIGGER_SHORTCUT_UNDO",
  "TRIGGER_SHORTCUT_REDO" = "TRIGGER_SHORTCUT_REDO",
  "TRIGGER_SHORTCUT_ADD_TO_SNIPPETS" = "TRIGGER_SHORTCUT_ADD_TO_SNIPPETS",
}

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
    ev.dataTransfer.setDragImage(ev.target as Element, 0, 0);
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
            newNode = node.moveToChildren(
              selectedAstNode,
              insertIndex
            ) as AstNodeModelType;
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
        setSelectedAstNode,
      ]
    );
  return (
    <div className={styles.resizer}>
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
    </div>
  );
});

const RendererInFrame = () => {
  const doc = (document.getElementById("editorArea") as HTMLIFrameElement)
    ?.contentWindow?.document;
  if (doc) {
    const anchor = doc.body;
    if (anchor) {
      return ReactDom.createPortal(<Renderer />, anchor);
    }
  }
  return null;
};

const RendererAnchor = observer(() => {
  const wrapperRef = useRef<HTMLIFrameElement>(null);
  const ref = useRef<HTMLIFrameElement | null>(null);
  const resizerIndicatorStartXRef = useRef<number>(0);
  const [isResizerIndicatorHolded, setIsResizerIndicatorHolded] =
    useState(false);
  const [updated, setUpdated] = useState(Date.now());
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const { undoAst, redoAst, editor } = selectedPage;
  const { selectedAstNode, pushToSnippets } = editor;

  const onShortCutDeleteHandler = useCallback(() => {
    if (selectedAstNode?.isSelfCanBeDeleted) {
      selectedAstNode.parent.deletChild(selectedAstNode);
    }
  }, [selectedAstNode]);

  const onShortCutUndoHandler = useCallback(() => {
    undoAst();
  }, [undoAst]);

  const onShortCutRedoHandler = useCallback(() => {
    redoAst();
  }, [redoAst]);

  const onShortCutAddToSnippetsHandler = useCallback(() => {
    if (selectedAstNode) {
      pushToSnippets(selectedAstNode);
    }
  }, [selectedAstNode, pushToSnippets]);

  useEffect(() => {
    if (ref.current) {
      const handleShortCutFromIframe = (
        ev: MessageEvent<{ type: IframePostMessageEventType }>
      ) => {
        switch (ev.data.type) {
          case IframePostMessageEventType.TRIGGER_SHORTCUT_DELETE_SELECTED_NODE:
            onShortCutDeleteHandler();
            return;
          case IframePostMessageEventType.TRIGGER_SHORTCUT_UNDO:
            onShortCutUndoHandler();
            return;
          case IframePostMessageEventType.TRIGGER_SHORTCUT_REDO:
            onShortCutRedoHandler();
            return;
          case IframePostMessageEventType.TRIGGER_SHORTCUT_ADD_TO_SNIPPETS:
            onShortCutAddToSnippetsHandler();
            return;
          default:
            break;
        }
      };
      window.addEventListener("message", handleShortCutFromIframe);

      const normalizeCssLink = document.createElement("link");
      normalizeCssLink.href = "/normalize.css";
      normalizeCssLink.rel = "stylesheet";
      normalizeCssLink.type = "text/css";
      ref.current?.contentDocument?.head.appendChild(normalizeCssLink);
      const resetCssLink = document.createElement("link");
      resetCssLink.href = "/reset.css";
      resetCssLink.rel = "stylesheet";
      resetCssLink.type = "text/css";
      ref.current?.contentDocument?.head.appendChild(resetCssLink);
      // 這邊不讓動畫跑在編輯器上，會有位置跑掉的問題
      // const animateCssLink = document.createElement("link");
      // animateCssLink.href = "/animate.min.css";
      // animateCssLink.rel = "stylesheet";
      // animateCssLink.type = "text/css";
      // ref.current?.contentDocument?.head.appendChild(animateCssLink);
      const shortcutScript = document.createElement("script");
      shortcutScript.type = "text/javascript";
      shortcutScript.innerHTML = `
        window.addEventListener("keyup", function(e) {
          if (e.ctrlKey && e.key === "Backspace") {
            window.parent.postMessage(
              {
                type: "${IframePostMessageEventType.TRIGGER_SHORTCUT_DELETE_SELECTED_NODE}",
              },
              "*"
            );
          }
        });
        window.addEventListener("keyup", function(e) {
          if (e.ctrlKey && e.key === "z") {
            window.parent.postMessage(
              {
                type: "${IframePostMessageEventType.TRIGGER_SHORTCUT_UNDO}",
              },
              "*"
            );
          }
        });
        window.addEventListener("keyup", function(e) {
          if (e.ctrlKey && e.key === "r") {
            window.parent.postMessage(
              {
                type: "${IframePostMessageEventType.TRIGGER_SHORTCUT_REDO}",
              },
              "*"
            );
          }
        });
        window.addEventListener("keyup", function(e) {
          if (e.ctrlKey && e.key === "f") {
            window.parent.postMessage(
              {
                type: "${IframePostMessageEventType.TRIGGER_SHORTCUT_ADD_TO_SNIPPETS}",
              },
              "*"
            );
          }
        });
      `;
      ref.current?.contentDocument?.head.appendChild(shortcutScript);
      return () => {
        window.removeEventListener("message", handleShortCutFromIframe);
      };
    }
  }, [
    onShortCutDeleteHandler,
    onShortCutUndoHandler,
    onShortCutRedoHandler,
    onShortCutAddToSnippetsHandler,
  ]);

  useEffect(() => {
    if (ref.current) {
      const styleId = "insert-style";
      const styleContent = `
        html {
          width: ${editor.editorLayout.width};
          height: 100%;
        }
        body {
          width: ${editor.editorLayout.width};
          height: 100%;
        };
      `;
      const oldStyleTag =
        ref.current?.contentWindow?.document.getElementById(styleId);
      if (oldStyleTag) {
        oldStyleTag.textContent = styleContent;
      } else {
        const newStyleTag = document.createElement("style");
        newStyleTag.id = styleId;
        newStyleTag.textContent = styleContent;
        ref.current?.contentDocument?.head.appendChild(newStyleTag);
      }
    }
  }, [editor.editorLayout.width]);

  const resizeHandler = useCallback(() => {
    if (wrapperRef.current) {
      //
      // 獲取編輯區視口最大寬度
      //
      const wrapperMax = wrapperRef.current.clientWidth - 20 - 30;
      editor.editorLayout.setMaxWidth(wrapperMax);

      //
      // 假如當前編輯區大小大於最大寬度，則將之設置為最大寬度
      //
      if (Number(editor.editorLayout.width.replace("px", "")) > wrapperMax) {
        editor.editorLayout.setWidth(`${wrapperMax}px`);
      }
    }
  }, [editor]);

  useLayoutEffect(() => {
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [resizeHandler]);

  return (
    <div ref={wrapperRef} className={styles.rendererWithWrap}>
      <iframe
        ref={(r) => {
          ref.current = r;
          setUpdated(Date.now());
        }}
        id="editorArea"
        title="editorArea"
        width={editor.editorLayout.width}
        height="100%"
      />
      {ref.current && <RendererInFrame />}
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
            const nextWidth = Number(prevEditorLayoutWidth) - movemoent * 2;
            if (nextWidth > editor.editorLayout.maxWidth) {
              editor.editorLayout.setWidth(`${editor.editorLayout.maxWidth}px`);
            } else {
              editor.editorLayout.setWidth(`${nextWidth}px`);
            }
          }
        }}
      >
        <Icons.MdDragIndicator></Icons.MdDragIndicator>
      </div>
    </div>
  );
});

export default RendererAnchor;
