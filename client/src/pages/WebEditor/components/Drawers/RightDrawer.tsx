import styles from "./Drawer.module.scss";
import clsx from "clsx";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { TfiLayout, TfiText } from "react-icons/tfi";
import { CgArrangeBack } from "react-icons/cg";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import LayoutPanel from "../panels/LayoutPanel";
import ArrangementPanel from "../panels/ArrangementPanel";
import TypographyPanel from "../panels/TypographyPanel";
import { useStores } from "@/libs/mobx/useMobxStateTreeStores";

enum TabTypes {
  ARRANGEMENT = "ARRANGEMENT",
  LAYOUT = "LAYOUT",
  TYPOGRAPHY = "TYPOGRAPHY",
}

const tabs = [
  {
    type: TabTypes.ARRANGEMENT,
    label: "Arrange",
    IconComponent: CgArrangeBack,
  },
  {
    type: TabTypes.LAYOUT,
    label: "Layout",
    IconComponent: TfiLayout,
  },
  {
    type: TabTypes.TYPOGRAPHY,
    label: "Text",
    IconComponent: TfiText,
  },
];

const RightDrawer: React.FC = observer(() => {
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const { editor } = selectedPage;
  const node = editor.selectedAstNode;
  const [tabType, setTabType] = useState(TabTypes.ARRANGEMENT);
  return (
    <div
      className={clsx([
        styles.drawer,
        {
          [styles.drawerOpen]: editor.isRightDrawerOpen,
        },
      ])}
    >
      <div className={styles.drawerContentWrap} style={{
        height: '100%',
      }}>
        <div className={styles.drawerTabsArea}>
          <Tabs
            value={tabType}
            variant="scrollable"
            scrollButtons="auto"
            onChange={(e: React.SyntheticEvent, v: TabTypes | null) => {
              if (v !== null) {
                setTabType(v);
              }
            }}
            aria-label="left drawer panel tabs"
          >
            {tabs.map((tab) => {
              const { IconComponent, type, label } = tab;
              return (
                <Tab
                  key={type}
                  label={label}
                  icon={<IconComponent />}
                  value={type}
                  aria-label={`left drawer panel tab ${type}`}
                />
              );
            })}
          </Tabs>
        </div>
        <div className={styles.drawerPanelArea}>
          {node ? (
            <>
              {tabType === TabTypes.ARRANGEMENT && <ArrangementPanel />}
              {tabType === TabTypes.LAYOUT && <LayoutPanel />}
              {tabType === TabTypes.TYPOGRAPHY && <TypographyPanel />}
            </>
          ) : (
            <div className={styles.drawerPanelAreaNoSelectedNode}>
              select node first
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default RightDrawer;
