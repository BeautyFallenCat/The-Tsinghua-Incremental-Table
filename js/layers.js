addLayer("1layer", {
    name: "sideLayer1",
    position: -1,
    row: 0,
    symbol() {return '↓ layer 1 ↓'}, // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N() {return '↓ layer 1 ↓'}, // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled (in mod.js)
    small: true,// Set to true to generate a slightly smaller layer node
    nodeStyle: {"font-size": "15px", "height": "30px"},// Style for the layer button
    startData() { return {
        unlocked: true,
        points: new Decimal(0),// This currently does nothing, but it's required. (Might change later if you add mechanics to this layer.)
    }},
    color: "#fefefe",
    type: "none",
    tooltip(){return false},
    layerShown(){return layerDisplayTotal(['p'])},// If any layer in the array is unlocked, it will returns true. Otherwise it will return false.
	tabFormat: [
        ["display-text", function() { return getPointsDisplay() }]
    ],
})

function insertCard(id){
    for (let i=0; i<=24; i++){
        if(player.p.itemCurrent[i].n == 0) {
            player.p.itemCurrent[i].n = id
            player.p.itemCurrent[i].p = tmp.p.cards[id].points
            player.p.itemCurrent[i].m = tmp.p.cards[id].mind
            player.p.itemCurrent[i].pre = tmp.p.cards[id].pressure
            break
        }
    }
}

function randomNew() {
    let list = []
    for (let i=0; i<=2; i++){
        if(Math.random() <= 999){
            list[i] = randomTier(0)
        }
    }
    return list
}

function randomTier(tier) {
    let cardAmount = 0
    let cardList = []
    for (card in tmp.p.cards){
        if(tmp.p.cards[card].avilable && tmp.p.cards[card].tier == tier) {cardList[cardAmount] = card; cardAmount++}
    }
    let cardChoice = (cardList[Math.round(Math.random()*Number(cardList.length-1))])
    return cardChoice
}

function shuffle(arr) {
    var len = arr.length;
    for (var i = len - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    }
    return arr;
}

function according(id){
    if(id <= 4) return 101 + id
    if(id <= 9) return 200 + id - 4
    if(id <= 14) return 300 + id - 9
    if(id <= 19) return 400 + id - 14
    if(id <= 24) return 500 + id - 19
}

function reAccording(id){
    if(id < 200) return id - 101
    if(id < 300) return id - 200 + 4
    if(id < 400) return id - 300 + 9
    if(id < 500) return id - 400 + 14
    if(id < 600) return id - 500 + 19
}

function getTermName(turn){
    let array = ['学龄前7年级','学龄前6年级','学龄前5年级','学龄前4年级','学龄前3年级','学龄前2年级','学龄前1年级','小学1年级','小学2年级','小学3年级','小学4年级','小学5年级','小学6年级','初中7年级','初中8年级','初中9年级','高中1年级','高中2年级','高中3年级']
    return array[Math.floor((turn - 1) / 12)]
}

function update(){
    for ( card in player.p.itemCurrent ){
        player.points = player.points.add(player.p.itemCurrent[card].p)
        player.p.mind = player.p.mind.add(player.p.itemCurrent[card].m)
        player.p.pressure = player.p.pressure.add(player.p.itemCurrent[card].pre)
    }
    player.p.turn = player.p.turn.add(1)
    player.p.mind = player.p.mind.add(3).min(100)
    player.p.pressure = player.p.pressure.sub(4).max(0)
    player.p.itemCurrent = shuffle(player.p.itemCurrent)
    Vue.set(player['p'], "grid", getStartGrid('p'))
    player.p.newList = randomNew()
    Modal.show({
        color: 'white',
        title() {return `选择卡牌`},
        text() {return '请选择一张新的卡牌加入卡池！注意，已有 25 张卡牌后选择新卡后会直接吞卡'},
    })
}

addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "主页面", // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N: "Prestige", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 0, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        turn: new Decimal(1),
        mind: new Decimal(35),
        pressure: new Decimal(75),
        newList: ['1','1','1'],
        itemCurrent: [{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0}],
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    resourceI18N: "prestige points", // Second name of the resource for internationalization (i18n) if internationalizationMod is enabled
    baseResource: "points", // Name of resource prestige is based on
    baseResourceI18N: "points", // Second name of the baseResource for internationalization (i18n) if internationalizationMod is enabled
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    cards:{
        1:{
            avilable() {return true},
            tier: 0,
            name: "吃奶嘴",
            type: "早教",
            points: n(2),
            mind: n(1),
            pressure: n(0),
            special:'无特殊效果'
        },
        2:{
            avilable() {return true},
            tier: 0,
            name: "拍手",
            type: "早教",
            points: n(1),
            mind: n(1),
            pressure: n(-1),
            special:'无特殊效果'
        },
        3:{
            avilable() {return true},
            tier: 0,
            name: "撒娇",
            type: "早教",
            points: n(3),
            mind: n(0),
            pressure: n(0),
            special:'无特殊效果'
        },
        4:{
            avilable() {return true},
            tier: 0,
            name: "学说话",
            type: "早教",
            points: n(7),
            mind: n(-1),
            pressure: n(0),
            special:'无特殊效果'
        },
    },
    upgrades: {
    },
    clickables:{
        'p-mind':{
            display() {return "意志："+formatWhole(player.p.mind)+'/100'},
            canClick() {return true},
            style(){
                return {'height':'40px','width':'200px','background':`linear-gradient(to right,orange ${formatWhole(player.p.mind)}%,black ${formatWhole(player.p.mind)}%)`,'border-radius':'5px', 'border-width':'2px','border-color':'orange','color':'white','font-size':'15px'}
            },
            onClick() {
            },
            unlocked(){return true}
        },
        'p-pre':{
            display() {return "压力："+formatWhole(player.p.pressure)+'/100'},
            canClick() {return true},
            style(){
                return {'height':'40px','width':'200px','background':`linear-gradient(to right,orange ${formatWhole(player.p.pressure)}%,black ${formatWhole(player.p.pressure)}%)`,'border-radius':'5px', 'border-width':'2px','border-color':'orange','color':'white','font-size':'15px'}
            },
            onClick() {
            },
            unlocked(){return true}
        },
        'p-next':{
            display() {return "下一回合"},
            canClick() {return true},
            style(){
                return {'height':'40px','width':'200px','background':`linear-gradient(to right,black ${formatWhole(player.p.pressure)}%,black ${formatWhole(player.p.pressure)}%)`,'border-radius':'5px', 'border-width':'2px','border-color':'white','color':'white','font-size':'15px'}
            },
            onClick() {
                if(player.p.turn.gte(13)) {alert('pre-Alpha版本内容到此结束！请期待更新\n结局是高考 300 分以上'); return}
                update()
            },
            unlocked(){return true}
        }
    },
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    grid: {
        rows: 5, // If these are dynamic make sure to have a max value as well!
        cols: 5,
        getStartData(id) {
            return 0
        },
        getUnlocked(id) { // Default
            return true
        },
        getCanClick(data, id) {
            return true
        },
        onClick(data, id) { 
            player[this.layer].grid[id]+=11451419198
        },
        getDisplay(data, id) {
            if(player.p.itemCurrent[reAccording(id)].n != 0) return `Tier ${formatWhole((tmp.p.cards[player.p.itemCurrent[reAccording(id)].n]).tier)}<br>${(tmp.p.cards[player.p.itemCurrent[reAccording(id)].n]).name}<br>Scr ${formatWhole(player.p.itemCurrent[reAccording(id)].p)} / Mind ${formatWhole(player.p.itemCurrent[reAccording(id)].m)} / Pre ${formatWhole(player.p.itemCurrent[reAccording(id)].pre)} `
        },
        getStyle(data, id){
            if(player.p.itemCurrent[reAccording(id)].n != 0) return {'background-color': "#FFFFFF", color: "black", 'border-color': '#DDDDDD','border-radius': "5px", height: "100px", width: "100px"}
            return {'background-color': "#000000", color: "white", 'border-color': 'white','border-radius': "5px", height: "100px", width: "100px"}
        }
    },
    microtabs:{
        tab:{
            "main":{
                name(){return 'main'}, // Name of tab button
                nameI18N(){return 'main'}, // Second name for internationalization (i18n) if internationalizationMod is enabled
                content:[
                ],
            },
        },
    },
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       "blank",
       ['row',[["column", [["raw-html", function() {}],
                    "blank",['display-text',function(){return `<h3>${getTermName(Number(player.p.turn))} 第${((Number(player.p.turn)-1) % 12 >= 7) ? "二":"一"}学期 (${formatWhole((player.p.turn).sub(1).div(12).floor())}岁)<br>第 ${formatWhole(player.p.turn)} 回合<br><br>【婴儿时期】效果：<br>高考分数自增 +1<br>意志 +3<br>压力 -4`}],
                   "blank",
                   ['column',["blank",["clickable",'p-pre'],'blank',["clickable",'p-mind'],'blank',["clickable",'p-next'],["clickable",'Ktr-g1'],["clickable",'Ktr-g1/2'],["clickable",'Ktr-g1/4'],["clickable",'Ktr-g1/8']]],
                   ],
                   {
                       "color":"white",
                       "width":"300px",
                       "height":"300px",
                       "border-color":"#FFFFFF",
                       "border-width":"3px",
                       "background-color":"transparent",
                       "padding":"100px"
                   },
                ],'grid']],
       ["microtabs","tab"]
    ],
    layerShown(){return true},
})

// You can delete the second name from each option if internationalizationMod is not enabled.
// You can use function i18n(text, otherText) to return text in two different languages. Typically, text is English and otherText is Chinese. If changedDefaultLanguage is true, its reversed