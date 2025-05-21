import CryptoJS from "crypto-js";

export const customEncode = (str) => {
    return str.split('').reverse().map(c => String.fromCharCode(c.charCodeAt(0) + 2)).join('');
};

const CustomEncryption = ( str, nonce ) => {
    return CryptoJS.AES.encrypt(customEncode(str), nonce).toString();
}
export default CustomEncryption;