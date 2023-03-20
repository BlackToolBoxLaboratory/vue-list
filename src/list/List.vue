<template>
  <div class="btb-vue-list" :style="{ ...getStyle(['btb-vue-list'], props.styleObj) }">
    <btb-vue-list-layer id="root" :activeID="activeEntryID" :subdataList="props.dataList" :styleObj="props.styleObj"
      :collapseEnable="props.collapseEnable" :iteration="0" @clickEntry="clickEntry" @toggleCollapsed="toggleCollapsed">
      <template v-for="name in slotList" #[name]="slotProps">
        <slot :name="name" :="slotProps"/>
      </template>
    </btb-vue-list-layer>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import type { ListItemObj } from "../types";

import { defineComponent, onUpdated, computed, provide, ref, watch } from "vue";

import { getStyle } from "../utils/styleMethods";

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
    const activeEntryID = ref(props.activeID);

    const slotList = computed(() => {
      return Object.keys(slots);
    });

    const clickEntry = (entry: ListItemObj) => {
      changeActiveID(entry.id);
      emit("clickEntry", entry);
    };

    const changeActiveID = (id: string) => {
      if (typeof props.activeID !== "undefined") {
        activeEntryID.value = id;
      }
      emit("update:activeID", id);
    };

    const toggleCollapsed = (entry: ListItemObj) => {
      emit("toggleCollapsed", entry);
    };

    onUpdated(() => {
      if (typeof props.activeID !== "undefined") {
        changeActiveID(props.activeID);
      }
    })

    watch(
      () => props.activeID,
      (newValue, oldValue) => {
        activeEntryID.value = newValue;
      }
    )

    provide("BtbVueList-activeEntryID", activeEntryID);
    return {
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