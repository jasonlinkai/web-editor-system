"use client";
import styles from "./SizerBar.module.scss";
import { observer } from "mobx-react-lite";
import { FaLaptop, FaMobile } from "react-icons/fa";
import { TbDeviceIpad } from "react-icons/tb";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useStores } from "source/libs/mobx/useMobxStateTreeStores";

export const actionBarHeight = 50;

const SizerBar: React.FC = observer(() => {
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const { editor } = selectedPage;

  const handleEditorLayoutWidth = (
    event: React.MouseEvent<HTMLElement>,
    width: string | null
  ) => {
    if (width !== null) {
      if (Number(width.replace("px", "")) > editor.editorLayout.maxWidth) {
        editor.editorLayout.setWidth(`${editor.editorLayout.maxWidth}px`);
      } else {
        editor.editorLayout.setWidth(width);
      }
    }
  };

  return (
    <div
      className={styles.actionBar}
      style={{ height: `${actionBarHeight}px` }}
    >
      <div className={styles.actionBarArea}>
        <ToggleButtonGroup
          value={editor.editorLayout.width}
          exclusive
          onChange={handleEditorLayoutWidth}
          aria-label="editor layout width"
        >
          <ToggleButton size="small" value="1440px" aria-label="1440px">
            <FaLaptop />
          </ToggleButton>
          <ToggleButton size="small" value="768px" aria-label="768px">
            <TbDeviceIpad />
          </ToggleButton>
          <ToggleButton size="small" value="320px" aria-label="320px">
            <FaMobile />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <span>
        {editor.editorLayout.width}
      </span>
    </div>
  );
});

export default SizerBar;
