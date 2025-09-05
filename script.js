// script.js (Fixed Full Version)
// Note: This file consolidates and hardens combat flow to prevent soft-locks
// and ensures nextTurn() is always reached, with safe target checks.

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

    // 偵錯：按 D 顯示戰鬥狀態
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
      if (target.closest('#show-author-btn')) this.ui.showAuthorModal?.();
      if (target.closest('#confirm-char-btn')) this.ui.showNameInputModal(); // Removed optional chaining

      if (target.closest('.char-card')) {
        document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
        target.closest('.char-card').classList.add('selected');
        document.getElementById('confirm-char-btn').classList.remove('hidden');
      }

      if (target.closest('#continue-to-game-btn')) this.ui.showScreen('hub-screen');
    });
  },

  // ---------------------- Game Start Logic ----------------------
  startGame(classId, playerName) {
    const classData = DATABASE.classes[classId];
    if (!classData) {
        console.error('無效的職業 ID:', classId);
        return;
    }

    this.state.player = {
        id: 'player',
        isPlayer: true,
        name: playerName,
        class: classId,
        level: 1,
        exp: 0,
        expToNext: 80, // Initial value
        skillPoints: 1,
        attributePoints: 0,
        baseStats: JSON.parse(JSON.stringify(classData.stats)),
        maxStats: {}, // recalculateStats will populate this
        stats: {}, // recalculateStats will populate this
        equipment: { weapon: null, armor: null, accessory: null, boots: null },
        inventory: [],
        activeEffects: [],
        skills: { ...classData.skills },
        completedQuests: [],
        storyProgress: 'main01',
        gold: 50
    };

    this.player.recalculateStats();
    // Set current stats to max stats
    this.state.player.stats = { ...this.state.player.maxStats };

    this.ui.closeModal();

    // Populate and show the story screen
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
        this.ui.showModal({
            title: '錯誤',
            body: '<p>請先選擇一個職業。</p>',
            buttons: [{ text: '好的', fn: () => this.ui.closeModal() }]
        });
        return;
    }

    this.startGame(classId, playerName);
  },

  // ---------------------- Save/Load ----------------------
  saveLoad: {
    save() {
      if (!game.state.player) {
        game.ui.showModal({
          title: '存檔失敗',
          body: '<p>沒有遊戲進度可以儲存。</p>',
          buttons: [{ text: '關閉', fn: () => game.ui.closeModal() }]
        });
        return;
      }
      try {
        const saveState = JSON.parse(JSON.stringify(game.state));
        delete saveState.currentScreen;
        delete saveState.victoryTimeoutId;
        localStorage.setItem('勇闖天下-savegame', JSON.stringify(saveState));
        game.ui.showModal({
          title: '<span class="text-green-400">儲存成功！</span>',
          body: '<p>你的進度已安全保存在此瀏覽器中。</p>',
          buttons: [{ text: '好的', fn: () => game.ui.closeModal() }]
        });
        document.getElementById('load-game-btn').disabled = false;
      } catch (e) {
        console.error('Save failed:', e);
        game.ui.showModal({
          title: '<span class="text-red-500">存檔失敗</span>',
          body: `<p>發生未知錯誤，無法儲存進度。</p><p>${e.message}</p>`,
          buttons: [{ text: '關閉', fn: () => game.ui.closeModal() }]
        });
      }
    },
    showLoadConfirmationModal() {
      game.ui.showModal({
        title: '確定讀取？',
        body: '<p class="text-gray-400">確定要讀取本機存檔嗎？目前的遊戲進度將會被覆蓋。</p>',
        buttons: [
          { text: '取消', fn: () => game.ui.closeModal() },
          { text: '確定', fn: () => { game.ui.closeModal(); game.saveLoad.load(); }, class: 'bg-red-600 hover:bg-red-700 text-white' }
        ]
      });
    },
    load() {
      const savedData = localStorage.getItem('勇闖天下-savegame');
      if (!savedData) {
        game.ui.showModal({
          title: '找不到存檔',
          body: '<p>此瀏覽器沒有找到你的遊戲存檔。</p>',
          buttons: [{ text: '返回', fn: () => game.ui.closeModal() }]
        });
        return;
      }
      try {
        const loadedState = JSON.parse(savedData);
        loadedState.isRunning = false;
        loadedState.currentScreen = 'hub-screen';
        loadedState.victoryTimeoutId = null;
        if (loadedState.player && !loadedState.player.completedQuests) loadedState.player.completedQuests = [];
        if (loadedState.player?.equipment && !loadedState.player.equipment.boots) {
          loadedState.player.equipment.boots = null;
        }
        game.state = loadedState;
        game.ui.showScreen('hub-screen');
      } catch (e) {
        console.error('Load failed:', e);
        game.ui.showModal({
          title: '<span class="text-red-500">讀取失敗</span>',
          body: `<p>存檔檔案已損毀，無法讀取。</p><p>${e.message}</p>`,
          buttons: [{ text: '關閉', fn: () => game.ui.closeModal() }]
        });
      }
    }
  },

  // ---------------------- Audio ----------------------
  audio: {
    isInitialized: false,
    sounds: {},
    music: {},
    async init() {
      document.body.addEventListener('click', async () => {
        if (!this.isInitialized) {
          try {
            await Tone.start();
            this.setup();
            this.isInitialized = true;
          } catch (e) {
            console.error('Audio context could not be started:', e);
          }
        }
      }, { once: true });
    },
    setup() {
      this.sounds.click = new Audio('assets/sounds/click.mp3');
      this.sounds.hit = new Audio('assets/sounds/hit.mp3');
      this.sounds.levelUp = new Audio('assets/sounds/level-up.mp3');
    },
    playSound(name) {
      try {
        if (this.sounds[name]) {
          this.sounds[name].currentTime = 0;
          this.sounds[name].play();
        }
      } catch (e) {
        console.warn('Sound play error:', e);
      }
    }
  },

  // ---------------------- Player ----------------------
  player: {
    levelUp() {
      const p = game.state.player;
      if (!p) return;
      p.exp -= p.expToNext;
      p.exp = Math.max(0, p.exp);
      p.level++;
      p.expToNext = Math.floor(80 * Math.pow(p.level, 1.4));
      p.skillPoints += 1;
      p.attributePoints += 3;
      const growth = {
        swordsman: { hp: 12, mp: 4, atk: 3, def: 2, spi: 1, hit: 1, eva: 0.5, speed: 0.5 },
        monk: { hp: 8, mp: 10, atk: 1, def: 1.5, spi: 3, hit: 1, eva: 1, speed: 1 },
        orc: { hp: 15, mp: 3, atk: 3, def: 3, spi: 0.5, hit: 0.5, eva: 0.2, speed: 0.3 },
        necromancer: { hp: 6, mp: 12, atk: 0.5, def: 1, spi: 4, hit: 1.2, eva: 1.5, speed: 1.2 }
      };
      const classGrowth = growth[p.class];
      if (classGrowth) {
        for (const stat in classGrowth) p.baseStats[stat] += classGrowth[stat];
      }
      this.recalculateStats();
      p.stats.hp = p.maxStats.hp;
      p.stats.mp = p.maxStats.mp;
      game.audio.playSound('levelUp');
      setTimeout(() => {
        game.ui.showModal({
          title: '等級提升！',
          body: `<p>你升到了 ${p.level} 級！你的能力已完全恢復並獲得了提升！</p>`,
          buttons: [{ text: '太棒了！', fn: () => game.ui.closeModal() }]
        });
      }, 300);
    },
    recalculateStats() {
      const p = game.state.player;
      if (!p) return;
      const oldMaxHp = p.maxStats?.hp || p.baseStats.hp;
      p.maxStats = { ...p.baseStats };
      for (const slot in p.equipment) {
        if (p.equipment[slot]) {
          const item = DATABASE.items[p.equipment[slot]];
          if (item?.stats) {
            for (const stat in item.stats) p.maxStats[stat] += item.stats[stat];
          }
        }
      }
      const statBuffs = {};
      const statMultipliers = {};
      (p.activeEffects || []).forEach(effect => {
        if (['buff', 'debuff'].includes(effect.type)) {
          if (effect.stats) {
            for (const stat in effect.stats) statBuffs[stat] = (statBuffs[stat] || 0) + effect.stats[stat];
          }
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
      if (existingItem) { existingItem.quantity += quantity; existingItem.seen = false; }
      else p.inventory.push({ itemId, quantity, seen: false });
      this.addCodexEntryForItem(itemId);
      game.ui.updateHubUI();
    },
    addCodexEntryForItem(itemId) {
      if (!game.state.codex.items.includes(itemId)) game.state.codex.items.push(itemId);
    }
  },

  // ---------------------- Inventory helpers ----------------------
  inventory: {
    useItem(itemId, inCombat = false) {
      const p = game.state.player;
      const item = DATABASE.items[itemId];
      if (!item) return false;
      const invItem = p.inventory.find(i => i.itemId === itemId);
      if (!invItem || invItem.quantity <= 0) {
        game.ui.showCombatLogMessage?.('沒有這個物品。', 'text-red-400');
        return false;
      }
      if (item.type === 'consumable') {
        if (item.effect.type === 'heal_hp') {
          p.stats.hp = Math.min(p.maxStats.hp, p.stats.hp + item.effect.value);
          game.ui.showCombatLogMessage?.(`${p.name} 使用了 ${item.name}，回復了 ${item.effect.value} HP。`, 'text-green-400');
        } else if (item.effect.type === 'heal_mp') {
          p.stats.mp = Math.min(p.maxStats.mp, p.stats.mp + item.effect.value);
          game.ui.showCombatLogMessage?.(`${p.name} 使用了 ${item.name}，回復了 ${item.effect.value} MP。`, 'text-blue-400');
        } else if (item.effect.type === 'cure') {
          p.activeEffects = (p.activeEffects || []).filter(e => e.id !== item.effect.ailment);
          game.ui.showCombatLogMessage?.(`${p.name} 使用 ${item.name} 解除了 ${item.effect.ailment} 狀態。`, 'text-green-400');
        } else if (item.effect.type === 'escape' && inCombat) {
          const isBoss = game.combat.state.enemies.some(e => e.isBoss);
          if (!isBoss) {
            game.ui.showCombatLogMessage?.(`${p.name} 使用 ${item.name} 成功逃跑！`, 'text-yellow-400');
            game.combat.end(false, true);
            return true;
          }
        }
      }
      invItem.quantity--;
      if (invItem.quantity <= 0) p.inventory = p.inventory.filter(i => i.itemId !== itemId);
      game.ui.updateHubUI?.();
      if (inCombat) game.ui.renderCombatants?.();
      return true;
    },
    equipItem(itemId) {
      const p = game.state.player;
      const item = DATABASE.items[itemId];
      if (!item || !item.slot) return false;
      const current = p.equipment[item.slot];
      if (current) p.inventory.push({ itemId: current, quantity: 1, seen: false });
      p.equipment[item.slot] = itemId;
      // 扣除背包數量
      let removed = false;
      p.inventory = p.inventory.flatMap(stack => {
        if (!removed && stack.itemId === itemId) {
          const q = stack.quantity - 1;
          removed = true;
          return q > 0 ? [{ ...stack, quantity: q }] : [];
        }
        return [stack];
      });
      game.player.recalculateStats();
      game.ui.updateHubUI?.();
      return true;
    }
  },

  // ---------------------- UI (minimal-needed) ----------------------
  ui: {
    state: {
      playerTarget: null
    },
    showScreen(id) {
      document.querySelectorAll('#game-window > div').forEach(div => div.classList.add('hidden'));
      const el = document.getElementById(id);
      if (el) el.classList.remove('hidden');
      game.state.currentScreen = id;
    },
    showModal({ title, body, buttons }) {
      const modal = document.getElementById('modal');
      const modalTitle = document.getElementById('modal-title');
      const modalBody = document.getElementById('modal-body');
      const modalButtons = document.getElementById('modal-buttons');
      if (!modal) return alert(title.replace(/<[^>]+>/g,'') + '\n' + body.replace(/<[^>]+>/g,''));
      modalTitle.innerHTML = title;
      modalBody.innerHTML = body;
      modalButtons.innerHTML = '';
      (buttons || [{ text: '關閉', fn: () => game.ui.closeModal() }]).forEach(btn => {
        const b = document.createElement('button');
        b.className = `menu-button px-4 py-2 ${btn.class || ''}`;
        b.innerHTML = btn.text;
        b.addEventListener('click', btn.fn);
        modalButtons.appendChild(b);
      });
      modal.classList.remove('hidden');
    },
    closeModal() {
      const modal = document.getElementById('modal');
      if (modal) modal.classList.add('hidden');
    },
    showNameInputModal() {
      game.ui.showModal({
        title: '決定你的名字',
        body: `
          <p class="mb-4 text-gray-400">請為你的英雄命名：</p>
          <input type="text" id="player-name-input" class="w-full p-2 rounded bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" maxlength="12" placeholder="最多12個字">
        `,
        buttons: [
          { text: '返回', fn: () => game.ui.closeModal() },
          { text: '開始遊戲', fn: () => game.confirmCharacterCreation(), class: 'bg-green-600 hover:bg-green-700 text-white' }
        ]
      });
      // Auto-focus the input field
      setTimeout(() => document.getElementById('player-name-input')?.focus(), 100);
    },
    showCombatLogMessage(msg, cls='') {
      const log = document.getElementById('combat-log');
      if (!log) { console.log('[combat-log]', msg); return; }
      const p = document.createElement('p');
      p.className = `text-sm ${cls}`;
      p.innerHTML = msg;
      log.appendChild(p);
      log.scrollTop = log.scrollHeight;
    },
    updateUnitHP(unit, oldHp) {
      const isPlayer = unit.isPlayer;
      const idBase = isPlayer ? 'player' : unit.id;
      const fill = document.getElementById(`hp-fill-${idBase}`);
      const text = document.querySelector(`#unit-display-${idBase} .hp-text`);
      if (fill) {
        const percent = unit.maxStats.hp > 0 ? (unit.stats.hp / unit.maxStats.hp) * 100 : 0;
        fill.style.width = `${Math.max(0, Math.min(100, percent))}%`;
      }
      if (text) text.textContent = `${unit.stats.hp}/${unit.maxStats.hp}`;
      // hit effect
      const el = document.getElementById(`unit-display-${idBase}`);
      if (el) {
        el.classList.remove('hit-effect'); void el.offsetWidth; el.classList.add('hit-effect');
      }
    },
    renderCombatants() {
      const p = game.state.player;
      const enemies = game.combat.state.enemies;
      // player block assumed already in HTML; here ensure target validity
      if (!this.state.playerTarget || !enemies.find(e => e.id === this.state.playerTarget && e.stats.hp > 0)) {
        const aliveEnemy = enemies.find(e => e.stats.hp > 0);
        if (aliveEnemy) this.state.playerTarget = aliveEnemy.id;
      }
      this.renderTurnOrderBar();
    },
    renderTurnOrderBar() {
      const bar = document.getElementById('turn-order-bar');
      if (!bar) return;
      const order = game.combat.state.turnOrder;
      bar.innerHTML = order.map((o, idx) => {
        const u = o.unit;
        const isPlayer = o.isPlayer;
        const icon = isPlayer ? (DATABASE.classes[u.class]?.icon || '🧑') : '👾';
        return `<div class="turn-order-icon ${isPlayer ? 'player-icon' : 'enemy-icon'}" title="${u.name} (${u.stats.hp}/${u.maxStats.hp})">${icon}</div>`;
      }).join('');
    },
    showCombatStatusModal() {
      const p = game.state.player;
      let statusHTML = `<p>玩家: ${p?.name || '???'} HP: ${p?.stats.hp}/${p?.maxStats.hp}</p>`;
      game.combat.state.enemies.forEach(enemy => {
        statusHTML += `<p>敵人 ${enemy.name}: HP: ${enemy.stats.hp}/${enemy.maxStats.hp}</p>`;
      });
      this.showModal({
        title: '戰場狀態檢查',
        body: statusHTML,
        buttons: [{ text: '關閉', fn: () => this.closeModal() }]
      });
    },
    updateHubUI() {
      // stub: 更新背包/屬性/任務等 UI
    }
  },

  // ---------------------- VFX ----------------------
  vfx: {
    play(name, el) {
      // 簡化，依賴 CSS
      if (!el) return;
      el.classList.remove('fx-' + name); void el.offsetWidth; el.classList.add('fx-' + name);
    }
  },

  // ---------------------- Quests (minimal stub) ----------------------
  quests: {
    advance(type, id) { /* stub */ },
    accept(id) { /* stub */ }
  },

  // ---------------------- Combat ----------------------
  combat: {
    state: {
      enemies: [],
      turnOrder: [],
      turnIndex: -1,
      actionInProgress: false
    },

    start(encounterId) {
      // Build basic encounter from DATABASE
      const data = DATABASE.encounters?.[encounterId];
      const list = data?.enemies || [ { id: 'slime' } ];
      this.state.enemies = list.map((e, idx) => this._makeEnemy(e.id, idx));
      this._preparePlayer();
      this._calcTurnOrder();
      game.state.isRunning = true;
      game.ui.showScreen('combat-screen');
      game.ui.renderCombatants();
      game.ui.showCombatLogMessage('戰鬥開始！', 'text-white');
      this._startFirstTurn();
    },

    _preparePlayer() {
      const p = game.state.player;
      if (!p) {
        // create a default player for safety
        game.state.player = {
          isPlayer: true, id: 'player', name: '勇者', class: 'swordsman',
          level: 1,
          baseStats: { hp: 60, mp: 20, atk: 10, def: 8, spi: 5, hit: 10, eva: 5, speed: 10, critRate: 5, critDamage: 150 },
          maxStats: {}, stats: {}, equipment: { weapon: null, armor: null, accessory: null, boots: null },
          inventory: [], activeEffects: [], skills: {}, exp: 0, expToNext: 50, skillPoints: 0, attributePoints: 0
        };
      }
      game.player.recalculateStats();
      const p2 = game.state.player;
      if (!p2.stats.hp) { p2.stats.hp = p2.maxStats.hp; p2.stats.mp = p2.maxStats.mp; }
      p2.isPlayer = true;
      p2.id = 'player';
    },

    _makeEnemy(monsterId, idx) {
      const m = DATABASE.monsters?.[monsterId];
      const base = m ? JSON.parse(JSON.stringify(m)) : {
        id: 'slime', name: '史萊姆', level: 1,
        stats: { hp: 20, mp: 0, atk: 7, def: 7, spi: 2, hit: 5, eva: 3, speed: 7, critRate: 0, critDamage: 100 },
        exp: 18, dropsId: 'L001', skills: []
      };
      return {
        ...base,
        uniqueId: `${base.id}_${Date.now()}_${idx}`,
        isPlayer: false,
        maxStats: { ...base.stats },
        activeEffects: [],
        id: base.id // keep original id for UI hooks
      };
    },

    _calcTurnOrder() {
      const p = game.state.player;
      const arr = [
        { unit: p, isPlayer: true },
        ...this.state.enemies.map(e => ({ unit: e, isPlayer: false }))
      ].filter(x => x.unit && x.unit.stats.hp > 0);
      // simple sort by speed desc
      arr.sort((a, b) => (b.unit.maxStats.speed || 0) - (a.unit.maxStats.speed || 0));
      this.state.turnOrder = arr;
      this.state.turnIndex = -1;
      game.ui.renderTurnOrderBar();
    },

    _startFirstTurn() {
      this.nextTurn(); // will select first unit
    },

    toggleActionButtons(enable) {
      const btns = document.querySelectorAll('.combat-action-btn');
      btns.forEach(b => b.disabled = !enable);
    },

    // ---- Player input entrypoint ----
    playerAction(action, option) {
      if (this.state.actionInProgress || !game.state.isRunning) return;
      this.state.actionInProgress = true;
      this.toggleActionButtons(false);

      const p = game.state.player;
      const target = this.state.enemies.find(e => e.id === game.ui.state.playerTarget && e.stats.hp > 0);

      if (action !== 'run' && action !== 'item' && (!target || target.stats.hp <= 0)) {
        game.ui.showCombatLogMessage('請選擇一個有效的目標。', 'text-red-400');
        this.state.actionInProgress = false;
        this.toggleActionButtons(true);
        return;
      }

      switch (action) {
        case 'attack': this._executeAttack(p, target); break;
        case 'skill': this._executeSkill(p, option, target); break;
        case 'item':
          if (!game.inventory.useItem(option, true)) {
            this.state.actionInProgress = false;
            this.toggleActionButtons(true);
            return;
          }
          break;
        case 'run': {
          const isBoss = this.state.enemies.some(e => e.isBoss);
          if (isBoss) {
            game.ui.showCombatLogMessage('無法從首領戰中逃跑！', 'text-red-500');
          } else if (option === true || Math.random() < 0.6) {
            game.ui.showCombatLogMessage('你成功逃跑了！', 'text-yellow-400');
            this.end(false, true);
            return;
          } else {
            game.ui.showCombatLogMessage('逃跑失敗！', 'text-red-400');
          }
          break;
        }
      }

      // 保險：確保一定會進下一回合
      setTimeout(() => {
        this.state.actionInProgress = false;
        if (game.state.isRunning) this.nextTurn();
      }, 800);
    },

    enemyAction(enemy) {
      const player = game.state.player;
      if (!enemy || player.stats.hp <= 0 || !game.state.isRunning) return;
      // choose basic attack
      this._executeAttack(enemy, player);
      setTimeout(() => {
        if (game.state.isRunning) this.nextTurn();
      }, 600);
    },

    _executeAttack(attacker, defender) {
      if (!attacker || !defender) return;
      const baseAtk = attacker.maxStats.atk || 0;
      const def = defender.maxStats.def || 0;
      const raw = Math.max(1, Math.round(baseAtk * 1.0 - def * 0.4 + Math.random() * 4));
      this.applyDamage(attacker, defender, raw, false, false);
    },

    _executeSkill(attacker, skillId, target) {
      if (!attacker || !skillId) return;
      const skill = DATABASE.skills?.[skillId];
      if (!skill) {
        game.ui.showCombatLogMessage('技能不存在。', 'text-red-400');
        return;
      }
      const level = Math.max(1, attacker.skills?.[skillId] || 1);
      const sd = skill.levels[level - 1];
      if (!sd) { game.ui.showCombatLogMessage('技能等級資料缺失。', 'text-red-400'); return; }
      if ((sd.mpCost || 0) > attacker.stats.mp) {
        game.ui.showCombatLogMessage('法力不足。', 'text-red-400');
        return;
      }
      attacker.stats.mp -= sd.mpCost || 0;

      if (skill.type === 'physical' || skill.type === 'magical' || skill.type === 'magical_drain') {
        const atkStat = (skill.type === 'magical' || skill.type === 'magical_drain') ? attacker.maxStats.spi : attacker.maxStats.atk;
        const defStat = (skill.type === 'magical' || skill.type === 'magical_drain') ? target.maxStats.spi : target.maxStats.def;
        const raw = Math.max(1, Math.round((atkStat * (sd.damageMultiplier || 1)) - defStat * 0.35 + Math.random() * 5));
        const dealt = this.applyDamage(attacker, target, raw, skill.type !== 'physical', true);
        if (skill.type === 'magical_drain' && dealt > 0) {
          const heal = Math.max(1, Math.floor(dealt * (sd.drainRatio || 0.5)));
          attacker.stats.hp = Math.min(attacker.maxStats.hp, attacker.stats.hp + heal);
          game.ui.updateUnitHP(attacker, attacker.stats.hp);
          game.ui.showCombatLogMessage(`${attacker.name} 吸取了 ${heal} 點生命。`, 'text-green-400');
        }
      } else if (skill.type === 'buff' && sd.effect) {
        game.combat._applyEffect(attacker, sd.effect);
        game.ui.showCombatLogMessage(`${attacker.name} 使用了 ${skill.name}。`, 'text-yellow-400');
      }
    },

    applyDamage(attacker, defender, damage, isMagical, isSkill = false) {
      if (!defender || !defender.stats) return 0;
      const oldHp = defender.stats.hp;

      // 不倒類狀態
      if ((defender.activeEffects || []).some(e => e.id === 'unbreakable')) {
        game.ui.showCombatLogMessage(`${defender.name} 處於不倒狀態，免疫了所有傷害！`, 'text-green-400');
        return 0;
      }

      // 暴擊
      let finalDamage = damage;
      const isCrit = (attacker.maxStats.critRate || 0) > Math.random() * 100;
      if (isCrit) finalDamage = Math.round(finalDamage * ((attacker.maxStats.critDamage || 150) / 100));

      defender.stats.hp = Math.max(0, oldHp - finalDamage);

      // 播放動畫音效 (防錯)
      try {
        if (!isSkill) {
          game.audio.playSound('hit');
          const el = document.getElementById(`unit-display-${defender.id || 'player'}`);
          if (el) game.vfx.play('slash', el);
        }
      } catch (e) { console.error('VFX error:', e); }

      let colorClass = isMagical ? 'text-purple-400' : 'text-red-400';
      if (isSkill) colorClass = 'text-yellow-400';
      if (isCrit) {
        game.ui.showCombatLogMessage(`💥 暴擊！${attacker.name} 對 ${defender.name} 造成了 ${finalDamage} 點傷害。`, 'text-red-500 font-bold');
      } else {
        game.ui.showCombatLogMessage(`${attacker.name} 對 ${defender.name} 造成了 ${finalDamage} 點傷害。`, colorClass);
      }

      game.ui.updateUnitHP(defender, oldHp);

      // 死亡處理標記
      if (defender.stats.hp <= 0) {
        game.ui.showCombatLogMessage(`${defender.name} 被擊敗了！`, 'text-gray-400');
        if (!defender.isPlayer) {
          // 後續清理會在 checkWinLossCondition 和 nextTurn 進行
        }
      }

      // 立即檢查勝負，避免流程懸空
      this.checkWinLossCondition();

      return finalDamage;
    },

    _applyEffect(target, effect) {
      target.activeEffects = target.activeEffects || [];
      const copy = JSON.parse(JSON.stringify(effect));
      target.activeEffects.push(copy);
      if (target.isPlayer) game.player.recalculateStats();
    },

    processTurnEnd(unit) {
      // 遞減 DOT / Buff 的回合數
      unit.activeEffects = (unit.activeEffects || []).map(e => ({ ...e, turns: (e.turns ?? 0) - 1 }))
        .filter(e => (e.turns ?? 0) >= 0);
      if (unit.isPlayer) game.player.recalculateStats();
    },

    checkWinLossCondition() {
      const p = game.state.player;
      const enemiesAlive = this.state.enemies.filter(e => e.stats.hp > 0);
      if (p.stats.hp <= 0) {
        this.end(false, false);
        return true;
      }
      if (enemiesAlive.length === 0) {
        this.end(true, false);
        return true;
      }
      // 清理死掉的敵人（避免回合轉到死人身上）
      this.state.enemies = this.state.enemies.filter(e => e.stats.hp > 0 || e._pendingRevive);
      // 也重新整理 turn order 以防止 dead reference
      this._calcTurnOrder();
      return false;
    },

    end(win, fled = false) {
      if (!game.state.isRunning) return;
      game.state.isRunning = false;
      this.toggleActionButtons(false);
      if (win) {
        game.ui.showCombatLogMessage('勝利！', 'text-green-400');
      } else if (fled) {
        game.ui.showCombatLogMessage('你離開了戰鬥。', 'text-yellow-400');
      } else {
        game.ui.showCombatLogMessage('戰敗了……', 'text-red-400');
      }
      // 回城或顯示結算由外部處理
    },

    nextTurn() {
      if (!game.state.isRunning) return;
      // 先處理當前行動者的回合結束效果
      const curr = this.state.turnOrder[this.state.turnIndex]?.unit;
      if (curr && curr.stats.hp > 0) {
        this.processTurnEnd(curr);
        if (!game.state.isRunning) return;
      }

      // 找下一個可行動單位
      let nextUnit, isPlayerTurn = false;
      let attempts = 0;
      const maxAttempts = Math.max(10, this.state.turnOrder.length * 3);
      do {
        this.state.turnIndex = (this.state.turnIndex + 1) % (this.state.turnOrder.length || 1);
        const turnInfo = this.state.turnOrder[this.state.turnIndex];
        nextUnit = turnInfo?.unit;
        isPlayerTurn = !!turnInfo?.isPlayer;
        attempts++;
      } while ((
          !nextUnit ||
          nextUnit.stats?.hp <= 0
        ) && attempts < maxAttempts);

      if (!nextUnit || nextUnit.stats.hp <= 0) {
        // 沒找到下一位 → 強制檢查勝負
        this.checkWinLossCondition();
        return;
      }

      // 顯示提示 & 執行
      if (isPlayerTurn) {
        this.toggleActionButtons(true);
        game.ui.showCombatLogMessage('你的回合！', 'text-white');
      } else {
        this.toggleActionButtons(false);
        setTimeout(() => this.enemyAction(nextUnit), 500);
      }
      game.ui.renderTurnOrderBar();
    }
  }
};

// 全域暴露以便 HTML onclick 使用（如需要）
window.game = game;

// 啟動
window.addEventListener('DOMContentLoaded', () => game.init());
