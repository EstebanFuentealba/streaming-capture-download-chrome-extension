export default class Request {
  static downloadBlob(url, onSuccess) {
    Request.get(url,'arraybuffer', function(response) {
      var uInt8Array = new Uint8Array(response);
      onSuccess(new Blob([uInt8Array.buffer]));
    })
  }
  static get(url, responseType = '' , onSuccess, onError = function(){}) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = responseType;
    xhr.onload = function(e) {
      if (xhr.status == 200) {
        onSuccess(xhr.response);
      }
    };
    xhr.onerror = function(e) {
      onError(e);
    }
    xhr.send();
  }
};
