document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btnCapture").addEventListener("click", function () {
    chrome.runtime.sendMessage({msg: "initCapture"}, function(status) {
      console.log(status);
    });
  });
  document.getElementById("btnDownload").addEventListener("click", function () {
    chrome.runtime.sendMessage({msg: "downloadLinks"}, function(links) {
      console.log(links);
    });
  });
});
