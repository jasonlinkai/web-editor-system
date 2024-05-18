import styles from "./SizerBar.module.scss";
import { observer } from "mobx-react-lite";
import { FaLaptop, FaMobile } from "react-icons/fa";
import { TbDeviceIpad } from "react-icons/tb";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useStores } from "@/libs/mobx/useMobxStateTreeStores";

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
      editor.setEditorLayout({
        width,
      });
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
          <ToggleButton value="100%" aria-label="100%">
            <FaLaptop />
          </ToggleButton>
          <ToggleButton value="768px" aria-label="768px">
            <TbDeviceIpad />
          </ToggleButton>
          <ToggleButton value="320px" aria-label="320px">
            <FaMobile />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );
});

export default SizerBar;
