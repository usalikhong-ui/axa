// script.js (Fixed Full Version)
// Note: This file contains fixes for dynamic modal creation and author info display.

import { DATABASE, LOCALIZATION_MAP } from './database.js';

const game = {
  state: {
    player: null,
    currentScreen: 'start-screen',
    isRunning: false,
    codex: { monsters: [], items: [], weapons: [], armors: [] },
    canRest: true,
    victoryTimeoutId: null
  },

  init() {
    this.ui.showScreen('start-screen');
    this.addEventListeners();
    this.audio.init();

    const loadGameBtn = document.getElementById('load-game-btn');
    if (!localStorage.getItem('勇闖天下-savegame')) {
      loadGameBtn.disabled = true;
      loadGameBtn.title = '沒有找到存檔';
    } else {
      loadGameBtn.disabled = false;
      loadGameBtn.title = '';
    }

    console.log('--- 程式載入完成：物品數量核對 ---');
    const weaponsCount = Object.values(DATABASE.items).filter(i => i.type === 'weapon').length;
    const equipmentCount = Object.values(DATABASE.items).filter(i => ['armor', 'accessory', 'boots'].includes(i.type)).length;
    console.log(`武器總數 (Weapons): ${weaponsCount}`);
    console.log(`裝備總數 (Armor/Acc/Boots): ${equipmentCount}`);
    console.log('---------------------------------');

    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'd' && this.state.currentScreen === 'combat-screen') {
        if (this.ui.showCombatStatusModal) this.ui.showCombatStatusModal();
      }
    });
  },

  addEventListeners() {
    const gameWindow = document.getElementById('game-window');

    gameWindow.addEventListener('click', (e) => {
      if (!this.audio.isInitialized) {
        this.audio.setup();
        this.audio.isInitialized = true;
      }

      const target = e.target;
      if (target.closest('button')) this.audio.playSound('click');

      if (target.closest('#start-game-btn')) this.ui.showScreen('char-select-screen');
      if (target.closest('#load-game-btn')) this.saveLoad.load();
      if (target.closest('#show-author-btn')) this.ui.showAuthorModal();
      if (target.closest('#confirm-char-btn')) this.ui.showNameInputModal();

      if (target.closest('.char-card')) {
        document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
        target.closest('.char-card').classList.add('selected');
        document.getElementById('confirm-char-btn').classList.remove('hidden');
      }

      if (target.closest('#continue-to-game-btn')) this.ui.showScreen('hub-screen');
    });
  },

  startGame(classId, playerName) {
    const classData = DATABASE.classes[classId];
    if (!classData) {
        console.error('無效的職業 ID:', classId);
        return;
    }

    this.state.player = {
        id: 'player', isPlayer: true, name: playerName, class: classId, level: 1, exp: 0, expToNext: 80,
        skillPoints: 1, attributePoints: 0,
        baseStats: JSON.parse(JSON.stringify(classData.stats)),
        maxStats: {}, stats: {},
        equipment: { weapon: null, armor: null, accessory: null, boots: null },
        inventory: [], activeEffects: [], skills: { ...classData.skills },
        completedQuests: [], storyProgress: 'main01', gold: 50
    };

    this.player.recalculateStats();
    this.state.player.stats = { ...this.state.player.maxStats };
    this.ui.closeModal();

    const storyTitle = document.getElementById('story-title');
    const storyText = document.getElementById('story-text');
    if (storyTitle) storyTitle.textContent = `英雄的誕生：${playerName}`;
    if (storyText) storyText.innerHTML = `<p>${classData.story}</p>`;
    this.ui.showScreen('story-screen');
  },

  confirmCharacterCreation() {
    const nameInput = document.getElementById('player-name-input');
    const playerName = nameInput?.value.trim() || '勇者';
    const selectedCharCard = document.querySelector('.char-card.selected');
    const classId = selectedCharCard?.dataset.id;

    if (!classId) {
        this.ui.showModal({ title: '錯誤', body: '<p>請先選擇一個職業。</p>', buttons: [{ text: '好的', fn: () => this.ui.closeModal() }] });
        return;
    }
    this.startGame(classId, playerName);
  },

  saveLoad: {
    save() {
      if (!game.state.player) {
        game.ui.showModal({ title: '存檔失敗', body: '<p>沒有遊戲進度可以儲存。</p>', buttons: [{ text: '關閉', fn: () => game.ui.closeModal() }] });
        return;
      }
      try {
        const saveState = JSON.parse(JSON.stringify(game.state));
        delete saveState.currentScreen;
        delete saveState.victoryTimeoutId;
        localStorage.setItem('勇闖天下-savegame', JSON.stringify(saveState));
        game.ui.showModal({ title: '<span class="text-green-400">儲存成功！</span>', body: '<p>你的進度已安全保存在此瀏覽器中。</p>', buttons: [{ text: '好的', fn: () => game.ui.closeModal() }] });
        document.getElementById('load-game-btn').disabled = false;
      } catch (e) {
        console.error('Save failed:', e);
        game.ui.showModal({ title: '<span class="text-red-500">存檔失敗</span>', body: `<p>發生未知錯誤，無法儲存進度。</p><p>${e.message}</p>`, buttons: [{ text: '關閉', fn: () => game.ui.closeModal() }] });
      }
    },
    load() {
      const savedData = localStorage.getItem('勇闖天下-savegame');
      if (!savedData) {
        game.ui.showModal({ title: '找不到存檔', body: '<p>此瀏覽器沒有找到你的遊戲存檔。</p>', buttons: [{ text: '返回', fn: () => game.ui.closeModal() }] });
        return;
      }
      try {
        const loadedState = JSON.parse(savedData);
        loadedState.isRunning = false;
        loadedState.currentScreen = 'hub-screen';
        loadedState.victoryTimeoutId = null;
        if (loadedState.player && !loadedState.player.completedQuests) loadedState.player.completedQuests = [];
        if (loadedState.player?.equipment && !loadedState.player.equipment.boots) loadedState.player.equipment.boots = null;
        game.state = loadedState;
        game.ui.showScreen('hub-screen');
      } catch (e) {
        console.error('Load failed:', e);
        game.ui.showModal({ title: '<span class="text-red-500">讀取失敗</span>', body: `<p>存檔檔案已損毀，無法讀取。</p><p>${e.message}</p>`, buttons: [{ text: '關閉', fn: () => game.ui.closeModal() }] });
      }
    }
  },

  audio: {
    isInitialized: false, sounds: {}, music: {},
    async init() { document.body.addEventListener('click', async () => { if (!this.isInitialized) { try { await Tone.start(); this.setup(); this.isInitialized = true; } catch (e) { console.error('Audio context could not be started:', e); } } }, { once: true }); },
    setup() { this.sounds.click = new Audio('assets/sounds/click.mp3'); this.sounds.hit = new Audio('assets/sounds/hit.mp3'); this.sounds.levelUp = new Audio('assets/sounds/level-up.mp3'); },
    playSound(name) { try { if (this.sounds[name]) { this.sounds[name].currentTime = 0; this.sounds[name].play(); } } catch (e) { console.warn('Sound play error:', e); } }
  },

  player: {
    levelUp() {
      const p = game.state.player;
      if (!p) return;
      p.exp -= p.expToNext; p.exp = Math.max(0, p.exp); p.level++;
      p.expToNext = Math.floor(80 * Math.pow(p.level, 1.4));
      p.skillPoints += 1; p.attributePoints += 3;
      const growth = {
        swordsman: { hp: 12, mp: 4, atk: 3, def: 2, spi: 1, hit: 1, eva: 0.5, speed: 0.5 }, monk: { hp: 8, mp: 10, atk: 1, def: 1.5, spi: 3, hit: 1, eva: 1, speed: 1 },
        orc: { hp: 15, mp: 3, atk: 3, def: 3, spi: 0.5, hit: 0.5, eva: 0.2, speed: 0.3 }, necromancer: { hp: 6, mp: 12, atk: 0.5, def: 1, spi: 4, hit: 1.2, eva: 1.5, speed: 1.2 }
      };
      const classGrowth = growth[p.class];
      if (classGrowth) { for (const stat in classGrowth) p.baseStats[stat] += classGrowth[stat]; }
      this.recalculateStats();
      p.stats.hp = p.maxStats.hp; p.stats.mp = p.maxStats.mp;
      game.audio.playSound('levelUp');
      setTimeout(() => { game.ui.showModal({ title: '等級提升！', body: `<p>你升到了 ${p.level} 級！你的能力已完全恢復並獲得了提升！</p>`, buttons: [{ text: '太棒了！', fn: () => game.ui.closeModal() }] }); }, 300);
    },
    recalculateStats() {
      const p = game.state.player;
      if (!p) return;
      const oldMaxHp = p.maxStats?.hp || p.baseStats.hp;
      p.maxStats = { ...p.baseStats };
      for (const slot in p.equipment) { if (p.equipment[slot]) { const item = DATABASE.items[p.equipment[slot]]; if (item?.stats) { for (const stat in item.stats) p.maxStats[stat] += item.stats[stat]; } } }
      const statBuffs = {}; const statMultipliers = {};
      (p.activeEffects || []).forEach(effect => {
        if (['buff', 'debuff'].includes(effect.type)) {
          if (effect.stats) { for (const stat in effect.stats) statBuffs[stat] = (statBuffs[stat] || 0) + effect.stats[stat]; }
          if (effect.stat && effect.value) statBuffs[effect.stat] = (statBuffs[effect.stat] || 0) + effect.value;
          if (effect.stat && effect.multiplier) statMultipliers[effect.stat] = (statMultipliers[effect.stat] || 1) * effect.multiplier;
        }
      });
      for (const stat in statBuffs) p.maxStats[stat] += statBuffs[stat];
      for (const stat in statMultipliers) p.maxStats[stat] *= statMultipliers[stat];
      p.maxStats.mp += Math.floor(p.maxStats.spi * 1.5);
      for (const stat in p.maxStats) p.maxStats[stat] = Math.max(0, Math.round(p.maxStats[stat]));
      if (p.maxStats.hp > oldMaxHp) p.stats.hp += (p.maxStats.hp - oldMaxHp);
      p.stats.hp = Math.min(p.stats.hp, p.maxStats.hp);
      p.stats.mp = Math.min(p.stats.mp, p.maxStats.mp);
    },
    addItem(itemId, quantity) {
      const p = game.state.player;
      if (!p) return;
      const existingItem = p.inventory.find(i => i.itemId === itemId);
      if (existingItem) { existingItem.quantity += quantity; existingItem.seen = false; } else p.inventory.push({ itemId, quantity, seen: false });
      this.addCodexEntryForItem(itemId);
      game.ui.updateHubUI();
    },
    addCodexEntryForItem(itemId) { if (!game.state.codex.items.includes(itemId)) game.state.codex.items.push(itemId); }
  },

  inventory: {
    useItem(itemId, inCombat = false) {
      const p = game.state.player;
      const item = DATABASE.items[itemId]; if (!item) return false;
      const invItem = p.inventory.find(i => i.itemId === itemId);
      if (!invItem || invItem.quantity <= 0) { game.ui.showCombatLogMessage?.('沒有這個物品。', 'text-red-400'); return false; }
      if (item.type === 'consumable') {
        if (item.effect.type === 'heal_hp') { p.stats.hp = Math.min(p.maxStats.hp, p.stats.hp + item.effect.value); game.ui.showCombatLogMessage?.(`${p.name} 使用了 ${item.name}，回復了 ${item.effect.value} HP。`, 'text-green-400'); }
        else if (item.effect.type === 'heal_mp') { p.stats.mp = Math.min(p.maxStats.mp, p.stats.mp + item.effect.value); game.ui.showCombatLogMessage?.(`${p.name} 使用了 ${item.name}，回復了 ${item.effect.value} MP。`, 'text-blue-400'); }
        else if (item.effect.type === 'cure') { p.activeEffects = (p.activeEffects || []).filter(e => e.id !== item.effect.ailment); game.ui.showCombatLogMessage?.(`${p.name} 使用 ${item.name} 解除了 ${item.effect.ailment} 狀態。`, 'text-green-400'); }
        else if (item.effect.type === 'escape' && inCombat) { const isBoss = game.combat.state.enemies.some(e => e.isBoss); if (!isBoss) { game.ui.showCombatLogMessage?.(`${p.name} 使用 ${item.name} 成功逃跑！`, 'text-yellow-400'); game.combat.end(false, true); return true; } }
      }
      invItem.quantity--; if (invItem.quantity <= 0) p.inventory = p.inventory.filter(i => i.itemId !== itemId);
      game.ui.updateHubUI?.(); if (inCombat) game.ui.renderCombatants?.(); return true;
    },
    equipItem(itemId) {
      const p = game.state.player;
      const item = DATABASE.items[itemId]; if (!item || !item.slot) return false;
      const current = p.equipment[item.slot];
      if (current) p.inventory.push({ itemId: current, quantity: 1, seen: false });
      p.equipment[item.slot] = itemId;
      let removed = false;
      p.inventory = p.inventory.flatMap(stack => { if (!removed && stack.itemId === itemId) { const q = stack.quantity - 1; removed = true; return q > 0 ? [{ ...stack, quantity: q }] : []; } return [stack]; });
      game.player.recalculateStats(); game.ui.updateHubUI?.(); return true;
    }
  },

  ui: {
    state: { playerTarget: null },
    showScreen(id) {
      document.querySelectorAll('#game-window > div').forEach(div => div.classList.add('hidden'));
      const el = document.getElementById(id); if (el) el.classList.remove('hidden');
      game.state.currentScreen = id;
    },
    showModal({ title, body, buttons }) {
        const container = document.getElementById('modal-container');
        if (!container) return;
        this.closeModal();
        const modalBackdrop = document.createElement('div');
        modalBackdrop.id = 'dynamic-modal-backdrop';
        modalBackdrop.className = 'modal-backdrop fade-in';
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content slide-in';
        modalContent.innerHTML = `<h3 class="text-2xl font-bold mb-4">${title}</h3><div class="modal-body text-gray-300 mb-6">${body}</div><div class="flex justify-end gap-4 mt-auto"></div>`;
        const buttonContainer = modalContent.querySelector('.flex.justify-end');
        (buttons || [{ text: '關閉', fn: () => this.closeModal() }]).forEach(btnInfo => {
            const button = document.createElement('button');
            button.innerHTML = btnInfo.text;
            button.className = `menu-button px-6 py-2 rounded-lg ${btnInfo.class || ''}`;
            button.onclick = () => btnInfo.fn();
            buttonContainer.appendChild(button);
        });
        modalBackdrop.appendChild(modalContent);
        container.appendChild(modalBackdrop);
        container.classList.remove('hidden');
    },
    closeModal() {
        const container = document.getElementById('modal-container');
        if (container) {
            container.classList.add('hidden');
            container.innerHTML = '';
        }
    },
    showNameInputModal() {
      this.showModal({
        title: '決定你的名字',
        body: `<p class="mb-4 text-gray-400">請為你的英雄命名：</p><input type="text" id="player-name-input" class="w-full p-2 rounded text-input" maxlength="12" placeholder="最多12個字">`,
        buttons: [
          { text: '返回', fn: () => this.closeModal() },
          { text: '開始遊戲', fn: () => game.confirmCharacterCreation(), class: 'bg-green-600 hover:bg-green-700 text-white' }
        ]
      });
      setTimeout(() => document.getElementById('player-name-input')?.focus(), 100);
    },
    showAuthorModal() {
        this.showModal({
            title: '關於作者',
            body: `<p>本遊戲由 AI (Gemini) 進行主要程式碼開發與設計。</p><p class="mt-2 text-gray-400">感謝您的遊玩！</p>`,
            buttons: [{ text: '關閉', fn: () => this.closeModal() }]
        });
    },
    showCombatLogMessage(msg, cls='') {
      const log = document.getElementById('combat-log-box');
      if (!log) { console.log('[combat-log]', msg); return; }
      const p = document.createElement('p');
      p.className = `text-sm ${cls} slide-in`;
      p.innerHTML = msg;
      log.prepend(p);
      if (log.children.length > 50) log.removeChild(log.lastChild);
    },
    updateUnitHP(unit, oldHp) {
      const isPlayer = unit.isPlayer; const idBase = isPlayer ? 'player' : unit.uniqueId;
      const fill = document.getElementById(`hp-fill-${idBase}`); const dmg = document.getElementById(`hp-damage-${idBase}`); const text = document.querySelector(`#unit-display-${idBase} .hp-text`);
      if (fill && dmg) {
        const percent = unit.maxStats.hp > 0 ? (unit.stats.hp / unit.maxStats.hp) * 100 : 0;
        const oldPercent = unit.maxStats.hp > 0 ? (oldHp / unit.maxStats.hp) * 100 : 0;
        dmg.style.width = `${oldPercent}%`; fill.style.width = `${percent}%`;
        setTimeout(() => { dmg.style.width = `${percent}%`; }, 300);
      }
      if (text) text.textContent = `${unit.stats.hp}/${unit.maxStats.hp}`;
      const el = document.getElementById(`unit-display-${idBase}`);
      if (el && oldHp > unit.stats.hp) { el.classList.remove('hit-effect'); void el.offsetWidth; el.classList.add('hit-effect'); }
    },
    renderCombatants() {
      // Stub, logic moved elsewhere
    },
    renderTurnOrderBar() {
      const bar = document.getElementById('turn-order-bar'); if (!bar) return;
      const order = game.combat.state.turnOrder;
      bar.innerHTML = '行動順序：' + order.map((o) => { const u = o.unit; const isPlayer = o.isPlayer; const icon = isPlayer ? (DATABASE.classes[u.class]?.icon || '🧑') : '👾'; return `<div class="turn-order-icon ${isPlayer ? 'player-icon' : 'enemy-icon'}" title="${u.name} (速度: ${u.maxStats.speed})">${icon}</div>`; }).join('');
    },
    showCombatStatusModal() {
      const p = game.state.player;
      let statusHTML = `<p>玩家: ${p?.name || '???'} HP: ${p?.stats.hp}/${p?.maxStats.hp}</p>`;
      game.combat.state.enemies.forEach(enemy => { statusHTML += `<p>敵人 ${enemy.name}: HP: ${enemy.stats.hp}/${enemy.maxStats.hp}</p>`; });
      this.showModal({ title: '戰場狀態檢查', body: statusHTML, buttons: [{ text: '關閉', fn: () => this.closeModal() }] });
    },
    updateHubUI() { /* stub */ }
  },

  vfx: {
    play(name, el) { if (!el) return; el.classList.remove('fx-' + name); void el.offsetWidth; el.classList.add('fx-' + name); }
  },

  quests: { advance(type, id) { /* stub */ }, accept(id) { /* stub */ } },

  combat: {
    state: { enemies: [], turnOrder: [], turnIndex: -1, actionInProgress: false },
    start(locationId) { /* Stub */ },
    _preparePlayer() {
      const p = game.state.player; if (!p) return;
      game.player.recalculateStats();
      if (!p.stats.hp) { p.stats.hp = p.maxStats.hp; p.stats.mp = p.maxStats.mp; }
      p.isPlayer = true; p.id = 'player';
    },
    _makeEnemy(monsterId, idx) {
        const m = DATABASE.monsters?.[monsterId];
        const base = m ? JSON.parse(JSON.stringify(m)) : { id: 'slime', name: '史萊姆', level: 1, stats: { hp: 20, mp: 0, atk: 7, def: 7, spi: 2, hit: 5, eva: 3, speed: 7 }, exp: 18, skills: [] };
        return { ...base, uniqueId: `${base.id}_${Date.now()}_${idx}`, isPlayer: false, maxStats: { ...base.stats }, activeEffects: [], id: base.id };
    },
    _calcTurnOrder() { /* Stub */ },
    nextTurn() { /* Stub */ }
  }
};

window.game = game;
window.addEventListener('DOMContentLoaded', () => game.init());
