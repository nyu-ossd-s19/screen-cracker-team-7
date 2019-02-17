//Screen Cracker Javascript for Popup content
const crackCSS = `.crack-image {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vw;
  object-fit: cover;
  mix-blend-mode: multiply;
  z-index: 99999999999;
}`;

const crackImages = [
  'img/screen_crack_1.png',
  'img/screen_crack_2.jpg'
];


/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {
    function getImageURL() {
      let index = Math.floor(Math.random() * crackImages.length);
      return browser.extension.getURL(crackImages[index]);
    }

    /**
     * get the URL and send a 'crack' message to 
     * the content script in the active tab.
     */
    function crack_it(tabs) {
      browser.tabs.insertCSS({code: crackCSS}).then( function() {
        let url = getImageURL(e.target.textContent);
        browser.tabs.sendMessage(tabs[0].id, {
          command: "crack",
          crackURL: url
        });
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