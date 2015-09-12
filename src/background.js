/*
* @author: Esteban Fuentealba <efuentealba@json.cl>
*/
/*
import {M3U} from "playlist-parser";
import Request from './classes/Request';*/
import Streaming from './classes/Streaming';


var tabCapture = null;

chrome.browserAction.onClicked.addListener(function() {
  tabCapture = null;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    tabCapture = tabs[0];
    chrome.tabs.reload(tabCapture.id, {bypassCache:false}, function() {
      console.log("reloaded");
      chrome.webRequest.onCompleted.addListener(function(details) {
        if(details.tabId === tabCapture.id){
          let link_m3u8= Streaming.catchM3U8(details.url);
          if(link_m3u8 !== false) {
              let streaming = new Streaming({
                tab_id: details.tabId,
                playlist_url: link_m3u8
              },function(streaming) {
                streaming.download();
              });
          }
        }
        return {};
      },
        {urls: ["<all_urls>"]},
        ["responseHeaders"]
      );
    });
  });
});
