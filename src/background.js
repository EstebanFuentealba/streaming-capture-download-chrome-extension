var blobs = [];
var binaries = [];
var urls = [];
var counter = 0;

chrome.webRequest.onCompleted.addListener(function(details) {
    var regex = /edge\-(\d+)-us\.edge\.mdstrm\.com\/media-us\/_definst_\/smil\:(.*)\/media_(.*)_(\d+)\.ts/;
    if(regex.test(details.url)) {
      var matchs = regex.exec(details.url);
      if(urls.indexOf(details.url)< 0) {
        urls.push(details.url);
      }
    }
    return {};
  },
  {urls: ["<all_urls>"]},
  ["responseHeaders"]
);


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.msg == "downloadLinks") {
    downloadFile();
	} else if (request.msg == "initCapture") {
    urls = [];
    blobs = [];
    counter = 0;
    sendResponse({
      status: 'OK'
    });
	}
});

function downloadFile() {
  chrome.browserAction.setBadgeText({
    text: Math.round(((counter * 100) / (urls.length -1))) + '%'
  });
    var xhr = new XMLHttpRequest();
    xhr.open('GET', urls[counter], true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function(e) {
      if (xhr.status == 200) {
        var uInt8Array = new Uint8Array(xhr.response);
        var arrayBuffer = uInt8Array.buffer;
        var blob        = new Blob([arrayBuffer]);
        blobs.push(blob);
        if(counter == urls.length-1){
          fnOnDownload();
          return true;
        } else {
          counter++;
          downloadFile();
        }
      }
    };
    xhr.send();
}
function fnOnDownload() {
  var a = document.createElement('a');
  a.href = window.URL.createObjectURL(new Blob(blobs));
  a.download = 'streming_video.ts';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  downloadURL = false;

}
