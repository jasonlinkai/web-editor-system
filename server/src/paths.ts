import path from "path";


const paths = {
  public: path.join(__dirname, "../", "./public"),
  uploads: path.join(__dirname, "../", "./public", "./uploads"),
  data: path.join(__dirname, "../", "./data"),
  index: path.join(__dirname, "../", "./public", "./index.html"),
};

export default paths;