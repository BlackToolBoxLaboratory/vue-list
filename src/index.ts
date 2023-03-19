import type { App } from "vue";

import { ListItemObj } from './types';
import { List, ListLayer } from "./list/index";

export default function install(app: App) {
  app.component(List.name, List);
  app.component(ListLayer.name, ListLayer);
};

export {
  ListItemObj,

  install,

  List,
  ListLayer,
}
