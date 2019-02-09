
//Screen Cracker Javascript for Popup content

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {
    function getImageURL(beastName) {
          return browser.extension.getURL("img/screen_crack_2.jpg");
    }

    /**
     * get the beast URL and send a "beastify" message to 
     * the content script in the active tab.
     */
    function crack_it(tabs) {
        let url = getImageURL(e.target.textContent);
        browser.tabs.sendMessage(tabs[0].id, {
          command: "crack",
          crackURL: url
        });
    }

    /**
     * send a "reset" message to the content script in the active tab.
     */
    function reset(tabs) {
        browser.tabs.sendMessage(tabs[0].id, {
          command: "reset",
        });
    }

    /**
     * Log the error to the console.
     */
    function reportError(error) {
      console.error(`Your screen is uncrackable!  ${error}`);
    }

    /**
     * Get the active tab,
     * then call "crack_it()" or "reset()" as appropriate.
     */
    if (e.target.classList.contains("cracker")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(crack_it)
        .catch(reportError);
    }
    else if (e.target.classList.contains("reset")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(reset)
        .catch(reportError);
    }
    });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute screen_cracker content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({file: "/content_scripts/screen_cracker.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);