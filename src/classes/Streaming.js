import {M3U} from "playlist-parser";
import validUrl from 'valid-url';
import url from 'url';
import Request from './Request';
import Playlist from './Playlist';
import Chunklist from './Chunklist';
import Writer from './Writer';
export default class Streaming {

  constructor(props, callback) {
    let {playlist_url, tab_id} = props;
    this.playlist_url     = playlist_url;
    this.Writer = null;
    this.chunklist_url;
    this.callback         = callback;
    //this.blobs            = [];
    this.urls             = [];
    //this.chuckCount       = 0;
    this.chuck_urls       = [];
    this.playlist;
    this.chunklist;
    this.tab_id = tab_id;
    this.downloaded = false;
    console.log("llamado desde " + this.tab_id);

    this.parsePlaylist();
  }
  static catchM3U8(url){
    let match = url.match(/(.*)playlist\.m3u8(.*)?/);
    return (match && match.length === 3) ? match[0]: false;
  }
  parseChunkList() {
    let me = this;
    let playlist_metas = this.playlist.getMetas();
    if(playlist_metas.length > 0){
      let quality = playlist_metas[0];
      console.log("Quality: "+ quality.label);
      me.chunklist_url = quality.item.file;
      if(!validUrl.isUri(me.chunklist_url)) {
        console.log("chunklist is not URL")
        me.chunklist_url = this.createURL() + quality.item.file;
        console.log("GENERATE URL: " + me.chunklist_url)
      }
      Request.get(me.chunklist_url,{},(response) => {
        me.chunklist = new Chunklist({RAW:response});
        me.urls = me.chunklist.getLinks();
        me.Writer = new Writer({
          chunkTotal: me.urls.length,
          fileName: 'prueba.ts'
        });
        me.callback(me);
      });
      /*
      let arrVars = quality.item.file.split("/");
      let lastVar = arrVars.pop();
      me.chunklist_url = arrVars.join("/");*/

    }
  }
  createURL() {
    return this.playlist_url_parsed.protocol + '//' + this.playlist_url_parsed.host + '' + this.playlist_url_parsed.pathname.replace('playlist.m3u8','');
  }
  parsePlaylist() {
    let me = this;
    if(validUrl.isUri(this.playlist_url)) {
      this.playlist_url_parsed = url.parse(this.playlist_url);
      Request.get(this.playlist_url,{},(response) => {
        me.playlist = new Playlist({RAW:response});
        me.parseChunkList();
      });
    } else {
      console.log("playlist is not URL")
    }

  }
  download() {
    //console.log("Downloading...");
    let me = this;
    let downloadURL = me.urls[me.Writer.chunkCount];
    if(!validUrl.isUri(downloadURL)) {
      //console.log("download is not URL")
      downloadURL = this.createURL() + downloadURL;
    }
    Request.downloadBlob(downloadURL,function(blob){
      //me.blobs.push(blob);
      me.Writer.write(blob);
      if(me.Writer.hasNext()) {
        me.download();
      }
    });
  }
}
