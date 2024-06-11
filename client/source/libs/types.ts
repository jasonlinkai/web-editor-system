export enum ContainerNodeType {
  div = "div",
}

export enum TextNodeType {
  span = "span",
  h1 = "h1",
  h2 = "h2",
  h3 = "h3",
  h4 = "h4",
  h5 = "h5",
  button = "button",
}

export enum SelfClosingNodeType {
  img = "img",
  video = "video",
}

export enum ComponentNodeType {
}

export type ElementType =
  | ContainerNodeType
  | TextNodeType
  | SelfClosingNodeType
  | ComponentNodeType;

export enum AttributesEnum {
  src = "src",
  alt = "alt",
  crossOrigin = "crossOrigin",
}
export enum StyleEnum {
  width = "width",
  height = "height",
  maxWidth = "maxWidth",
  maxHeight = "maxHeight",
  minWidth = "minWidth",
  minHeight = "minHeight",
  display = "display",
  flexBasis = "flexBasis",
  flexGrow = "flexGrow",
  flexShrink = "flexShrink",
  flexWrap = "flexWrap",
  flexDirection = "flexDirection",
  justifyContent = "justifyContent",
  alignItems = "alignItems",
  color = "color",
  fontSize = "fontSize",
  fontWeight = "fontWeight",
  textAlign = "textAlign",
  backgroundColor = "backgroundColor",
  backgroundAttachment = "backgroundAttachment",
  backgroundClip = "backgroundClip",
  backgroundImage = "backgroundImage",
  backgroundOrigin = "backgroundOrigin",
  backgroundPositionX = "backgroundPositionX",
  backgroundPositionY = "backgroundPositionY",
  backgroundRepeat = "backgroundRepeat",
  backgroundSize = "backgroundSize",
  position = "position",
  top = "top",
  right = "right",
  bottom = "bottom",
  left = "left",
  boxShadow = "boxShadow",
  paddingTop = "paddingTop",
  paddingRight = "paddingRight",
  paddingBottom = "paddingBottom",
  paddingLeft = "paddingLeft",
  marginTop = "marginTop",
  marginRight = "marginRight",
  marginBottom = "marginBottom",
  marginLeft = "marginLeft",
  borderStyle = "borderStyle",
  borderColor = "borderColor",
  borderTopWidth = "borderTopWidth",
  borderBottomWidth = "borderBottomWidth",
  borderLeftWidth = "borderLeftWidth",
  borderRightWidth = "borderRightWidth",
  borderTopLeftRadius = "borderTopLeftRadius",
  borderTopRightRadius = "borderTopRightRadius",
  borderBottomLeftRadius = "borderBottomLeftRadius",
  borderBottomRightRadius = "borderBottomRightRadius",
}
export enum MetaEnum {
  description = "description",
  keywords = "keywords",
  author = "author",
  ogTitle = "ogTitle",
  ogType = "ogType",
  ogImage = "ogImage",
  ogUrl = "ogUrl",
  ogDescription = "ogDescription",
  twitterCard = "twitterCard",
  twitterTitle = "twitterTitle",
  twitterDescription = "twitterDescription",
  twitterImage = "twitterImage",
}
