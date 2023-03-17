'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');

var getStyle = function (classList, styleObj) {
    var classObj = {};
    classList.forEach(function (classname) {
        classObj = Object.assign({}, classObj, searchStyleByClassName(classname, styleObj));
    });
    return classObj;
};
var searchStyleByClassName = function (classname, styleObj) {
    var result = {};
    if (typeof styleObj === "object") {
        Object.keys(styleObj).find(function (specname) {
            if (specname === classname) {
                result = Object.assign({}, styleObj[specname]);
                return true;
            }
        });
    }
    return result;
};

var script$1 = vue.defineComponent({
    name: "btb-vue-list",
    props: {
        dataList: {
            type: Array,
            "default": function () {
                return [];
            }
        },
        collapseEnable: {
            type: Boolean,
            "default": function () {
                return false;
            }
        },
        activeID: {
            type: String
        },
        styleObj: {
            type: Object,
            "default": function () {
                return undefined;
            }
        }
    },
    emits: ["update:activeID", "clickEntry", "toggleCollapsed"],
    setup: function (props, _a) {
        var emit = _a.emit, slots = _a.slots;
        var activeEntryID = vue.ref(props.activeID || "");
        var slotList = vue.computed(function () {
            return Object.keys(slots);
        });
        var clickEntry = function (entry) {
            changeActiveID(entry.id);
            emit("clickEntry", entry);
        };
        var changeActiveID = function (id) {
            activeEntryID.value = id;
            if (typeof props.activeID !== "undefined") {
                emit("update:activeID", id);
            }
        };
        var toggleCollapsed = function (entry) {
            emit("toggleCollapsed", entry);
        };
        vue.onUpdated(function () {
            if (typeof props.activeID !== "undefined") {
                changeActiveID(props.activeID);
            }
        });
        vue.provide("BtbVueList-activeEntryID", activeEntryID);
        return {
            getStyle: getStyle,
            props: props,
            slotList: slotList,
            activeEntryID: activeEntryID,
            clickEntry: clickEntry,
            changeActiveID: changeActiveID,
            toggleCollapsed: toggleCollapsed
        };
    }
});

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_btb_vue_list_layer = vue.resolveComponent("btb-vue-list-layer");

  return (vue.openBlock(), vue.createElementBlock("div", {
    class: "btb-vue-list",
    style: vue.normalizeStyle({ ..._ctx.getStyle(['btb-vue-list'], _ctx.props.styleObj) })
  }, [
    vue.createVNode(_component_btb_vue_list_layer, {
      id: "root",
      activeID: _ctx.activeEntryID,
      subdataList: _ctx.props.dataList,
      styleObj: _ctx.props.styleObj,
      collapseEnable: _ctx.props.collapseEnable,
      iteration: 0,
      onClickEntry: _ctx.clickEntry,
      onToggleCollapsed: _ctx.toggleCollapsed
    }, vue.createSlots({ _: 2 /* DYNAMIC */ }, [
      vue.renderList(_ctx.slotList, (name) => {
        return {
          name: name,
          fn: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, name)
          ])
        }
      })
    ]), 1032 /* PROPS, DYNAMIC_SLOTS */, ["activeID", "subdataList", "styleObj", "collapseEnable", "onClickEntry", "onToggleCollapsed"])
  ], 4 /* STYLE */))
}

script$1.render = render$1;
script$1.__file = "src/list/List.vue";

