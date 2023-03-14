import type { DefineComponent } from 'vue';

export declare type GetStyle = (
  classList: string[],
  styleObj?: Record<string, any>
) => Record<string, any>;

export declare type SearchStyleByClassName = (
  className: string,
  styleObj?: Record<string, any>
) => Record<string, any>;

export declare type ListItemObj = {
  id: string;
  title: string;
  href?: string;
  defaultCollapsed?: boolean;
  children?: ListItemObj[];
};

export declare const BtbVueList: DefineComponent<{
  dataList: {
    type: ListItemObj[],
    default: array
  },
  collapseEnable: {
    type: BooleanConstructor,
    default: boolean
  },
  defaultActiveID: {
    type: StringConstructor,
  },
  activeID: {
    type: StringConstructor,
  },
  styleObj: {
    type: ObjectConstructor,
    default: undefined
  },
}>;


export declare const BtbVueListLayer: DefineComponent<{
  subdataList: {
    type: ListItemObj[],
    default: array
  },
  iteration: {
    type: NumberConstructor,
    default: number;
  },
  collapseEnable: {
    type: BooleanConstructor,
    default: boolean
  },
  styleObj: {
    type: ObjectConstructor,
    default: undefined
  },
}>;

declare interface BTBList {
  install(app: App): void;
}

declare const BtbListComponents: BTBList;

export default BtbListComponents;