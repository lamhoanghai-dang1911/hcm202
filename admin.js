/**
 * ===================================================================
 * ADMIN DASHBOARD ENGINE (HCM202)
 * Projector view, Live Room, Stopwatch, Race Track, Live Podium
 * ===================================================================
 */

class AdminApp {
  constructor() {
    // Socket.IO with custom server support
    const params = new URLSearchParams(window.location.search);
    const customServer = params.get('server') || localStorage.getItem('hcm202_server_url') || '';
    if (typeof io !== 'undefined') {
      try {
        this.socket = customServer ? io(customServer) : io();
      } catch (e) {
        console.warn('Admin socket error:', e);
        this.socket = null;
      }
    } else {
      this.socket = null;
    }

    this.sound = new SoundSystem();
    this.fireworks = new FireworksEngine(document.getElementById('fireworks-canvas'));

    this.adminPin = sessionStorage.getItem('hcm202_admin_pin') || '';
    this.gameState = 'WAITING';
    this.startTime = null;
    this.timerInterval = null;

    // DOM Elements
    this.dom = {
      // Views
      viewLobby: document.getElementById('view-lobby'),
      viewRacing: document.getElementById('view-racing'),
      viewLeaderboard: document.getElementById('view-leaderboard'),

      // Header
      matchStatusBadge: document.getElementById('match-status-badge'),
      matchTimerDisplay: document.getElementById('match-timer-display'),
      btnAdminSound: document.getElementById('btn-admin-sound'),
      btnAdminReset: document.getElementById('btn-admin-reset'),

      // Login
      loginOverlay: document.getElementById('admin-login-overlay'),
      loginForm: document.getElementById('admin-login-form'),
      pinInput: document.getElementById('admin-pin-input'),
      pinErrorMsg: document.getElementById('pin-error-msg'),

      // Lobby
      adminQrImg: document.getElementById('admin-qr-img'),
      adminJoinUrl: document.getElementById('admin-join-url'),
      lobbyPlayerCount: document.getElementById('lobby-player-count'),
      lobbyPlayerList: document.getElementById('lobby-player-list'),
      btnAdminStartGame: document.getElementById('btn-admin-start-game'),

      // Racing
      racingFinishedCount: document.getElementById('racing-finished-count'),
      raceTracksList: document.getElementById('race-tracks-list'),

      // Leaderboard
      podiumWrapper: document.getElementById('podium-wrapper'),
      leaderboardTableBody: document.getElementById('leaderboard-table-body'),
      btnAdminNewRound: document.getElementById('btn-admin-new-round')
    };

    this.bindEvents();
    this.initSocketEvents();

    // Auto-login if PIN stored
    if (this.socket && this.adminPin) {
      this.socket.emit('admin_login', { pin: this.adminPin });
    }
  }

  showView(viewElement) {
    [this.dom.viewLobby, this.dom.viewRacing, this.dom.viewLeaderboard]
      .forEach(v => v.classList.remove('active'));
    viewElement.classList.add('active');
  }

  formatTime(ms) {
    if (!ms || ms < 0) return '00:00.00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const hundredths = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
  }