var script = vue.defineComponent({
    name: "btb-vue-list-layer",
    props: {
        subdataList: {
            type: Array,
            "default": function () {
                return [];
            }
        },
        iteration: {
            type: Number,
            "default": 0
        },
        collapseEnable: {
            type: Boolean,
            "default": function () {
                return false;
            }
        },
        styleObj: {
            type: Object,
            "default": function () {
                return undefined;
            }
        }
    },
    emits: ["clickEntry", "toggleCollapsed", "updateLayerSize"],
    setup: function (props, _a) {
        var emit = _a.emit, slots = _a.slots;
        var activeID = vue.inject("BtbVueList-activeEntryID");
        var collapsedSet = vue.reactive(new Set());
        var refList = vue.reactive({});
        var slotList = vue.computed(function () {
            return Object.keys(slots);
        });
        var clickEntry = function (entry) {
            emit("clickEntry", entry);
        };
        var toggleCollapsed = function (entry) {
            emit("toggleCollapsed", entry);
        };
        var toggleCollapsedHandler = function (entry, state) {
            if (typeof entry.id === "undefined") {
                console.error("BTB ERROR: Please make sure every entry has id.");
                return false;
            }
            if (!props.collapseEnable) {
                emit("clickEntry", entry);
                return false;
            }
            switch (state) {
                case "hide":
                    collapsedSet.add(entry.id);
                    resizeLayer(entry.id, state);
                    emit("toggleCollapsed", entry);
                    break;
                case "show":
                    collapsedSet["delete"](entry.id);
                    resizeLayer(entry.id, state);
                    emit("toggleCollapsed", entry);
                    break;
                default:
                    toggleCollapsedHandler(entry, collapsedSet.has(entry.id) ? "show" : "hide");
                    break;
            }
        };
        var resizeLayer = function (id, state) {
            var targetNode = refList["".concat(id, "_sublayer")];
            if (!!targetNode) {
                switch (state) {
                    case "hide":
                        targetNode.style.maxHeight = "0px";
                        emit("updateLayerSize", -1 * Math.ceil(targetNode.scrollHeight));
                        break;
                    case "show":
                        targetNode.style.maxHeight = "".concat(Math.ceil(targetNode.scrollHeight), "px");
                        emit("updateLayerSize", Math.ceil(targetNode.scrollHeight));
                        break;
                }
            }
        };
        var updateLayer = function (height, id) {
            var targetNode = refList["".concat(id, "_sublayer")];
            if (!!targetNode) {
                targetNode.style.maxHeight = "".concat(Math.ceil(targetNode.scrollHeight) + height, "px");
                emit("updateLayerSize", height);
            }
        };
        vue.onMounted(function () {
            props.subdataList.map(function (entry) {
                var targetNode = refList["".concat(entry.id, "_sublayer")];
                if (!!targetNode && entry.children) {
                    if (props.collapseEnable && entry.defaultCollapsed === true) {
                        targetNode.style.maxHeight = "0px";
                        toggleCollapsedHandler(entry, "hide");
                    }
                    else {
                        targetNode.style.maxHeight = "".concat(Math.ceil(targetNode.scrollHeight), "px");
                    }
                }
            });
        });
        return {
            getStyle: getStyle,
            props: props,
            activeID: activeID,
            refList: refList,
            slotList: slotList,
            collapsedSet: collapsedSet,
            clickEntry: clickEntry,
            toggleCollapsed: toggleCollapsed,
            toggleCollapsedHandler: toggleCollapsedHandler,
            resizeLayer: resizeLayer,
            updateLayer: updateLayer
        };
    }
});

