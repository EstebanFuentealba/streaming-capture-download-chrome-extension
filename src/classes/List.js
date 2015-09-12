/*
* @author: Esteban Fuentealba <efuentealba@json.cl>
*/
import {M3U} from "playlist-parser";
export default class List {
  constructor(props) {
    let {RAW} = props;
    this.RAW = RAW;
    this.list = M3U.parse(this.RAW);
  }
};
