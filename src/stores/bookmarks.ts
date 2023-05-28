import { defineStore } from "pinia";
import { ref } from "vue";
import { nanoid } from "nanoid";

interface Bookmark {
  id?: string;
  title: string;
  cover?: string;
  url: string;
}

interface Group {
  id?: string;
  title: string;
  list: Bookmark[];
}

export const useBookmarksStore = defineStore("bookmarks", () => {
  const bookmarks = ref<Group[]>([{ id: "homepage", title: "首页", list: [] }]);
  const activeGroupIndex = ref(0);

  function addGroup(title: string) {
    const group: Group = {
      id: nanoid(),
      title,
      list: [],
    };
    bookmarks.value.push(group);
    activeGroupIndex.value = bookmarks.value.length - 1;
  }

  function renameGroup(index: number, title: string) {
    bookmarks.value[index].title = title;
  }

  function deleteGroup(index: number) {
    bookmarks.value.splice(index, 1);
    if (bookmarks.value.length === 0) {
      bookmarks.value.push({ id: "homepage", title: "首页", list: [] });
    }
    activeGroupIndex.value = 0;
  }

  function addBookmark(bookmark: Bookmark) {
    bookmark.id = nanoid();
    bookmarks.value[activeGroupIndex.value].list.push({ ...bookmark });
  }

  function editBookmark(bookmarkIndex: number, bookmark: Bookmark) {
    bookmarks.value[activeGroupIndex.value].list[bookmarkIndex] = {
      ...bookmark,
    };
  }

  function deleteBookmark(groupIndex: number, bookmarkIndex: number) {
    bookmarks.value[groupIndex].list.splice(bookmarkIndex, 1);
  }

  function updateBookmarks(storage: Group[]) {
    bookmarks.value = storage;
  }

  function updateActiveGroupIndex(index: number) {
    activeGroupIndex.value = index;
  }

  return {
    bookmarks,
    activeGroupIndex,
    addBookmark,
    editBookmark,
    deleteBookmark,
    addGroup,
    renameGroup,
    deleteGroup,
    updateBookmarks,
    updateActiveGroupIndex,
  };
});
