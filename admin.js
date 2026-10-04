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
      btnAdminFinish: document.getElementById('btn-admin-finish'),
      btnAdminFinishRacing: document.getElementById('btn-admin-finish-racing'),
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

  // 10-Minute Countdown Timer
  startCountdown(serverStartTime, durationMs = 10 * 60 * 1000) {
    this.startTime = serverStartTime;
    this.durationMs = durationMs;
    if (this.timerInterval) clearInterval(this.timerInterval);

    const updateTimer = () => {
      const elapsed = Date.now() - this.startTime;
      const remaining = Math.max(0, this.durationMs - elapsed);

      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      const hundredths = Math.floor((remaining % 1000) / 10);

      this.dom.matchTimerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;

      // Visual warning when <= 60 seconds remain
      if (remaining <= 60000 && remaining > 0) {
        this.dom.matchTimerDisplay.classList.add('urgent');
      } else {
        this.dom.matchTimerDisplay.classList.remove('urgent');
      }

      if (remaining <= 0) {
        this.stopCountdown();
        this.dom.matchTimerDisplay.textContent = '00:00.00';
      }
    };

    updateTimer();
    this.timerInterval = setInterval(updateTimer, 50);
  }

  stopCountdown() {
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
      if (confirm('Bắt đầu trận đấu ngay bây giờ? Phòng sẽ khóa và không cho phép thí sinh vào muộn! (Thời lượng tối đa 10 phút)')) {
        this.socket.emit('admin_start_game', { pin: this.adminPin });
      }
    });

    // Finish Match Early / Lock Rankings buttons
    const handleFinishMatch = () => {
      this.sound.playClick();
      if (confirm('Bạn có chắc chắn muốn KẾT THÚC TRẬN ĐẤU VÀ CHỐT THỨ HẠNG ngay bây giờ không?\n- Trận đấu sẽ lập tức dừng lại đối với tất cả thí sinh.\n- Hệ thống sẽ chốt thứ hạng chính thức.')) {
        this.socket.emit('admin_finish_game', { pin: this.adminPin });
      }
    };

    if (this.dom.btnAdminFinish) {
      this.dom.btnAdminFinish.addEventListener('click', handleFinishMatch);
    }
    if (this.dom.btnAdminFinishRacing) {
      this.dom.btnAdminFinishRacing.addEventListener('click', handleFinishMatch);
    }

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

    // 5. Game started (10-minute session)
    this.socket.on('game_started', (data) => {
      this.gameState = 'IN_PROGRESS';
      this.dom.matchStatusBadge.textContent = 'TRẬN ĐẤU ĐANG DIỄN RA (10 PHÚT)';
      this.dom.matchStatusBadge.className = 'status-indicator racing';

      if (this.dom.btnAdminFinish) this.dom.btnAdminFinish.style.display = 'inline-flex';
      if (this.dom.btnAdminFinishRacing) this.dom.btnAdminFinishRacing.style.display = 'inline-flex';

      this.sound.playMilestoneWin();
      this.fireworks.triggerCelebration();

      this.startCountdown(data.startTime, data.durationMs || (10 * 60 * 1000));
      this.showView(this.dom.viewRacing);
    });

    // 6. Live race track updates
    this.socket.on('admin_race_update', (data) => {
      this.renderRaceTracks(data.players || []);
    });

    // 7. Leaderboard update (during match)
    this.socket.on('leaderboard_update', (data) => {
      this.renderRaceTracks(data.players || []);
      this.renderLeaderboard(data.leaderboard || []);

      const finishedCount = (data.leaderboard || []).filter(p => p.status === 'FINISHED').length;
      this.dom.racingFinishedCount.textContent = `${finishedCount} thí sinh đã về đích`;

      // Visual fanfare when someone completes
      this.sound.playCorrect();
      this.fireworks.burst();
    });

    // 7b. Official Match Finished (10 mins up or Admin finish)
    this.socket.on('game_finished', (data) => {
      this.gameState = 'FINISHED';
      this.stopCountdown();
      this.dom.matchTimerDisplay.classList.remove('urgent');

      if (this.dom.btnAdminFinish) this.dom.btnAdminFinish.style.display = 'none';
      if (this.dom.btnAdminFinishRacing) this.dom.btnAdminFinishRacing.style.display = 'none';

      this.dom.matchStatusBadge.textContent = 'TRẬN ĐẤU ĐÃ KẾT THÚC • ĐÃ CHỐT HẠNG';
      this.dom.matchStatusBadge.className = 'status-indicator finished';

      this.sound.playVictory();
      this.fireworks.triggerCelebration();
      setTimeout(() => this.fireworks.triggerCelebration(), 800);

      this.renderLeaderboard(data.leaderboard || []);
      this.showView(this.dom.viewLeaderboard);

      let reasonNotice = 'Trận đấu đã chính thức kết thúc và bảng thứ hạng đã được chốt!';
      if (data.reason === 'TIME_EXPIRED') {
        reasonNotice = '⏳ ĐÃ HẾT 10 PHÚT! Trận đấu đã tự động kết thúc và chốt thứ hạng chính thức cho toàn bộ thí sinh!';
      } else if (data.reason === 'ADMIN_TERMINATED') {
        reasonNotice = '🏁 Quản trò đã bấm kết thúc trận đấu và chốt thứ hạng chính thức!';
      } else if (data.reason === 'ALL_FINISHED') {
        reasonNotice = '🎉 Toàn bộ thí sinh đã hoàn thành xuất sắc trước 10 phút!';
      }
      setTimeout(() => alert(reasonNotice), 400);
    });

    // 8. Game reset
    this.socket.on('game_reset', () => {
      this.gameState = 'WAITING';
      this.stopCountdown();
      this.dom.matchTimerDisplay.textContent = '10:00';
      this.dom.matchTimerDisplay.classList.remove('urgent');
      this.dom.matchStatusBadge.textContent = 'ĐANG MỞ PHÒNG CHỜ';
      this.dom.matchStatusBadge.className = 'status-indicator';

      if (this.dom.btnAdminFinish) this.dom.btnAdminFinish.style.display = 'none';
      if (this.dom.btnAdminFinishRacing) this.dom.btnAdminFinishRacing.style.display = 'none';

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
      if (this.dom.btnAdminFinish) this.dom.btnAdminFinish.style.display = 'none';
      if (this.dom.btnAdminFinishRacing) this.dom.btnAdminFinishRacing.style.display = 'none';
      this.renderWaitingPlayers(state.players || []);
    } else if (this.gameState === 'IN_PROGRESS') {
      this.showView(this.dom.viewRacing);
      this.dom.matchStatusBadge.textContent = 'TRẬN ĐẤU ĐANG DIỄN RA (10 PHÚT)';
      this.dom.matchStatusBadge.className = 'status-indicator racing';
      if (this.dom.btnAdminFinish) this.dom.btnAdminFinish.style.display = 'inline-flex';
      if (this.dom.btnAdminFinishRacing) this.dom.btnAdminFinishRacing.style.display = 'inline-flex';
      if (state.startTime) this.startCountdown(state.startTime, state.durationMs || (10 * 60 * 1000));
      this.renderRaceTracks(state.players || []);
    } else if (this.gameState === 'FINISHED') {
      this.stopCountdown();
      this.showView(this.dom.viewLeaderboard);
      this.dom.matchStatusBadge.textContent = 'TRẬN ĐẤU ĐÃ KẾT THÚC • ĐÃ CHỐT HẠNG';
      this.dom.matchStatusBadge.className = 'status-indicator finished';
      if (this.dom.btnAdminFinish) this.dom.btnAdminFinish.style.display = 'none';
      if (this.dom.btnAdminFinishRacing) this.dom.btnAdminFinishRacing.style.display = 'none';
      if (state.leaderboard) this.renderLeaderboard(state.leaderboard);
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
      const medal = item.rank === 1 ? '🥇 HẠNG 1' : (item.rank === 2 ? '🥈 HẠNG 2' : (item.rank === 3 ? '🥉 HẠNG 3' : `HẠNG #${item.rank}`));
      const isFinished = item.status === 'FINISHED';
      const statusBadge = isFinished
        ? `<span class="lane-status-badge finish-badge">✓ Đã Về Đích</span>`
        : `<span class="lane-status-badge" style="background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid #ef4444;">⏱️ Chốt Hạng (Hết giờ)</span>`;

      row.innerHTML = `
        <td><strong>${medal}</strong></td>
        <td><strong>${item.name}</strong></td>
        <td><span style="font-family: monospace; font-size: 1.05rem; color: #ffd700;">${item.finishTimeFormatted}</span></td>
        <td>${item.attempts || 0} lượt</td>
        <td>${statusBadge}</td>
      `;
      this.dom.leaderboardTableBody.appendChild(row);
    });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.adminApp = new AdminApp();
});
