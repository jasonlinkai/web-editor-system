"use client";
import styles from "./Panel.module.scss";
import { observer } from "mobx-react-lite";
import Input, { SizeInput, TextInput } from "source/editor-components/Input";
import { useStores } from "source/libs/mobx/useMobxStateTreeStores";
import { StyleEnum } from "source/libs/types";
import { useState } from "react";
import clsx from "clsx";
import ActionButton from "../ActionButton";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import ColorInput from "@/editor-components/ColorInput";
import ShadowInput from "@/editor-components/ShadowInput";
import Select from "@/editor-components/Select";
import options from "@/editor-components/Select/options";
import ImageSelect from "@/editor-components/ImageSelect";

const LayoutPanel = observer(() => {
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const { editor } = selectedPage;
  const [isOpen, setIsOpen] = useState(true);
  const node = editor.selectedAstNode;
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>Layout</div>
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
          <div className={styles.panelItemColumnArea}>
            <SizeInput
              label="width"
              value={node?.props.style.width || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.width,
                  styleValue: e,
                })
              }
            />
            <Input
              label="height"
              value={node?.props.style.height || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.height,
                  styleValue: e,
                })
              }
            />
          </div>
        </div>
        <div className={styles.panelItem}>
          <label className={styles.panelItemLabel}>Background</label>
          <div className={styles.panelItemColumnArea}>
            <ColorInput
              label="color"
              value={node?.props.style.backgroundColor || ""}
              onChange={(e) => {
                node?.updateStyle({
                  styleKey: StyleEnum.backgroundColor,
                  styleValue: e,
                });
              }}
            />
            <TextInput
              label="position-x"
              value={node?.props.style.backgroundPositionX || ""}
              onChange={(e) => {
                node?.updateStyle({
                  styleKey: StyleEnum.backgroundPositionX,
                  styleValue: e,
                });
              }}
            />
            <TextInput
              label="position-y"
              value={node?.props.style.backgroundPositionY || ""}
              onChange={(e) => {
                node?.updateStyle({
                  styleKey: StyleEnum.backgroundPositionY,
                  styleValue: e,
                });
              }}
            />
            <Select
              label="attachment"
              value={node?.props.style.backgroundAttachment || ""}
              onChange={(e) => {
                node?.updateStyle({
                  styleKey: StyleEnum.backgroundAttachment,
                  styleValue: e,
                });
              }}
              options={options.backgroundAttachment}
            />
            <Select
              label="clip"
              value={node?.props.style.backgroundClip || ""}
              onChange={(e) => {
                node?.updateStyle({
                  styleKey: StyleEnum.backgroundClip,
                  styleValue: e,
                });
              }}
              options={options.backgroundClip}
            />
            <ImageSelect
              label="image"
              value={node?.props.style.backgroundImage || ""}
              onChange={(e) => {
                node?.updateStyle({
                  styleKey: StyleEnum.backgroundImage,
                  styleValue: `url(${e})`,
                });
              }}
            />
            <Select
              label="origin"
              value={node?.props.style.backgroundOrigin || ""}
              onChange={(e) => {
                node?.updateStyle({
                  styleKey: StyleEnum.backgroundOrigin,
                  styleValue: e,
                });
              }}
              options={options.backgroundOrigin}
            />
            <Select
              label="repeat"
              value={node?.props.style.backgroundRepeat || ""}
              onChange={(e) => {
                node?.updateStyle({
                  styleKey: StyleEnum.backgroundRepeat,
                  styleValue: e,
                });
              }}
              options={options.backgroundRepeat}
            />
            <TextInput
              label="size"
              value={node?.props.style.backgroundSize || ""}
              onChange={(e) => {
                node?.updateStyle({
                  styleKey: StyleEnum.backgroundSize,
                  styleValue: e,
                });
              }}
            />
          </div>
        </div>
        <div className={styles.panelItem}>
          <label className={styles.panelItemLabel}>Box</label>
          <div className={styles.panelItemColumnArea}>
            <ShadowInput
              label="shadow"
              value={node?.props.style.boxShadow || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.boxShadow,
                  styleValue: e,
                })
              }
            />
          </div>
        </div>
        <div className={styles.panelItem}>
          <label className={styles.panelItemLabel}>Padding</label>
          <div className={styles.panelItemColumnArea}>
            <Input
              label="top"
              value={node?.props.style.paddingTop || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.paddingTop,
                  styleValue: e,
                })
              }
            />
            <Input
              label="bottom"
              value={node?.props.style.paddingBottom || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.paddingBottom,
                  styleValue: e,
                })
              }
            />
            <Input
              label="left"
              value={node?.props.style.paddingLeft || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.paddingLeft,
                  styleValue: e,
                })
              }
            />
            <Input
              label="right"
              value={node?.props.style.paddingRight || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.paddingRight,
                  styleValue: e,
                })
              }
            />
          </div>
        </div>
        <div className={styles.panelItem}>
          <label className={styles.panelItemLabel}>Margin</label>
          <div className={styles.panelItemColumnArea}>
            <Input
              label="top"
              value={node?.props.style.marginTop || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.marginTop,
                  styleValue: e,
                })
              }
            />
            <Input
              label="bottom"
              value={node?.props.style.marginBottom || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.marginBottom,
                  styleValue: e,
                })
              }
            />
            <Input
              label="left"
              value={node?.props.style.marginLeft || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.marginLeft,
                  styleValue: e,
                })
              }
            />
            <Input
              label="right"
              value={node?.props.style.marginRight || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.marginRight,
                  styleValue: e,
                })
              }
            />
          </div>
        </div>
        <div className={styles.panelItem}>
          <label className={styles.panelItemLabel}>Border</label>
          <div className={styles.panelItemColumnArea}>
            <Select
              label="style"
              value={node?.props.style.borderStyle || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.borderStyle,
                  styleValue: e,
                })
              }
              options={options.borderStyle}
            />
            <ColorInput
              label="border-color"
              value={node?.props.style.borderColor || ""}
              onChange={(e) => {
                node?.updateStyle({
                  styleKey: StyleEnum.borderColor,
                  styleValue: e,
                });
              }}
            />
          </div>
        </div>
        <div className={styles.panelItem}>
          <label className={styles.panelItemLabel}>BorderWidth</label>
          <div className={styles.panelItemColumnArea}>
            <Input
              label="top"
              value={node?.props.style.borderTopWidth || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.borderTopWidth,
                  styleValue: e,
                })
              }
            />
            <Input
              label="bottom"
              value={node?.props.style.borderBottomWidth || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.borderBottomWidth,
                  styleValue: e,
                })
              }
            />
            <Input
              label="left"
              value={node?.props.style.borderLeftWidth || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.borderLeftWidth,
                  styleValue: e,
                })
              }
            />
            <Input
              label="right"
              value={node?.props.style.borderRightWidth || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.borderRightWidth,
                  styleValue: e,
                })
              }
            />
          </div>
        </div>
        <div className={styles.panelItem}>
          <label className={styles.panelItemLabel}>BorderRadius</label>
          <div className={styles.panelItemColumnArea}>
            <Input
              label="top-left"
              value={node?.props.style.borderTopLeftRadius || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.borderTopLeftRadius,
                  styleValue: e,
                })
              }
            />
            <Input
              label="top-right"
              value={node?.props.style.borderTopRightRadius || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.borderTopRightRadius,
                  styleValue: e,
                })
              }
            />
            <Input
              label="bottom-left"
              value={node?.props.style.borderBottomLeftRadius || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.borderBottomLeftRadius,
                  styleValue: e,
                })
              }
            />
            <Input
              label="bottom-right"
              value={node?.props.style.borderBottomRightRadius || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.borderBottomRightRadius,
                  styleValue: e,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default LayoutPanel;
