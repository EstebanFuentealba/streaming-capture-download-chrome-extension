/*
* @author: Esteban Fuentealba <efuentealba@json.cl>
*/
export default class Writer {
  constructor(props) {
    let {chunkTotal, fileName} = props;
    this.chunkTotal = chunkTotal;
    this.chunkCount = 0;
    this.fileEntry = null;
    this.dirEntry = null;
    this.dirid = 'streaming-download';
    this.fileName = fileName || "prueba.bin";
    this.writing = true;
    this.fileWriter = null;
    window.webkitRequestFileSystem(
      window.PERSISTENT,
      1024*1024*1024*25,
      this.createtmpfile.bind(this),
      this.RequestFileSystem_errorHandler);
  }
  RequestFileSystem_errorHandler(e) {
  	this.errorHandler(e,'RequestFileSystem');
  }
  getDirectory_errorHandler(e){
  	this.errorHandler(e,'getDirectory');
  }
  createWriter_errorHandler(e) {
  	this.errorHandler(e,'createWriter');
  }
  getFile_errorHandler(e) {
  	this.errorHandler(e,'getFile');
  }
  createtmpfile(fs) {
    let me = this;
  	fs.root.getDirectory(this.dirid, {create: true}, (dirEntry) => {
  		me.dirEntry = dirEntry;
  	}, me.getDirectory_errorHandler);
  	fs.root.getFile(me.dirid + '/' + me.fileName, {create: true},(fileEntry) => {
  		fileEntry.createWriter((fileWriter) => {
        me.fileWriter = fileWriter;
  			me.fileWriter.truncate(0);

  			me.fileWriter.onerror = (e) => {
          console.log(e);
  			}

  			me.fileWriter.onwriteend = () => {
          if (this.chunkCount == (this.chunkTotal-1)) {
            this.writing = false;
            this.toURL();
            console.log("download");
            return false;
          }
          console.log("percent [" + (me.chunkCount+1) + "/" + me.chunkTotal + "]");
  			}

  			me.fileEntry = fileEntry;

  			console.log("comienza escritura")
  		}, me.createWriter_errorHandler);
  	}, me.getFile_errorHandler);
  }
  toURL(){
    let a = document.createElement('a');
    a.href = this.fileEntry.toURL();
    a.download = this.fileName;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    /*this.fileEntry.remove(function() {
      console.log('File removed.');
    }, this.errorHandler);*/
  }
  write(blob) {
    try{
      this.fileWriter.write(blob);

    } catch(e){
      console.log(e);
    }
    this.chunkCount++;

  }
  hasNext() {

    if(this.chunkCount < this.chunkTotal) {
      return true;
    }
    return false;
  }
  errorHandler(e,type) {
    switch (e.code) {
    	case FileError.QUOTA_EXCEEDED_ERR:
    	  console.log('Error writing file, is your harddrive almost full? (' + type + ')');
    	  break;
    	case FileError.NOT_FOUND_ERR:
    	  console.log('NOT_FOUND_ERR in ' + type);
    	  break;
    	case FileError.SECURITY_ERR:
    	  console.log('File transfers do not work with Chrome Incognito.<br>' + '(Security Error in ' + type + ')');
    	  break;
    	case FileError.INVALID_MODIFICATION_ERR:
    	  console.log('INVALID_MODIFICATION_ERR in ' + type);
    	  break;
    	case FileError.INVALID_STATE_ERR:
    		console.log('INVALID_STATE_ERROR in ' + type + ', retrying...');
    		break;
    	default:
    	  console.log('webkitRequestFileSystem failed in ' + type);
    }
  }
};
