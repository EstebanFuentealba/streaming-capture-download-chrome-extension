/*
* @author: Esteban Fuentealba <efuentealba@json.cl>
*/
import List from './List';
export default class Playlist extends List {
  constructor(props) {
    super(props);
    this.DATA_STREAMING   = /PROGRAM-ID=(\d+),BANDWIDTH=(\d+),RESOLUTION=(\d+)x(\d+)(,CODECS="(.*)")?/;
  }
  getMetas() {
    let metas = [];
    this.list.map((item) => {
      if (typeof item !== 'undefined' && item.hasOwnProperty('title')){
        var _metadata = item.title.match(this.DATA_STREAMING);
        if(_metadata && _metadata.length == 7) {
          let [raw , programId, bandwith, width, height] = _metadata;
          metas.push({
            "value": bandwith,
            "label": width + 'x' + height,
            "item": item
          })
        }
      }
    });
    return metas;
  }
};
