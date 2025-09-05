import { skills } from './skills.js';
import { WEAPONS, EQUIPMENT } from './equipment.js';

export const LOCALIZATION_MAP = {
    stats: {
        hp: '生命', mp: '法力', atk: '攻擊', def: '防禦',
        spi: '靈力', hit: '命中', eva: '閃避',
        critRate: '暴擊率', critDamage: '暴傷', speed: '速度'
    },
    ui: {
        confirm: '確認', cancel: '取消', back: '返回',
        equipped: '已裝備', learn: '學習', upgrade: '升級'
    }
};

const monsters = {
    slime: { id: 'slime', name: "史萊姆", level: 1, stats: { hp: 20, mp: 0, atk: 7, def: 7, spi: 2, hit: 5, eva: 3, speed: 7, critRate: 0, critDamage: 100 }, exp: 18, dropsId: 'L001', skills: []},
    goblin: { id: 'goblin', name: "哥布林", level: 2, stats: { hp: 38, mp: 5, atk: 10, def: 8, spi: 5, hit: 7, eva: 8, speed: 12, critRate: 5, critDamage: 120 }, exp: 30, dropsId: 'L002', skills: ['goblinRush']},
    forestSpider: { id: 'forestSpider', name: '森林蜘蛛', level: 3, stats: { hp: 42, mp: 0, atk: 15, def: 7, spi: 0, hit: 10, eva: 12, speed: 18, critRate: 5, critDamage: 120 }, exp: 40, dropsId: 'L003', skills: ['poisonBite']},
    wildBoar: { id: 'wildBoar', name: "野豬", level: 3, stats: { hp: 85, mp: 0, atk: 19, def: 13, spi: 0, hit: 6, eva: 5, speed: 10, critRate: 5, critDamage: 130 }, exp: 45, dropsId: 'L004', skills: ['tuskGore']},
    wolf: { id: 'wolf', name: '野狼', level: 4, stats: { hp: 70, mp: 0, atk: 24, def: 10, spi: 3, hit: 12, eva: 15, speed: 20, critRate: 10, critDamage: 130 }, exp: 60, dropsId: 'L005', skills: ['furiousBite']},
    goblinWarrior: { id: 'goblinWarrior', name: '哥布林戰士', level: 5, stats: { hp: 100, mp: 10, atk: 26, def: 15, spi: 8, hit: 9, eva: 8, speed: 12, critRate: 8, critDamage: 130 }, exp: 70, dropsId: 'L006', skills: ['goblinRush']},
    orcGrunt: { id: 'orcGrunt', name: '獸人步兵', level: 6, stats: { hp: 140, mp: 0, atk: 33, def: 19, spi: 5, hit: 8, eva: 5, speed: 10, critRate: 5, critDamage: 140 }, exp: 90, dropsId: 'L007', skills: []},
    hobgoblin: { id: 'hobgoblin', name: '大哥布林', level: 7, stats: { hp: 170, mp: 20, atk: 36, def: 22, spi: 10, hit: 10, eva: 10, speed: 14, critRate: 10, critDamage: 140 }, exp: 110, dropsId: 'L008', skills: ['hobgoblinSmash']},
    orcShaman: { id: 'orcShaman', name: '獸人薩滿', level: 8, stats: { hp: 130, mp: 50, atk: 24, def: 16, spi: 30, hit: 12, eva: 12, speed: 15, critRate: 5, critDamage: 120 }, exp: 140, dropsId: 'L009', skills: ['shamanCurse', 'minorHeal']},
    skeleton: { id: 'skeleton', name: '骷髏兵', level: 8, stats: { hp: 190, mp: 0, atk: 42, def: 26, spi: 0, hit: 11, eva: 8, speed: 13, critRate: 5, critDamage: 120 }, exp: 160, dropsId: 'L010', skills: [] },
    wraith: { id: 'wraith', name: '怨靈', level: 9, stats: { hp: 155, mp: 70, atk: 33, def: 22, spi: 40, hit: 15, eva: 20, speed: 22, critRate: 5, critDamage: 120 }, exp: 200, dropsId: 'L011', skills: ['shadowBlast'] },
    direWolf: { id: 'direWolf', name: '恐狼', level: 10, stats: { hp: 220, mp: 0, atk: 50, def: 24, spi: 5, hit: 14, eva: 18, speed: 25, critRate: 15, critDamage: 140 }, exp: 230, dropsId: 'L012', skills: ['furiousBite'] },
    golem: { id: 'golem', name: '石巨人', level: 12, stats: { hp: 280, mp: 0, atk: 58, def: 45, spi: 0, hit: 10, eva: 2, speed: 8, critRate: 0, critDamage: 150 }, exp: 280, dropsId: 'L013', skills: ['earthSlam']},
    goblinLeader: { id: 'goblinLeader', name: '哥布林首領', level: 8, stats: { hp: 350, mp: 50, atk: 40, def: 25, spi: 20, hit: 15, eva: 12, speed: 16, critRate: 10, critDamage: 150 }, exp: 500, dropsId: 'L014', skills: ['hobgoblinSmash', 'battleCry'], isBoss: true },
    ogre: { id: 'ogre', name: '食人魔', level: 14, stats: { hp: 450, mp: 0, atk: 70, def: 35, spi: 10, hit: 12, eva: 6, speed: 9, critRate: 10, critDamage: 150 }, exp: 400, dropsId: 'L015', skills: ['ogreClub'] },
    manticore: { id: 'manticore', name: '蠍尾獅', level: 16, stats: { hp: 380, mp: 40, atk: 65, def: 30, spi: 30, hit: 18, eva: 20, speed: 28, critRate: 15, critDamage: 140 }, exp: 550, dropsId: 'L016', skills: ['poisonSting', 'wingSlash'] },
    troll: { id: 'troll', name: '巨魔', level: 17, stats: { hp: 600, mp: 20, atk: 80, def: 40, spi: 15, hit: 10, eva: 8, speed: 12, critRate: 5, critDamage: 150 }, exp: 700, dropsId: 'L017', skills: ['trollRegen', 'ogreClub'] },
    lich: { id: 'lich', name: '巫妖', level: 20, stats: { hp: 550, mp: 200, atk: 50, def: 38, spi: 90, hit: 20, eva: 22, speed: 25, critRate: 10, critDamage: 150 }, exp: 1200, dropsId: 'L018', skills: ['shadowBlast', 'summonSkeleton', 'shamanCurse'], isBoss: true },
    minotaur: { id: 'minotaur', name: '牛頭怪', level: 22, stats: { hp: 750, mp: 0, atk: 100, def: 50, spi: 5, hit: 15, eva: 10, speed: 18, critRate: 15, critDamage: 160 }, exp: 900, dropsId: 'L019', skills: ['charge'] },
    basilisk: { id: 'basilisk', name: '石化蜥蜴', level: 24, stats: { hp: 650, mp: 80, atk: 90, def: 60, spi: 40, hit: 18, eva: 15, speed: 15, critRate: 10, critDamage: 140 }, exp: 1100, dropsId: 'L020', skills: ['petrifyingGaze', 'poisonBite'] },
    wyvern: { id: 'wyvern', name: '雙足飛龍', level: 26, stats: { hp: 800, mp: 100, atk: 110, def: 45, spi: 50, hit: 22, eva: 25, speed: 35, critRate: 15, critDamage: 150 }, exp: 1500, dropsId: 'L021', skills: ['fireBreath', 'wingSlash'] },
    hydra: { id: 'hydra', name: '九頭蛇', level: 28, stats: { hp: 1200, mp: 150, atk: 120, def: 55, spi: 60, hit: 20, eva: 18, speed: 22, critRate: 10, critDamage: 150 }, exp: 2000, dropsId: 'L022', skills: ['multiBite', 'trollRegen'], isBoss: true },
    elemental: { id: 'elemental', name: '元素體', level: 30, stats: { hp: 700, mp: 300, atk: 60, def: 50, spi: 120, hit: 25, eva: 30, speed: 30, critRate: 10, critDamage: 150 }, exp: 1800, dropsId: 'L023', skills: ['elementalBlast'] },
    ancientDragon: { id: 'ancientDragon', name: '遠古巨龍', level: 50, stats: { hp: 5000, mp: 1000, atk: 250, def: 150, spi: 180, hit: 50, eva: 30, speed: 40, critRate: 25, critDamage: 200 }, exp: 10000, dropsId: 'L024', skills: ['fireBreath', 'earthSlam', 'wingSlash'], isBoss: true },
    giantBat: { id: 'giantBat', name: '巨型蝙蝠', level: 4, stats: { hp: 55, mp: 0, atk: 18, def: 8, spi: 2, hit: 15, eva: 25, speed: 30, critRate: 5, critDamage: 120 }, exp: 50, dropsId: 'L005', skills: [] },
    kobold: { id: 'kobold', name: '狗頭人', level: 3, stats: { hp: 45, mp: 10, atk: 12, def: 9, spi: 8, hit: 8, eva: 10, speed: 15, critRate: 5, critDamage: 120 }, exp: 35, dropsId: 'L002', skills: [] },
    zombie: { id: 'zombie', name: '殭屍', level: 7, stats: { hp: 150, mp: 0, atk: 30, def: 15, spi: 0, hit: 5, eva: 2, speed: 6, critRate: 0, critDamage: 100 }, exp: 80, dropsId: 'L010', skills: [] },
    ghoul: { id: 'ghoul', name: '食屍鬼', level: 9, stats: { hp: 180, mp: 20, atk: 45, def: 20, spi: 10, hit: 12, eva: 12, speed: 18, critRate: 10, critDamage: 130 }, exp: 180, dropsId: 'L011', skills: ['paralyzingTouch'] },
    harpy: { id: 'harpy', name: '鷹身女妖', level: 11, stats: { hp: 200, mp: 30, atk: 55, def: 25, spi: 25, hit: 20, eva: 28, speed: 32, critRate: 10, critDamage: 140 }, exp: 250, dropsId: 'L016', skills: ['wingSlash'] },
    imp: { id: 'imp', name: '小惡魔', level: 13, stats: { hp: 180, mp: 80, atk: 40, def: 28, spi: 60, hit: 18, eva: 22, speed: 28, critRate: 5, critDamage: 130 }, exp: 300, dropsId: 'L018', skills: ['minorFireball'] },
    salamander: { id: 'salamander', name: '火蜥蜴', level: 15, stats: { hp: 350, mp: 50, atk: 75, def: 35, spi: 40, hit: 15, eva: 15, speed: 20, critRate: 10, critDamage: 150 }, exp: 450, dropsId: 'L021', skills: ['fireBreath'] },
    griffin: { id: 'griffin', name: '獅鷲', level: 17, stats: { hp: 420, mp: 0, atk: 85, def: 40, spi: 20, hit: 20, eva: 24, speed: 38, critRate: 15, critDamage: 150 }, exp: 600, dropsId: 'L016', skills: ['wingSlash', 'furiousBite'] },
    cyclops: { id: 'cyclops', name: '獨眼巨人', level: 19, stats: { hp: 800, mp: 0, atk: 95, def: 45, spi: 5, hit: 12, eva: 5, speed: 10, critRate: 10, critDamage: 160 }, exp: 800, dropsId: 'L019', skills: ['ogreClub'] },
    drake: { id: 'drake', name: '幼龍', level: 21, stats: { hp: 600, mp: 120, atk: 100, def: 50, spi: 70, hit: 18, eva: 18, speed: 25, critRate: 10, critDamage: 150 }, exp: 1000, dropsId: 'L021', skills: ['fireBreath'] },
    chimera: { id: 'chimera', name: '奇美拉', level: 23, stats: { hp: 900, mp: 100, atk: 115, def: 55, spi: 60, hit: 20, eva: 20, speed: 26, critRate: 15, critDamage: 150 }, exp: 1300, dropsId: 'L022', skills: ['fireBreath', 'poisonBite'] },
    behemoth: { id: 'behemoth', name: '貝西摩斯', level: 25, stats: { hp: 1500, mp: 0, atk: 130, def: 80, spi: 10, hit: 15, eva: 8, speed: 14, critRate: 5, critDamage: 160 }, exp: 1800, dropsId: 'L017', skills: ['earthSlam', 'tuskGore'] },
    roc: { id: 'roc', name: '大鵬鳥', level: 27, stats: { hp: 1000, mp: 0, atk: 120, def: 50, spi: 40, hit: 25, eva: 35, speed: 42, critRate: 15, critDamage: 150 }, exp: 2200, dropsId: 'L021', skills: ['wingSlash'] },
    leviathan: { id: 'leviathan', name: '利維坦', level: 29, stats: { hp: 2000, mp: 300, atk: 140, def: 70, spi: 80, hit: 22, eva: 15, speed: 20, critRate: 10, critDamage: 150 }, exp: 2800, dropsId: 'L022', skills: ['waterJet', 'tuskGore'] },
    archangel: { id: 'archangel', name: '大天使', level: 32, stats: { hp: 1500, mp: 400, atk: 130, def: 80, spi: 150, hit: 30, eva: 30, speed: 38, critRate: 15, critDamage: 150 }, exp: 3500, dropsId: 'L023', skills: ['divineStrike', 'majorHeal'], isBoss: true },
    demonLord: { id: 'demonLord', name: '惡魔領主', level: 35, stats: { hp: 2500, mp: 300, atk: 180, def: 90, spi: 120, hit: 28, eva: 25, speed: 32, critRate: 20, critDamage: 170 }, exp: 5000, dropsId: 'L024', skills: ['fireBreath', 'shadowBlast', 'shamanCurse'], isBoss: true },
    bandit: { id: 'bandit', name: '盜賊', level: 5, stats: { hp: 90, mp: 0, atk: 28, def: 12, spi: 5, hit: 15, eva: 20, speed: 25, critRate: 10, critDamage: 140 }, exp: 65, dropsId: 'L006', skills: [] },
    spirit: { id: 'spirit', name: '幽魂', level: 9, stats: { hp: 120, mp: 100, atk: 20, def: 30, spi: 50, hit: 15, eva: 30, speed: 28, critRate: 5, critDamage: 120 }, exp: 210, dropsId: 'L011', skills: ['shadowBlast'] },
    gargoyle: { id: 'gargoyle', name: '石像鬼', level: 12, stats: { hp: 250, mp: 0, atk: 60, def: 50, spi: 10, hit: 12, eva: 10, speed: 15, critRate: 5, critDamage: 140 }, exp: 300, dropsId: 'L013', skills: [] },
    orcWarlord: { id: 'orcWarlord', name: '獸人督軍', level: 15, stats: { hp: 500, mp: 50, atk: 75, def: 40, spi: 20, hit: 18, eva: 12, speed: 20, critRate: 15, critDamage: 150 }, exp: 500, dropsId: 'L007', skills: ['hobgoblinSmash', 'battleCry'] },
    necromancerAcolyte: { id: 'necromancerAcolyte', name: '死靈學徒', level: 18, stats: { hp: 350, mp: 150, atk: 40, def: 30, spi: 80, hit: 15, eva: 18, speed: 22, critRate: 5, critDamage: 130 }, exp: 650, dropsId: 'L018', skills: ['boneSpear', 'shamanCurse'] },
    sandworm: { id: 'sandworm', name: '沙蟲', level: 20, stats: { hp: 900, mp: 0, atk: 100, def: 60, spi: 5, hit: 10, eva: 5, speed: 12, critRate: 10, critDamage: 160 }, exp: 950, dropsId: 'L019', skills: ['earthSlam'] },
    djinn: { id: 'djinn', name: '燈神', level: 25, stats: { hp: 800, mp: 350, atk: 80, def: 60, spi: 130, hit: 25, eva: 28, speed: 35, critRate: 10, critDamage: 150 }, exp: 1700, dropsId: 'L023', skills: ['elementalBlast', 'whirlwind'] },
    ironGolem: { id: 'ironGolem', name: '鋼鐵魔像', level: 30, stats: { hp: 1800, mp: 0, atk: 150, def: 120, spi: 0, hit: 18, eva: 2, speed: 10, critRate: 5, critDamage: 150 }, exp: 2500, dropsId: 'L013', skills: ['earthSlam'] },
    fallenAngel: { id: 'fallenAngel', name: '墮落天使', level: 38, stats: { hp: 3000, mp: 500, atk: 200, def: 100, spi: 160, hit: 35, eva: 30, speed: 40, critRate: 20, critDamage: 180 }, exp: 6000, dropsId: 'L024', skills: ['divineStrike', 'shadowBlast'], isBoss: true },
    titan: { id: 'titan', name: '泰坦', level: 45, stats: { hp: 8000, mp: 300, atk: 300, def: 200, spi: 100, hit: 40, eva: 15, speed: 25, critRate: 15, critDamage: 180 }, exp: 15000, dropsId: 'L024', skills: ['earthSlam', 'ogreClub'], isBoss: true },
};

