import axios from 'axios';
import env from '../config/env';
let util = {

};
util.title = function (title) {
    title = title ? title : 'Netease Mall';
    window.document.title = title;
};

const ajaxUrl = env === 'development' ?
    'http://127.0.0.1:8080/api' :
    env === 'production' ?
        'https://www.url.com' :
        'https://debug.url.com';

util.ajax = axios.create({
    baseURL: '/api',
    timeout: 30000
});

util.getBase64Image = (img) => {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // 原生toDataURL无发压缩png格式
    return canvas.toDataURL("image/png", 0.5);
    debugger

    // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
};
function newBlob(data, datatype) {
    var out
    try {
        out = new Blob([data], { type: datatype })
    } catch (e) {
        window.BlobBuilder = window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder

        if (e.name == 'TypeError' && window.BlobBuilder) {
            var bb = new BlobBuilder()
            bb.append(data)
            out = bb.getBlob(datatype)
        } else if (e.name == 'InvalidStateError') {
            out = new Blob([data], { type: datatype })
        } else {
            throw new Error('Your browser does not support Blob & BlobBuilder!')
        }
    }
    return out
}

util.dataURL2Blob = (dataURI) => {
    var byteStr
    var intArray
    var ab
    var i
    var mimetype
    var parts

    parts = dataURI.split(',')
    parts[1] = parts[1].replace(/\s/g, '')

    if (~parts[0].indexOf('base64')) {
        byteStr = atob(parts[1])
    } else {
        byteStr = decodeURIComponent(parts[1])
    }

    ab = new ArrayBuffer(byteStr.length)
    intArray = new Uint8Array(ab)

    for (i = 0; i < byteStr.length; i++) {
        intArray[i] = byteStr.charCodeAt(i)
    }

    mimetype = parts[0].split(':')[1].split(';')[0]

    return new newBlob(ab, mimetype)
}
util.dataURItoBlob = (dataURI) => {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1]);
    } else {
        byteString = unescape(dataURI.split(',')[1]);
    }
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
};

export default util;