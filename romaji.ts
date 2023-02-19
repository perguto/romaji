type Dict = {
	[entry:string]:string
}

function reverseDict(dict:Dict){
	let p:Dict = {}
	for (let [k,v] of Object.entries(dict)){
		p[v]=k
	}
	return p
}

type char = string // intended to be exactly one codepoint

type Interval = [number, number] // [start (inclusive), end (exclusive)]
type Range = Interval[]

function inInterval(n : number, interval : Interval){
	return (n>=interval[0] && n < interval[1])
}

function inRange(n:number,range:Range){
	for(const interval of range){
		if(inInterval(n,interval)){
			return true
		}
	}
	return false
}

function shiftChar(c:char,offset:number,range:Range){
	const codePoint =c.codePointAt(0) as number
	if(!inRange(codePoint,range)){
		return c;
	}
	const new_codePoint = codePoint + offset
	return String.fromCodePoint(new_codePoint)
}


const hiraStart = 0x3040
const hiraLength = 0x60
const hiraEnd = hiraStart + hiraLength
const hiraInterval : Interval = [hiraStart, hiraEnd]
const hiraRange = [hiraInterval]

const kataStart = 0x30A0
const kataLength = 0x60
const kataEnd = kataStart + kataLength
const kataInterval : Interval = [kataStart, kataEnd]
const kataRange = [kataInterval]

const hira2kataOffset = kataStart - hiraStart

function hira2kataChar(c : char){
	return shiftChar(c,hira2kataOffset, hiraRange)
}


const input = //prompt()??
	'わかりますか?'
// const test_katakana = hiraToKata(input)
// const test_hiragana = kataToHira(test_katakana)


// console.log(test_katakana)
// console.log(test_hiragana)
