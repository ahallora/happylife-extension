document.addEventListener("DOMContentLoaded", function () {
  const addWebsiteButton = document.getElementById("addWebsite");
  const newWebsiteInput = document.getElementById("newWebsite");
  const websiteList = document.getElementById("websiteList");

  chrome.storage.sync.get(["blockedWebsites"], function (result) {
    if (result.blockedWebsites) {
      result.blockedWebsites.forEach((website) => addWebsiteToList(website));
    }
  });

  addWebsiteButton.className = "addButton";
  addWebsiteButton.addEventListener("click", function () {
    const website = newWebsiteInput.value.trim();
    if (website) {
      chrome.storage.sync.get("blockedWebsites", function (result) {
        const blockedWebsites = result.blockedWebsites || [];
        if (!blockedWebsites.includes(website)) {
          blockedWebsites.push(website);
          chrome.storage.sync.set(
            { blockedWebsites: blockedWebsites },
            function () {
              addWebsiteToList(website);
              newWebsiteInput.value = "";
            }
          );
        }
      });
    }
  });

  function addWebsiteToList(website) {
    const li = document.createElement("li");
    li.textContent = website;
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.className = "removeButton";
    removeButton.addEventListener("click", function () {
      chrome.storage.sync.get("blockedWebsites", function (result) {
        const blockedWebsites = result.blockedWebsites || [];
        const index = blockedWebsites.indexOf(website);
        if (index > -1) {
          blockedWebsites.splice(index, 1);
          chrome.storage.sync.set(
            { blockedWebsites: blockedWebsites },
            function () {
              li.remove();
            }
          );
        }
      });
    });
    li.appendChild(removeButton);
    websiteList.appendChild(li);
  }
});
