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

function TierColor(tier){
    if(tier == 1) return "#a15c2f"
    else return "white"
}

function TierName(tier){
    if(tier == 1) return "Copper"
    else return "Original"
}

function insertCard(id){
    for (let i=0; i<=24; i++){
        if(player.p.itemCurrent[i].n == 0) {
            player.p.itemCurrent[i].n = id
            player.p.itemCurrent[i].p = tmp.p.cards[id].points
            player.p.itemCurrent[i].m = tmp.p.cards[id].mind
            player.p.itemCurrent[i].pre = tmp.p.cards[id].pressure
            player.p.itemCurrent[i].c1 = tmp.p.cards[id].c1
            player.p.itemCurrent[i].c2 = tmp.p.cards[id].c2
            player.p.itemCurrent[i].c3 = tmp.p.cards[id].c3
            player.p.itemCurrent[i].c4 = tmp.p.cards[id].c4
            player.p.itemCurrent[i].c5 = tmp.p.cards[id].c5
            player.p.itemCurrent[i].c6 = tmp.p.cards[id].c6
            player.p.itemCurrent[i].ch = tmp.p.cards[id].ch
            break
        }
    }
}

function randomNew() {
let list = []
    for (let j=0; j<=99999; j++){
        for (let i=0; i<=2; i++){
            if(Math.random() <= 0.97){
                list[i] = randomTier(0)
            }
        else list[i] = randomTier(1)
        }
        if(list[0] && list [1] && list[2]) break
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

function check(id){
    if(player.p.itemCurrent[id] == 9){
        if (((player.p.itemCurrent[id-4]||0).type == '早教') || ((player.p.itemCurrent[id-1]||0).type == '早教') || ((player.p.itemCurrent[id+1]||0).type == '早教') || ((player.p.itemCurrent[id+4]||0).type == '早教')) player.points = player.points.add(5)
    }
}

function update(){
    for ( card in player.p.itemCurrent ){
        player.points = player.points.add(player.p.itemCurrent[card].p)
        player.p.mind = player.p.mind.add(player.p.itemCurrent[card].m)
        player.p.pressure = player.p.pressure.add(player.p.itemCurrent[card].pre)
        player.p.c[0] = player.p.c[0].add(player.p.itemCurrent[card].c1)
        player.p.c[1] = player.p.c[1].add(player.p.itemCurrent[card].c2)
        player.p.c[2] = player.p.c[2].add(player.p.itemCurrent[card].c3)
        player.p.c[3] = player.p.c[3].add(player.p.itemCurrent[card].c4)
        player.p.c[4] = player.p.c[4].add(player.p.itemCurrent[card].c5)
        player.p.c[5] = player.p.c[5].add(player.p.itemCurrent[card].c6)
        check(card)
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

function getRank(){
    let Rank_Req = [300, 600, 900, 1500, 3000, 5000];
    let Rank_List = ['无','戊下之下','戊下','戊中','戊中上','戊上'];
    let Rank = ['','','','','','','','','','','',''];
    for (var i = 0; i <= 5; i++){
        for (var j = 0; j <= 10; j++){
            if(Number(player.p.c[i]) < Rank_Req[j]) {Rank[i] = Rank_List[j]; Rank[i+6] = j; break}
        };
    };
    return Rank
}

var Rank_Req = [50, 100, 150, 200, 300, 400, 500, 700, 900, 1200, 1500, 1800, 2100, 2400, 2800, 3400, 4000, 4700, 5500, 6500, 8000, 10000, 11000, 12000, 13500, 16000, 18000, 20000, 23000, 27000, 33000, 40000, 50000, 60000, 70000, 80000, 100000, 125000, 150000, 300000];
var Rank_List = ['无','墨不沾肤下','墨不沾肤中','墨不沾肤上','纸上谈兵下','纸上谈兵中','纸上谈兵上','出口成章下','出口成章中','出口成章上','舌绽春雷下'];

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
        c: [n(10),n(10),n(10),n(10),n(10),n(0)],
        deleteMode: false,
        itemCurrent: [{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0},{n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0}],
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
            avilable() {return player.p.turn.lt(13)},
            tier: 0,
            name: "吃奶嘴",
            type: "早教",
            points: n(2),
            mind: n(1),
            pressure: n(0),
            c1: n(0), c2: n(0), c3: n(0), c4: n(0), c5: n(0), c6: n(0),
            special:'无特殊效果'
        },
        2:{
            avilable() {return player.p.turn.lt(13)},
            tier: 0,
            name: "拍手",
            type: "早教",
            points: n(1),
            mind: n(1),
            pressure: n(-1),
            c1: n(0), c2: n(0), c3: n(0), c4: n(0), c5: n(0), c6: n(0),
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
            c1: n(0), c2: n(0), c3: n(0), c4: n(0), c5: n(0), c6: n(0),
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
            c1: n(0), c2: n(0), c3: n(0), c4: n(0), c5: n(0), c6: n(0),
            special:'无特殊效果'
        },
        5:{
            avilable() {return player.p.turn.gte(13)},
            tier: 0,
            name: "学爬行",
            type: "早教",
            points: n(1),
            mind: n(-1),
            pressure: n(1),
            c1: n(0), c2: n(0), c3: n(2), c4: n(0), c5: n(0), c6: n(0),
            special:'运动力 +2'
        },
        6:{
            avilable() {return player.p.turn.gte(25)},
            tier: 0,
            name: "学走路",
            type: "早教",
            points: n(1),
            mind: n(1),
            pressure: n(2),
            c1: n(0), c2: n(0), c3: n(3), c4: n(0), c5: n(0), c6: n(0),
            special:'运动力 +3'
        },
        7:{
            avilable() {return player.p.turn.gte(37)},
            tier: 0,
            name: "学跑步",
            type: "早教",
            points: n(1),
            mind: n(2),
            pressure: n(4),
            c1: n(0), c2: n(0), c3: n(4), c4: n(0), c5: n(0), c6: n(0),
            special:'运动力 +4'
        },
        8:{
            avilable() {return player.p.turn.gte(13)},
            tier: 0,
            name: "买菜",
            type: "早教",
            points: n(),
            mind: n(0),
            pressure: n(-1),
            c1: n(2), c2: n(0), c3: n(2), c4: n(0), c5: n(0), c6: n(0),
            special:'思维力 +2'
        },
        
        9:{
            avilable() {return player.p.turn.gte(25)},
            tier: 1,
            name: "点读笔",
            type: "工具",
            points: n(10),
            mind: n(2),
            pressure: n(2),
            c1: n(3), c2: n(0), c3: n(0), c4: n(0), c5: n(0), c6: n(0),
            special:'思维力 +3 如果周围四格包含至少 1张 早教卡，本回合高考分数增加 5'
        },

        10:{
            avilable() {return player.p.turn.gte(25)},
            tier: 0,
            name: "Tictoc",
            type: "娱乐",
            points: n(-7),
            mind: n(-1),
            pressure: n(-4),
            c1: n(1), c2: n(0), c3: n(0), c4: n(0), c5: n(0), c6: n(1),
            special:'思维力 +1 情商 +1'
        },
        11:{
            avilable() {return player.p.turn.gte(25)},
            tier: 0,
            name: "儿童读物",
            type: "娱乐",
            points: n(6),
            mind: n(1),
            pressure: n(-1),
            c1: n(1), c2: n(0), c3: n(0), c4: n(0), c5: n(0), c6: n(1),
            special:'想象力 +1 思维力 +1'
        },
        12:{
            avilable() {return player.p.turn.gte(25)},
            tier: 0,
            name: "睡前故事",
            type: "娱乐",
            points: n(3),
            mind: n(3),
            pressure: n(-1),
            c1: n(1), c2: n(0), c3: n(0), c4: n(0), c5: n(0), c6: n(1),
            special:'想象力 +1 思维力 +1'
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
        'p-c1':{
            display() {return "思维力："+getRank()[0]+' '+formatWhole(player.p.c[0])},
            canClick() {return false},
            style(){
                return {'height':'40px','width':'200px','background':`black`,'border-radius':'3px', 'border-width':'2px','border-color':'red','color':'white','font-size':'15px'}
            },
            onClick() {
            },
            unlocked(){return true}
        },
        'p-c2':{
            display() {return "语言力："+getRank()[1]+' '+formatWhole(player.p.c[1])},
            canClick() {return false},
            style(){
                return {'height':'40px','width':'200px','background':`black`,'border-radius':'3px', 'border-width':'2px','border-color':'yellow','color':'white','font-size':'15px'}
            },
            onClick() {
            },
            unlocked(){return true}
        },
        'p-c3':{
            display() {return "运动力："+getRank()[2]+' '+formatWhole(player.p.c[2])},
            canClick() {return false},
            style(){
                return {'height':'40px','width':'200px','background':`black`,'border-radius':'3px', 'border-width':'2px','border-color':'lime','color':'white','font-size':'15px'}
            },
            onClick() {
            },
            unlocked(){return true}
        },
        'p-c4':{
            display() {return "记忆力："+getRank()[3]+' '+formatWhole(player.p.c[3])},
            canClick() {return false},
            style(){
                return {'height':'40px','width':'200px','background':`black`,'border-radius':'3px', 'border-width':'2px','border-color':'cyan','color':'white','font-size':'15px'}
            },
            onClick() {
            },
            unlocked(){return true}
        },
        'p-c5':{
            display() {return "想象力："+getRank()[4]+' '+formatWhole(player.p.c[4])},
            canClick() {return false},
            style(){
                return {'height':'40px','width':'200px','background':`black`,'border-radius':'3px', 'border-width':'2px','border-color':'blue','color':'white','font-size':'15px'}
            },
            onClick() {
            },
            unlocked(){return true}
        },
        'p-c6':{
            display() {return "情商："+getRank()[5]+' '+formatWhole(player.p.c[5])},
            canClick() {return false},
            style(){
                return {'height':'40px','width':'200px','background':`black`,'border-radius':'3px', 'border-width':'2px','border-color':'lavender','color':'lavender','font-size':'15px'}
            },
            onClick() {
            },
            unlocked(){return true}
        },
        'p-next':{
            display() {return "下一回合"},
            canClick() {return true

            },
            style(){
                return {'height':'40px','width':'200px','background':`black`,'border-radius':'3px', 'border-width':'2px','border-color':'white','color':'white','font-size':'15px'}
            },
            onClick() {
                if(player.p.turn.gte(37)) {alert('很遗憾，目前版本的内容只有这么多了！\n结局是高考 3,000 分'); return}
                if(player.p.pressure.gte(100) || player.p.mind.lt(1)) {alert('很遗憾，因为压力或意志超限你失败了！请进行硬重置\n结局是高考 3,000 分'); return}
                update()
            },
            unlocked(){return true}
        },
        'p-del':{
            display() {return "删除卡牌"},
            canClick() {return true},
            style(){
                if(!player.p.deleteMode) return {'height':'40px','width':'200px','background':`black`,'border-radius':'3px', 'border-width':'2px','border-color':'red','color':'white','font-size':'15px'};
                else return {'height':'40px','width':'200px','background':`red`,'border-radius':'3px', 'border-width':'2px','border-color':'red','color':'white','font-size':'15px'}
            },
            onClick() {
                player.p.deleteMode = !player.p.deleteMode
            },
            unlocked(){return true}
        },
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
            if(player.p.deleteMode && player.p.itemCurrent[reAccording(id)].n != 0) player.p.itemCurrent[reAccording(id)] = {n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0}; Vue.set(player['p'], "grid", getStartGrid('p'))
        },
        getDisplay(data, id) {
            if(player.p.itemCurrent[reAccording(id)].n != 0) return `Tier ${formatWhole((tmp.p.cards[player.p.itemCurrent[reAccording(id)].n]).tier)}<br>${(tmp.p.cards[player.p.itemCurrent[reAccording(id)].n]).name}<br>Scr ${formatWhole(player.p.itemCurrent[reAccording(id)].p)} / Mind ${formatWhole(player.p.itemCurrent[reAccording(id)].m)} / Pre ${formatWhole(player.p.itemCurrent[reAccording(id)].pre)} `
        },
        getStyle(data, id){
            if((tmp.p.cards[player.p.itemCurrent[reAccording(id)].n] || 0).tier == 1) return {'background-color': "#a15c2f", color: "white", 'border-color': "#a15c2f",'border-radius': "5px", height: "100px", width: "100px"}
            else if(player.p.itemCurrent[reAccording(id)].n != 0) return {'background-color': "#FFFFFF", color: "black", 'border-color': '#DDDDDD','border-radius': "5px", height: "100px", width: "100px"}
            else return {'background-color': "#000000", color: "white", 'border-color': 'white','border-radius': "5px", height: "100px", width: "100px"}
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
       ['row',[
        ["column", [["raw-html", function() {}],
                    "blank",['display-text',function(){return `<h3>属性面板：<br>`}],
                   "blank",
                   ['column',["blank",["clickable",'p-c1'],'blank',["clickable",'p-c2'],'blank',["clickable",'p-c3'],'blank',["clickable",'p-c4'],'blank',["clickable",'p-c5'],'blank',["clickable",'p-c6'],'blank',["clickable",'Ktr-g1/8']]],
                   ],
                   {
                       "color":"white",
                       "width":"200px",
                       "height":"300px",
                       "border-color":"#FFFFFF",
                       "border-width":"3px",
                       "background-color":"transparent",
                       "padding":"20px"
                   },
                ],
        ["column", [["raw-html", function() {}],
                    "blank",['display-text',function(){return `<h3>${getTermName(Number(player.p.turn))} 第${((Number(player.p.turn)-1) % 12 >= 7) ? "二":"一"}学期 (${formatWhole((player.p.turn).sub(1).div(12).floor())}岁)<br>第 ${formatWhole(player.p.turn)} 回合<br><br>【婴幼儿时期】效果：<br>高考分数自增 +1<br>意志 +3<br>压力 -4`}],
                   "blank",
                   ['column',["blank",["clickable",'p-pre'],'blank',["clickable",'p-mind'],'blank',["clickable",'p-next'],'blank',["clickable",'p-del'],["clickable",'Ktr-g1/2'],["clickable",'Ktr-g1/4'],["clickable",'Ktr-g1/8']]],
                   ],
                   {
                       "color":"white",
                       "width":"280px",
                       "height":"300px",
                       "border-color":"#FFFFFF",
                       "border-width":"3px",
                       "background-color":"transparent",
                       "padding":"20px"
                   },
                ],'grid']],
       ["microtabs","tab"]
    ],
    layerShown(){return true},
})
addLayer("c", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "青铜针匣", // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N: "Prestige", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 0, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        description: '选中一个目标来查看其效果！'
    }},
    color: "#a15c2f",
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

    clickables: {
        'c-dis': {
            display() { return player.c.description },
            unlocked() { return true },
            style() {
                let s = {
                    'border-radius': '0%',
                    'border-color': '#ffffff',
                    'background-color': '#000000',
                    'color': '#ffffff',
                    'min-height': '120px',
                    'width': '320px',
                }
                return s
            },
        },
    },

    upgrades:{
        "Pre-a":{
            fullDisplay(){ return "Pre-a" },
            cover() { if(isUpgradeCovered(this.layer,this.id)) player.c.description = `[Pre-a] 聪明伶俐 <br>
                思维力等级达到戊 (要求 300 思维力) <br>
                3岁 / 36回合开始前可达成 <br>
                奖励：将数个和才艺有关的卡牌洗入卡池 (包括较高稀有度卡牌)
            `
            },
            canAfford() {
                return false
            },
            style() {
                let color = '#000000'
                if (hasUpgrade(this.layer, this.id)) color = '#a15c2f'
                let s = {
                    'border-radius': '0%',
                    'border-color': '#a15c2f',
                    'background-color': color,
                    'font-size': '20px',
                    'color': '#ffffff',
                    'height': '70px',
                    'width': '70px',
                }
                return s
            },
        },
        "Pre-p":{
            fullDisplay(){ return "Pre-p" },
            cover() { if(isUpgradeCovered(this.layer,this.id)) player.c.description = `[Pre-a] 健康成长 <br>
                运动力等级达到戊 (要求 300 运动力) <br>
                3岁 / 36回合开始前可达成 <br>
                奖励：将数个和运动有关的初级卡牌洗入卡池 (包括较高稀有度卡牌)
            `
            },
            canAfford() {
                return false
            },
            style() {
                let color = '#000000'
                if (hasUpgrade(this.layer, this.id)) color = '#a15c2f'
                let s = {
                    'border-radius': '0%',
                    'border-color': '#a15c2f',
                    'background-color': color,
                    'font-size': '20px',
                    'color': '#ffffff',
                    'height': '70px',
                    'width': '70px',
                }
                return s
            },
        },
    },
    microtabs:{
        tab:{
            "main":{
                name(){return '目标'}, // Name of tab button
                nameI18N(){return 'main'}, // Second name for internationalization (i18n) if internationalizationMod is enabled
                content:[
                    ["clickable","c-dis"],
                    ['row',[['upgrade','Pre-a'],['upgrade','Pre-p']]],
                    'blank',
                    ["display-text", function() { return '很遗憾，这个板块功能还在开发中，下个版本才能达成这些目标并获取奖励' }],
                ],
            },
            "stat":{
                name(){return '统计'}, // Name of tab button
                nameI18N(){return 'main'}, // Second name for internationalization (i18n) if internationalizationMod is enabled
                content:[
                ],
            },
        },
    },
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       ["microtabs","tab"]
    ],
    layerShown(){return player.points.gte(10)},
})
addLayer("s", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "白银宝盒", // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N: "Prestige", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 0, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#a8a8a8",
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
    microtabs:{
        tab:{
            "main":{
                name(){return '主要'}, // Name of tab button
                nameI18N(){return 'main'}, // Second name for internationalization (i18n) if internationalizationMod is enabled
                content:[
                ],
            },
            
        },
    },
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       "blank",
    ],
    layerShown(){return player.points.gte(100)},
})
// You can delete the second name from each option if internationalizationMod is not enabled.
// You can use function i18n(text, otherText) to return text in two different languages. Typically, text is English and otherText is Chinese. If changedDefaultLanguage is true, its reversed
// You can delete the second name from each option if internationalizationMod is not enabled.
// You can use function i18n(text, otherText) to return text in two different languages. Typically, text is English and otherText is Chinese. If changedDefaultLanguage is true, its reversed