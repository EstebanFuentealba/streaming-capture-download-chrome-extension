/*
* @author: Esteban Fuentealba <efuentealba@json.cl>
*/
import url from 'url';
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
            chrome.tabs.getSelected(null,function(tab) {
              let tmpFileName = url.parse(tab.url);
              let streaming = new Streaming({
                tab_id: details.tabId,
                playlist_url: link_m3u8,
                fileName: tmpFileName.pathname.replace(/\//g,"_") + '.ts'
              },function(streaming) {
                streaming.download();
              });
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
