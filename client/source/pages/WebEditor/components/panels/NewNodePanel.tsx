"use client";
import styles from "./Panel.module.scss";
import { observer } from "mobx-react-lite";
import ActionButton from "../ActionButton";
import { useState } from "react";
import clsx from "clsx";
import { FaArrowUp, FaArrowDown, FaImage, FaUpload } from "react-icons/fa";
import { LuContainer } from "react-icons/lu";
import { GoTypography } from "react-icons/go";
import {
  ComponentNodeType,
  ContainerNodeType,
  SelfClosingNodeType,
  TextNodeType,
} from "source/libs/types";
import { useStores } from "source/libs/mobx/useMobxStateTreeStores";
import Icons from "@/shared-components/Icons";

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
                cursor: "grab",
              }}
              onDragStart={(ev) => {
                ev.dataTransfer.effectAllowed = "move";
                ev.dataTransfer.setData(
                  "application/json",
                  JSON.stringify({
                    type: "add new node",
                    data: {
                      nodeType: ContainerNodeType.div,
                    },
                  })
                );
              }}
            >
              <LuContainer />
              Container
            </div>
            <div className={styles.panelItemActionRowBoxWithToolsWrap}>
              <div className={styles.panelItemActionRowBoxToolsArea}>
                <FaUpload
                  className={styles.panelItemActionRowBoxToolsAreaToolButton}
                  onClick={() => {
                    editor.setIsUploadModalVisible(true);
                  }}
                ></FaUpload>
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
                      type: "add new node",
                      data: {
                        nodeType: SelfClosingNodeType.img,
                      },
                    })
                  );
                }}
              >
                <FaImage />
                Image
              </div>
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
                    type: "add new node",
                    data: {
                      nodeType: TextNodeType.span,
                    },
                  })
                );
              }}
            >
              <GoTypography />
              Text
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
                    type: "add new node",
                    data: {
                      nodeType: ComponentNodeType.carousel,
                    },
                  })
                );
              }}
            >
              <Icons.MdOutlineViewCarousel />
              Carousel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default NewNodePanel;
