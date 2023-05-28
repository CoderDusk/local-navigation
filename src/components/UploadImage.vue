<template>
  <div>
    <div class="upload-background-image">
      <el-space>
        <el-upload action="#" :auto-upload="false" class="cusUpload" :on-change="getFile" :show-file-list="false">
          <el-button type="primary">上传图片</el-button>
        </el-upload>
        <el-button type="danger" @click="clearImage">清除</el-button>
      </el-space>
      <br>
      <img v-if="image" :src="image" class="background-image" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { image } = defineProps(['image'])
const emits = defineEmits(['update:image'])
//图片转base64
const getFile = (file: any) => {
  getBase64(file.raw).then(res => {
    emits('update:image', res)
  })
}

function getBase64(file: File) {
  return new Promise(function (resolve, reject) {
    let reader = new FileReader();
    let imgResult = "";
    reader.readAsDataURL(file);
    reader.onload = function () {
      imgResult = reader.result as string;
    };
    reader.onerror = function (error) {
      reject(error);
    };
    reader.onloadend = function () {
      resolve(imgResult);
    };
  });
}

function clearImage() {
  emits('update:image', "")
}
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