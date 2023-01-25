const CryptoJS = require('crypto-js');
export function encrypt(data){
    return CryptoJS.AES.encrypt(data, "wshdfgcskhdghcvliesyuvfvbawd34234234234234'''234234][234][.,34342/.45.,234/5......lskjebc...").toString();

}
export function decrypt(data){
    return CryptoJS.AES.decrypt(data, "wshdfgcskhdghcvliesyuvfvbawd34234234234234'''234234][234][.,34342/.45.,234/5......lskjebc...").toString(CryptoJS.enc.Utf8);
}