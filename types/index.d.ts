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
  [key: string]: any;
};

export declare const BtbVueList: DefineComponent<{
  dataList: {
    type: ListItemObj[],
    default: array
  },
  collapseEnable: {
    type: Boolean,
    default: boolean
  },
  activeID: {
    type: String,
  },
  styleObj: {
    type: Record<string, any>,
    default: undefined
  },
}>;


export declare const BtbVueListLayer: DefineComponent<{
  subdataList: {
    type: ListItemObj[],
    default: array
  },
  iteration: {
    type: Number,
    default: number;
  },
  collapseEnable: {
    type: Boolean,
    default: boolean
  },
  styleObj: {
    type: Record<string, any>,
    default: undefined
  },
}>;

declare interface BTBList {
  install(app: App): void;
}

declare const BtbListComponents: BTBList;

export default BtbListComponents;