document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("optionsForm");
  const currentOptionsList = document.getElementById("currentOptions");

  chrome.storage.sync.get(["mergeOptions"], function (data) {
    const mergeOptions = data.mergeOptions || {};

    for (let branch in mergeOptions) {
      for (let mergeType in mergeOptions[branch]) {
        const optionItem = document.createElement("li");
        optionItem.textContent = `${mergeType.toUpperCase()} merge disabled to branch ${branch}`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("data-branch", branch);
        deleteButton.setAttribute("data-merge-type", mergeType);
        deleteButton.addEventListener("click", function () {
          deleteOption(branch, mergeType);
        });

        optionItem.appendChild(deleteButton);
        currentOptionsList.appendChild(optionItem);
      }
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const branchName = document.getElementById("branchName").value.trim();
    const mergeType = document.getElementById("mergeType").value;

    chrome.storage.sync.get(["mergeOptions"], function (data) {
      let mergeOptions = data.mergeOptions || {};

      if (!mergeOptions[branchName]) {
        mergeOptions[branchName] = {};
      }

      mergeOptions[branchName]["mergeType"] = mergeType;

      chrome.storage.sync.set({ mergeOptions: mergeOptions }, function () {
        alert("Option added successfully!");
        location.reload();
      });
    });
  });

  function deleteOption(branch, mergeType) {
    chrome.storage.sync.get(["mergeOptions"], function (data) {
      let mergeOptions = data.mergeOptions || {};

      if (mergeOptions[branch] && mergeOptions[branch][mergeType]) {
        delete mergeOptions[branch][mergeType];

        if (Object.keys(mergeOptions[branch]).length === 0) {
          delete mergeOptions[branch];
        }

        chrome.storage.sync.set({ mergeOptions: mergeOptions }, function () {
          alert("Option deleted successfully!");
          location.reload();
        });
      }
    });
  }
});