const items = {
    // 消耗品
    healingEgg: { id: 'healingEgg', name: '補血蛋', type: 'consumable', effect: { type: 'heal_hp', value: 50 }, description: '恢復50點生命值。', value: 10, rarity: 'common'},
    healingPotion: { id: 'healingPotion', name: '中級治療藥水', type: 'consumable', effect: { type: 'heal_hp', value: 200 }, description: '恢復200點生命值。', value: 50, rarity: 'uncommon'},
    hiHealingPotion: { id: 'hiHealingPotion', name: '高級治療藥水', type: 'consumable', effect: { type: 'heal_hp', value: 800 }, description: '恢復800點生命值。', value: 250, rarity: 'rare'},

    manaTea: { id: 'manaTea', name: '魔力奶茶', type: 'consumable', effect: { type: 'heal_mp', value: 30 }, description: '恢復30點法力值。', value: 15, rarity: 'common' },
    manaPotion: { id: 'manaPotion', name: '中級法力藥水', type: 'consumable', effect: { type: 'heal_mp', value: 100 }, description: '恢復100點法力值。', value: 60, rarity: 'uncommon' },
    hiManaPotion: { id: 'hiManaPotion', name: '高級法力藥水', type: 'consumable', effect: { type: 'heal_mp', value: 400 }, description: '恢復400點法力值。', value: 300, rarity: 'rare'},

    stoneSkinPotion: { id: 'stoneSkinPotion', name: '石膚藥水', type: 'consumable', effect: { id: 'stoneSkin', name: '石膚', type: 'buff', stat: 'def', value: 10, turns: 3}, description: '3回合內提升防禦力(Def+10)。', value: 30, combatOnly: true, rarity: 'uncommon' },
    swiftnessPotion: { id: 'swiftnessPotion', name: '疾風藥劑', type: 'consumable', effect: { id: 'swiftness', name: '疾風', type: 'buff', stat: 'eva', value: 10, turns: 3}, description: '3回合內提升閃避(Eva+10)。', value: 30, combatOnly: true, rarity: 'uncommon' },
    giantsElixir: { id: 'giantsElixir', name: '巨力藥劑', type: 'consumable', effect: { id: 'giantsStrength', name: '巨力', type: 'buff', stat: 'atk', value: 10, turns: 3}, description: '3回合內提升攻擊力(Atk+10)。', value: 50, combatOnly: true, rarity: 'uncommon' },
    antidote: { id: 'antidote', name: '解毒劑', type: 'consumable', effect: { type: 'cure', ailment: 'poison'}, description: '解除中毒狀態。', value: 25, combatOnly: true, rarity: 'common' },
    smokeBomb: { id: 'smokeBomb', name: '煙霧彈', type: 'consumable', effect: { type: 'escape'}, description: '保證從非頭目戰中逃脫。', value: 40, combatOnly: true, rarity: 'uncommon'},

    ...WEAPONS,
    ...EQUIPMENT,
    
    skillBookWhirlwind: { id: 'skillBookWhirlwind', name: '技能書:旋風斬', type: 'skillbook', skillId: 'superWhirlwind', class: ['swordsman'], description: '記載著旋風斬的卷軸。', value: 1000, rarity: 'rare' },
    skillBookLifeBalance: { id: 'skillBookLifeBalance', name: '技能書:生死平衡', type: 'skillbook', skillId: 'superLifeBalance', class: ['monk'], description: '闡述生死平衡之道的經文。', value: 1200, rarity: 'rare' },
    skillBookFrenzy: { id: 'skillBookFrenzy', name: '技能書:狂暴', type: 'skillbook', skillId: 'superFrenzy', class: ['orc'], description: '能激發內心狂怒的圖騰。', value: 1100, rarity: 'rare' },
    skillBookLifeDrain: { id: 'skillBookLifeDrain', name: '技能書:生命汲取', type: 'skillbook', skillId: 'superLifeDrain', class: ['necromancer'], description: '記載著禁忌吸血魔法的書頁。', value: 1500, rarity: 'rare' },
    skillBookDemoralizingShout: { id: 'skillBookDemoralizingShout', name: '戰吼之書:挑撥', type: 'skillbook', skillId: 'demoralizingShout', class: ['orc'], description: '教你如何用言語激怒敵人。', value: 800, rarity: 'uncommon' },
    
    brokenFabric: { id: 'brokenFabric', name: '破損的布料', type: 'material', description: '從敵人身上剝下的破布。', value: 2, rarity: 'common' },
    spiderSilk: { id: 'spiderSilk', name: '蜘蛛絲', type: 'material', description: '堅韌的蜘蛛絲，可以用來製作東西。', value: 8, rarity: 'common' },
    boarPelt: { id: 'boarPelt', name: '野豬皮', type: 'material', description: '粗糙但耐用的野豬皮。', value: 10, rarity: 'common' },
    wolfFang: { id: 'wolfFang', name: '狼牙', type: 'material', description: '鋒利的狼牙，可以做成飾品或箭頭。', value: 12, rarity: 'common' },
    ectoplasm: { id: 'ectoplasm', name: '靈質', type: 'material', description: '靈體生物留下的殘餘物。', value: 20, rarity: 'uncommon' },
};

