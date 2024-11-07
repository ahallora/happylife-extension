document.addEventListener("DOMContentLoaded", function () {
  const addWebsiteForm = document.getElementById("addWebsiteForm");
  const newWebsiteInput = document.getElementById("newWebsite");
  const websiteList = document.getElementById("websiteList");

  // Load blocked websites from storage on page load
  chrome.storage.sync.get(["blockedWebsites"], function (result) {
    if (result.blockedWebsites) {
      result.blockedWebsites.forEach((website) => addWebsiteToList(website));
    }
  });

  // Listen for form submit instead of button click
  addWebsiteForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from submitting in the traditional way

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
              newWebsiteInput.value = ""; // Clear input field
              newWebsiteInput.focus(); // Move focus back to input
            }
          );
        }
      });
    }
  });

  // Function to add website to list with remove button
  function addWebsiteToList(website) {
    const li = document.createElement("li");
    li.textContent = website;
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.className = "removeButton";

    // Remove website from list and storage
    removeButton.addEventListener("click", function () {
      chrome.storage.sync.get("blockedWebsites", function (result) {
        let blockedWebsites = result.blockedWebsites || [];
        blockedWebsites = blockedWebsites.filter((site) => site !== website);

        chrome.storage.sync.set(
          { blockedWebsites: blockedWebsites },
          function () {
            li.remove();
          }
        );
      });
    });

    li.appendChild(removeButton);
    websiteList.appendChild(li);
  }
});
