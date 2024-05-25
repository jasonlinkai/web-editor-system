import styles from "./Home.module.scss";
import { useEffect, useState } from "react";
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
import { Button } from "@mui/material";
import { useStores, useStoresReload } from "@/libs/mobx/useMobxStateTreeStores";
import TemplateGalleryModal from "./components/TemplateGalleryModal";
import Snackbar from "@/shared-components/SnackBar";
import Loading from "@/shared-components/Loading";
import { LogoutOutlined } from "@mui/icons-material";

const Home = observer(() => {
  const navigate = useNavigate();
  const [
    deletePageSuccessSnackbarVisible,
    setDeletePageSuccessSnackbarVisible,
  ] = useState(false);
  const {
    token,
    inited,
    setInited,
    pages,
    setSelectedPage,
    deletePage,
    setIsTemplateGalleryModalVisible,
    ActionGetPages,
    isFetchPagesLoading,
    ActionDeletePage,
    ActionPostLogout,
  } = useStores();
  const { reload } = useStoresReload();
  useEffect(() => {
    const init = async () => {
      try {
        if (token && !inited) {
          await ActionGetPages();
          setInited(true);
        }
      } catch (e) {
        console.log("init error", (e as Error).message);
      }
    };
    init();
  }, [token, inited, setInited, ActionGetPages]);
  return (
    <div className={styles.home}>
      <h1 className={styles.homeTitle}>web-editor.js</h1>
      <div className={styles.previousWork}>
        <h2 className={styles.previousWorkTitle}>
          Here is your previous works
        </h2>
        {}
        <div className={styles.previousWorkArea}>
          {isFetchPagesLoading ? (
            <Loading color="primary" />
          ) : (
            <List dense={true}>
              {pages.map((page) => {
                return (
                  <ListItem
                    key={page.uuid}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={async () => {
                          try {
                            if (page.id !== null) {
                              await ActionDeletePage(page.id);
                              deletePage(page);
                              setDeletePageSuccessSnackbarVisible(true);
                            }
                          } catch (e) {
                            setDeletePageSuccessSnackbarVisible(true);
                          }
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
                      <ListItemText
                        primary={page.title}
                        secondary={page.uuid}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
        </div>
        <div className={styles.addNewPage}>
          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              setIsTemplateGalleryModalVisible(true);
            }}
          >
            add new page
          </Button>
          <Button
            color="error"
            startIcon={<LogoutOutlined />}
            onClick={async () => {
              await ActionPostLogout();
              navigate("/login");
              reload();
            }}
          >
            logout
          </Button>
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
