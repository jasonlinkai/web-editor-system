import {
  types as t,
  IAnyModelType,
  Instance,
  SnapshotIn,
  SnapshotOut,
  detach,
} from "mobx-state-tree";
import { Event, EventNames } from "source/libs/event";
import {
  AttributesEnum,
  ComponentNodeType,
  ContainerNodeType,
  SelfClosingNodeType,
  TextNodeType,
} from "source/libs/types";
import { StyleEnum } from "source/libs/types";

const AstNodeModelPropsAttributes = t.model("AstNodeModelPropsAttributes", {
  datanodetype: t.optional(t.string, ""),
  // for image
  src: t.maybe(t.string),
  alt: t.maybe(t.string),
  crossOrigin: t.maybe(t.string),
});

export type AstNodeModelPropsAttributesType = Instance<
  typeof AstNodeModelPropsAttributes
>;
export type AstNodeModelPropsAttributesSnapshotInType = SnapshotIn<
  typeof AstNodeModelPropsAttributes
>;
export type AstNodeModelPropsAttributesSnapshotOutType = SnapshotOut<
  typeof AstNodeModelPropsAttributes
>;

const AstNodeModelPropsStyle = t.model("AstNodeModelPropsStyle", {
  width: t.maybe(t.string),
  height: t.maybe(t.string),
  minHeight: t.maybe(t.string),
  display: t.maybe(t.string),
  flexBasis: t.maybe(t.string),
  flexGrow: t.maybe(t.string),
  flexShrink: t.maybe(t.string),
  flexWrap: t.maybe(t.string),
  flexDirection: t.maybe(t.string),
  justifyContent: t.maybe(t.string),
  alignItems: t.maybe(t.string),
  color: t.maybe(t.string),
  fontSize: t.maybe(t.string),
  fontWeight: t.maybe(t.string),
  textAlign: t.maybe(t.string),
  backgroundColor: t.maybe(t.string),
  backgroundAttachment: t.maybe(t.string),
  backgroundClip: t.maybe(t.string),
  backgroundImage: t.maybe(t.string),
  backgroundOrigin: t.maybe(t.string),
  backgroundPositionX: t.maybe(t.string),
  backgroundPositionY: t.maybe(t.string),
  backgroundRepeat: t.maybe(t.string),
  backgroundSize: t.maybe(t.string),
  position: t.maybe(t.string),
  top: t.maybe(t.string),
  right: t.maybe(t.string),
  bottom: t.maybe(t.string),
  left: t.maybe(t.string),
  boxShadow: t.maybe(t.string),
  paddingTop: t.maybe(t.string),
  paddingRight: t.maybe(t.string),
  paddingBottom: t.maybe(t.string),
  paddingLeft: t.maybe(t.string),
  marginTop: t.maybe(t.string),
  marginRight: t.maybe(t.string),
  marginBottom: t.maybe(t.string),
  marginLeft: t.maybe(t.string),
  borderStyle: t.maybe(t.string),
  borderColor: t.maybe(t.string),
  borderTopWidth: t.maybe(t.string),
  borderBottomWidth: t.maybe(t.string),
  borderLeftWidth: t.maybe(t.string),
  borderRightWidth: t.maybe(t.string),
  borderTopLeftRadius: t.maybe(t.string),
  borderTopRightRadius: t.maybe(t.string),
  borderBottomLeftRadius: t.maybe(t.string),
  borderBottomRightRadius: t.maybe(t.string),
});

export type AstNodeModelPropsStyleType = Instance<
  typeof AstNodeModelPropsStyle
>;
export type AstNodeModelPropsStyleSnapshotInType = SnapshotIn<
  typeof AstNodeModelPropsStyle
>;
export type AstNodeModelPropsStyleSnapshotOutType = SnapshotOut<
  typeof AstNodeModelPropsStyle
>;

