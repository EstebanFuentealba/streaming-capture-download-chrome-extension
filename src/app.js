import React from 'react'
import Panel from './components/Panel';

let items = [];
document.addEventListener("DOMContentLoaded", function () {
  React.render(
    <Panel items={items} />,
    document.getElementById('container')
  );
  chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
       if(msg.action == 'quality') {
         console.log(msg);
         React.render(
           <Panel items={msg.items} />,
           document.getElementById('container')
         );
       }
    });
  });
});
