import styles from "./Panel.module.scss";
import { observer } from "mobx-react-lite";
import ActionButton from "../ActionButton";
import { useState } from "react";
import clsx from "clsx";
import { FaArrowUp, FaArrowDown, FaImage } from "react-icons/fa";
import { LuContainer } from "react-icons/lu";
import { GoTypography } from "react-icons/go";
import { ContainerNodeType, SelfClosingNodeType, TextNodeType } from "@/libs/types";
import { useStores } from "@/libs/mobx/useMobxStateTreeStores";

const NewNodePanel = observer(() => {
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const { editor } = selectedPage;
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>NewNode</div>
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
            <div
              className={styles.panelItemActionRowBox}
              draggable
              style={{ 
                cursor: 'grab',
              }}
              onDragStart={(ev) => {
                ev.dataTransfer.effectAllowed = "move";
                ev.dataTransfer.setData("application/json", JSON.stringify({
                  type: 'add new node',
                  data: {
                    nodeType: ContainerNodeType.div,
                  },
                }));
              }}
            >
              <LuContainer />
              Container
            </div>
            <div
              className={styles.panelItemActionRowBox}
              draggable
              style={{ 
                cursor: 'grab',
              }}
              onClick={() => {
                editor.setIsUploadModalVisible(true);
              }}
              onDragStart={(ev) => {
                ev.dataTransfer.effectAllowed = "move";
                ev.dataTransfer.setData("application/json", JSON.stringify({
                  type: 'add new node',
                  data: {
                    nodeType: SelfClosingNodeType.img,
                  },
                }));
              }}
            >
              <FaImage />
              Image
            </div>
            <div
              className={styles.panelItemActionRowBox}
              draggable
              style={{ 
                cursor: 'grab',
              }}
              onDragStart={(ev) => {
                ev.dataTransfer.effectAllowed = "move";
                ev.dataTransfer.setData("application/json", JSON.stringify({
                  type: 'add new node',
                  data: {
                    nodeType: TextNodeType.span,
                  },
                }));
              }}
            >
              <GoTypography />
              Text
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default NewNodePanel;
