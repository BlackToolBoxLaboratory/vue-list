import type { App } from "vue";

import { GetStyle, SearchStyleByClassName, ListItemObj } from './types';
import { List, ListLayer } from "./list/index";

const install = function (app: App) {
  if (install.installed) {
    /* istanbul ignore next */
    return;
  }
  install.installed = true;

  app.component(List.name, List);
  app.component(ListLayer.name, ListLayer);
};

install.installed = false;

const componentInstaller = {
  install
};

export default componentInstaller;

export {
  install,

  List,
  ListLayer,

  GetStyle,
  SearchStyleByClassName,
  ListItemObj
}
