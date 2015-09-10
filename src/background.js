/*
* @author: Esteban Fuentealba <efuentealba@json.cl>
*/
import {M3U} from "playlist-parser";

var blobs = [];
var tabIdCapture = null;
var tabCapture = null;
var tabCaptureResult = null;
var binaries = [];
var urls = [];
var counter = 0;
var port = null;


chrome.browserAction.onClicked.addListener(function() {
  urls = [];
  blobs = [];
  counter = 0;
  tabCapture = null;
  tabCaptureResult = null;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    tabCapture = tabs[0];
    chrome.tabs.create({url:chrome.extension.getURL("index.html")}, function(tab) {
      tabCaptureResult = tab;
      chrome.tabs.reload(tabCapture.id, {bypassCache:false}, function() {
        console.log("reloaded");

      });
      port = chrome.tabs.connect(tabCaptureResult.id);
    });
  });
  chrome.webRequest.onCompleted.addListener(function(details) {
    if(details.tabId === tabCapture.id){
      let LISTING_M3U8 = /(.*)playlist\.m3u8(.*)?/;
      let DATA_STREAMING = /PROGRAM-ID=(\d+),BANDWIDTH=(\d+),RESOLUTION=(\d+)x(\d+)(,CODECS="(.*)")?/;
      let match = details.url.match(LISTING_M3U8);

      if (match && match.length === 3) {
        port.postMessage({
          "action": "log",
          "msg": "URL CATCH"
        });
        let url_m3u8 = match[0];
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url_m3u8, true);
        xhr.onload = function(e) {
          if (xhr.status == 200) {
            var playlist = M3U.parse(xhr.response);
            let metas = [];
            playlist.map((item) => {
              if (typeof item !== 'undefined') {
                var _metadata = item.title.match(DATA_STREAMING);
                if(_metadata && _metadata.length == 7) {
                  let [raw , programId, bandwith, width, height] = _metadata;
                  let metadata = {
                    "programId": programId,
                    "bandwith": bandwith,
                    "width": width,
                    "height": height
                  };
                  metas.push({
                    "value": bandwith,
                    "label": width + 'x' + height,
                    "item": item
                  })
                }
              }
            });
            if(port != null){
              port.postMessage({
                "action": "quality",
                "items": metas
              });
            }
          }
        };
        xhr.send();
      }
    }
      return {};
  },
    {urls: ["<all_urls>"]},
    ["responseHeaders"]
  );
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.msg == "downloadLinks") {
      urls = request.items;
      downloadFile();
  	}
  });
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
}
