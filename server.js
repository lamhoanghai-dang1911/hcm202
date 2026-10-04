/**
 * ===================================================================
 * TƯ TƯỞNG HỒ CHÍ MINH (HCM202) - MULTIPLAYER EVENT SERVER
 * Real-time Audience Room & Admin Live Dashboard (Socket.io + Express)
 * ===================================================================
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const os = require('os');
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 3000;
const ADMIN_PIN = process.env.ADMIN_PIN || '1234';

// Detect Local LAN IPv4 for Audience connection
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const LAN_IP = getLocalIpAddress();
let PUBLIC_URL = process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || (process.env.RAILWAY_STATIC_URL ? `https://${process.env.RAILWAY_STATIC_URL}` : '');
let JOIN_URL = PUBLIC_URL || `http://${LAN_IP}:${PORT}`;
let qrCodeDataUrl = '';

function updateQrCode(url) {
  return QRCode.toDataURL(url, { margin: 1, width: 280 })
    .then(dataUrl => {
      qrCodeDataUrl = dataUrl;
      console.log(`[QR CODE] Generated for ${url}`);
      return dataUrl;
    })
    .catch(err => {
      console.error('[QR CODE] Error generating:', err);
      return '';
    });
}

// Generate initial QR code
updateQrCode(JOIN_URL);

// Serve static directory
app.use(express.static(__dirname));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/api/server-info', async (req, res) => {
  let effectiveJoinUrl = JOIN_URL;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';

  if (!PUBLIC_URL && host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
    effectiveJoinUrl = `${proto}://${host}`;
  }

  let qr = qrCodeDataUrl;
  if (effectiveJoinUrl !== JOIN_URL) {
    try {
      qr = await QRCode.toDataURL(effectiveJoinUrl, { margin: 1, width: 280 });
    } catch (e) {}
  }

  res.json({
    lanIp: LAN_IP,
    port: PORT,
    joinUrl: effectiveJoinUrl,
    qrCode: qr,
    gameState,
    totalPlayers: players.size
  });
});

// --- GAME STATE ---
let gameState = 'WAITING'; // 'WAITING' | 'IN_PROGRESS' | 'FINISHED'
let startTime = null;
const players = new Map(); // socket.id -> PlayerObject
const leaderboard = [];    // Array of finished players sorted by finishTimeMs

function formatTime(ms) {
  if (!ms || ms < 0) return '00:00.00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hundredths = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
}

function getWaitingPlayersList() {
  const list = [];
  players.forEach(p => {
    list.push({
      id: p.id,
      name: p.name,
      status: p.status,
      joinedAt: p.joinedAt
    });
  });
  return list;
}

function getLiveRaceData() {
  const list = [];
  players.forEach(p => {
    list.push({
      id: p.id,
      name: p.name,
      status: p.status,
      milestone: p.milestone,
      question: p.question,
      step: p.step,
      attempts: p.attempts,
      finishTimeMs: p.finishTimeMs,
      finishTimeFormatted: p.finishTimeFormatted,
      rank: p.rank
    });
  });
  return list;
}

// --- SOCKET.IO EVENTS ---
io.on('connection', async (socket) => {
  // Determine host for client
  let effectiveJoinUrl = JOIN_URL;
  const host = socket.handshake.headers['x-forwarded-host'] || socket.handshake.headers.host;
  const proto = socket.handshake.headers['x-forwarded-proto'] || 'http';
  if (!PUBLIC_URL && host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
    effectiveJoinUrl = `${proto}://${host}`;
  }

  let clientQr = qrCodeDataUrl;
  if (effectiveJoinUrl !== JOIN_URL) {
    try {
      clientQr = await QRCode.toDataURL(effectiveJoinUrl, { margin: 1, width: 280 });
    } catch (e) {}
  }

  // 1. Initial info
  socket.emit('server_status', {
    gameState,
    lanIp: LAN_IP,
    joinUrl: effectiveJoinUrl,
    qrCode: clientQr
  });

  // 2. Player joins room
  socket.on('player_join', ({ name }) => {
    const cleanName = (name || '').trim();

    if (!cleanName) {
      return socket.emit('join_error', { message: 'Vui lòng nhập tên của bạn để tham gia!' });
    }

    // STRICT RULE: Không cho khán giả vào sau khi đã bắt đầu trò chơi
    if (gameState !== 'WAITING') {
      return socket.emit('join_error', {
        message: 'Trò chơi đã bắt đầu! Phòng thi đấu đã khóa và không nhận thêm người chơi.'
      });
    }

    const playerObj = {
      id: socket.id,
      name: cleanName,
      status: 'WAITING',
      joinedAt: Date.now(),
      milestone: 1,
      question: 1,
      step: 'quiz', // 'quiz' | 'puzzle'
      attempts: 0,
      finishTimeMs: null,
      finishTimeFormatted: null,
      rank: null
    };

    players.set(socket.id, playerObj);

    socket.emit('join_success', {
      name: cleanName,
      playerCount: players.size
    });

    // Notify all of room update
    io.emit('room_update', {
      playerCount: players.size,
      players: getWaitingPlayersList()
    });

    console.log(`[JOIN] Player "${cleanName}" (${socket.id}) entered. Total: ${players.size}`);
  });

  // 3. Player progress updates (live racing)
  socket.on('player_progress', ({ milestone, question, step, attempts }) => {
    const player = players.get(socket.id);
    if (!player) return;

    player.milestone = milestone || player.milestone;
    player.question = question || player.question;
    player.step = step || player.step;
    player.attempts = (attempts !== undefined) ? attempts : player.attempts;

    // Send live update to Admin
    io.emit('admin_race_update', {
      players: getLiveRaceData()
    });
  });

  // 4. Player finishes the entire game (3 milestones + 3 puzzles)
  socket.on('player_finish', ({ attempts }) => {
    const player = players.get(socket.id);
    if (!player || player.status === 'FINISHED') return;

    const timeSpent = startTime ? (Date.now() - startTime) : 0;
    const formatted = formatTime(timeSpent);
    const assignedRank = leaderboard.length + 1;

    player.status = 'FINISHED';
    player.finishTimeMs = timeSpent;
    player.finishTimeFormatted = formatted;
    player.rank = assignedRank;
    player.attempts = (attempts !== undefined) ? attempts : player.attempts;

    const leaderboardEntry = {
      id: player.id,
      name: player.name,
      finishTimeMs: timeSpent,
      finishTimeFormatted: formatted,
      attempts: player.attempts,
      rank: assignedRank
    };

    leaderboard.push(leaderboardEntry);

    // Send rank ack to player
    socket.emit('player_finished_ack', {
      rank: assignedRank,
      finishTimeFormatted: formatted,
      finishTimeMs: timeSpent,
      totalPlayers: players.size,
      leaderboard
    });

    // Broadcast new rank to all
    io.emit('leaderboard_update', {
      leaderboard,
      players: getLiveRaceData()
    });

    console.log(`[FINISH] Rank #${assignedRank}: "${player.name}" in ${formatted}!`);
  });

  // 5. Admin Authentication
  socket.on('admin_login', ({ pin }) => {
    if (pin === ADMIN_PIN) {
      socket.emit('admin_auth_success', {
        gameState,
        startTime,
        players: getLiveRaceData(),
        leaderboard,
        joinUrl: effectiveJoinUrl,
        qrCode: clientQr
      });
    } else {
      socket.emit('admin_auth_error', { message: 'Mã PIN quản trị không chính xác!' });
    }
  });

  // 6. Admin Starts Game
  socket.on('admin_start_game', ({ pin }) => {
    if (pin !== ADMIN_PIN) {
      return socket.emit('admin_auth_error', { message: 'Mã PIN không hợp lệ!' });
    }

    if (gameState === 'WAITING') {
      gameState = 'IN_PROGRESS';
      startTime = Date.now();

      // Mark all connected waiting players as PLAYING
      players.forEach(p => {
        p.status = 'PLAYING';
      });

      console.log(`[START] Game started by Admin with ${players.size} players at ${new Date(startTime).toLocaleTimeString()}!`);

      // Broadcast start signal to all players simultaneously
      io.emit('game_started', {
        startTime,
        totalPlayers: players.size
      });

      // Update Admin screen
      io.emit('admin_race_update', {
        players: getLiveRaceData()
      });
    }
  });

  // 7. Admin Kicks a Player (before start)
  socket.on('admin_kick_player', ({ pin, playerId }) => {
    if (pin !== ADMIN_PIN) return;
    if (players.has(playerId)) {
      const kicked = players.get(playerId);
      players.delete(playerId);
      io.to(playerId).emit('player_kicked', { message: 'Bạn đã bị quản trị viên mời ra khỏi phòng.' });
      io.emit('room_update', {
        playerCount: players.size,
        players: getWaitingPlayersList()
      });
      console.log(`[KICK] Player "${kicked.name}" kicked by Admin.`);
    }
  });

  // 8. Admin Resets Game for a New Match
  socket.on('admin_reset_game', ({ pin }) => {
    if (pin !== ADMIN_PIN) return;

    gameState = 'WAITING';
    startTime = null;
    players.clear();
    leaderboard.length = 0;

    console.log('[RESET] Room reset for a new match.');

    io.emit('game_reset', {
      message: 'Trận đấu đã được quản trị viên đặt lại cho lượt chơi mới.'
    });

    io.emit('room_update', {
      playerCount: 0,
      players: []
    });
  });

  // 9. Disconnect handling
  socket.on('disconnect', () => {
    if (players.has(socket.id)) {
      const p = players.get(socket.id);
      if (gameState === 'WAITING') {
        players.delete(socket.id);
        io.emit('room_update', {
          playerCount: players.size,
          players: getWaitingPlayersList()
        });
        console.log(`[DISCONNECT] Waiting player "${p.name}" disconnected. Remaining: ${players.size}`);
      } else {
        console.log(`[DISCONNECT] In-game player "${p.name}" disconnected.`);
      }
    }
  });
});

// Start Server (when run directly with node server.js or npm start)
if (require.main === module) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log('\n======================================================');
    console.log('   TƯ TƯỞNG HỒ CHÍ MINH (HCM202) - MULTIPLAYER SERVER');
    console.log('======================================================');
    console.log(`[LOCAL]     http://localhost:${PORT}`);
    console.log(`[LAN / WI-FI] ${JOIN_URL}`);
    console.log(`[ADMIN URL]   ${JOIN_URL}/admin (PIN: ${ADMIN_PIN})`);
    console.log('======================================================\n');
  });
}

module.exports = app;
