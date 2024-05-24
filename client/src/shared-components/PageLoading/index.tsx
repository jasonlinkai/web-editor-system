import { Backdrop } from "@mui/material";
import Loading from "@/shared-components/Loading";

interface PageLoadingProps {
  visible: boolean;
}

const PageLoading: React.FC<PageLoadingProps> = ({ visible = false }) => {
  return (
    <Backdrop open={visible}>
      <Loading color="primary" />
    </Backdrop>
  );
};

export default PageLoading;
