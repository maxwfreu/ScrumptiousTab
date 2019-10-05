let count = 0;

const chromeUtil = chrome;

const processBookmark = (bookmarks) => {
  for (let i = 0; i < bookmarks.length; i += 1) {
    const bookmark = bookmarks[i];
    if (bookmark.id === '2') {
      return;
    }
    if (bookmark.url) {
      count += 1;
      window.localStorage.setItem(`scrumptious-bkm-title-${count}`, bookmark.title);
      window.localStorage.setItem(`scrumptious-bkm-url-${count}`, bookmark.url);
    }

    if (bookmark.children) {
      processBookmark(bookmark.children);
    }
  }
};

const saveBookMarks = () => {
  if (!chromeUtil.bookmarks) return;
  count = 0;
  chromeUtil.bookmarks.getTree(processBookmark);
  setTimeout(() => {
    window.localStorage.setItem('scrumptious-bkm-length', count);
  }, 1000);
};

if (chromeUtil.bookmarks) {
  chromeUtil.bookmarks.onCreated.addListener(saveBookMarks);
  chromeUtil.bookmarks.onRemoved.addListener(saveBookMarks);
  chromeUtil.bookmarks.onMoved.addListener(saveBookMarks);
  chromeUtil.bookmarks.onChanged.addListener(saveBookMarks);
}

// Check whether new version is installed
if (chromeUtil) {
  chromeUtil.runtime.onInstalled.addListener(saveBookMarks);
  const manifest = chromeUtil.runtime.getManifest();
  if (manifest.short_name === 'Scrumptious') {
    chromeUtil.runtime.setUninstallURL('https://www.scrumptioustab.com/uninstall');
  }

  chromeUtil.browserAction.onClicked.addListener(() => {
    window.open(`chrome-extension://${chromeUtil.runtime.id}/index.html#0`);
  });
}
