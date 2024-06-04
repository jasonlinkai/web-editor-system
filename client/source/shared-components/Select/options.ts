const options = {
  display: [
    { label: "block", value: "block" },
    { label: "flex", value: "flex" },
    { label: "inline", value: "inline" },
    { label: "none", value: "none" },
  ],
  flexWrap: [
    { label: "nowrap", value: "nowrap" },
    { label: "wrap", value: "wrap" },
    { label: "wrap", value: "wrap-reverse" },
    { label: "inherit", value: "inherit" },
    { label: "initial", value: "initial" },
    { label: "revert", value: "revert" },
    { label: "revert", value: "revert-layer" },
    { label: "unset", value: "unset" },
  ],
  flexDirection: [
    { label: "row", value: "row" },
    { label: "column", value: "column" },
    { label: "row-reverse", value: "row-reverse" },
    { label: "column-reverse", value: "column-reverse" },
  ],
  position: [
    { label: "static", value: "static" },
    { label: "relative", value: "relative" },
    // { label: "fixed", value: "fixed" },
    { label: "absolute", value: "absolute" },
    { label: "sticky", value: "sticky" },
  ],
  textAlign: [
    { label: "center", value: "center" },
    { label: "left", value: "left" },
    { label: "right", value: "right" },
    { label: "start", value: "start" },
    { label: "end", value: "end" },
    { label: "justify", value: "justify" },
  ],
};

export default options;
