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
    if(tier == 3) return "#E5c100"
    if(tier == 2) return "#a8a8a8"
    if(tier == 1) return "#a15c2f"
    else return "white"
}

function TierName(tier){
    if(tier == 3) return "Gold"
    if(tier == 2) return "Silver"
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
            let t = Math.random()
            if(t <= randomFactor()[0]){
                list[i] = randomTier(0)
            }
            else if(t <= randomFactor()[1]){
                list[i] = randomTier(1)
            }
            else if(t <= randomFactor()[2]){
                list[i] = randomTier(2)
            }
            else list[i] = randomTier(3)
        }
        if(list[0] && list [1] && list[2]) break
    }
    return list
}

function randomFactor() {
    let stat = player.p.c[0].add(player.p.c[1]).add(player.p.c[2]).add(player.p.c[3]).add(player.p.c[4]).add(player.p.c[5])
    if(stat.lt(1000)) return [0.97,1,1,1]
    if(stat.lt(2000)) return [0.9,0.98,1,1,1]
    if(stat.lt(4000)) return [0.77,0.88,0.96,1]
    else return [0.60,0.80,0.93,1]
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
    if(player.p.itemCurrent[id].n == 9){ 
        if (((tmp.p.cards[(player.p.itemCurrent[id-4]||0)]||0).type == '早教') || ((tmp.p.cards[(player.p.itemCurrent[id-1]||0)]||0).type == '早教') || ((tmp.p.cards[(player.p.itemCurrent[id+1]||0)]||0).type == '早教') || ((tmp.p.cards[(player.p.itemCurrent[id+4]||0)]||0).type == '早教')) player.points = player.points.add(5)
    }
    if(player.p.itemCurrent[id].n == 13 || player.p.itemCurrent[id].n == 14 || player.p.itemCurrent[id].n == 15){
        player.p.itemCurrent[id].ch = player.p.itemCurrent[id].ch + 1
        if(player.p.itemCurrent[id].ch >= 10){
            let temp = player.p.itemCurrent[id].n
            player.p.itemCurrent[id] = {n:0,p:0,m:0,pre:0,c1:0,c2:0,c3:0,c4:0,c5:0,c6:0,ch:0}
            insertCard(Number(temp) + 1)
        }
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
    if(player.g.event.includes(11)) player.points = player.points.add(64)
    if(player.g.event.includes(21)) player.p.c[0] = player.p.c[0].add(8)
    if(player.g.event.includes(31)) player.p.c[1] = player.p.c[1].add(8)
    if(player.g.event.includes(41)) player.p.c[2] = player.p.c[2].add(8)
    if(player.g.event.includes(51)) player.p.c[3] = player.p.c[3].add(8)
    if(player.g.event.includes(61)) player.p.c[4] = player.p.c[4].add(8)
    player.p.turn = player.p.turn.add(1)
    if(player.p.turn.lt(99)){
    player.p.mind = player.p.mind.add(3).min(100)
    player.p.pressure = player.p.pressure.sub(4).max(0)
    }
    player.p.itemCurrent = shuffle(player.p.itemCurrent)
    Vue.set(player['p'], "grid", getStartGrid('p'))
    player.p.newList = randomNew()
    player.p.modelType = 'card'
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

function hasCard(id){
    let obj = { n:id }
    let isExist = player.p.itemCurrent.some(f => f.n == obj.n)
    return isExist
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
        c: [n(10),n(10),n(10),n(10),n(10),n(0)],
        deleteMode: false,
        modelType: 'card',
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
            ch: 0,
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
            ch: 0,
            special:'无特殊效果'
        },
        3:{
            avilable() {return player.p.turn.lt(37)},
            tier: 0,
            name: "撒娇",
            type: "早教",
            points: n(3),
            mind: n(0),
            pressure: n(0),
            c1: n(0), c2: n(0), c3: n(0), c4: n(0), c5: n(0), c6: n(0),
            ch: 0,
            special:'无特殊效果'
        },
        4:{
            avilable() {return player.p.turn.lt(37)},
            tier: 0,
            name: "学说话",
            type: "早教",
            points: n(7),
            mind: n(-1),
            pressure: n(0),
            c1: n(0), c2: n(0), c3: n(0), c4: n(0), c5: n(0), c6: n(0),
            ch: 0,
            special:'无特殊效果'
        },
        5:{
            avilable() {return player.p.turn.gte(13) && player.p.turn.lt(37)},
            tier: 0,
            name: "学爬行",
            type: "早教",
            points: n(1),
            mind: n(-1),
            pressure: n(1),
            c1: n(0), c2: n(0), c3: n(2), c4: n(0), c5: n(0), c6: n(0),
            ch: 0,
            special:'运动力 +2'
        },
        6:{
            avilable() {return player.p.turn.gte(25) && player.p.turn.lt(49)},
            tier: 0,
            name: "学走路",
            type: "早教",
            points: n(1),
            mind: n(1),
            pressure: n(2),
            c1: n(0), c2: n(0), c3: n(3), c4: n(0), c5: n(0), c6: n(0),
            ch: 0,
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
            ch: 0,
            special:'运动力 +4'
        },
        8:{
            avilable() {return player.p.turn.gte(13) && player.p.turn.lt(49)},
            tier: 0,
            name: "买菜",
            type: "早教",
            points: n(),
            mind: n(0),
            pressure: n(-1),
            c1: n(2), c2: n(0), c3: n(2), c4: n(0), c5: n(0), c6: n(0),
            ch: 0,
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
            ch: 0,
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
            ch: 0,
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
            ch: 0,
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
            ch: 0,
            special:'想象力 +1 思维力 +1'
        },
        13:{
            avilable() {return player.c.completed.includes('Pre-a') && !hasCard(13) && !hasCard(14) && !hasCard(15) && !hasCard(16)},
            tier: 0,
            name: "学钢琴",
            type: "早教",
            points: n(9),
            mind: n(2),
            pressure: n(1),
            c1: n(2), c2: n(0), c3: n(0), c4: n(2), c5: n(0), c6: n(0),
            ch: 0,
            special:'记忆力 +2 思维力 +2；每在场 10 回合升级自身'
        },
        14:{
            avilable() {return false},
            tier: 1,
            name: "钢琴 4 级",
            type: "早教",
            points: n(18),
            mind: n(2),
            pressure: n(1),
            c1: n(3), c2: n(0), c3: n(0), c4: n(3), c5: n(0), c6: n(0),
            ch: 0,
            special:'记忆力 +3 思维力 +3；每在场 10 回合升级自身'
        },
        15:{
            avilable() {return false},
            tier: 1,
            name: "钢琴 7 级",
            type: "早教",
            points: n(27),
            mind: n(2),
            pressure: n(1),
            c1: n(4), c2: n(0), c3: n(0), c4: n(4), c5: n(0), c6: n(0),
            ch: 0,
            special:'记忆力 +4 思维力 +4；每在场 10 回合升级自身'
        },
        16:{
            avilable() {return false},
            tier: 2,
            name: "钢琴 10 级",
            type: "早教",
            points: n(45),
            mind: n(2),
            pressure: n(1),
            c1: n(5), c2: n(0), c3: n(0), c4: n(5), c5: n(0), c6: n(0),
            ch: 0,
            special:'记忆力 +5 思维力 +5；每在场 10 回合升级自身'
        },
        18:{
            avilable() {return player.c.completed.includes('Pre-a')},
            tier: 1,
            name: "电子琴",
            type: "早教",
            points: n(22),
            mind: n(2),
            pressure: n(0),
            c1: n(0), c2: n(0), c3: n(0), c4: n(3), c5: n(0), c6: n(0),
            ch: 0,
            special:'记忆力 +3；该卡牌由 Pre-a 友情赞助'
        },
        19:{
            avilable() {return player.c.completed.includes('Pre-a')},
            tier: 1,
            name: "舞蹈",
            type: "早教",
            points: n(19),
            mind: n(1),
            pressure: n(2),
            c1: n(0), c2: n(0), c3: n(1), c4: n(0), c5: n(0), c6: n(0),
            ch: 0,
            special:'运动力 +1；该卡牌由 Pre-a 友情赞助'
        },
        20:{
            avilable() {return player.c.completed.includes('Pre-a')},
            tier: 1,
            name: "美术基础",
            type: "艺术",
            points: n(14),
            mind: n(1),
            pressure: n(2),
            c1: n(0), c2: n(0), c3: n(0), c4: n(0), c5: n(1), c6: n(0),
            ch: 0,
            special:'想象力 +3'
        },
        21:{
            avilable() {return player.c.completed.includes('Pre-p')},
            tier: 0,
            name: "做操",
            type: "早教",
            points: n(10),
            mind: n(1),
            pressure: n(-2),
            c1: n(0), c2: n(0), c3: n(3), c4: n(0), c5: n(0), c6: n(0),
            ch: 0,
            special:'运动力 +3'
        },
        22:{
            avilable() {return player.c.completed.includes('Pre-p')},
            tier: 1,
            name: "体育课",
            type: "体育",
            points: n(14),
            mind: n(1),
            pressure: n(-2),
            c1: n(0), c2: n(0), c3: n(4), c4: n(0), c5: n(0), c6: n(0),
            ch: 0,
            special:'运动力 +4'
        },
        23:{
            avilable() {return player.p.turn.gte(37)},
            tier: 0,
            name: "十兆个为什么",
            type: "书籍",
            points: n(9),
            mind: n(2),
            pressure: n(0),
            c1: n(0), c2: n(1), c3: n(0), c4: n(0), c5: n(0), c6: n(0),
            ch: 0,
            special:'语言力 +1 “这个用科学计数法的话就是 1e13 ”'
        },
        24:{
            avilable() {return player.p.turn.gte(37)},
            tier: 2,
            name: "唐诗 300 首",
            type: "书籍",
            points: n(50),
            mind: n(1),
            pressure: n(1),
            c1: n(0), c2: n(4), c3: n(0), c4: n(0), c5: n(0), c6: n(0),
            ch: 0,
            special:'语言力 +4 “不畏浮云遮望眼 自缘身在最高层”'
        },
        25:{
            avilable() {return player.p.turn.gte(37)},
            tier: 0,
            name: "月亮与八美刀",
            type: "书籍",
            points: n(8),
            mind: n(1),
            pressure: n(0),
            c1: n(0), c2: n(0), c3: n(0), c4: n(0), c5: n(0), c6: n(1),
            ch: 0,
            special:'情商 +1'
        },
        26:{
            avilable() {return player.p.turn.gte(37)},
            tier: 0,
            name: "Mimiworld",
            type: "娱乐",
            points: n(-20),
            mind: n(-1),
            pressure: n(-5),
            c1: n(0), c2: n(0), c3: n(0), c4: n(0), c5: n(0), c6: n(-1),
            ch: 0,
            special:'情商 -1'
        },
        27:{
            avilable() {return player.p.turn.gte(37)},
            tier: 0,
            name: "Minecart",
            type: "娱乐",
            points: n(-8),
            mind: n(0),
            pressure: n(-3),
            c1: n(2), c2: n(1), c3: n(0), c4: n(0), c5: n(0), c6: n(0),
            ch: 0,
            special:'思维力 +2 语言力 +1'
        },
        28:{
            avilable() {return player.p.turn.gte(37)},
            tier: 0,
            name: "延迟满足",
            type: "早教",
            points: n(5),
            mind: n(1),
            pressure: n(1),
            c1: n(0), c2: n(2), c3: n(0), c4: n(0), c5: n(0), c6: n(0),
            ch: 0,
            special:'语言力 +2'
        },
        29:{
            avilable() {return false},
            tier: 2,
            name: "智慧小标兵",
            type: "勋章",
            points: n(30),
            mind: n(2),
            pressure: n(0),
            c1: n(1), c2: n(1), c3: n(1), c4: n(1), c5: n(1), c6: n(1),
            ch: 0,
            special:'全属性 +1'
        },
        30:{
            avilable() {return false},
            tier: 3,
            name: "智慧小明星",
            type: "勋章",
            points: n(90),
            mind: n(2),
            pressure: n(0),
            c1: n(1), c2: n(1), c3: n(1), c4: n(1), c5: n(1), c6: n(1),
            ch: 0,
            special:'全属性 +1'
        },
        31:{
            avilable() {return false},
            tier: 2,
            name: "小组长",
            type: "勋章",
            points: n(24),
            mind: n(2),
            pressure: n(0),
            c1: n(1), c2: n(1), c3: n(1), c4: n(1), c5: n(1), c6: n(1),
            ch: 0,
            special:'全属性 +1'
        },
        32:{
            avilable() {return false},
            tier: 2,
            name: "大组长",
            type: "勋章",
            points: n(48),
            mind: n(2),
            pressure: n(0),
            c1: n(1), c2: n(1), c3: n(1), c4: n(1), c5: n(1), c6: n(1),
            ch: 0,
            special:'全属性 +1'
        },
        33:{
            avilable() {return false},
            tier: 3,
            name: "班长",
            type: "勋章",
            points: n(96),
            mind: n(2),
            pressure: n(0),
            c1: n(2), c2: n(2), c3: n(2), c4: n(2), c5: n(2), c6: n(2),
            ch: 0,
            special:'全属性 +2'
        },
        34:{
            avilable() {return player.p.turn.gte(49)},
            tier: 0,
            name: "过家家",
            type: "娱乐",
            points: n(7),
            mind: n(1),
            pressure: n(0),
            c1: n(0), c2: n(1), c3: n(0), c4: n(0), c5: n(1), c6: n(0),
            ch: 0,
            special:'语言力 +1 想象力 +1'
        },
        35:{
            avilable() {return player.p.turn.gte(49)},
            tier: 0,
            name: "儿童乐园",
            type: "娱乐",
            points: n(4),
            mind: n(1),
            pressure: n(-1),
            c1: n(0), c2: n(1), c3: n(0), c4: n(0), c5: n(1), c6: n(0),
            ch: 0,
            special:'语言力 +1 想象力 +1'
        },
        36:{
            avilable() {return player.p.turn.gte(49)},
            tier: 1,
            name: "拼音",
            type: "语文",
            points: n(18),
            mind: n(1),
            pressure: n(3),
            c1: n(0), c2: n(4), c3: n(0), c4: n(0), c5: n(0), c6: n(0),
            ch: 0,
            special:'语言力 +4'
        },
        37:{
            avilable() {return player.p.turn.gte(49)},
            tier: 1,
            name: "认识数字",
            type: "数学",
            points: n(16),
            mind: n(1),
            pressure: n(3),
            c1: n(4), c2: n(0), c3: n(0), c4: n(0), c5: n(0), c6: n(0),
            ch: 0,
            special:'思维力 +4'
        },
        38:{
            avilable() {return player.p.turn.gte(49)},
            tier: 1,
            name: "汉字",
            type: "语文",
            points: n(27),
            mind: n(1),
            pressure: n(3),
            c1: n(0), c2: n(6), c3: n(0), c4: n(0), c5: n(0), c6: n(0),
            ch: 0,
            special:'语言力 +6'
        },
        39:{
            avilable() {return player.p.turn.gte(49)},
            tier: 1,
            name: "10 以内的加法",
            type: "数学",
            points: n(24),
            mind: n(1),
            pressure: n(3),
            c1: n(6), c2: n(0), c3: n(0), c4: n(0), c5: n(0), c6: n(0),
            ch: 0,
            special:'思维力 +6'
        },
        40:{
            avilable() {return player.p.turn.gte(49)},
            tier: 0,
            name: "Legody",
            type: "娱乐",
            points: n(-5),
            mind: n(1),
            pressure: n(-3),
            c1: n(2), c2: n(0), c3: n(0), c4: n(0), c5: n(2), c6: n(0),
            ch: 0,
            special:'思维力 +2 想象力 +2'
        },

        41:{
            avilable() {return player.p.turn.gte(49)},
            tier: 1,
            name: "新华字典",
            type: "工具",
            points: n(14),
            mind: n(2),
            pressure: n(3),
            c1: n(0), c2: n(4), c3: n(0), c4: n(0), c5: n(0), c6: n(0),
            ch: 0,
            special:'语言力 +4 如果周围四格包含至少 1张 语文卡，本回合高考分数增加 14'
        },

        42:{
            avilable() {return player.p.turn.gte(49)},
            tier: 2,
            name: "口算题卡",
            type: "工具",
            points: n(35),
            mind: n(2),
            pressure: n(3),
            c1: n(5), c2: n(0), c3: n(0), c4: n(0), c5: n(0), c6: n(0),
            ch: 0,
            special:'思维力 +5'
        },

        43:{
            avilable() {return player.p.turn.gte(49)},
            tier: 3,
            name: "步步高家教机",
            type: "工具",
            points: n(75),
            mind: n(2),
            pressure: n(5),
            c1: n(4), c2: n(0), c3: n(0), c4: n(0), c5: n(0), c6: n(4),
            ch: 0,
            special:'思维力 +4 情商 +4'
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
                if(player.p.turn.gte(60)) {alert('目前的内容就到这里了！请等待更新\n结局是高考 10,000 分')}
                if(player.p.pressure.gte(100) || player.p.mind.lt(1)) {alert('很遗憾，因为压力或意志超限你失败了！请进行硬重置\n结局是高考 10,000 分'); return}
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
            if((tmp.p.cards[player.p.itemCurrent[reAccording(id)].n] || 0).tier == 3) return {'background-color': "#e5c100", color: "white", 'border-color': "#e5c100",'border-radius': "5px", height: "100px", width: "100px"}
            if((tmp.p.cards[player.p.itemCurrent[reAccording(id)].n] || 0).tier == 2) return {'background-color': "#a8a8a8", color: "white", 'border-color': "#a8a8a8",'border-radius': "5px", height: "100px", width: "100px"}
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
                    "blank",['display-text',function(){return `<h3>属性面板：<br>(属性越高，随机出高品质卡概率越高)`}],
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
    symbol: "青铜针匣 - 目标", // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N: "Prestige", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 0, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        description: '选中一个目标来查看其效果！',
        completed:[],
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
                奖励：将数个和才艺有关的卡牌洗入卡池 (包括较高稀有度卡牌); 高考加 500 分
            `
            },
            canAfford() {
                return player.p.c[0].gte(300) && player.p.turn.lt(37)
            },
            onPurchase() {
                player.points = player.points.add(500)
                player.c.completed.push(this.id)
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
                奖励：将数个和运动有关的初级卡牌洗入卡池 (包括较高稀有度卡牌); 高考加 500 分
            `
            },
            canAfford() {
                return player.p.c[2].gte(300) && player.p.turn.lt(37)
            },
            onPurchase() {
                player.points = player.points.add(500)
                player.c.completed.push(this.id)
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
        "K-in1":{
            fullDisplay(){ return "K-in1" },
            cover() { if(isUpgradeCovered(this.layer,this.id)) player.c.description = `[K-in1] 智慧小标兵 <br>
                思维力等级达到戊中 (要求 900 思维力) <br>
                幼儿园结束前可达成 <br>
                奖励：将一张银卡置入你的卡组; 高考加 1,000 分
            `
            },
            canAfford() {
                return player.p.c[0].gte(900)
            },
            onPurchase() {
                player.points = player.points.add(1000)
                player.c.completed.push(this.id)
                insertCard(29)
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
        "K-in2":{
            fullDisplay(){ return "K-in2" },
            cover() { if(isUpgradeCovered(this.layer,this.id)) player.c.description = `[K-in2] 智慧小明星 <br>
                思维力等级达到戊上<br>
                幼儿园结束前可达成 <br>
                奖励：将一张金卡置入你的卡组; 高考加 3,000 分
            `
            },
            canAfford() {
                return player.p.c[0].gte(3000)
            },
            onPurchase() {
                player.points = player.points.add(3000)
                player.c.completed.push(this.id)
                insertCard(30)
            },
            style() {
                let color = '#000000'
                if (hasUpgrade(this.layer, this.id)) color = '#a8a8a8'
                let s = {
                    'border-radius': '0%',
                    'border-color': '#a8a8a8',
                    'background-color': color,
                    'font-size': '20px',
                    'color': '#ffffff',
                    'height': '70px',
                    'width': '70px',
                }
                return s
            },
        },
        "K-e1":{
            fullDisplay(){ return "K-e1" },
            cover() { if(isUpgradeCovered(this.layer,this.id)) player.c.description = `[K-e1] 幼儿园小组长 <br>
                语言力达到戊中 (要求 900 语言力) <br>
                幼儿园结束前可达成 <br>
                奖励：将一张银卡置入你的卡组; 高考加 1,000 分
            `
            },
            canAfford() {
                return player.p.c[1].gte(900)
            },
            onPurchase() {
                player.points = player.points.add(1000)
                player.c.completed.push(this.id)
                insertCard(31)
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
        "K-e2":{
            fullDisplay(){ return "K-e2" },
            cover() { if(isUpgradeCovered(this.layer,this.id)) player.c.description = `[K-e2] 幼儿园大组长 <br>
                语言力达到戊中上 (要求 1500 语言力) <br>
                幼儿园结束前可达成 <br>
                奖励：将一张银卡置入你的卡组; 高考加 2,000 分
            `
            },
            canAfford() {
                return player.p.c[5].gte(900)
            },
            onPurchase() {
                player.points = player.points.add(2000)
                player.c.completed.push(this.id)
                insertCard(32)
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
        "K-e3":{
            fullDisplay(){ return "K-e3" },
            cover() { if(isUpgradeCovered(this.layer,this.id)) player.c.description = `[K-e3] 幼儿园班长 <br>
                全属性综合 1w 点<br>
                幼儿园结束前可达成 <br>
                奖励：将一张金卡置入你的卡组; 高考加 3,000 分
            `
            },
            canAfford() {
                return player.p.c[0].add(player.p.c[1]).add(player.p.c[2]).add(player.p.c[3]).add(player.p.c[4]).add(player.p.c[5]).gte(10000)
            },
            onPurchase() {
                player.points = player.points.add(3000)
                player.c.completed.push(this.id)
                insertCard(33)
            },
            style() {
                let color = '#000000'
                if (hasUpgrade(this.layer, this.id)) color = '#a8a8a8'
                let s = {
                    'border-radius': '0%',
                    'border-color': '#a8a8a8',
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
                    ['row',[['upgrade','K-in1'],['upgrade','K-in2'],['upgrade','K-e1'],['upgrade','K-e2'],['upgrade','K-e3']]],
                    'blank',
                    ["display-text", function() { return '领取卡牌奖励之前一定要检查你的卡组是否有空余位置，否则会吞卡！' }],
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

function decide(i){
    if(player.s.currentEvent == 1){
        if(i == 'A'){
            if(Math.random() <= 0.5){
                doPopup(type = "none", text = "<h4>桑梓寓意着你在学习生涯中自强不息，遇到学习中问题能以刚韧之姿解决", title = "结果1 高考 +300 分", timer = 10, color = "#a8a8a8")
                player.points = player.points.add(300)
            }
            else {
                doPopup(type = "none", text = "<h4>桑梓寓意着你之后将会眷恋故乡，依恋过去，对未来审时度势的判断力不足", title = "结果2 思维力降低 30", timer = 10, color = "#a8a8a8")
                player.p.c[0] = player.p.c[0].sub(30)
            }
        }
        if(i == 'B'){
            if(Math.random() <= 0.5){
                doPopup(type = "none", text = "<h4>你将会是一位一诺千金，信守他人约定，始终如一的人", title = "结果1 情商提升 30", timer = 10, color = "#a8a8a8")
                player.p.c[5] = player.p.c[5].add(30)
            }
            else {
                doPopup(type = "none", text = "<h4>这个名字疑似太烂大街了，会注定你平凡的命运", title = "结果2 高考 -100 分", timer = 10, color = "#a8a8a8")
                player.points = player.points.sub(100)
            }
        }
        if(i == 'C'){
            doPopup(type = "none", text = "<h4>这个名字疑似太烂大街了，会注定你平凡的命运", title = "结果1 高考 -100 分", timer = 10, color = "#a8a8a8")
            player.points = player.points.sub(100)
        }
    }
    if(player.s.currentEvent == 2){
        if(i == 'A'){
            doPopup(type = "none", text = "<h4>大师说：此娃以后必将成大科学家啊！爸妈开心的给你付了咨询费", title = "结果1 高考分数提升 222", timer = 10, color = "#a8a8a8")
            player.points = player.points.add(222)
        }
        if(i == 'B'){
            doPopup(type = "none", text = "<h4>大师说：此娃以后必将成大作家啊！爸妈开心的给你付了咨询费", title = "结果1 语言力提升 40", timer = 10, color = "#a8a8a8")
            player.p.c[1] = player.p.c[1].add(40)
        }
        if(i == 'C'){
            doPopup(type = "none", text = "<h4>大师说：此娃以后必将一事无成啊！你都已经都选这个了，还指望什么好东西？", title = "结果1 高考分数降低 111", timer = 10, color = "#a8a8a8")
            player.points = player.points.sub(111)
        }
    }
    if(player.s.currentEvent == 3){
        if(i == 'A'){
            doPopup(type = "none", text = "<h4>爸妈觉得你的无助的样子很可爱", title = "结果1 运动力提升 80", timer = 10, color = "#a8a8a8")
            player.p.c[2] = player.p.c[2].add(80)
        }
        if(i == 'B'){
            doPopup(type = "none", text = "<h4>爸妈再也没有花钱给你买过裙子。。。", title = "结果1 想象力降低 50", timer = 10, color = "#a8a8a8")
            player.p.c[4] = player.p.c[4].sub(50)
        }
        if(i == 'C'){
            doPopup(type = "none", text = "<h4>宝贝乖哦！抱抱", title = "结果1 语言力提升 80", timer = 10, color = "#a8a8a8")
            player.p.c[1] = player.p.c[1].add(80)
        }
    }
    if(player.s.currentEvent == 4){
        if(i == 'A'){
            doPopup(type = "none", text = "<h4>爸妈罚你把幼儿园校规抄写了 10 遍。。。", title = "结果1 高考分数降低 384", timer = 10, color = "#a8a8a8")
            player.points = player.points.sub(384)
        }
        if(i == 'B'){
            doPopup(type = "none", text = "<h4>一番口舌过后爸妈惊叹于你的能言善辩！", title = "结果1 高考分数提升 768", timer = 10, color = "#a8a8a8")
            player.points = player.points.add(768)
        }
        if(i == 'C'){
            doPopup(type = "none", text = "<h4>宝贝乖哦！抱抱", title = "结果1 语言力提升 80", timer = 10, color = "#a8a8a8")
            player.p.c[1] = player.p.c[1].add(80)
        }
    }
}

addLayer("s", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "白银宝盒 - 事件", // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N: "Prestige", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 0, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        currentEvent: 0,
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
                name(){return '事件'}, // Name of tab button
                nameI18N(){return 'main'}, // Second name for internationalization (i18n) if internationalizationMod is enabled
                content:[
                    ["buyable",0],
                    ["buyable",1],
                    ["buyable",2],
                ],
            },
            
        },
    },
    buyables:{
        0: {
            title() {return '<h3>[事件'+this.id+'] 随机事件 <br>'},
            display() {return '点击此处来查看事件！'},
            canAfford() {return true},
            buy(){
                player.s.currentEvent = Math.floor(Math.random()*2)+1
                player.p.modelType = 'decision'
                Modal.show({
                    color: 'white',
                    title() {return `事件:`+tmp.s.event[player.s.currentEvent].title},
                    text() {return tmp.s.event[player.s.currentEvent].desc},
                })
                setBuyableAmount(this.layer,this.id,n(1))
            },
            style() {
                return {'width':'600px','height':'100px','border-radius':'5px'}
            },
            unlocked(){
                return getBuyableAmount(this.layer,this.id).lt(1) && player.p.turn.gte(18)
            },
        },
        1: {
            title() {return '<h3>[事件'+this.id+'] 随机事件 <br>'},
            display() {return '点击此处来查看事件！'},
            canAfford() {return true},
            buy(){
                player.s.currentEvent = 3
                player.p.modelType = 'decision'
                Modal.show({
                    color: 'white',
                    title() {return `事件`},
                    text() {return tmp.s.event[player.s.currentEvent].desc},
                })
                setBuyableAmount(this.layer,this.id,n(1))
            },
            style() {
                return {'width':'600px','height':'100px','border-radius':'5px'}
            },
            unlocked(){
                return getBuyableAmount(this.layer,this.id).lt(1) && player.p.turn.gte(36)
            },
        },
        2: {
            title() {return '<h3>[事件'+this.id+'] 随机事件 <br>'},
            display() {return '点击此处来查看事件！'},
            canAfford() {return true},
            buy(){
                player.s.currentEvent = 4
                player.p.modelType = 'decision'
                Modal.show({
                    color: 'white',
                    title() {return `事件`},
                    text() {return tmp.s.event[player.s.currentEvent].desc},
                })
                setBuyableAmount(this.layer,this.id,n(1))
            },
            style() {
                return {'width':'600px','height':'100px','border-radius':'5px'}
            },
            unlocked(){
                return getBuyableAmount(this.layer,this.id).lt(1) && player.p.turn.gte(54)
            },
        },
    },
    event:{
        1:{
            title: '起名',
            desc: '父母准备给你取名，姓已经确定好随父姓，那么名字呢？',
            A:{
                title: '梓萱',
                desc: '就把这个当作名字了！',
            },
            B:{
                title: '一诺',
                desc: '就把这个当作名字了！',
            },
            C:{
                title: '婧涵',
                desc: '就把这个当作名字了！',
            },
        },
        2:{
            title: '抓周',
            desc: '爸妈抱着你来到一个算命摊位面前，对方拿出算盘，字典和cosplay手办。你准备抓什么？',
            A:{
                title: '算盘',
                desc: '就抓这个了！',
            },
            B:{
                title: '字典',
                desc: '就抓这个了！',
            },
            C:{
                title: 'cosplay手办',
                desc: '就抓这个了！',
            },
        },
        3:{
            title: '公主裙',
            desc: '爸妈把你强行塞入一条砂质公主裙里，你感觉有点不适，你决定？',
            A:{
                title: '扭动，表示反抗',
                desc: '哎呀呀！~',
            },
            B:{
                title: '伤心的大哭',
                desc: '呜呜呜',
            },
            C:{
                title: '冷漠脸，顺从',
                desc: '唔嗯',
            },
        }, 
        4:{
            title: '公主裙',
            desc: '你想像动画片里的小公主一样长发披肩，但是爸妈觉得学生必须绑马尾，你决定？',
            A:{
                title: '大哭抗议',
                desc: '呜呜呜',
            },
            B:{
                title: '“公主都是披着头发的！”',
                desc: '哼！>_<',
            },
            C:{
                title: '无奈服从',
                desc: '唔嗯',
            },
        }, 
    },
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       "blank",
       "buyables",
       ["microtabs","tab"]
    ],
    layerShown(){return player.points.gte(100) || player.p.turn.gte(18)},
})
addLayer("g", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "黄金积木 - 学校", // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N: "Prestige", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 0, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        effort: new Decimal(12),
        event: [],
    }},
    color: "#E5C100",
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
    maxEffort(){
        let effort = n(12)
        effort = effort.add(player.p.c[2].div(200).floor()).min(22)
        return effort
    },
    buyables:{
        1: {
            title() {return '<h3>洗点 <br>'},
            display() {return '清楚所有已分配活动并将精力恢复到最大值'},
            canAfford() {return true},
            buy(){
                player.g.effort = tmp.g.maxEffort
                player.g.event = []
            },
            style() {
                let color = '#000000'
                if (player.g.event.includes(this.id)) color = 'white'
                let s = {
                    'border-radius': '0%',
                    'border-color': 'white',
                    'background-color': color,
                    'font-size': '10px',
                    'color': '#ffffff',
                    'height': '100px',
                    'width': '200px',
                }
                return s
            },
            unlocked(){
                return true
            },
        },
        11: {
            title() {return '<h3>[p-1] 知识角-初阶 <br>'},
            display() {return '分配 5 精力以进入<br>每个月高考提升 64 分'},
            canAfford() {return player.g.effort.gte(5)},
            buy(){
                player.g.effort = player.g.effort.sub(5)
                player.g.event.push(this.id)
            },
            style() {
                let color = '#000000'
                if (player.g.event.includes(this.id)) color = 'grey'
                let s = {
                    'border-radius': '0%',
                    'border-color': 'grey',
                    'background-color': color,
                    'font-size': '10px',
                    'color': '#ffffff',
                    'height': '100px',
                    'width': '200px',
                }
                return s
            },
            unlocked(){
                return true
            },
        },
        21: {
            title() {return '<h3>[c1-1] 思维角-初阶 <br>'},
            display() {return '分配 5 精力以进入<br>每个月获得 8 思维力'},
            canAfford() {return player.g.effort.gte(5)},
            buy(){
                player.g.effort = player.g.effort.sub(5)
                player.g.event.push(this.id)
            },
            style() {
                let color = '#000000'
                if (player.g.event.includes(this.id)) color = 'red'
                let s = {
                    'border-radius': '0%',
                    'border-color': 'red',
                    'background-color': color,
                    'font-size': '10px',
                    'color': '#ffffff',
                    'height': '100px',
                    'width': '200px',
                }
                return s
            },
            unlocked(){
                return true
            },
        },
        31: {
            title() {return '<h3>[c2-1] 图书角-初阶 <br>'},
            display() {return '分配 5 精力以进入<br>每个月获得 8 语言力'},
            canAfford() {return player.g.effort.gte(5)},
            buy(){
                player.g.effort = player.g.effort.sub(5)
                player.g.event.push(this.id)
            },
            style() {
                let color = '#000000'
                if (player.g.event.includes(this.id)) color = 'orange'
                let s = {
                    'border-radius': '0%',
                    'border-color': 'orange',
                    'background-color': color,
                    'font-size': '10px',
                    'color': '#ffffff',
                    'height': '100px',
                    'width': '200px',
                }
                return s
            },
            unlocked(){
                return true
            },
        },
        41: {
            title() {return '<h3>[c3-1] 运动场-初阶 <br>'},
            display() {return '分配 5 精力以进入<br>每个月获得 8 运动力'},
            canAfford() {return player.g.effort.gte(5)},
            buy(){
                player.g.effort = player.g.effort.sub(5)
                player.g.event.push(this.id)
            },
            style() {
                let color = '#000000'
                if (player.g.event.includes(this.id)) color = 'green'
                let s = {
                    'border-radius': '0%',
                    'border-color': 'green',
                    'background-color': color,
                    'font-size': '10px',
                    'color': '#ffffff',
                    'height': '100px',
                    'width': '200px',
                }
                return s
            },
            unlocked(){
                return true
            },
        },
        51: {
            title() {return '<h3>[c4-1] 朗诵角-初阶 <br>'},
            display() {return '分配 5 精力以进入<br>每个月获得 8 记忆力'},
            canAfford() {return player.g.effort.gte(5)},
            buy(){
                player.g.effort = player.g.effort.sub(5)
                player.g.event.push(this.id)
            },
            style() {
                let color = '#000000'
                if (player.g.event.includes(this.id)) color = 'cyan'
                let s = {
                    'border-radius': '0%',
                    'border-color': 'cyan',
                    'background-color': color,
                    'font-size': '10px',
                    'color': '#ffffff',
                    'height': '100px',
                    'width': '200px',
                }
                return s
            },
            unlocked(){
                return true
            },
        },
        61: {
            title() {return '<h3>[c5-1] 美术角-初阶 <br>'},
            display() {return '分配 5 精力以进入<br>每个月获得 8 想象力'},
            canAfford() {return player.g.effort.gte(5)},
            buy(){
                player.g.effort = player.g.effort.sub(5)
                player.g.event.push(this.id)
            },
            style() {
                let color = '#000000'
                if (player.g.event.includes(this.id)) color = 'blue'
                let s = {
                    'border-radius': '0%',
                    'border-color': 'blue',
                    'background-color': color,
                    'font-size': '10px',
                    'color': '#ffffff',
                    'height': '100px',
                    'width': '200px',
                }
                return s
            },
            unlocked(){
                return true
            },
        },
    },
    microtabs:{
        tab:{
            "main":{
                name(){return '日程'}, // Name of tab button
                nameI18N(){return 'main'}, // Second name for internationalization (i18n) if internationalizationMod is enabled
                content:[
                    ["buyable",1],
                    ["buyable",11],
                    ["buyable",21],
                    ["buyable",31],
                    ["buyable",41],
                    ["buyable",51],
                    ["buyable",61],
                    'blank',
                    ["display-text", function() { return '很遗憾，这个板块功能还在开发中，下个版本才能达成这些目标并获取奖励' }],
                ],
            },
            "stat":{
                name(){return '活动'}, // Name of tab button
                nameI18N(){return 'main'}, // Second name for internationalization (i18n) if internationalizationMod is enabled
                content:[
                    
                ],
            },
        },
    },
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       ['display-text',function(){return '<h4>欢迎来到幼儿园阶段！'}],
       ['display-text',function(){return '<h4>你剩余的精力是 '+quickBigColor(formatWhole(player.g.effort),'#E5C100') +' , 基于你的运动力数值，你的最大精力是 '+quickBigColor(formatWhole(tmp.g.maxEffort),'#E5C100')+'（需要洗点才可以将精力重置为最大值）'}],
       ["microtabs","tab"]
    ],
    layerShown(){return player.points.gte(1000) && player.p.turn.gte(49)},
})