<template>
  <div class="btb-vue-list" :style="{ ...getStyle(['btb-vue-list'], props.styleObj) }">
    <btb-vue-list-layer id="root" :activeID="activeEntryID" :subdataList="props.dataList" :styleObj="props.styleObj"
      :collapseEnable="props.collapseEnable" :iteration="0" @clickEntry="clickEntry" @toggleCollapsed="toggleCollapsed">
      <template v-for="name in slotList" #[name]>
        <slot :name="name" />
      </template>
    </btb-vue-list-layer>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import type { ListItemObj } from "../../types/index";

import { defineComponent, onMounted, onUpdated, computed, provide, ref } from "vue";

import { getStyle } from "../utils/styleMethods";
import BtbVueListLayer from './ListLayer.vue';

export default defineComponent({
  name: "btb-vue-list",
  props: {
    dataList: {
      type: Array as PropType<ListItemObj[]>,
      default: function () {
        return [];
      },
    },
    collapseEnable: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    defaultActiveID: {
      type: String,
    },
    activeID: {
      type: String,
    },
    styleObj: {
      type: Object,
      default: function () {
        return undefined;
      },
    },
  },
  emits: ["update:activeID", "clickEntry", "toggleCollapsed"],
  setup(props, { emit, slots }) {
    const activeEntryID = ref(props.activeID || props.defaultActiveID || "");

    const slotList = computed(() => {
      return Object.keys(slots);
    });

    const clickEntry = (entry: ListItemObj) => {
      changeActiveID(entry.id);
      emit("clickEntry", entry);
    };

    const changeActiveID = (id: string) => {
      activeEntryID.value = id;
      if (typeof props.activeID !== "undefined") {
        emit("update:activeID", id);
      }
    };

    const toggleCollapsed = (entry: ListItemObj) => {
      emit("toggleCollapsed", entry);
    };

    onUpdated(() => {
      if (typeof props.activeID !== "undefined") {
        changeActiveID(props.activeID);
      }
    })

    provide("BtbVueList-activeEntryID", activeEntryID);
    return {
      BtbVueListLayer,
      getStyle,

      props,
      slotList,
      activeEntryID,

      clickEntry,
      changeActiveID,
      toggleCollapsed,
    };
  },
})
</script>

<style lang="scss">
.btb-vue-list {}
</style>