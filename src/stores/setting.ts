import { defineStore } from "pinia";
import { ref } from "vue";

interface Setting {
  column: number;
  gap: number;
  width: number;
  bgColor: string;
  bgImage: string;
}

export const useSettingStore = defineStore("setting", () => {
  const setting = ref<Setting>({
    column: 4,
    gap: 16,
    width: 80,
    bgColor: "rgba(0,0,0,0.1)",
    bgImage: "",
  });

  function updateSetting(form: Setting) {
    setting.value = form;
  }

  return { setting, updateSetting };
});