const AstNodeModelProps = t.model("AstNodeModelProps", {
  className: t.optional(t.string, ""),
  style: t.optional(AstNodeModelPropsStyle, {}),
  attributes: t.optional(AstNodeModelPropsAttributes, {}),
});

export const AstNodeModel = t
  .model("AstNodeModel", {
    uuid: t.identifier,
    parent: t.maybe(t.safeReference(t.late((): IAnyModelType => AstNodeModel))),
    type: t.enumeration([
      "div",
      "span",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "button",
      "img",
      "video",
    ]),
    events: t.optional(
      t.frozen<{
        onClick?: Event<EventNames>;
      }>({}),
      {}
    ),
    props: t.optional(AstNodeModelProps, {}),
    children: t.optional(
      t.array(t.late((): IAnyModelType => AstNodeModel)),
      []
    ),
    content: t.optional(t.string, ""),
  })
  .volatile<{
    isSelected: boolean;
    isDragOvered: boolean;
    changeValueTimeStamp: number | null;
  }>(() => ({
    isSelected: false,
    isDragOvered: false,
    changeValueTimeStamp: null,
  }))
  .views((self) => ({
    get isSelfCanBeDeleted() {
      return !!self.parent;
    },
    get isRootNode() {
      return self.parent === undefined;
    },
    get isContainerNode() {
      return Object.values(ContainerNodeType).includes(
        self.type as ContainerNodeType
      );
    },
    get isTextNode() {
      return Object.values(TextNodeType).includes(self.type as TextNodeType);
    },
    get isSelfClosingNode() {
      return Object.values(SelfClosingNodeType).includes(
        self.type as SelfClosingNodeType
      );
    },
  }))
  .actions((self) => ({
    setContent(content: string) {
      self.content = content;
      self.changeValueTimeStamp = Date.now();
    },
    setParent(uuid: string) {
      self.parent = uuid;
    },
    setIsSelected(v: boolean) {
      self.isSelected = v;
    },
    setIsDragOvered(v: boolean) {
      self.isDragOvered = v;
    },
    setStyle(style: Partial<SnapshotOut<AstNodeModelPropsStyleType>>) {
      self.props.style = {
        ...self.props.style,
        ...style,
      };
      self.changeValueTimeStamp = Date.now();
    },
    setClassName(
      className: string,
    ) {
      self.props.className = className;
      self.changeValueTimeStamp = Date.now();
    },
    setAttributes(
      attributes: Partial<SnapshotOut<AstNodeModelPropsAttributesType>>
    ) {
      self.props.attributes = {
        ...self.props.attributes,
        ...attributes,
      };
      self.changeValueTimeStamp = Date.now();
    },
    updateStyle({
      styleKey,
      styleValue,
    }: {
      styleKey: StyleEnum;
      styleValue: string;
    }) {
      self.props.style = {
        ...self.props.style,
        [styleKey]: styleValue || undefined,
      };
      self.changeValueTimeStamp = Date.now();
    },
    updateAttributes({ key, value }: { key: AttributesEnum; value: string }) {
      self.props.attributes = {
        ...self.props.attributes,
        [key]: value || undefined,
      };
      self.changeValueTimeStamp = Date.now();
    },
    moveToChildren(child: any, index: number) {
      child.parent.deletChild(child);
      child.setParent(self.uuid);
      self.children.splice(index, 0, child);
      self.changeValueTimeStamp = Date.now();
      return child;
    },
    addToChildren(child: any, index: number) {
      child.setParent(self.uuid);
      self.children.splice(index, 0, child);
      self.changeValueTimeStamp = Date.now();
      return child;
    },
    deletChild(child: any) {
      detach(child);
      self.changeValueTimeStamp = Date.now();
    },
  }));

export type AstNodeModelType = Instance<typeof AstNodeModel>;
export type AstNodeModelSnapshotInType = SnapshotIn<typeof AstNodeModel>;
export type AstNodeModelSnapshotOutType = SnapshotOut<typeof AstNodeModel>;