  startStopwatch(serverStartTime) {
    this.startTime = serverStartTime;
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      const elapsed = Date.now() - this.startTime;
      this.dom.matchTimerDisplay.textContent = this.formatTime(elapsed);
    }, 40);
  }

  stopStopwatch() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  bindEvents() {
    // Sound toggle
    this.dom.btnAdminSound.addEventListener('click', () => {
      this.sound.enabled = !this.sound.enabled;
      this.dom.btnAdminSound.innerHTML = this.sound.enabled ? '<span>🔊</span>' : '<span>🔇</span>';
    });

    // Login Form Submit
    this.dom.loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPin = this.dom.pinInput.value.trim();
      if (!enteredPin) return;

      this.sound.playClick();
      this.socket.emit('admin_login', { pin: enteredPin });
    });

    // Start Game Button (Lock & Launch)
    this.dom.btnAdminStartGame.addEventListener('click', () => {
      this.sound.playClick();
      if (confirm('Bắt đầu trận đấu ngay bây giờ? Phòng sẽ khóa và không cho phép thí sinh vào muộn!')) {
        this.socket.emit('admin_start_game', { pin: this.adminPin });
      }
    });

    // Reset Room Buttons
    const handleReset = () => {
      this.sound.playClick();
      if (confirm('Bạn có chắc chắn muốn đặt lại phòng thi đấu? Tất cả thí sinh sẽ trở về màn hình chờ.')) {
        this.socket.emit('admin_reset_game', { pin: this.adminPin });
      }
    };

    this.dom.btnAdminReset.addEventListener('click', handleReset);
    this.dom.btnAdminNewRound.addEventListener('click', handleReset);
  }

  initSocketEvents() {
    if (!this.socket) return;

    // 1. Initial info from server
    this.socket.on('server_status', (data) => {
      if (data.joinUrl) {
        this.dom.adminJoinUrl.textContent = data.joinUrl;
        this.dom.adminJoinUrl.href = data.joinUrl;
      }
      if (data.qrCode) {
        this.dom.adminQrImg.src = data.qrCode;
      }
    });

    // 2. Auth success
    this.socket.on('admin_auth_success', (data) => {
      this.adminPin = this.dom.pinInput.value.trim() || this.adminPin;
      sessionStorage.setItem('hcm202_admin_pin', this.adminPin);

      this.dom.loginOverlay.classList.remove('active');
      this.dom.pinErrorMsg.textContent = '';

      if (data.joinUrl) {
        this.dom.adminJoinUrl.textContent = data.joinUrl;
        this.dom.adminJoinUrl.href = data.joinUrl;
      }
      if (data.qrCode) {
        this.dom.adminQrImg.src = data.qrCode;
      }

      this.handleStateUpdate(data);
    });

    // 3. Auth error
    this.socket.on('admin_auth_error', (data) => {
      this.dom.pinErrorMsg.textContent = data.message || 'Mã PIN không đúng!';
      this.sound.playWrong();
    });

    // 4. Room waiting update
    this.socket.on('room_update', (data) => {
      this.dom.lobbyPlayerCount.textContent = data.playerCount || 0;
      this.renderWaitingPlayers(data.players || []);
    });

    // 5. Game started
    this.socket.on('game_started', (data) => {
      this.gameState = 'IN_PROGRESS';
      this.dom.matchStatusBadge.textContent = 'TRẬN ĐẤU ĐANG DIỄN RA';
      this.dom.matchStatusBadge.className = 'status-indicator racing';

      this.sound.playMilestoneWin();
      this.fireworks.triggerCelebration();

      this.startStopwatch(data.startTime);
      this.showView(this.dom.viewRacing);
    });

    // 6. Live race track updates
    this.socket.on('admin_race_update', (data) => {
      this.renderRaceTracks(data.players || []);
    });

    // 7. Leaderboard update
    this.socket.on('leaderboard_update', (data) => {
      this.renderRaceTracks(data.players || []);
      this.renderLeaderboard(data.leaderboard || []);

      const finishedCount = (data.leaderboard || []).length;
      this.dom.racingFinishedCount.textContent = `${finishedCount} thí sinh đã về đích`;

      // If at least 1 finished, sound celebratory fanfare
      this.sound.playMilestoneWin();
      this.fireworks.burst();

      // Show leaderboard view once anyone finishes or host chooses
      if (finishedCount > 0 && !this.dom.viewLeaderboard.classList.contains('active')) {
        // Automatically switch to leaderboard after brief delay or keep race view
        setTimeout(() => {
          this.showView(this.dom.viewLeaderboard);
          this.dom.matchStatusBadge.textContent = 'ĐÃ CÓ THÍ SINH VỀ ĐÍCH';
          this.dom.matchStatusBadge.className = 'status-indicator finished';
        }, 1200);
      }
    });

    // 8. Game reset
    this.socket.on('game_reset', () => {
      this.gameState = 'WAITING';
      this.stopStopwatch();
      this.dom.matchTimerDisplay.textContent = '00:00.00';
      this.dom.matchStatusBadge.textContent = 'ĐANG MỞ PHÒNG CHỜ';
      this.dom.matchStatusBadge.className = 'status-indicator';
      this.dom.lobbyPlayerCount.textContent = '0';
      this.dom.lobbyPlayerList.innerHTML = `
        <div class="empty-waiting-notice">
          <span>⏳ Đang đợi khán giả quét mã QR và tham gia...</span>
        </div>
      `;
      this.showView(this.dom.viewLobby);
    });
  }

  handleStateUpdate(state) {
    this.gameState = state.gameState;

    if (this.gameState === 'WAITING') {
      this.showView(this.dom.viewLobby);
      this.dom.matchStatusBadge.textContent = 'ĐANG MỞ PHÒNG CHỜ';
      this.dom.matchStatusBadge.className = 'status-indicator';
      this.renderWaitingPlayers(state.players || []);
    } else if (this.gameState === 'IN_PROGRESS') {
      this.showView(this.dom.viewRacing);
      this.dom.matchStatusBadge.textContent = 'TRẬN ĐẤU ĐANG DIỄN RA';
      this.dom.matchStatusBadge.className = 'status-indicator racing';
      if (state.startTime) this.startStopwatch(state.startTime);
      this.renderRaceTracks(state.players || []);
    }

    if (state.leaderboard && state.leaderboard.length > 0) {
      this.renderLeaderboard(state.leaderboard);
      this.showView(this.dom.viewLeaderboard);
    }
  }

  renderWaitingPlayers(players) {
    if (!players || players.length === 0) {
      this.dom.lobbyPlayerList.innerHTML = `
        <div class="empty-waiting-notice">
          <span>⏳ Đang đợi khán giả quét mã QR và tham gia...</span>
        </div>
      `;
      return;
    }

    this.dom.lobbyPlayerList.innerHTML = '';
    players.forEach(p => {
      const chip = document.createElement('div');
      chip.className = 'player-chip';
      const initial = (p.name || '?')[0].toUpperCase();
      chip.innerHTML = `
        <span class="player-chip-avatar">${initial}</span>
        <span class="player-chip-name">${p.name}</span>
        <button class="btn-kick-player" title="Mời ra khỏi phòng">&times;</button>
      `;

      // Kick handler
      chip.querySelector('.btn-kick-player').addEventListener('click', () => {
        if (confirm(`Bạn có chắc muốn mời thí sinh "${p.name}" ra khỏi phòng?`)) {
          this.socket.emit('admin_kick_player', {
            pin: this.adminPin,
            playerId: p.id
          });
        }
      });

      this.dom.lobbyPlayerList.appendChild(chip);
    });
  }

  calculateProgressPercent(p) {
    if (p.status === 'FINISHED') return 100;

    // Total 6 stages:
    // M1 Quiz: 0 - 16%
    // M1 Puzzle: 17 - 33%
    // M2 Quiz: 34 - 50%
    // M2 Puzzle: 51 - 66%
    // M3 Quiz: 67 - 83%
    // M3 Puzzle: 84 - 99%
    let base = 0;
    if (p.milestone === 1) {
      base = p.step === 'puzzle' ? 25 : (p.question / 5) * 16;
    } else if (p.milestone === 2) {
      base = p.step === 'puzzle' ? 58 : 33 + (p.question / 5) * 16;
    } else if (p.milestone === 3) {
      base = p.step === 'puzzle' ? 90 : 66 + (p.question / 5) * 16;
    }
    return Math.min(Math.round(base), 95);
  }

  getStageLabel(p) {
    if (p.status === 'FINISHED') {
      return `🏆 VỀ ĐÍCH HẠNG #${p.rank} (${p.finishTimeFormatted})`;
    }
    if (p.step === 'puzzle') {
      return `🧩 Ghép hình Mốc ${p.milestone}`;
    }
    return `📝 Mốc ${p.milestone}: Câu ${p.question}/5`;
  }

  renderRaceTracks(players) {
    if (!players || players.length === 0) return;

    this.dom.raceTracksList.innerHTML = '';

    // Sort players: Finished first (by rank), then by progress
    const sorted = [...players].sort((a, b) => {
      if (a.status === 'FINISHED' && b.status === 'FINISHED') return (a.rank || 0) - (b.rank || 0);
      if (a.status === 'FINISHED') return -1;
      if (b.status === 'FINISHED') return 1;
      return this.calculateProgressPercent(b) - this.calculateProgressPercent(a);
    });

    sorted.forEach((p, idx) => {
      const lane = document.createElement('div');
      lane.className = `race-lane ${p.status === 'FINISHED' ? 'finished' : ''}`;

      const progress = this.calculateProgressPercent(p);
      const stageLabel = this.getStageLabel(p);
      const rankBadge = p.rank ? `Hạng #${p.rank}` : `#${idx + 1}`;

      lane.innerHTML = `
        <div class="lane-header">
          <div class="lane-player-info">
            <span class="lane-rank-badge">${p.rank ? '🥇' : '🏃'} ${rankBadge}</span>
            <span class="lane-player-name">${p.name}</span>
          </div>
          <span class="lane-status-badge ${p.status === 'FINISHED' ? 'finish-badge' : ''}">${stageLabel}</span>
        </div>
        <div class="lane-track-bar">
          <div class="lane-progress-fill ${p.status === 'FINISHED' ? 'done' : ''}" style="width: ${progress}%;"></div>
        </div>
      `;
      this.dom.raceTracksList.appendChild(lane);
    });
  }

  renderLeaderboard(leaderboard) {
    if (!leaderboard || leaderboard.length === 0) return;

    // Render Olympic Podium for Top 3
    const top1 = leaderboard[0];
    const top2 = leaderboard[1];
    const top3 = leaderboard[2];

    this.dom.podiumWrapper.innerHTML = `
      <!-- 2nd Place -->
      <div class="podium-place podium-place-2">
        <div class="podium-rank-icon">🥈</div>
        <div class="podium-box">
          <div class="podium-player-name">${top2 ? top2.name : 'Chưa có'}</div>
          <div class="podium-player-time">${top2 ? top2.finishTimeFormatted : '--:--'}</div>
        </div>
      </div>

      <!-- 1st Place (Highest) -->
      <div class="podium-place podium-place-1">
        <div class="podium-rank-icon">🥇</div>
        <div class="podium-box">
          <div class="podium-player-name">${top1 ? top1.name : 'Chưa có'}</div>
          <div class="podium-player-time">${top1 ? top1.finishTimeFormatted : '--:--'}</div>
        </div>
      </div>

      <!-- 3rd Place -->
      <div class="podium-place podium-place-3">
        <div class="podium-rank-icon">🥉</div>
        <div class="podium-box">
          <div class="podium-player-name">${top3 ? top3.name : 'Chưa có'}</div>
          <div class="podium-player-time">${top3 ? top3.finishTimeFormatted : '--:--'}</div>
        </div>
      </div>
    `;

    // Render Full Table
    this.dom.leaderboardTableBody.innerHTML = '';
    leaderboard.forEach(item => {
      const row = document.createElement('tr');
      const medal = item.rank === 1 ? '🥇 HẠNG 1' : (item.rank === 2 ? '🥈 HẠNG 2' : (item.rank === 3 ? '🥉 HẠNG 3' : `HẠNG ${item.rank}`));
      row.innerHTML = `
        <td><strong>${medal}</strong></td>
        <td><strong>${item.name}</strong></td>
        <td><span style="font-family: monospace; font-size: 1.05rem; color: #ffd700;">${item.finishTimeFormatted}</span></td>
        <td>${item.attempts || 15} lượt</td>
        <td><span class="lane-status-badge finish-badge">✓ Đã Hoàn Thành</span></td>
      `;
      this.dom.leaderboardTableBody.appendChild(row);
    });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.adminApp = new AdminApp();
});
