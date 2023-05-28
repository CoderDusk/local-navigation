import { createApp } from "vue";
import { createPinia, type Store } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "reset-css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "@imengyu/vue3-context-menu/lib/vue3-context-menu.css";
import ContextMenu from "@imengyu/vue3-context-menu";
import localForage from "localforage";
import { useRegisterSW } from "virtual:pwa-register/vue";

useRegisterSW();

localForage.config({
  driver: localForage.INDEXEDDB, // This force IndexedDB as the driver
});

async function indexDbPlugin({ store }: { store: Store }) {
  const stored = await localForage.getItem(store.$id + "-state");
  if (stored) {
    store.$patch(stored);
  }

  store.$subscribe(() => {
    localForage.setItem(
      `navigation-${store.$id}-state`,
      JSON.stringify({ ...store.$state })
    ); // Destructure to transform to plain object
  });
}

import App from "./App.vue";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

const pinia = createPinia();
pinia.use(indexDbPlugin);

app.use(pinia);
app.use(ElementPlus);
app.use(ContextMenu);

app.mount("#app", true);
