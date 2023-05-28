<template>
  <HomePage></HomePage>
</template>

<script setup lang="ts">
import localForage from "localforage";
import { useSettingStore } from '@/stores/setting'
import { useBookmarksStore } from '@/stores/bookmarks'
import HomePage from './views/index.vue';
import { ref } from 'vue';
const settingStore = useSettingStore()
const bookmarksStore = useBookmarksStore()
localForage.getItem('navigation-setting-state').then(res => {
  if (res) {
    const setting = (JSON.parse(res as string)).setting
    settingStore.updateSetting(setting)
  }
})
localForage.getItem('navigation-bookmarks-state').then(res => {
  if (res) {
    const { bookmarks, activeGroupIndex } = JSON.parse(res as string)
    bookmarksStore.updateBookmarks(bookmarks)
    bookmarksStore.updateActiveGroupIndex(activeGroupIndex)
  }
})

const deferredPrompt = ref()
async function install() {
  deferredPrompt.value.prompt()
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt.value = e;
});
</script>


<style scoped></style>