const _hoisted_1 = ["onClick"];
const _hoisted_2 = ["id"];
const _hoisted_3 = ["onClick"];
const _hoisted_4 = ["href"];

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_btb_vue_list_layer = vue.resolveComponent("btb-vue-list-layer");

  return (vue.openBlock(), vue.createElementBlock("ul", {
    class: vue.normalizeClass(`btb-vue-list-layer layer-${_ctx.props.iteration}`),
    style: vue.normalizeStyle({ ..._ctx.getStyle(['btb-vue-list-layer', `layer-${_ctx.props.iteration}`], _ctx.props.styleObj) })
  }, [
    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.props.subdataList, (entry) => {
      return (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
        (entry.children)
          ? (vue.openBlock(), vue.createElementBlock("li", {
              class: "layer_container",
              style: vue.normalizeStyle({ ..._ctx.getStyle(['layer_container'], _ctx.props.styleObj) }),
              key: entry.id
            }, [
              vue.createElementVNode("div", {
                class: vue.normalizeClass([`container_entry entry-${entry.id}`, { 'entry-collapsable': _ctx.props.collapseEnable }, { 'entry-active': _ctx.activeID && _ctx.activeID === entry.id }]),
                style: vue.normalizeStyle({
              'padding-left': `${_ctx.props.iteration}rem`,
              ..._ctx.getStyle([
                'container_entry',
                `entry-${entry.id}`,
                (_ctx.props.collapseEnable && 'entry-collapsable') || '',
                _ctx.activeID && _ctx.activeID === entry.id ? 'entry-active' : '',
              ], _ctx.props.styleObj),
            }),
                onClick: $event => (_ctx.toggleCollapsedHandler(entry))
              }, [
                vue.createElementVNode("div", {
                  class: "entry_title",
                  style: vue.normalizeStyle({ ..._ctx.getStyle(['entry_title'], _ctx.props.styleObj) })
                }, [
                  (_ctx.$slots[entry.id])
                    ? vue.renderSlot(_ctx.$slots, entry.id, { key: 0 })
                    : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                        vue.createTextVNode(vue.toDisplayString(entry.title), 1 /* TEXT */)
                      ], 64 /* STABLE_FRAGMENT */))
                ], 4 /* STYLE */),
                (_ctx.props.collapseEnable)
                  ? (vue.openBlock(), vue.createElementBlock("div", {
                      key: 0,
                      class: vue.normalizeClass(['entry_collapseBtn collapseBtn-default', { 'collapseBtn-on': _ctx.collapsedSet.has(entry.id) }]),
                      style: vue.normalizeStyle({
                  ..._ctx.getStyle([
                    'entry_collapseBtn',
                    'collapseBtn-default',
                    (_ctx.collapsedSet.has(entry.id) && 'collapseBtn-on') || '',
                  ], _ctx.props.styleObj),
                })
                    }, [
                      vue.createElementVNode("div", {
                        class: "collapseBtn_arrow",
                        style: vue.normalizeStyle({ ..._ctx.getStyle(['collapseBtn_arrow'], _ctx.props.styleObj) })
                      }, null, 4 /* STYLE */)
                    ], 6 /* CLASS, STYLE */))
                  : vue.createCommentVNode("v-if", true)
              ], 14 /* CLASS, STYLE, PROPS */, _hoisted_1),
              (entry.children.length > 0)
                ? (vue.openBlock(), vue.createElementBlock("div", {
                    key: 0,
                    class: "container_sublayer",
                    id: `${entry.id}_sublayer`,
                    style: vue.normalizeStyle({ ..._ctx.getStyle(['container_sublayer'], _ctx.props.styleObj) }),
                    ref_for: true,
                    ref: (el) => { _ctx.refList[`${entry.id}_sublayer`] = el; }
                  }, [
                    vue.createVNode(_component_btb_vue_list_layer, {
                      activeID: _ctx.activeID,
                      subdataList: entry.children,
                      styleObj: _ctx.props.styleObj,
                      iteration: _ctx.props.iteration + 1,
                      collapseEnable: _ctx.props.collapseEnable,
                      onUpdateLayerSize: (height) => _ctx.updateLayer(height, entry.id),
                      onClickEntry: _ctx.clickEntry,
                      onToggleCollapsed: _ctx.toggleCollapsed
                    }, vue.createSlots({ _: 2 /* DYNAMIC */ }, [
                      vue.renderList(_ctx.slotList, (name) => {
                        return {
                          name: name,
                          fn: vue.withCtx(() => [
                            vue.renderSlot(_ctx.$slots, name)
                          ])
                        }
                      })
                    ]), 1032 /* PROPS, DYNAMIC_SLOTS */, ["activeID", "subdataList", "styleObj", "iteration", "collapseEnable", "onUpdateLayerSize", "onClickEntry", "onToggleCollapsed"])
                  ], 12 /* STYLE, PROPS */, _hoisted_2))
                : vue.createCommentVNode("v-if", true)
            ], 4 /* STYLE */))
          : (vue.openBlock(), vue.createElementBlock("li", {
              class: "layer_container",
              style: vue.normalizeStyle({ ..._ctx.getStyle(['layer_container'], _ctx.props.styleObj) }),
              key: entry.id
            }, [
              vue.createElementVNode("div", {
                class: vue.normalizeClass(['container_entry', `entry-${entry.id}`, { 'entry-active': _ctx.activeID && _ctx.activeID === entry.id },]),
                style: vue.normalizeStyle({
              'padding-left': `${_ctx.props.iteration}rem`,
              ..._ctx.getStyle([
                'container_entry',
                `entry-${entry.id}`,
                _ctx.activeID && _ctx.activeID === entry.id ? 'entry-active' : '',
              ], _ctx.props.styleObj),
            }),
                onClick: $event => (_ctx.clickEntry(entry))
              }, [
                vue.createElementVNode("div", {
                  class: "entry_title",
                  style: vue.normalizeStyle({ ..._ctx.getStyle(['entry_title'], _ctx.props.styleObj) })
                }, [
                  (_ctx.$slots[entry.id])
                    ? vue.renderSlot(_ctx.$slots, entry.id, { key: 0 })
                    : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                        (typeof entry.href == 'undefined')
                          ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                              vue.createTextVNode(vue.toDisplayString(entry.title), 1 /* TEXT */)
                            ], 64 /* STABLE_FRAGMENT */))
                          : (vue.openBlock(), vue.createElementBlock("a", {
                              key: 1,
                              className: "title_link",
                              href: entry.href
                            }, vue.toDisplayString(entry.title), 9 /* TEXT, PROPS */, _hoisted_4))
                      ], 64 /* STABLE_FRAGMENT */))
                ], 4 /* STYLE */)
              ], 14 /* CLASS, STYLE, PROPS */, _hoisted_3)
            ], 4 /* STYLE */))
      ], 64 /* STABLE_FRAGMENT */))
    }), 256 /* UNKEYED_FRAGMENT */))
  ], 6 /* CLASS, STYLE */))
}

script.render = render;
script.__file = "src/list/ListLayer.vue";

var install = function (app) {
    if (install.installed) {
        /* istanbul ignore next */
        return;
    }
    install.installed = true;
    app.component(script$1.name, script$1);
    app.component(script.name, script);
};
install.installed = false;
var componentInstaller = {
    install: install
};

exports.List = script$1;
exports.ListLayer = script;
exports.default = componentInstaller;
exports.install = install;
