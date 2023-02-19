function reverseDict(dict) {
    let p = {};
    for (let [k, v] of Object.entries(dict)) {
        p[v] = k;
    }
    return p;
}
function inInterval(n, interval) {
    return (n >= interval[0] && n < interval[1]);
}
function inRange(n, range) {
    for (const interval of range) {
        if (inInterval(n, interval)) {
            return true;
        }
    }
    return false;
}
function shiftChar(c, offset, range) {
    const codePoint = c.codePointAt(0);
    if (!inRange(codePoint, range)) {
        return c;
    }
    const new_codePoint = codePoint + offset;
    return String.fromCodePoint(new_codePoint);
}
function disjunctiveMatcher(a, flags = "g") {
    // Escape special characters in each string and join them with the `|` operator
    const escaped = a.map((str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    // Create a RegExp object with the joined string as the pattern and the global //and ignore case flags
    return new RegExp(`(${escaped})`, flags);
}
function remap(s, dict) {
    const keys = Object.keys(dict);
    const r = disjunctiveMatcher(keys);
    const t = s.replaceAll(r, key => dict[key]);
    // const keySet = new Set(Object.keys(dict))
    // const keyMap = new Map(Object.entries(dict))
    // let t = ""
    return t;
}
const styles = ["any", "hira", "kata", "kunrei"];
const hiraStart = 0x3040;
const hiraLength = 0x60;
const hiraEnd = hiraStart + hiraLength;
const hiraInterval = [hiraStart, hiraEnd];
const hiraRange = [hiraInterval];
const kataStart = 0x30A0;
const kataLength = 0x60;
const kataEnd = kataStart + kataLength;
const kataInterval = [kataStart, kataEnd];
const kataRange = [kataInterval];
const hira2kataOffset = kataStart - hiraStart;
function hira2kataChar(c) {
    return shiftChar(c, hira2kataOffset, hiraRange);
}
const kata2hiraOffset = hiraStart - kataStart;
function kata2hiraChar(c) {
    return shiftChar(c, kata2hiraOffset, kataRange);
}
const kunreiTSV = `
か カ ka	き キ ki	く ク ku	け ケ ke	こ コ ko	きゃ キャ kya	きゅ キュ kyu	きょ キョ kyo
さ サ sa	し シ si	す ス su	せ セ se	そ ソ so	しゃ シャ sya	しゅ シュ syu	しょ ショ syo
た タ ta	ち チ ti	つ ツ tu	て テ te	と ト to	ちゃ チャ tya	ちゅ チュ tyu	ちょ チョ tyo
な ナ na	に ニ ni	ぬ ヌ nu	ね ネ ne	の ノ no	にゃ ニャ nya	にゅ ニュ nyu	にょ ニョ nyo
は ハ ha	ひ ヒ hi	ふ フ hu	へ ヘ he	ほ ホ ho	ひゃ ヒャ hya	ひゅ ヒュ hyu	ひょ ヒョ hyo
ま マ ma	み ミ mi	む ム mu	め メ me	も モ mo	みゃ ミャ mya	みゅ ミュ myu	みょ ミョ myo
や ヤ ya	(i)	ゆ ユ yu	(e)	よ ヨ yo	
ら ラ ra	り リ ri	る ル ru	れ レ re	ろ ロ ro	りゃ リャ rya	りゅ リュ ryu	りょ リョ ryo
わ ワ wa	ゐ ヰ i	(u)	ゑ ヱ e	を ヲ o	
ん ン n	
が ガ ga	ぎ ギ gi	ぐ グ gu	げ ゲ ge	ご ゴ go	ぎゃ ギャ gya	ぎゅ ギュ gyu	ぎょ ギョ gyo
ざ ザ za	じ ジ zi	ず ズ zu	ぜ ゼ ze	ぞ ゾ zo	じゃ ジャ zya	じゅ ジュ zyu	じょ ジョ zyo
だ ダ da	ぢ ヂ zi	づ ヅ zu	で デ de	ど ド do	ぢゃ ヂャ zya	ぢゅ ヂュ zyu	ぢょ ヂョ zyo
ば バ ba	び ビ bi	ぶ ブ bu	べ ベ be	ぼ ボ bo	びゃ ビャ bya	びゅ ビュ byu	びょ ビョ byo
ぱ パ pa	ぴ ピ pi	ぷ プ pu	ぺ ペ pe	ぽ ポ po	ぴゃ ピャ pya	ぴゅ ピュ pyu	ぴょ ピョ pyo
`.slice(0, -1);
const kunreiList = kunreiTSV.split(/\t|\n/);
const kunreiTable = kunreiList.map(row => row.split(/ /)).filter(row => row.length === 3);
// console.log(...kunreiTable)
const hira2kunreiDict = {};
const kata2kunreiDict = {};
const kunrei2hiraDict = {};
const kunrei2kataDict = {};
for (const [hira, kata, kunrei] of kunreiTable) {
    hira2kunreiDict[hira] = kunrei;
    kunrei2hiraDict[kunrei] = hira;
    kata2kunreiDict[kata] = kunrei;
    kunrei2kataDict[kunrei] = kata;
}
function hira2kunrei(s) {
    return remap(s, hira2kunreiDict);
}
function kunrei2hira(s) {
    return remap(s, kunrei2hiraDict);
}
function kata2kunrei(s) {
    return remap(s, kata2kunreiDict);
}
function kunrei2kata(s) {
    return remap(s, kunrei2kataDict);
}
///////////////
// string maninpulation
function replaceChars(s, replaceChar) {
    let t = "";
    for (const c of s) {
        t += replaceChar(c);
    }
    return t;
}
function hira2kata(s) {
    return replaceChars(s, hira2kataChar);
}
function kata2hira(s) {
    return replaceChars(s, kata2hiraChar);
}
const conversions = {
    "hira": {
        "kata": hira2kata,
        "kunrei": hira2kunrei,
    },
    "kata": {
        "hira": kata2hira,
        "kunrei": kata2kunrei,
    },
    "kunrei": {
        "hira": kunrei2hira,
        "kata": kunrei2kata,
    }
};
function convert(s, from, to) {
    if (to === "any") {
        to = "hira";
    }
    if (from === "any") {
        for (const style of styles) {
            if (style != "any") {
                s = convert(s, style, "hira");
            }
        }
        from = "hira";
    }
    if (from === to) {
        return s;
    }
    const conversionFunction = conversions[from][to];
    return conversionFunction(s);
    // console.log(from+"2"+to)
    // return Function("s","return "+from+"2"+to+"(s)")(s)
    // switch (from){
    // 	case "hira": 
    // 		switch (to) {
}
const test_input = //prompt()??
 'わかりますか?';
const test_katakana = 
// hira2kata(input)
convert(test_input, "hira", "kata");
const test_hiragana = kata2hira(test_katakana);
const test_kunrei = hira2kunrei(test_input);
const test_kunrei2hira = kunrei2hira(test_kunrei);
const test_kunrei2kata = kunrei2kata(test_kunrei);
console.log(test_katakana);
console.log(test_hiragana);
console.log(test_kunrei);
console.log(test_kunrei2hira);
console.log(test_kunrei2kata);
