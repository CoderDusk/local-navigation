<template>
  <div @contextmenu.stop="rightClick">
    <NavBar v-model:isShowSettingDialog="isShowSettingDialog"></NavBar>
    <BookMarks @add-bookmark="addBookmark" @edit-bookmark="editBookmark"></BookMarks>

    <el-dialog v-model="isShowSettingDialog" title="设置" width="35%" :appendToBody="true">
      <Setting></Setting>
    </el-dialog>

    <el-dialog v-model="bookmarkDialog.isShow" :title="bookmarkDialog.type === 'add' ? '添加书签' : '编辑书签'"
      :before-close="beforeCloseBookmarkDialog">
      <el-form :model="bookmarkDialog.form" :rules="bookmarkFormRule" ref="bookmarkFormRef" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="bookmarkDialog.form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="网址" prop="url">
          <el-input v-model="bookmarkDialog.form.url" placeholder="请输入网址"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <UploadImage v-model:image="bookmarkDialog.form.cover"></UploadImage>
        </el-form-item>
        <el-form-item>
          <el-space>
            <el-button type="primary" @click="submitBookmark(bookmarkFormRef)">提交</el-button>
            <el-button @click="closeBookmarkDialog(bookmarkFormRef)">取消</el-button>
          </el-space>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export interface BookmarkForm {
  title: string,
  cover?: string,
  url: string,
}

export interface BookmarkDialog {
  isShow: boolean,
  form: BookmarkForm,
  type: string,
  index?: number
}
</script>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import BookMarks from '@/components/BookMarks.vue';
import Setting from '@/components/Setting.vue';
import ContextMenu from '@imengyu/vue3-context-menu'
import UploadImage from '@/components/UploadImage.vue'

import { reactive, ref } from 'vue';
import { useBookmarksStore } from '@/stores/bookmarks'
import { ElMessageBox, type FormInstance, type FormRules } from 'element-plus';

const bookmarksStore = useBookmarksStore()
const isShowSettingDialog = ref(false)
const bookmarkDialog = ref<BookmarkDialog>({
  isShow: false,
  form: { title: "", cover: "", url: "" },
  type: 'add'
})
const bookmarkFormRule = reactive<FormRules>({
  title: [{ required: true, message: "请输入书签标题", trigger: 'blur' }],
  url: [{ type: "url", required: true, message: "请输入书签网址", trigger: 'blur' }]
})

const addGroup = () => {
  ElMessageBox.prompt("请输入分组名称", "创建新分组", { confirmButtonText: "确认", cancelButtonText: "取消" }).then(value => { bookmarksStore.addGroup(value.value) })
}

const rightClick = (e: MouseEvent) => {
  e.preventDefault();
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      { label: "添加新书签", onClick: () => { addBookmark() } },
      { label: "创建新小组", onClick: () => { addGroup() } },
      { label: "设置", onClick: () => { isShowSettingDialog.value = true } },
    ]
  })
}

// 初始化时从indexedDB读取数据
const bookmarkFormRef = ref<FormInstance>()

function closeBookmarkDialog(formEl: FormInstance | undefined) {
  if (!formEl) return;
  formEl.resetFields()
  bookmarkDialog.value.isShow = false
}

function beforeCloseBookmarkDialog(done: Function) {
  closeBookmarkDialog(bookmarkFormRef.value)
  done()
}

function submitBookmark(formEl: FormInstance | undefined) {
  if (!formEl) return;
  formEl.validate(res => {
    if (res) {
      const { index, form } = bookmarkDialog.value
      if (bookmarkDialog.value.type === 'add') {
        bookmarksStore.addBookmark(form)
      } else if (bookmarkDialog.value.type === 'edit' && typeof index === 'number') {
        bookmarksStore.editBookmark(index, form)
      }
      closeBookmarkDialog(formEl)
    }
  })
}

function addBookmark() {
  bookmarkDialog.value.type = 'add'
  bookmarkDialog.value.isShow = true
}

function editBookmark(index: number, form: BookmarkForm) {
  bookmarkDialog.value = {
    type: 'edit',
    form,
    isShow: true,
    index
  }
}

</script>

<style scoped></style>