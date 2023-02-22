type Dict = {
	[entry:string]:string
}

function reverseDict(dict:Dict){
	const p:Dict = {}
	for (const [k,v] of Object.entries(dict)){
		p[v]=k
	}
	return p
}

type char = string // intended to be exactly one codepoint

type Interval = [number, number] // [start (inclusive), end (exclusive)]
type numberRange = Interval[]

function inInterval(n : number, interval : Interval){
	return (n>=interval[0] && n < interval[1])
}

function inRange(n:number,range:numberRange){
	for(const interval of range){
		if(inInterval(n,interval)){
			return true
		}
	}
	return false
}

function shiftChar(c:char,offset:number,range:numberRange){
	const codePoint =c.codePointAt(0) as number
	if(!inRange(codePoint,range)){
		return c;
	}
	const new_codePoint = codePoint + offset
	return String.fromCodePoint(new_codePoint)
}

function disjunctiveMatcher(a:string[],flags= "g") {
	// Escape special characters in each string and join them with the `|` operator
	const escaped = a.map((str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
	// Create a RegExp object with the joined string as the pattern and the global //and ignore case flags
	return new RegExp(`(${escaped})`, flags);
}

function remap(s : string, dict : Dict){
	const keys = Object.keys(dict)
	const r = disjunctiveMatcher(keys)
	const t = s.replaceAll(r,key => dict[key])
	// const keySet = new Set(Object.keys(dict))
	// const keyMap = new Map(Object.entries(dict))
	// let t = ""
	return t
}

//////////////
// japanese char conversions

type Style = "any" |  "hira" | "kata" | "kunrei" // | "hepburn"
const styles :Style[] = ["any", "hira", "kata", "kunrei"]
const properStyles = styles.slice(1)

// the whole hira code page
const hiraStart = 0x3040
const hiraLength = 0x60
const hiraEnd = hiraStart + hiraLength
const hiraInterval : Interval = [hiraStart, hiraEnd]
const hiraRange = [hiraInterval]

// the part which matches 1 to 1 the kata page
const hiraParallelStart = hiraStart + 1
const hiraParallelEnd = hiraEnd - 9
const hiraParallelInterval : Interval = [hiraParallelStart,hiraParallelEnd]
const hiraParallelRange = [hiraParallelInterval]

const kataStart = 0x30A0
const kataLength = 0x60
const kataEnd = kataStart + kataLength
const kataInterval : Interval = [kataStart, kataEnd]
const kataRange = [kataInterval]

const kataParallelStart = kataStart + 1
const kataParallelEnd = kataEnd - 9
const kataParallelInterval : Interval = [kataParallelStart,kataParallelEnd]
const kataParallelRange = [kataParallelInterval]

const hira2kataOffset = kataStart - hiraStart

function hira2kataChar(c :char) {
    return shiftChar(c, hira2kataOffset, hiraParallelRange);
}
const kata2hiraOffset = hiraStart - kataStart

function kata2hiraChar(c : char){
	return shiftChar(c,kata2hiraOffset, kataParallelRange)
}

const punctuationTable = `
. 
? 
[ 
] 
" 
`.slice(0,-1)

// wagyou before agyou because latter overwrites former
const kunreiTSV = `
わ ワ wa	ゐ ヰ i	(u)	ゑ ヱ e	を ヲ o	
あ ア a	い イ i	う ウ u	え エ e	お オ o
か カ ka	き キ ki	く ク ku	け ケ ke	こ コ ko	きゃ キャ kya	きゅ キュ kyu	きょ キョ kyo
さ サ sa	し シ si	す ス su	せ セ se	そ ソ so	しゃ シャ sya	しゅ シュ syu	しょ ショ syo
た タ ta	ち チ ti	つ ツ tu	て テ te	と ト to	ちゃ チャ tya	ちゅ チュ tyu	ちょ チョ tyo
な ナ na	に ニ ni	ぬ ヌ nu	ね ネ ne	の ノ no	にゃ ニャ nya	にゅ ニュ nyu	にょ ニョ nyo
は ハ ha	ひ ヒ hi	ふ フ hu	へ ヘ he	ほ ホ ho	ひゃ ヒャ hya	ひゅ ヒュ hyu	ひょ ヒョ hyo
ま マ ma	み ミ mi	む ム mu	め メ me	も モ mo	みゃ ミャ mya	みゅ ミュ myu	みょ ミョ myo
や ヤ ya	(i)	ゆ ユ yu	(e)	よ ヨ yo	
ら ラ ra	り リ ri	る ル ru	れ レ re	ろ ロ ro	りゃ リャ rya	りゅ リュ ryu	りょ リョ ryo
ん ン n	
が ガ ga	ぎ ギ gi	ぐ グ gu	げ ゲ ge	ご ゴ go	ぎゃ ギャ gya	ぎゅ ギュ gyu	ぎょ ギョ gyo
ざ ザ za	じ ジ zi	ず ズ zu	ぜ ゼ ze	ぞ ゾ zo	じゃ ジャ zya	じゅ ジュ zyu	じょ ジョ zyo
だ ダ da	ぢ ヂ zi	づ ヅ zu	で デ de	ど ド do	ぢゃ ヂャ zya	ぢゅ ヂュ zyu	ぢょ ヂョ zyo
ば バ ba	び ビ bi	ぶ ブ bu	べ ベ be	ぼ ボ bo	びゃ ビャ bya	びゅ ビュ byu	びょ ビョ byo
ぱ パ pa	ぴ ピ pi	ぷ プ pu	ぺ ペ pe	ぽ ポ po	ぴゃ ピャ pya	ぴゅ ピュ pyu	ぴょ ピョ pyo


`.slice(0,-1)

const kunreiList = kunreiTSV.split(/\t|\n/)

const kunreiTable = kunreiList.map(row => row.split(/ /)).filter(row => row.length === 3)

// console.log(...kunreiTable)

type ConversionDict = {
	[from : string] : {
		[to : string] : Dict
	}
}

const conversionDict : ConversionDict = {}
for( const from of properStyles){
	conversionDict[from] = {}
	for( const to of properStyles){
		conversionDict[from][to] = {}
	}
}

for(const [hira, kata, kunrei] of kunreiTable){
	const entry : Dict = {hira, kata, kunrei}
	for( const from of properStyles){
		for( const to of properStyles){
			conversionDict[from][to][entry[from]] = entry[to]
		}
	}
}

///////////////
// string maninpulation

function replaceChars(s : string, replaceChar : (c:char) => char){
	let t = ""
	for(const c of s){
		t += replaceChar(c)
	}
	return t
}

type ConversionTable = {
	[ from : string ] : {
		[ to : string ] : (s: string) => string
	}
}

const conversions : ConversionTable = {
}

for( const from of properStyles){
	conversions[from] = {}
}

for( const from of properStyles){
	for( const to of properStyles){
		conversions[from][to] = s => remap(s, conversionDict[from][to])
	}
}

function convert(s : string, from : Style, to : Style) : string{
	if(to === "any"){
		to = "hira"
	}
	if(from === "any"){
		for(const style of styles){
			if(style!="any"){
				s=convert(s,style,"hira")

			}
		}
		from = "hira"
	}
	if(from===to){
		return s
	}
	const conversionFunction = conversions[from][to]
	return conversionFunction(s)
}

/////////////
//test area
const test_input = //prompt()??
	'わかりますか?'
const test_katakana = 
	// hira2kata(input)
	convert(test_input, "hira", "kata")
// const test_hiragana = kata2hira(test_katakana)
// const test_kunrei = hira2kunrei(test_input)
// const test_kunrei2hira = kunrei2hira(test_kunrei)
// const test_kunrei2kata = kunrei2kata(test_kunrei)



console.log(test_katakana)
// console.log(test_hiragana)
// console.log(test_kunrei)
// console.log(test_kunrei2hira)
// console.log(test_kunrei2kata)
