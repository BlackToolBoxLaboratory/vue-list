<template>
  <ul :class="`btb-vue-list-layer layer-${props.iteration}`"
    :style="{ ...getStyle(['btb-vue-list-layer', `layer-${props.iteration}`]) }">
    <template v-for="entry in props.subdataList">
      <template v-if="entry.children">
        <li class="layer_container" :style="{ ...getStyle(['layer_container']) }" :key="entry.id">
          <div
            :class="[`container_entry entry-${entry.id}`, { 'entry-collapsable': props.collapseEnable }, { 'entry-active': activeID && activeID === entry.id }]"
            :style="{
              'padding-left': `${props.iteration}rem`,
              ...getStyle([
                'container_entry',
                `entry-${entry.id}`,
                (props.collapseEnable && 'entry-collapsable') || '',
                activeID && activeID === entry.id ? 'entry-active' : '',
              ]),
            }" @click="toggleCollapsedHandler(entry)">
            <div class="entry_title" :style="{ ...getStyle(['entry_title']) }">
              <template v-if="$slots[entry.id]">
                <slot :name="entry.id" />
              </template>
              <template v-else>
                {{ entry.title }}
              </template>
            </div>
            <template v-if="props.collapseEnable">
              <div :class="['entry_collapseBtn collapseBtn-default', { 'collapseBtn-on': collapsedSet.has(entry.id) }]"
                :style="{
                  ...getStyle([
                    'entry_collapseBtn',
                    'collapseBtn-default',
                    (collapsedSet.has(entry.id) && 'collapseBtn-on') || '',
                  ]),
                }">
                <div class="collapseBtn_arrow" :style="{ ...getStyle(['collapseBtn_arrow']) }" />
              </div>
            </template>
          </div>
          <template v-if="entry.children.length > 0">
            <div class="container_sublayer" :id="`${entry.id}_sublayer`" :style="{ ...getStyle(['container_sublayer']) }"
              :ref="(el) => { refList[`${entry.id}_sublayer`] = el }">
              <btb-vue-list-layer :activeID="activeID" :subdataList="entry.children" :styleObj="props.styleObj"
                :iteration="props.iteration + 1" :collapseEnable="props.collapseEnable"
                @updateLayerSize="(height) => updateLayer(height, entry.id)" @clickEntry="clickEntry"
                @toggleCollapsed="toggleCollapsed">
              </btb-vue-list-layer>
            </div>
          </template>
        </li>
      </template>
      <template v-else>
        <li class="layer_container" :style="{ ...getStyle(['layer_container']) }" :key="entry.id">
          <div :class="['container_entry', `entry-${entry.id}`, { 'entry-active': activeID && activeID === entry.id },]"
            :style="{
              'padding-left': `${props.iteration}rem`,
              ...getStyle([
                'container_entry',
                `entry-${entry.id}`,
                activeID && activeID === entry.id ? 'entry-active' : '',
              ]),
            }" @click="clickEntry(entry)">
            <div class="entry_title" :style="{ ...getStyle(['entry_title']) }">
              <template v-if="$slots[entry.id]">
                <slot :name="entry.id" />
              </template>
              <template v-else>
                <template v-if="typeof entry.href == 'undefined'">
                  {{ entry.title }}
                </template>
                <template v-else>
                  <a className="title_link" :href="entry.href">{{entry.title}}</a>
                </template>
              </template>
            </div>
          </div>
        </li>
      </template>
    </template>
  </ul>
</template>

<script lang="ts">
import type { PropType } from "vue";
import type { ListItemObj } from "../../types/index";

import {
  defineComponent,
  onMounted,
  reactive,
  inject,
} from "vue";

import { getStyle } from "../utils/styleMethods";

export default defineComponent({
  name: "btb-vue-list-layer",
  props: {
    subdataList: {
      type: Array as PropType<ListItemObj[]>,
      default: function () {
        return [];
      },
    },
    iteration: {
      type: Number,
      default: 0,
    },
    collapseEnable: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    styleObj: {
      type: Object,
      default: function () {
        return undefined;
      },
    }
  },
  emits: ["clickEntry", "toggleCollapsed", "updateLayerSize"],
  setup(props, { emit, slots }) {
    const activeID = inject<string>("BtbVueList-activeEntryID");
    const collapsedSet = reactive(new Set<string>());

    const refList = reactive<any>({});

    const clickEntry = (entry: ListItemObj) => {
      emit("clickEntry", entry);
    };
    const toggleCollapsed = (entry: ListItemObj) => {
      emit("toggleCollapsed", entry);
    };
    const toggleCollapsedHandler = (
      entry: ListItemObj,
      state?: "show" | "hide"
    ) => {
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
          collapsedSet.delete(entry.id);
          resizeLayer(entry.id, state);
          emit("toggleCollapsed", entry);
          break;
        default:
          toggleCollapsedHandler(
            entry,
            collapsedSet.has(entry.id) ? "show" : "hide"
          );
          break;
      }
    };
    const resizeLayer = (id: string, state: "show" | "hide") => {
      const targetNode = refList[`${id}_sublayer`];
      if (!!targetNode) {
        switch (state) {
          case "hide":
            targetNode.style.maxHeight = "0px";
            emit("updateLayerSize", -1 * Math.ceil(targetNode.scrollHeight));
            break;
          case "show":
            targetNode.style.maxHeight = `${Math.ceil(targetNode.scrollHeight)}px`;
            emit("updateLayerSize", Math.ceil(targetNode.scrollHeight));
            break;
          default:
            break;
        }
      }
    };
    const updateLayer = (height: number, id: string) => {
      const targetNode = refList[`${id}_sublayer`];
      if (!!targetNode) {
        targetNode.style.maxHeight = `${Math.ceil(targetNode.scrollHeight) + height}px`;
        emit("updateLayerSize", height);
      }
    };

    onMounted(() => {
      props.subdataList.map((entry: ListItemObj) => {
        const targetNode = refList[`${entry.id}_sublayer`];
        if (!!targetNode && entry.children) {
          if (props.collapseEnable && entry.defaultCollapsed === true) {
            targetNode.style.maxHeight = "0px";
            toggleCollapsedHandler(entry, "hide");
          } else {
            targetNode.style.maxHeight = `${Math.ceil(targetNode.scrollHeight)}px`;
          }
        }
      });
    })

    return {
      getStyle,

      props,
      activeID,
      refList,
      collapsedSet,

      clickEntry,
      toggleCollapsed,
      toggleCollapsedHandler,
      resizeLayer,
      updateLayer,
    }
  }
})
</script>

<style lang="scss">
.btb-vue-list-layer {
  margin: 0;
  padding: 0;

  .layer_container {
    list-style: none;
  }

  .container_entry {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;

    &.entry-collapsable {
      cursor: pointer;
    }

    .entry_title {
      flex-grow: 1;

      .title_link {
        color: inherit;
        text-decoration: inherit;
        background: inherit;
        display: block;
      }
    }

    .entry_collapseBtn {
      flex-shrink: 0;

      &.collapseBtn-default {
        height: 1rem;
        width: 1rem;
        transition: transform 0.5s ease 0s;
        display: flex;
        justify-content: center;
        align-items: center;

        .collapseBtn_arrow {
          border-color: currentColor transparent transparent;
          border-style: solid;
          border-width: 0.5rem 0.5rem 0;
          height: 0;
          width: 0;
        }

        &.collapseBtn-on {
          transform: rotate(90deg);
        }
      }
    }
  }

  .container_sublayer {
    overflow: hidden;
    transition: max-height 0.5s ease 0s;
  }
}
</style>
