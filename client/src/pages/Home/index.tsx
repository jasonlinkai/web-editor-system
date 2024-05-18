import styles from "./Home.module.scss";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, ButtonGroup } from "@mui/material";
import { useStores } from "@/libs/mobx/useMobxStateTreeStores";
import TemplateGalleryModal from "./components/TemplateGalleryModal";
import Snackbar from "@/shared-components/SnackBar";

const Home = observer(() => {
  const navigate = useNavigate();
  const [
    deletePageSuccessSnackbarVisible,
    setDeletePageSuccessSnackbarVisible,
  ] = useState(false);
  const {
    pages,
    setSelectedPage,
    deletePage,
    setIsTemplateGalleryModalVisible,
  } = useStores();
  return (
    <div className={styles.home}>
      <h1 className={styles.homeTitle}>web-editor.js</h1>
      <div className={styles.previousWork}>
        <h2 className={styles.previousWorkTitle}>
          Here is your previous works
        </h2>
        <div className={styles.previousWorkArea}>
          <List dense={true}>
            {pages.map((page) => {
              return (
                <ListItem
                  key={page.uuid}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        deletePage(page);
                        setDeletePageSuccessSnackbarVisible(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    role={undefined}
                    onClick={() => {
                      setSelectedPage(page);
                      navigate("/web-editor");
                    }}
                    dense
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={page.title} secondary={page.uuid} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </div>
        <div className={styles.addNewPage}>
          <ButtonGroup variant="contained" aria-label="Basic button group">
            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                setIsTemplateGalleryModalVisible(true);
              }}
            >
              add new page
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <TemplateGalleryModal />
      <Snackbar
        open={deletePageSuccessSnackbarVisible}
        serverity="success"
        message="Delete page successed!"
        onClose={() => {
          setDeletePageSuccessSnackbarVisible(false);
        }}
      />
    </div>
  );
});

export default Home;
