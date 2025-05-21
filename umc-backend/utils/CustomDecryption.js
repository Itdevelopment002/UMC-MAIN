const CryptoJS = require('crypto-js');

 const customPasswordDecode = (str) => {
    return str.split('').map(c => String.fromCharCode(c.charCodeAt(0) - 2)).reverse().join('');
}

const CustomDecryption = ( str, nonce ) => {
    const bytes = CryptoJS.AES.decrypt(str, nonce);
    return customPasswordDecode(bytes.toString(CryptoJS.enc.Utf8));
}

module.exports = { customPasswordDecode, CustomDecryption};