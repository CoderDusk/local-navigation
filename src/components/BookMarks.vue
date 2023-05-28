<template>
  <div class="container" :style="containerStyle">
    <div class="main" :style="mainStyle">
      <div class="bookmark-list" :style="{
        'grid-gap': setting.gap + 'px'
      }">
        <a @contextmenu.stop="rightClick($event, index, item)" class="bookmark-item" v-for="item, index in   list"
          :key="item.id" :href="item.url" target="_blank">
          <img class="cover" v-if="item.cover" :src="item.cover" :alt="item.title">
          <div v-else class="cover text-cover">
            <div class="text">{{ item.title }}</div>
          </div>
          <div class="title">{{ item.title }}</div>
        </a>
        <div class="bookmark-item add-bookmark" @click="emit('add-bookmark')">
          <el-icon color="gray" size="26">
            <Plus />
          </el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BookmarkForm } from '@/views/index.vue'
import { useBookmarksStore } from '@/stores/bookmarks'
import { useSettingStore } from '@/stores/setting'
import { computed } from '@vue/reactivity';
import { storeToRefs } from 'pinia';
import ContextMenu from '@imengyu/vue3-context-menu'

const bookmarkStore = useBookmarksStore()
const settingStore = useSettingStore()
const { bookmarks, activeGroupIndex } = storeToRefs(bookmarkStore)
const { setting } = storeToRefs(settingStore)

const mainStyle = computed(() => ({
  width: setting.value.width + '%',
}))

const containerStyle = computed(() => ({
  backgroundImage: `url(${setting.value.bgImage})`
}))

const list = computed(() => bookmarks.value[activeGroupIndex.value].list)

const emit = defineEmits(['add-bookmark', 'edit-bookmark'])

const rightClick = (e: MouseEvent, index: number, item: BookmarkForm) => {
  e.preventDefault();
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      { label: "编辑", onClick: () => { editBookmark(index, item) } },
      { label: "删除", onClick: () => { deleteBookmark(index) } },
    ]
  })
}

function deleteBookmark(index: number) {
  bookmarkStore.deleteBookmark(activeGroupIndex.value, index
  )
}

function editBookmark(index: number, form: BookmarkForm) {
  emit('edit-bookmark', index, form)
}
</script>

<style lang="scss" scoped>
.container {
  background-color: v-bind('setting.bgColor');
  min-height: calc(100vh - 55px);
  background-size: cover;
}

.main {
  padding: 100px 0;
  margin: 0 auto;
}

.bookmark-list {
  display: grid;
  grid-template-columns: repeat(v-bind('setting.column'), minmax(300px, 1fr));

  a {
    text-decoration: none;
    color: black;
  }
}

.bookmark-item {
  height: 210px;
  background-color: white;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  user-select: none;
  cursor: default;
  min-width: 0;

  .cover {
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
    object-fit: contain;
    flex: 1;
    height: 1px;
  }

  .text-cover {
    background-color: rgba(26, 118, 209, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
    font-size: 50px;
    padding: 10px;

    .text {
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
    }
  }

  .title {
    display: flex;
    justify-content: center;
    padding: 5px 0;
  }
}

.add-bookmark {
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-bookmark:hover {
  background-color: rgba($color: #000000, $alpha: 0.1);
}
</style>