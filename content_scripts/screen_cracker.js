(function() {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  /**
   * Given a URL to a crack image, remove all existing cracks, then
   * create and style an IMG node pointing to
   * that image, then insert the node into the document.
   */
  function insertCrack(crackURL) {
    removeExistingCracks();
    let crackImage = document.createElement("img");
    crackImage.setAttribute("src", crackURL);
    crackImage.style.height = "100vh";
    crackImage.className = "crack-image";
    document.body.appendChild(crackImage);
  }

  /**
   * Remove every crack from the page.
   */
  function removeExistingCracks() {
    let existingCracks = document.querySelectorAll(".crack-image");
    for (let crack of existingCracks) {
      crack.remove();
    }
  }

  /**
   * Listen for messages from the background script.
   * Call "crack()" or "reset()".
  */
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "crack") {
      insertCrack(message.crackURL);
    } else if (message.command === "reset") {
      removeExistingCracks();
    }
  });

})();
