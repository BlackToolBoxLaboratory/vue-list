export type GetStyle = (
  classList: string[],
  styleObj?: Record<string, any>
) => Record<string, any>;

export type SearchStyleByClassName = (
  className: string,
  styleObj?: Record<string, any>
) => Record<string, any>;

export type ListItemObj = {
  id: string;
  title: string;
  href?: string;
  defaultCollapsed?: boolean;
  children?: ListItemObj[];
  [key: string]: any;
};
