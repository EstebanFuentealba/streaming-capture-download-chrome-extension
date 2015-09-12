import List from './List';
export default class Chunklist extends List {
  constructor(props) {
    super(props);
  }
  getLinks() {
    let downloadLinks = [];
    this.list.map((item) => {
      if (typeof item !== 'undefined') {
        downloadLinks.push(item.file)
      }
    });
    return downloadLinks;
  }

};
