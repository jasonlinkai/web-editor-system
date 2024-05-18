import styles from "./Panel.module.scss";
import { observer } from "mobx-react-lite";
import {
  LuAlignHorizontalJustifyStart,
  LuAlignHorizontalJustifyCenter,
  LuAlignHorizontalJustifyEnd,
  LuAlignHorizontalSpaceBetween,
  LuAlignHorizontalSpaceAround,
} from "react-icons/lu";
import Select from "@/shared-components/Select";
import { useStores } from "@/libs/mobx/useMobxStateTreeStores";
import { StyleEnum } from "@/libs/types";
import ActionButton from "../ActionButton";
import options from "@/shared-components/Select/options";
import { useState } from "react";
import clsx from "clsx";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Input from "@/shared-components/Input";

const ArrangementPanel = observer(() => {
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const { editor } = selectedPage;
  const [isOpen, setIsOpen] = useState(true);
  const node = editor.selectedAstNode;
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>Arrangement</div>
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
          <label className={styles.panelItemLabel}>Display</label>
          <div className={styles.panelItemRowCenterArea}>
            <Select
              value={node?.props.style.display || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.display,
                  styleValue: e,
                })
              }
              options={options.display}
            />
          </div>
        </div>
        {node?.props.style.display === "flex" && (
          <>
            <div className={styles.panelItem}>
              <label className={styles.panelItemLabel}>FlexDirection</label>
              <div className={styles.panelItemRowCenterArea}>
                <Select
                  value={node?.props.style.flexDirection || ""}
                  onChange={(e) =>
                    node?.updateStyle({
                      styleKey: StyleEnum.flexDirection,
                      styleValue: e,
                    })
                  }
                  options={options.flexDirection}
                />
              </div>
            </div>
            <div className={styles.panelItem}>
              <label className={styles.panelItemLabel}>JustifyContent</label>
              <div className={styles.panelItemRowBetweenAera}>
                <ActionButton
                  IconComponent={LuAlignHorizontalJustifyStart}
                  isActive={node.props.style.justifyContent === "start"}
                  onClick={() => {
                    node?.updateStyle({
                      styleKey: StyleEnum.justifyContent,
                      styleValue: "start",
                    });
                  }}
                ></ActionButton>
                <ActionButton
                  IconComponent={LuAlignHorizontalJustifyCenter}
                  isActive={node.props.style.justifyContent === "center"}
                  onClick={() => {
                    node?.updateStyle({
                      styleKey: StyleEnum.justifyContent,
                      styleValue: "center",
                    });
                  }}
                ></ActionButton>
                <ActionButton
                  IconComponent={LuAlignHorizontalJustifyEnd}
                  isActive={node.props.style.justifyContent === "end"}
                  onClick={() => {
                    node?.updateStyle({
                      styleKey: StyleEnum.justifyContent,
                      styleValue: "end",
                    });
                  }}
                ></ActionButton>
                <ActionButton
                  IconComponent={LuAlignHorizontalSpaceBetween}
                  isActive={node.props.style.justifyContent === "space-between"}
                  onClick={() => {
                    node?.updateStyle({
                      styleKey: StyleEnum.justifyContent,
                      styleValue: "space-between",
                    });
                  }}
                ></ActionButton>
                <ActionButton
                  IconComponent={LuAlignHorizontalSpaceAround}
                  isActive={node.props.style.justifyContent === "space-around"}
                  onClick={() => {
                    node?.updateStyle({
                      styleKey: StyleEnum.justifyContent,
                      styleValue: "space-around",
                    });
                  }}
                ></ActionButton>
              </div>
            </div>
            <div className={styles.panelItem}>
              <label className={styles.panelItemLabel}>AlignItems</label>
              <div className={styles.panelItemRowBetweenAera}>
                <ActionButton
                  IconComponent={LuAlignHorizontalJustifyStart}
                  isActive={node.props.style.alignItems === "start"}
                  onClick={() => {
                    node?.updateStyle({
                      styleKey: StyleEnum.alignItems,
                      styleValue: "start",
                    });
                  }}
                ></ActionButton>
                <ActionButton
                  IconComponent={LuAlignHorizontalJustifyCenter}
                  isActive={node.props.style.alignItems === "center"}
                  onClick={() => {
                    node?.updateStyle({
                      styleKey: StyleEnum.alignItems,
                      styleValue: "center",
                    });
                  }}
                ></ActionButton>
                <ActionButton
                  IconComponent={LuAlignHorizontalJustifyEnd}
                  isActive={node.props.style.alignItems === "end"}
                  onClick={() => {
                    node?.updateStyle({
                      styleKey: StyleEnum.alignItems,
                      styleValue: "end",
                    });
                  }}
                ></ActionButton>
                <ActionButton
                  IconComponent={LuAlignHorizontalSpaceBetween}
                  isActive={node.props.style.alignItems === "space-between"}
                  onClick={() => {
                    node?.updateStyle({
                      styleKey: StyleEnum.alignItems,
                      styleValue: "space-between",
                    });
                  }}
                ></ActionButton>
                <ActionButton
                  IconComponent={LuAlignHorizontalSpaceAround}
                  isActive={node.props.style.alignItems === "space-around"}
                  onClick={() => {
                    node?.updateStyle({
                      styleKey: StyleEnum.alignItems,
                      styleValue: "space-around",
                    });
                  }}
                ></ActionButton>
              </div>
            </div>
          </>
        )}
        <div className={styles.panelItem}>
          <label className={styles.panelItemLabel}>Position</label>
          <div className={styles.panelItemRowCenterArea}>
            <Select
              value={node?.props.style.position || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.position,
                  styleValue: e,
                })
              }
              options={options.position}
            />
          </div>
        </div>
        {(node?.props.style.position === "fixed" ||
          node?.props.style.position === "absolute") && (
          <div className={styles.panelItem}>
            <div className={styles.panelItemColumnArea}>
              <Input
                label="top:"
                value={node?.props.style.top || ""}
                onChange={(e) =>
                  node?.updateStyle({
                    styleKey: StyleEnum.top,
                    styleValue: e,
                  })
                }
              />
              <Input
                label="bottom:"
                value={node?.props.style.bottom || ""}
                onChange={(e) =>
                  node?.updateStyle({
                    styleKey: StyleEnum.bottom,
                    styleValue: e,
                  })
                }
              />
              <Input
                label="left:"
                value={node?.props.style.left || ""}
                onChange={(e) =>
                  node?.updateStyle({
                    styleKey: StyleEnum.left,
                    styleValue: e,
                  })
                }
              />
              <Input
                label="right:"
                value={node?.props.style.right || ""}
                onChange={(e) =>
                  node?.updateStyle({
                    styleKey: StyleEnum.right,
                    styleValue: e,
                  })
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default ArrangementPanel;
