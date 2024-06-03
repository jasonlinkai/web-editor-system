"use client";
import styles from "./ActionBar.module.scss";
import { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaHome,
  FaTrash,
} from "react-icons/fa";
import {
  MdSnippetFolder,
  MdOutlinePublish,
  MdOutlinePreview,
} from "react-icons/md";
import { ImRedo, ImUndo } from "react-icons/im";
import Button from "@mui/material/Button";
import { useStores } from "source/libs/mobx/useMobxStateTreeStores";
import { useRouter } from "next/navigation";
import { getSnapshot } from "mobx-state-tree";
import Snackbar from "source/shared-components/SnackBar";
import ToolTip from "@/shared-components/ToolTip";

export const actionBarHeight = 40;

const ActionBar: React.FC = observer(() => {
  const [
    publishPageSuccessSnackbarVisible,
    setPublishPageSuccessSnackbarVisible,
  ] = useState(false);
  const [publishPageFailSnackbarVisible, setPublishPageFailSnackbarVisible] =
    useState(false);
  const router = useRouter();
  const {
    currentUser,
    selectedPage,
    setSelectedPage,
    isPutPageLoading,
    ActionPutPage,
  } = useStores();
  if (!selectedPage) return null;
  const { canUndo, canRedo, undoAst, redoAst, editor } = selectedPage;
  const {
    isLeftDrawerOpen,
    setIsLeftDrawerOpen,
    isRightDrawerOpen,
    setIsRightDrawerOpen,
    selectedAstNode,
    pushToSnippets,
  } = editor;

  const onShortCutDelete = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Backspace") {
        if (selectedAstNode?.isSelfCanBeDeleted) {
          selectedAstNode.parent.deletChild(selectedAstNode);
        }
      }
    },
    [selectedAstNode]
  );

  const onShortCutUndo = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "z") {
        undoAst();
      }
    },
    [undoAst]
  );

  const onShortCutRedo = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "r") {
        redoAst();
      }
    },
    [redoAst]
  );

  const onShortCutAddToSnippets = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "f") {
        if (selectedAstNode) {
          pushToSnippets(selectedAstNode);
        }
      }
    },
    [pushToSnippets, selectedAstNode]
  );

  useEffect(() => {
    window.addEventListener("keyup", onShortCutDelete);
    window.addEventListener("keyup", onShortCutUndo);
    window.addEventListener("keyup", onShortCutRedo);
    window.addEventListener("keyup", onShortCutAddToSnippets);
    return () => {
      window.removeEventListener("keyup", onShortCutDelete);
      window.removeEventListener("keyup", onShortCutUndo);
      window.removeEventListener("keyup", onShortCutRedo);
      window.removeEventListener("keyup", onShortCutAddToSnippets);
    };
  }, [
    onShortCutDelete,
    onShortCutUndo,
    onShortCutRedo,
    onShortCutAddToSnippets,
  ]);

  return (
    <div
      className={styles.actionBar}
      style={{ height: `${actionBarHeight}px` }}
    >
      <div className={styles.actionBarLeftArea}>
        <ToolTip title="Home">
          <Button
            size="medium"
            onClick={() => {
              router.replace("/backend/protected/home");
              setSelectedPage(undefined);
            }}
          >
            <FaHome />
          </Button>
        </ToolTip>
        <ToolTip title="toggle left drawer">
          <Button
            size="medium"
            onClick={() => {
              setIsLeftDrawerOpen(!isLeftDrawerOpen);
            }}
          >
            {isLeftDrawerOpen ? (
              <FaAngleDoubleLeft />
            ) : (
              <FaAngleDoubleRight
                onClick={() => {
                  setIsLeftDrawerOpen(!isLeftDrawerOpen);
                }}
              />
            )}
          </Button>
        </ToolTip>
        <ToolTip title="undo(ctrl + z)">
          <Button
            size="medium"
            disabled={!canUndo}
            onClick={canUndo ? undoAst : undefined}
          >
            <ImUndo></ImUndo>
          </Button>
        </ToolTip>
        <ToolTip title="redo(ctrl + r)">
          <Button
            size="medium"
            disabled={!canRedo}
            onClick={canRedo ? redoAst : undefined}
          >
            <ImRedo></ImRedo>
          </Button>
        </ToolTip>
        <ToolTip title="add to snippets(ctrl + f)">
          <Button
            size="medium"
            disabled={!selectedAstNode}
            onClick={() => {
              if (selectedAstNode) {
                pushToSnippets(selectedAstNode);
              }
            }}
          >
            <MdSnippetFolder></MdSnippetFolder>
          </Button>
        </ToolTip>
        <ToolTip title="delete node(ctrl + backspace)">
          <Button
            size="medium"
            disabled={!selectedAstNode?.isSelfCanBeDeleted}
            onClick={
              selectedAstNode?.isSelfCanBeDeleted
                ? () => {
                    selectedAstNode.parent.deletChild(selectedAstNode);
                  }
                : undefined
            }
          >
            <FaTrash></FaTrash>
          </Button>
        </ToolTip>
      </div>
      <div className={styles.actionBarRightArea}>
        <a href={`/web/${currentUser?.uuid}/${selectedPage.uuid}`}>
          <ToolTip title="preview">
            <Button size="medium">
              <MdOutlinePreview />
            </Button>
          </ToolTip>
        </a>
        <ToolTip title="publish">
          <Button
            size="medium"
            disabled={isPutPageLoading}
            onClick={async () => {
              try {
                await ActionPutPage(JSON.stringify(getSnapshot(selectedPage)));
                setPublishPageSuccessSnackbarVisible(true);
              } catch (e) {
                setPublishPageFailSnackbarVisible(true);
              }
            }}
          >
            <MdOutlinePublish />
          </Button>
        </ToolTip>
        <ToolTip title="toggle right drawer">
          <Button
            size="medium"
            onClick={() => {
              setIsRightDrawerOpen(!isRightDrawerOpen);
            }}
          >
            {isRightDrawerOpen ? (
              <FaAngleDoubleRight />
            ) : (
              <FaAngleDoubleLeft
                onClick={() => {
                  setIsRightDrawerOpen(!isRightDrawerOpen);
                }}
              />
            )}
          </Button>
        </ToolTip>
      </div>
      <Snackbar
        open={publishPageSuccessSnackbarVisible}
        serverity="success"
        message="Publish page successed!"
        onClose={() => {
          setPublishPageSuccessSnackbarVisible(false);
        }}
      />
      <Snackbar
        open={publishPageFailSnackbarVisible}
        serverity="error"
        message="Publish page failed!"
        onClose={() => {
          setPublishPageFailSnackbarVisible(false);
        }}
      />
    </div>
  );
});

export default ActionBar;
