<template>
  <div>
    <el-form label-width="80px" label-position="top">
      <el-form-item label="列数">
        <el-slider class="inner" v-model="setting.column" :min="1" :max="8" />
      </el-form-item>
      <el-form-item label="书签间隔">
        <el-slider class="inner" v-model="setting.gap" :min="0" :max="32" />
      </el-form-item>
      <el-form-item label="宽度">
        <el-slider class="inner" v-model="setting.width" :min="30" :max="90" />
      </el-form-item>
      <el-form-item label="背景颜色">
        <el-color-picker class="inner" v-model="setting.bgColor" show-alpha />
      </el-form-item>
      <el-form-item label="背景图片">
        <upload-image v-model:image="setting.bgImage"></upload-image>
      </el-form-item>
      <el-form-item>
        <el-space>
          <el-button @click="exportData" type="success" plain>导出</el-button>
          <el-upload action="#" :auto-upload="false" class="cusUpload" :on-change="importFile" :show-file-list="false">
            <el-button type="warning" plain>导入</el-button>
          </el-upload>
        </el-space>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useSettingStore } from '@/stores/setting'
import { useBookmarksStore } from "@/stores/bookmarks"
import { storeToRefs } from 'pinia';
import UploadImage from './UploadImage.vue';
import fileDownload from "js-file-download";
import { ElMessage } from 'element-plus';

const settingStore = useSettingStore()
const { setting } = storeToRefs(settingStore)
const bookmarksStore = useBookmarksStore()
const { bookmarks } = storeToRefs(bookmarksStore)

function exportData() {
  const data = {
    setting: { ...setting.value },
    bookmarks: [...bookmarks.value]
  }
  const currentDate = new Date().toLocaleString()
  fileDownload(JSON.stringify(data), `我的书签导出数据${currentDate}.txt`)
}

function importFile(file: any) {
  if (file) {
    const fileReader = new FileReader()
    fileReader.readAsText(file.raw, 'utf-8')
    fileReader.onloadend = () => {
      const { result } = fileReader
      const { setting, bookmarks } = JSON.parse(result as string)
      settingStore.updateSetting(setting)
      bookmarksStore.updateBookmarks(bookmarks)

    }
    fileReader.onerror = () => {
      ElMessage.error("读取文件错误")
    }
  }
}

watch(setting, () => {
  settingStore.updateSetting(setting.value)
})
</script>

<style lang="scss" scoped>
.upload-background-image {
  display: flex;
  flex-direction: column;
}

.background-image {
  width: 80%;
  object-fit: contain;
  margin-top: 10px;
}
</style>