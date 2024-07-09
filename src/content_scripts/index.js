function checkBranch() {
  chrome.storage.sync.get(["mergeOptions"], (data) => {
    console.log(data.mergeOptions);

    const mergeOptions = data.mergeOptions;

    for (let mergeOption in mergeOptions) {
      const targetBranch = document.querySelector(
        "span.commit-ref span.css-truncate-target"
      ).innerText;

      const innerObj = mergeOptions[mergeOption];
      let mergeType;

      for (let innerKey in innerObj) {
        if (innerObj.hasOwnProperty(innerKey)) {
          mergeType = innerObj[innerKey];
        }
      }

      if (mergeOption.includes(targetBranch)) {
        const button = document.querySelector(
          `button.js-merge-box-button-${mergeType}`
        );

        if (button) {
          button.disabled = true;
        }
      }
    }
  });
}

window.onload = function () {
  setTimeout(checkBranch, 200);
};
