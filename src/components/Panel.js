import React from 'react';
import Select from 'react-select';
import {M3U} from "playlist-parser";

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      disabledDownload: true
    };
  }
  onChange(value) {
    this.setState({
      selected: value,
      disabledDownload: false
    });
  }
  onDownload() {
    this.props.items.map((item) => {
        if(this.state.selected == item.value) {
          var arrVars = item.item.file.split("/");
          var lastVar = arrVars.pop();
          var pathURL = arrVars.join("/");
          let xhr = new XMLHttpRequest();
          xhr.open('GET', item.item.file, true);
          xhr.onload = function(e) {
            if (xhr.status == 200) {
              let playlist = M3U.parse(xhr.response);
              let downloadLinks = [];
              playlist.map((itemTS) => {
                if (typeof itemTS !== 'undefined') {
                  downloadLinks.push(pathURL + '/' + itemTS.file)
                }
              });
              chrome.runtime.sendMessage({
                msg: "downloadLinks",
                items: downloadLinks
              }, function(links) {
                console.log(links);
              });
            }
          };
          xhr.send();
        }
    })
  }
  render() {
    return <div>
      <Select value={this.state.selected} options={this.props.items} onChange={this.onChange.bind(this)} />
      <button type="button" onClick={this.onDownload.bind(this)} disabled={this.state.disabledDownload}>Descargar</button>
  </div>
  }
};
