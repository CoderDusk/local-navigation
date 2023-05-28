<template>
  <div class="navbar">
    <div class="left nav-list">
      <div v-for="item, index in bookmarks" :key="item.id" class="nav-item" @contextmenu.stop="rightClick($event, index)"
        :class="{ 'active': activeGroupIndex === index }" @click="activeGroupIndex = index">{{ item.title }}
      </div>
    </div>
    <div class="right">
      <el-icon @click="toggleShowSettingDialog">
        <Setting />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBookmarksStore } from '@/stores/bookmarks'
import { storeToRefs } from 'pinia';
import ContextMenu from '@imengyu/vue3-context-menu'
import { ElMessageBox } from 'element-plus';
const props = defineProps(['isShowSettingDialog'])
const emits = defineEmits(["update:isShowSettingDialog"])

function toggleShowSettingDialog() {
  emits("update:isShowSettingDialog", !props.isShowSettingDialog)
}

const bookmarksStore = useBookmarksStore()
const { bookmarks, activeGroupIndex } = storeToRefs(bookmarksStore)

const rightClick = (e: MouseEvent, index: number) => {
  e.preventDefault();
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      { label: "重命名", onClick: () => { renameGroup(index) } },
      { label: "删除", onClick: () => { deleteGroup(index) } },
    ]
  })
}

function renameGroup(index: number) {
  ElMessageBox.prompt("请输入分组名称", "创建新分组", {
    confirmButtonText: "确认", cancelButtonText: "取消"
  }).then(value => {
    bookmarksStore.renameGroup(index, value.value)
  })
}

function deleteGroup(index: number) {
  bookmarksStore.deleteGroup(index)
}
</script>

<style scoped lang="scss">
.navbar {
  height: 55px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  align-items: center;
}

.nav-list {
  display: flex;
  height: 100%;

  .active {
    border-bottom: 1px solid black;
  }
}

.nav-item {
  padding: 0 5px;
  margin: 0 10px;
  height: 100%;
  display: flex;
  align-items: center;
  user-select: none;
  cursor: default;
}
</style>