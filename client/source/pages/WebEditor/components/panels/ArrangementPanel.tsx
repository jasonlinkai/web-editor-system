"use client";
import React from "react";
import styles from "./Panel.module.scss";
import { observer } from "mobx-react-lite";
import Icons from "@/shared-components/Icons";
import Select from "source/shared-components/Select";
import { useStores } from "source/libs/mobx/useMobxStateTreeStores";
import { StyleEnum } from "source/libs/types";
import ActionButton from "../ActionButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import InputButton from "@/shared-components/InputButton";
import options from "source/shared-components/Select/options";
import { useState } from "react";
import clsx from "clsx";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Input, { TextInput } from "source/shared-components/Input";
import FormItemLabel from "@/shared-components/FormItemLabel";

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
              <label className={styles.panelItemLabel}>Flex</label>
              <div className={styles.panelItemRowCenterArea}>
                <Input
                  label="basis"
                  value={node?.props.style.flexBasis || ""}
                  onChange={(e) => {
                    console.log(e);
                    node?.updateStyle({
                      styleKey: StyleEnum.flexBasis,
                      styleValue: e,
                    })
                  }}
                />
              </div>
            </div>
            <div className={styles.panelItem}>
              <div className={styles.panelItemRowCenterArea}>
                <TextInput
                  label="grow"
                  value={node?.props.style.flexGrow || ""}
                  onChange={(e) =>
                    node?.updateStyle({
                      styleKey: StyleEnum.flexGrow,
                      styleValue: e,
                    })
                  }
                />
              </div>
            </div>
            <div className={styles.panelItem}>
              <div className={styles.panelItemRowCenterArea}>
                <TextInput
                  label="shrink"
                  value={node?.props.style.flexShrink || ""}
                  onChange={(e) =>
                    node?.updateStyle({
                      styleKey: StyleEnum.flexShrink,
                      styleValue: e,
                    })
                  }
                />
              </div>
            </div>
            <div className={styles.panelItem}>
              <div className={styles.panelItemRowCenterArea}>
                <Select
                  label="wrap"
                  value={node?.props.style.flexWrap || ""}
                  onChange={(e) =>
                    node?.updateStyle({
                      styleKey: StyleEnum.flexWrap,
                      styleValue: e,
                    })
                  }
                  options={options.flexWrap}
                />
              </div>
            </div>
            <div className={styles.panelItem}>
              <div className={styles.panelItemRowCenterArea}>
                <Select
                  label="direction"
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
              <div className={styles.panelItemRowBetweenAera}>
                <FormItemLabel>justify</FormItemLabel>
                <ToggleButtonGroup
                  value={node?.props.style.justifyContent}
                  exclusive
                  onChange={(
                    event: React.MouseEvent<HTMLElement>,
                    value: string | null
                  ) => {
                    if (value !== null) {
                      node?.updateStyle({
                        styleKey: StyleEnum.justifyContent,
                        styleValue: value,
                      });
                    }
                  }}
                >
                  <InputButton value="start" aria-label="start">
                    <Icons.LuAlignHorizontalJustifyStart />
                  </InputButton>
                  <InputButton value="center" aria-label="center">
                    <Icons.LuAlignHorizontalJustifyCenter />
                  </InputButton>
                  <InputButton value="end" aria-label="end">
                    <Icons.LuAlignHorizontalJustifyEnd />
                  </InputButton>
                  <InputButton value="space-between" aria-label="space-between">
                    <Icons.LuAlignHorizontalSpaceBetween />
                  </InputButton>
                  <InputButton value="space-around" aria-label="space-around">
                    <Icons.LuAlignHorizontalSpaceAround />
                  </InputButton>
                </ToggleButtonGroup>
              </div>
            </div>
            <div className={styles.panelItem}>
              <div className={styles.panelItemRowBetweenAera}>
                <FormItemLabel>align</FormItemLabel>
                <ToggleButtonGroup
                  value={node?.props.style.alignItems}
                  exclusive
                  onChange={(
                    event: React.MouseEvent<HTMLElement>,
                    value: string | null
                  ) => {
                    if (value !== null) {
                      node?.updateStyle({
                        styleKey: StyleEnum.alignItems,
                        styleValue: value,
                      });
                    }
                  }}
                >
                  <InputButton value="start" aria-label="start">
                    <Icons.LuAlignHorizontalJustifyStart />
                  </InputButton>
                  <InputButton value="center" aria-label="center">
                    <Icons.LuAlignHorizontalJustifyCenter />
                  </InputButton>
                  <InputButton value="end" aria-label="end">
                    <Icons.LuAlignHorizontalJustifyEnd />
                  </InputButton>
                  <InputButton value="space-between" aria-label="space-between">
                    <Icons.LuAlignHorizontalSpaceBetween />
                  </InputButton>
                  <InputButton value="space-around" aria-label="space-around">
                    <Icons.LuAlignHorizontalSpaceAround />
                  </InputButton>
                </ToggleButtonGroup>
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
