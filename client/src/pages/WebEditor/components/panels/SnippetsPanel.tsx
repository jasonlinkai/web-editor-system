import styles from "./Panel.module.scss";
import { observer } from "mobx-react-lite";
import ActionButton from "../ActionButton";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { FaArrowUp, FaArrowDown, FaRegEye, FaTrash } from "react-icons/fa";
import { useStores } from "@/libs/mobx/useMobxStateTreeStores";
import Dailog, { DialogRefType } from "@/shared-components/Dialog";
import RenderNode from "../../Renderer/components/RenderNode";
import { recursiveClearUuid } from "@/libs/utils";

const SnippetsPanel = observer(() => {
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const { editor } = selectedPage;
  const { snippets, deleteSnippet } = editor;
  const dialogRef = useRef<DialogRefType>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [snippetIndex, setSnippetIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isDialogVisible) {
      dialogRef.current?.openDialog();
    } else {
      dialogRef.current?.closeDialog();
    }
  }, [isDialogVisible]);
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>Snippets</div>
        <ActionButton
          className={styles.panelHeaderToggleButton}
          IconComponent={isOpen ? FaArrowUp : FaArrowDown}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        ></ActionButton>
      </div>
      <div
        className={clsx([
          styles.panelArea,
          {
            [styles.panelAreaClose]: !isOpen,
          },
        ])}
      >
        <div className={styles.panelItem}>
          <div className={styles.panelItemColumnCenterArea}>
            {snippets.map((snippet, i) => {
              return (
                <div
                  key={snippet.alias}
                  className={styles.panelItemActionRowBoxWithToolsWrap}
                >
                  <div className={styles.panelItemActionRowBoxToolsArea}>
                    <FaRegEye
                      className={
                        styles.panelItemActionRowBoxToolsAreaToolButton
                      }
                      onClick={() => {
                        setSnippetIndex(i);
                        setIsDialogVisible(true);
                      }}
                    ></FaRegEye>
                    <FaTrash
                      className={
                        styles.panelItemActionRowBoxToolsAreaToolButton
                      }
                      onClick={() => {
                        deleteSnippet(snippet);
                      }}
                    ></FaTrash>
                  </div>
                  <div
                    className={styles.panelItemActionRowBox}
                    draggable
                    style={{
                      cursor: "grab",
                    }}
                    onDragStart={(ev) => {
                      ev.dataTransfer.effectAllowed = "move";
                      ev.dataTransfer.setData(
                        "application/json",
                        JSON.stringify({
                          type: "add new node from snippets",
                          data: recursiveClearUuid(
                            JSON.parse(JSON.stringify(snippet))
                          ),
                        })
                      );
                    }}
                  >
                    {snippet.alias}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Dailog
        ref={dialogRef}
        onClose={() => {
          setSnippetIndex(null);
          setIsDialogVisible(false);
        }}
      >
        {snippetIndex !== null && snippets[snippetIndex] && (
          <RenderNode ast={snippets[snippetIndex]}></RenderNode>
        )}
      </Dailog>
    </div>
  );
});

export default SnippetsPanel;
