function isBlocked(url) {
  return new Promise((resolve) => {
    chrome.storage.sync.get("blockedWebsites", function (result) {
      const blockedWebsites = result.blockedWebsites || [];
      const hostname = new URL(url).hostname;
      resolve(
        blockedWebsites.some(
          (blockedSite) =>
            hostname === blockedSite || hostname.endsWith(`.${blockedSite}`)
        )
      );
    });
  });
}

chrome.webNavigation.onBeforeNavigate.addListener(async function (details) {
  if (await isBlocked(details.url)) {
    chrome.tabs.update(details.tabId, {
      url: chrome.runtime.getURL("blocked.html"),
    });
  }
});
