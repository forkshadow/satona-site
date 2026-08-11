window.SatonaBip39={
  lookup(value){const word=String(value||'').trim().toLowerCase();if(!word)return{error:'empty'};if(typeof bip39List==='undefined')return{error:'unavailable'};const bits=bip39List[word];return bits===undefined?{error:'unknown',word}:{word,bits,index:parseInt(bits,2)}},
  wordAt(index){return Number.isInteger(index)&&index>=0&&index<window.SatonaBip39Words.length?window.SatonaBip39Words[index]:undefined},
  get size(){return window.SatonaBip39Words.length}
};
