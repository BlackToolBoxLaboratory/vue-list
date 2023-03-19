export type ListItemObj = {
  id: string;
  title: string;
  href?: string;
  defaultCollapsed?: boolean;
  children?: ListItemObj[];
  [key: string]: any;
};
