'use strict';

const registerPlugins = (Vue, VuePlugins = {}) => {
  for (const plugin in VuePlugins) {
    if (plugin && VuePlugins[plugin]) {
      Vue.use(VuePlugins[plugin]);
    }
  }
};

const vueUse = (VuePlugin) => {
  /*
    istanbul ignore next,
    Auto installation only occurs if window.Vue exists
  */
  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(VuePlugin);
  }
};

//
//
//
//
//
//

var script = {
  name: 'btb-vue-list',
  props: {
    listdata: {
      type: Array,
      default: function () {
        return []
      }
    },
    collapseEnable: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    defaultActiveID: {
      type: String
    },
    activeID: {
      type: String
    }
  },
  data () {
    return {
      env: {
        activeEntryID: ''
      }
    }
  },
  mounted () {
    this.changeActiveEntry(this.$props.activeID || this.$props.defaultActiveID || '');
  },
  updated () {
    if (typeof this.$props.activeID !== 'undefined') {
      this.changeActiveEntry(this.$props.activeID);
    }
  },
  methods: {
    clickEntry: function (entry) {
      this.changeActiveEntry(entry.id);
      this.$emit('clickEntry', entry);
    },
    changeActiveEntry: function (id) {
      if (this.env.activeEntryID !== id) {
        document.querySelectorAll(`.container_entry.entry-${this.env.activeEntryID}`).forEach((node) => {
          node.classList.remove('entry-active');
        });
        document.querySelectorAll(`.container_entry.entry-${id}`).forEach((node) => {
          node.classList.add('entry-active');
        });
        this.env.activeEntryID = id;
      }
    },
    toggleCollapsed: function (entry) {
      this.$emit('toggleCollapsed', entry);
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    _vm._g({ staticClass: "btb-vue-list" }, _vm.$listeners),
    [
      _c("btb-vue-list-layer", {
        attrs: {
          id: "root",
          sublist: _vm.listdata,
          collapseEnable: _vm.$props.collapseEnable,
          iteration: 0
        },
        on: { clickEntry: _vm.clickEntry, toggleCollapsed: _vm.toggleCollapsed }
      })
    ],
    1
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var script$1 = {
  name: 'btb-vue-list-layer',
  props: {
    sublist: {
      type: Array,
      default: function () {
        return []
      }
    },
    iteration: {
      type: Number,
      default: 0
    },
    collapseEnable: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  data () {
    return {
      env: {
        collapsedSet: new Set()
      }
    }
  },
  mounted () {
    this.$props.sublist.map((entry) => {
      if (entry.children) {
        if (this.$props.collapseEnable && entry.defaultCollapsed === true) {
          this.$refs[`${entry.id}_sublayer`].map((node) => {
            node.style.maxHeight = `0px`;
          });
          this._toggleCollapsed(entry, 'hide');
        } else {
          this.$refs[`${entry.id}_sublayer`].map((node) => {
            node.style.maxHeight = `${node.scrollHeight}px`;
          });
        }
      }
    });
  },
  methods: {
    clickEntry: function (entry) {
      this.$emit('clickEntry', entry);
    },
    toggleCollapsed: function (entry) {
      this.$emit('toggleCollapsed', entry);
    },
    _toggleCollapsed: function (entry, state) {
      if (typeof entry.id === 'undefined') {
        console.error('BTB ERROR: Please make sure every entry has id.');
        return false
      }
      if (!this.$props.collapseEnable) {
        this.$emit('clickEntry', entry);
        return false
      }

      switch (state) {
        case 'hide':
          this.env.collapsedSet.add(entry.id);
          this.resizeLayer(entry.id, state);
          this.$emit('toggleCollapsed', entry);
          this.$forceUpdate();
          break
        case 'show':
          this.env.collapsedSet.delete(entry.id);
          this.resizeLayer(entry.id, state);
          this.$emit('toggleCollapsed', entry);
          this.$forceUpdate();
          break
        default:
          this._toggleCollapsed(entry, (this.env.collapsedSet.has(entry.id)) ? 'show' : 'hide');
          break
      }
    },
    resizeLayer: function (id, state) {
      switch (state) {
        case 'hide':
          this.$refs[`${id}_sublayer`].map((node) => {
            node.style.maxHeight = '0px';
            this.$emit('updateLayerSize', -1 * node.scrollHeight);
          });
          break
        case 'show':
          this.$refs[`${id}_sublayer`].map((node) => {
            node.style.maxHeight = `${node.scrollHeight}px`;
            this.$emit('updateLayerSize', node.scrollHeight);
          });
          break
      }
    },
    updateLayer: function (height, id) {
      this.$refs[`${id}_sublayer`].map((node) => {
        node.style.maxHeight = `${node.scrollHeight + height}px`;
        this.$emit('updateLayerSize', height);
      });
    }
  }
};

/* script */
const __vue_script__$1 = script$1;
/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    _vm._g(
      { class: "btb-vue-list-layer layer-" + _vm.iteration },
      _vm.$listeners
    ),
    [
      _vm._l(_vm.sublist, function(entry) {
        return [
          entry.children
            ? [
                _c(
                  "div",
                  { key: entry.id, staticClass: "layer_container" },
                  [
                    _c(
                      "div",
                      {
                        class: [
                          "container_entry entry-" + entry.id,
                          { "entry-collapsable": _vm.$props.collapseEnable }
                        ],
                        on: {
                          click: function($event) {
                            return _vm._toggleCollapsed(entry)
                          }
                        }
                      },
                      [
                        _c("div", { staticClass: "entry_title" }, [
                          _vm._v(
                            "\n            " +
                              _vm._s(entry.title) +
                              "\n          "
                          )
                        ]),
                        _vm._v(" "),
                        _vm.$props.collapseEnable
                          ? [
                              _c(
                                "div",
                                {
                                  class: [
                                    "entry_collapseBtn collapseBtn-default",
                                    {
                                      "collapseBtn-on": _vm.env.collapsedSet.has(
                                        entry.id
                                      )
                                    }
                                  ]
                                },
                                [
                                  _c("div", {
                                    staticClass: "collapseBtn_arrow"
                                  })
                                ]
                              )
                            ]
                          : _vm._e()
                      ],
                      2
                    ),
                    _vm._v(" "),
                    entry.children.length > 0
                      ? [
                          _c(
                            "div",
                            {
                              ref: entry.id + "_sublayer",
                              refInFor: true,
                              staticClass: "container_sublayer",
                              attrs: { id: entry.id + "_sublayer" }
                            },
                            [
                              _c("btb-vue-list-layer", {
                                attrs: {
                                  sublist: entry.children,
                                  iteration: _vm.iteration + 1,
                                  collapseEnable: _vm.$props.collapseEnable
                                },
                                on: {
                                  updateLayerSize: function(event) {
                                    return _vm.updateLayer(event, entry.id)
                                  },
                                  clickEntry: _vm.clickEntry,
                                  toggleCollapsed: _vm.toggleCollapsed
                                }
                              })
                            ],
                            1
                          )
                        ]
                      : _vm._e()
                  ],
                  2
                )
              ]
            : [
                _c("div", { key: entry.id, staticClass: "layer_container" }, [
                  _c(
                    "div",
                    {
                      class: "container_entry entry-" + entry.id,
                      on: {
                        click: function($event) {
                          return _vm.clickEntry(entry)
                        }
                      }
                    },
                    [
                      _c("div", { staticClass: "entry_title" }, [
                        _vm._v(
                          "\n            " +
                            _vm._s(entry.title) +
                            "\n          "
                        )
                      ])
                    ]
                  )
                ])
              ]
        ]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$1 = normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    undefined,
    undefined,
    undefined
  );

__vue_component__.install = function (Vue) {
  Vue.component(__vue_component__.name, __vue_component__);
  Vue.component(__vue_component__$1.name, __vue_component__$1);
};

const InstallList = {
  List: __vue_component__
};

const install = function (Vue) {
  if (install.installed) {
    /* istanbul ignore next */
    return
  }
  install.installed = true;

  registerPlugins(Vue, InstallList);
};

install.installed = false;

const componentsInstaller = {
  install: install,
  module: __vue_component__
};

vueUse(componentsInstaller);

module.exports = componentsInstaller;