export const DATABASE = {
    classes: {
        swordsman: { name: "劍客", description: "戰場中的戰士，有優秀的防禦與物理攻擊能力。", stats: { hp: 90, mp: 35, atk: 16, def: 13, spi: 5, hit: 10, eva: 8, critRate: 5, critDamage: 150, speed: 10 }, story: "你是舊帝國破碎軍團的繼承者，背負著先祖失落的榮耀。", skills: { slash: 1 }, trait: "戰術運用：使用恢復藥水時效果翻倍。", icon: `<svg class="class-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.71,6.29,17.71,2.29a1,1,0,0,0-1.42,0L3.29,15.29a1,1,0,0,0,0,1.42l4,4a1,1,0,0,0,1.42,0L21.71,7.71A1,1,0,0,0,21.71,6.29ZM6.41,18.83l-1-1L15.59,7.71l1,1ZM8,14H4V11a1,1,0,0,0-2,0v4a1,1,0,0,0,1,1H7a1,1,0,0,0,0-2Zm12.17-9.17-1,1L9.41,5.17l1-1,8.76,8.76Z"/></svg>` },
        monk: { name: "修士", description: "天生的靈力者，能夠巧妙使用魔法來攻擊或附魔。", stats: { hp: 70, mp: 85, atk: 9, def: 9, spi: 19, hit: 12, eva: 10, critRate: 5, critDamage: 150, speed: 12 }, story: "你來自一個古老的修道院，尋求修復世界創傷、對抗混沌顯化的方法。", skills: { spiritualPalm: 1 }, trait: "超凡入聖：戰鬥失敗後在城鎮復活不會損失金錢。", icon: `<svg class="class-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11,4a8,8,0,0,0-8,8,8,8,0,0,0,8,8,7.91,7.91,0,0,0,3.34-.73l.25,1.5a1,1,0,0,0,1,.87,1,1,0,0,0,1-.87l-.25-1.5A7.91,7.91,0,0,0,20,12a8,8,0,0,0-8-8Zm0,14a6,6,0,0,1-6-6,6,6,0,0,1,6-6,6,6,0,0,1,6,6,6,6,0,0,1-6,6Zm-3-6a3,3,0,1,1,3,3A3,3,0,0,1,8,12Zm3,1a1,1,0,1,0-1-1A1,1,0,0,0,11,13Z"/></svg>` },
        orc: { name: "獸人", description: "超級人類，有超越人類的姿態，但對魔法抵抗力較低。", stats: { hp: 130, mp: 25, atk: 19, def: 16, spi: 3, hit: 8, eva: 5, critRate: 5, critDamage: 150, speed: 8 }, story: "你生於文明邊緣的洪荒部落，決求原始的力量對抗扭曲的現實。", skills: { savageCleave: 1 }, trait: "野蠻體質：無法使用法力藥水，但所有攻擊都附帶10%傷害值的法力吸收。", icon: `<svg class="class-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.89,14.28l-3.32,2.43a1,1,0,0,1-1.18,0L14,14.49V4.09a1,1,0,0,0-1-1,1,1,0,0,0-1,1v5.3L10.2,7.74a1,1,0,0,0-1.2,0L2,14.34V20a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V15.71A1,1,0,0,0,21.89,14.28ZM12.59,9.45,14,10.63v1.89l-1.41-1.04Zm-3,0,1.41,1.18v1.89L9.59,11.37ZM4,18.43v-3l4.79-3.52,1.21.9V18H4Zm7,0V13.7l.59.43.59-.43V18H11Zm7,0h-5V12.81l1.21-.9L19,15.43v3Z"/></svg>` },
        necromancer: { name: "死靈", description: "沒有實體，但對魔法有超高抵抗，能利用法術傷害敵人並汲取生命。", stats: { hp: 60, mp: 110, atk: 6, def: 6, spi: 26, hit: 11, eva: 15, critRate: 5, critDamage: 150, speed: 15 }, story: "世人誤解你為邪惡，但你只是個探求生命與死亡「迴響」的學者。", skills: { boneSpear: 1 }, trait: "亡靈之軀：無法使用生命藥水，但所有攻擊都附帶10%傷害值的生命竊取。", icon: `<svg class="class-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10,0,0,0,2,12a10,10,0,0,0,10,10,10,10,0,0,0,10-10A10,10,0,0,0,12,2Zm0,18a8,8,0,0,1-8-8,8,8,0,0,1,8-8,8,8,0,0,1,8,8,8,8,0,0,1-8,8Zm-2.5-5.5A1.5,1.5,0,1,0,8,13,1.5,1.5,0,0,0,9.5,14.5Zm5,0A1.5,1.5,0,1,0,16,13,1.5,1.5,0,0,0,14.5,14.5ZM12,6a1,1,0,0,0-1,1v3.13a2,2,0,0,0,4,0V7a1,1,0,0,0-1-1H12Z"/></svg>` }
    },
    monsters: monsters,
    items: items,
    dropTables: {
        L001: [ { itemId: 'brokenFabric', chance: 0.5, quantity: [1, 2] }, { itemId: 'healingEgg', chance: 0.3, quantity: [1, 1] }, { itemId: 'gold', chance: 1, quantity: [5, 10], isMoney: true }],
        L002: [ { itemId: 'brokenFabric', chance: 0.6, quantity: [1, 3] }, { itemId: 'smallSword', chance: 0.05, quantity: [1, 1], class: ['swordsman'] }, { itemId: 'gold', chance: 1, quantity: [12, 22], isMoney: true }],
        L003: [ { itemId: 'spiderSilk', chance: 0.7, quantity: [1, 2] }, { itemId: 'healingEgg', chance: 0.2, quantity: [1, 1] }, { itemId: 'antidote', chance: 0.1, quantity: [1, 1]}, { itemId: 'gold', chance: 1, quantity: [10, 18], isMoney: true }],
        L004: [ { itemId: 'boarPelt', chance: 0.6, quantity: [1,1] }, { itemId: 'leatherArmor', chance: 0.05, quantity: [1,1]}, { itemId: 'gold', chance: 1, quantity: [15, 25], isMoney: true }],
        L005: [ { itemId: 'wolfFang', chance: 0.5, quantity: [1,2]}, { itemId: 'courageBadge', chance: 0.05, quantity: [1,1]}, { itemId: 'gold', chance: 1, quantity: [18, 30], isMoney: true }],
        L006: [ { itemId: 'fineLongsword', chance: 0.1, quantity: [1, 1], class: ['swordsman']}, { itemId: 'leatherArmor', chance: 0.15, quantity: [1, 1]}, { itemId: 'gold', chance: 1, quantity: [20, 35], isMoney: true }],
        L007: [ { itemId: 'orcishAxe', chance: 0.15, quantity: [1, 1], class: ['orc']}, { itemId: 'chainmail', chance: 0.08, quantity: [1, 1]}, { itemId: 'giantsElixir', chance: 0.05, quantity: [1, 1]}, { itemId: 'gold', chance: 1, quantity: [25, 40], isMoney: true }],
        L008: [ { itemId: 'boneCrusher', chance: 0.08, quantity: [1, 1], class: ['orc']}, { itemId: 'acolyteBeads', chance: 0.08, quantity: [1, 1], class: ['monk']}, { itemId: 'gold', chance: 1, quantity: [30, 50], isMoney: true }],
        L009: [ { itemId: 'mageRobe', chance: 0.1, quantity: [1, 1]}, { itemId: 'specterWand', chance: 0.08, quantity: [1, 1], class: ['necromancer']}, { itemId: 'manaTea', chance: 0.3, quantity: [1, 2]}, { itemId: 'gold', chance: 1, quantity: [35, 60], isMoney: true}],
        L010: [ { itemId: 'brokenFabric', chance: 0.5, quantity: [1, 3] }, { itemId: 'boneWand', chance: 0.1, quantity: [1, 1], class: ['necromancer']}, { itemId: 'ectoplasm', chance: 0.2, quantity: [1,1]}, { itemId: 'gold', chance: 1, quantity: [40, 70], isMoney: true}],
        L011: [ { itemId: 'ectoplasm', chance: 0.5, quantity: [1, 2] }, { itemId: 'specterWand', chance: 0.1, quantity: [1, 1], class: ['necromancer']}, { itemId: 'mageRobe', chance: 0.1, quantity: [1, 1]}, { itemId: 'gold', chance: 1, quantity: [50, 80], isMoney: true}],
        L012: [ { itemId: 'wolfFang', chance: 0.6, quantity: [2, 4]}, { itemId: 'travelersBoots', chance: 0.1, quantity: [1,1]}, { itemId: 'gold', chance: 1, quantity: [60, 100], isMoney: true}],
        L013: [], L014: [], L015: [], L016: [], L017: [], L018: [], L019: [], L020: [], L021: [], L022: [], L023: [], L024: [],
    },
    skills: skills,
    locations: {
        oakwood: { name: "橡木鎮", description: "一個被森林環繞的寧靜小鎮，但最近似乎不太平靜。" },
        whisperingWoods: { name: "低語森林", description: "新手冒險者的試煉場，充滿了哥布林與野生動物。", monsters: ['slime', 'goblin', 'forestSpider', 'giantBat', 'kobold'], levelRange: [1, 4], requiredLevel: 1, storyReq: 'main01' },
        boarPlains: { name: "野豬平原", description: "開闊的平原，是野豬和狼群的家園。", monsters: ['wildBoar', 'wolf', 'bandit'], levelRange: [3, 6], requiredLevel: 3, storyReq: 'main03' },
        goblinCamp: { name: "哥布林營地", description: "哥布林們聚集的營地，由更強大的戰士守衛著。", monsters: ['goblinWarrior', 'hobgoblin', 'goblinLeader'], levelRange: [5, 8], requiredLevel: 5, storyReq: 'main03' },
        orcOutpost: { name: "獸人前哨", description: "獸人部落的前線哨站，瀰漫著戰爭的氣息。", monsters: ['orcGrunt', 'orcShaman', 'ogre'], levelRange: [7, 14], requiredLevel: 8, storyReq: 'main04' },
        hauntedCemetery: { name: '荒廢墓園', description: "不安的靈魂在此徘徊，生者勿近的詛咒之地。", monsters: ['skeleton', 'zombie', 'wraith', 'ghoul', 'spirit'], levelRange: [8, 12], requiredLevel: 10, storyReq: 'main05' },
    },
    npcs: {
        elder: { name: "村長", type: "quest" },
        blacksmith: { name: "鐵匠", type: "quest" }
    },
    quests: {
        main01: { id: 'main01', title: "森林裡的麻煩", npc: "elder", objective: { type: 'kill', target: 'goblin', current: 0, total: 5 }, reward: { exp: 150, items: [{ itemId: 'healingEgg', quantity: 5 }], gold: 50, skillPoints: 1 }, levelReq: 1, onComplete: (p) => { p.storyProgress = 'main02'; } },
        main02: { id: 'main02', title: "第一次裝備", npc: "blacksmith", objective: { type: 'equip', target: 'any', current: 0, total: 1 }, reward: { exp: 50, items: [{ itemId: 'courageBadge', quantity: 1 }], gold: 20 }, levelReq: 1, onComplete: (p) => { p.storyProgress = 'main03'; } },
        main03: { id: 'main03', title: "等級的考驗", npc: "elder", objective: { type: 'level', target: 'any', current: 0, total: 5 }, reward: { exp: 200, items: [{ itemId: 'giantsElixir', quantity: 3 }], gold: 100 }, levelReq: 3, onComplete: (p) => { p.storyProgress = 'main04'; } },
        main04: { id: 'main04', title: "深入獸人領地", npc: "elder", objective: { type: 'kill', target: 'orcGrunt', current: 0, total: 8 }, 
            reward: { exp: 500, items: [{ classSpecific: true, swordsman: 'fineLongsword', monk: 'acolyteBeads', orc: 'boneCrusher', necromancer: 'specterWand' }], gold: 250 }, 
            levelReq: 8, onComplete: (p) => { p.storyProgress = 'main05'; } 
        },
        main05: { id: 'main05', title: "亡靈的呢喃", npc: "elder", objective: { type: 'kill', target: 'wraith', current: 0, total: 3 }, 
            reward: { exp: 800, items: [{ classSpecific: true, swordsman: 'chainmail', monk: 'mageRobe', orc: 'chainmail', necromancer: 'mageRobe' }], gold: 500 }, 
            levelReq: 10, onComplete: (p) => { p.storyProgress = 'main06'; } 
        },
        main06: { id: 'main06', title: "最終的挑戰", npc: "elder", objective: { type: 'level', target: 'any', current: 0, total: 15 }, reward: { exp: 1500, gold: 1000, skillPoints: 3 }, levelReq: 13, onComplete: (p) => {} },
    },
    storyline: {
        main01: { title: '第一章：低語的先兆', description: '調查橡木鎮水源污染的源頭。' },
        main02: { title: '第二章：磨練自我', description: '學會利用裝備來強化自己。' },
        main03: { title: '第三章：實力證明', description: '透過實戰來證明自己的實力。' },
        main04: { title: '第四章：部落的威脅', description: '擊退入侵的獸人步兵。' },
        main05: { title: '第五章：安撫亡魂', description: '淨化墓園中的怨靈。' },
        main06: { title: '第六章：迎接挑戰', description: '為更艱鉅的挑戰做好準備。' },
    },
    shop: {
        inventory: {
            main01: ['healingEgg', 'manaTea', 'antidote', 'smallSword', 'monksGloves', 'orcishAxe', 'boneWand', 'leatherArmor', 'courageBadge', 'travelersBoots'],
            main03: ['healingPotion', 'manaPotion', 'smokeBomb', 'fineLongsword', 'acolyteBeads', 'boneCrusher', 'specterWand', 'chainmail', 'mageRobe'],
            main05: ['hiHealingPotion', 'hiManaPotion','stoneSkinPotion', 'swiftnessPotion', 'giantsElixir', 'knightSword', 'ironFist', 'spikedClub', 'ritualDagger', 'plateArmor']
        }
    }
};

DATABASE.codex = {
    monsters: Object.keys(DATABASE.monsters),
    items: Object.values(DATABASE.items).filter(i => ['consumable', 'material', 'skillbook'].includes(i.type)).map(i => i.id),
    weapons: Object.values(DATABASE.items).filter(i => i.type === 'weapon').map(i => i.id),
    armors: Object.values(DATABASE.items).filter(i => ['armor', 'accessory', 'boots'].includes(i.type)).map(i => i.id),
};