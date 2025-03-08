let modInfo = {
	name: "The Tsinghua Table",
	nameI18N: "The Tsinghua Incremental Table",// When you enabled the internationalizationMod, this is the name in the second language
	id: "Falmod",
	author: "FallenCat",
	pointsName: "高考考分",
	modFiles: ["layers.js", "tree.js"],

	internationalizationMod: false,
	// When enabled, it will ask the player to choose a language at the beginning of the game
	changedDefaultLanguage: true,
	// Changes the mod default language. false -> English, true -> Chinese

	forceOneTab: false,// Enable Single-Tab Mode (This feature doesn't work as smoothly as you might expect; it's designed for experts)
	showTab: 'tree-node',// If forceOneTab is enabled, it will always show this page when the page is refreshed

	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

var colors = {
	button: {
		width: '250px',// Table Button
		height: '40px',// Table Button
		font: '25px',// Table Button
		border: '3px'// Table Button
	},
	default: {
		1: "#ffffff",//Branch color 1
		2: "#bfbfbf",//Branch color 2
		3: "#7f7f7f",//Branch color 3
		color: "#dfdfdf",
		points: "white",
		locked: "#bf8f8f",
		background: "#0f0f0f",
		background_tooltip: "rgba(0, 0, 0, 0.75)",
	},
}

// Set your version in num and name
let VERSION = {
	num: "Pre-Alpha-60-43",
	name: "义务教育前",
}

function changelog(){
	return i18n(`
		<br><br><br><h1>更新日志:</h1><br>(不存在<span style='color: red'><s>剧透警告</s></span>)<br><br>
		<span style="font-size: 17px;">
			<h3><s>这里什么都没有，别看了</s></h3><br><br>
			<h3>vPre-Alpha-60-43 - 义务教育前</h3><br>
				- 6 维属性被赋予了作用
				- 加入新的卡牌等级：Tier 2 (白银级) Tier 3 (黄金级)<br>
				- 加入事件，并添加 4 个事件<br>
				- 目标系统实装<br>
				- 幼儿园系统初步实装<br>
				- 总卡牌数量：43，结局：高考 10,000 分<br>
			<br><br>
			<h3>vPre-Alpha-36-12 - 发挥潜能？</h3><br>
				- 意志和压力现在会导致游戏失败<br>
				- 加入 6 维属性，虽然暂时没什么用<br>
				- 加入新的卡牌等级：Tier 1 (青铜级)<br>
				- 总卡牌数量：12，结局：高考 3,000 分<br>
			<br><br>
			<h3>vPre-Alpha-12-4 - 创世纪</h3><br>
				- 开发了第一个版本，加入学分，意志与压力系统<br>
				- 总卡牌数量：4，结局：高考 300 分<br>
			<br><br>
		`, `
		<br><br><br><h1>ChangeLog:</h1><br>(No<span style='color: red'><s> Spoiler Warning!</s></span>)<br><br>
		<span style="font-size: 17px;">
			<h3><s>YOU SHOULD WRITE THIS YOURSELF</s></h3><br><br>
			<h3>v3.0 - Unprecedented changes</h3><br>
				- Developed The Modding Table, Which, you could say, is another form of TMT<br>
			<br><br>
	`, false)
} 

function winText(){
	return i18n(`你暂时完成了游戏!`, `Congratulations! You have reached the end and beaten this game, but for now...`, false)
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

function getPointsColor(){
	if(player.points.gte(1e32)) return "#FFFFFF"
	if(player.points.gte(1e27)) return "#66ccff"
	if(player.points.gte(1e23)) return "#00ff00"
	if(player.points.gte(1e20)) return "#ffffcc"
	if(player.points.gte(1e17)) return "#ff0083"
	if(player.points.gte(1e14)) return "#27b897"
	if(player.points.gte(1e12)) return "#cd72ff"
	if(player.points.gte(1e10)) return "#f5c211"
	if(player.points.gte(1e8)) return "#ffffff"
	if(player.points.gte(1e7)) return "#ed333b"
	if(player.points.gte(1e6)) return "#6666ff"
	if(player.points.gte(1e5)) return "#2ec27e"
	if(player.points.gte(1e4)) return "#79b9c7"
	if(player.points.gte(1000)) return "#E5C100"
	if(player.points.gte(100)) return "#a8a8a8"
	if(player.points.gte(10)) return "#a15c2f"
	else return "#dddddd"
}

// Determines if it should show points/sec
function canGenPoints(){
	return false
}

function isUpgradeCovered(layer, id) {
	let upgElement = getUpgradeElement(layer, id)
	if (upgElement == null) return false
	else {
		let rect = upgElement.getBoundingClientRect()
		return (mouseX > rect.left && mouseX < rect.right && mouseY > rect.top && mouseY < rect.bottom)
	}
}

function getUpgradeElement(layer, id) {
	let elementName = "#upgrade-" + layer + "-" + id.toString()
	return document.querySelector(elementName)
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra information at the top of the page
var displayThings = [
	function() {
		if(options.ch==undefined && modInfo.internationalizationMod==true){return '<big><br>You should choose your language first<br>你需要先选择语言</big>'}
		return '<div class="res">'+displayThingsRes()+'</div><br><div class="vl2"></div></span>'
	}
]

// You can write code here to easily display information in the top-left corner
function displayThingsRes(){
	return 'Points: '+format(player.points)+' | '
}

// Determines when the game "ends"
function isEndgame() {
	return false
}

function getPointsDisplay(){
	let a = ''
	if(player.devSpeed && player.devSpeed!=1){
		a += options.ch ? '<br>时间加速: '+format(player.devSpeed)+'x' : '<br>Dev Speed: '+format(player.devSpeed)+'x'
	}
	if(player.offTime!==undefined){
		a += options.ch ? '<br>离线加速剩余时间: '+formatTime(player.offTime.remain) : '<br>Offline Time: '+formatTime(player.offTime.remain)
	}
	a += '<br>'
	if(!(options.ch==undefined && modInfo.internationalizationMod==true)){
		if (player.points.lt(1e32)) a += `<span class="overlayThing">${(i18n("", "You have", false))} <h1 class="overlayThing" id="points" style='color: ${getPointsColor()}; text-shadow: 0 0 7px ${getPointsColor()}'> ${formatWhole(player.points)}</h2> ${i18n(modInfo.pointsName, modInfo.pointsNameI18N)}</span>`
		else if (player.points.lt(1e40)) a += `<span class="overlayThing">${(i18n("", "You have", false))} ${quickDoubleColor(formatWhole(player.points),'red','green')} ${i18n(modInfo.pointsName, modInfo.pointsNameI18N)}</span>`
		else if (player.points.lt(1e99)) a += `<span class="overlayThing">${(i18n("", "You have", false))} ${quickDoubleColor(formatWhole(player.points),'cyan','blue')} ${i18n(modInfo.pointsName, modInfo.pointsNameI18N)}</span>`
		if(canGenPoints()){
			a += `<br><span class="overlayThing">(`+(tmp.other.oompsMag != 0 ? format(tmp.other.oomps) + " OoM" + (tmp.other.oompsMag < 0 ? "^OoM" : tmp.other.oompsMag > 1 ? "^" + tmp.other.oompsMag : "") + "s" : formatSmall(getPointGen()))+`/sec)</span>`
		}
		a += `<div style="margin-top: 3px"></div>`
	}
	a += tmp.displayThings
	a += '<br><br>'
	return a
}

// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}

//快捷调用+提高运算速度
var zero = new Decimal(0)
var one = new Decimal(1)
var two = new Decimal(2)
var three = new Decimal(3)
var four = new Decimal(4)
var five = new Decimal(5)
var six = new Decimal(6)
var seven = new Decimal(7)
var eight = new Decimal(8)
var nine = new Decimal(9)
var ten = new Decimal(10)
//快捷定义
function n(num){
    return new Decimal(num)
}
//检测旁边的升级是否被购买
function checkAroundUpg(UPGlayer,place){
    place = Number(place)
    return hasUpgrade(UPGlayer,place-1)||hasUpgrade(UPGlayer,place+1)||hasUpgrade(UPGlayer,place-10)||hasUpgrade(UPGlayer,place+10)
}
//指数软上限
function powsoftcap(num,start,power){
	if(num.gt(start)){
		num = num.root(power).mul(start.pow(one.sub(one.div(power))))
	}
    return num
}
//e后数字开根
function expRoot(num,root){
    return ten.pow(num.log10().root(root))
}
//e后数字乘方
function expPow(num,pow){
    return ten.pow(num.log10().pow(pow))
}
//e后数字指数软上限
function expRootSoftcap(num,start,power){
    if(num.lte(start)) return num;
    num = num.log10();start = start.log10()
    return ten.pow(num.root(power).mul(start.pow(one.sub(one.div(power)))))
}
//修改class属性
function setClass(id,toClass = []){
    var classes = ""
    for(i in toClass) classes += " "+toClass[i]
    if(classes != "") classes = classes.substr(1)
    document.getElementById(id).className = classes
}
//快速创建sub元素
function quickSUB(str){
    return `<sub>${str}</sub>`
}
//快速创建sup元素
function quickSUP(str){
    return `<sup>${str}</sup>`
}
//快速给文字上色
function quickBackgColor(str,color){
    return `<text style='background-color:${color};color:white'>${str}</text>`
}
function quickBackgColor2(str,color){
    return `<text style='background-color:${color};color:black'>${str}</text>`
}
function quickColor(str,color){
    return `<text style='color:${color}'>${str}</text>`
}
function quickBigColor(str,color){
    return `<text style='color:${color}; font-size: 25px; text-shadow: 0px 0px 10px ${color}'>${str}</text>`
}
function quickDoubleColor(str,colora,colorb){
    return `<text style='background-image:linear-gradient(to right, ${colora}, ${colorb}); -webkit-background-clip:text; color: transparent; font-size: 30px; text-shadow: 0px 0px 10px ${colorb}'>${str}</text>`
}