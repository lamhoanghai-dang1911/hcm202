/**
 * ===================================================================
 * TƯ TƯỞNG HỒ CHÍ MINH (HCM202) - GAME ÔN TẬP & GHÉP HÌNH LỊCH SỬ
 * Core Game Engine: Quiz Flow, Web Audio API, Puzzle 3x3, Fireworks,
 * Multi-user Audience Room & Real-time Live Ranking
 * ===================================================================
 */

// --- 1. DATA DEFINITIONS ---
const GAME_DATA = [
  {
    id: 1,
    title: "MỐC 1: TƯ TƯỞNG HỒ CHÍ MINH VỀ VĂN HÓA",
    shortTitle: "Mốc 1: Văn Hóa",
    image: "images/van_hoa.jpg",
    puzzleTitle: "Mảnh Ghép Lịch Sử: Nền Văn Hóa Dân Tộc",
    puzzleDesc: "Đổi chỗ các mảnh ghép để hoàn thiện bức tranh văn hóa dân tộc và mở khóa Mốc 2!",
    startQNum: 1,
    questions: [
      {
        num: 1,
        question: "Trong định nghĩa về văn hóa, Hồ Chí Minh khẳng định văn hóa là sự tổng hợp của mọi phương thức sinh hoạt cùng với biểu hiện của nó mà loài người đã sản sinh ra nhằm mục đích gì?",
        options: [
          { key: "A", text: "Phục vụ giai cấp thống trị." },
          { key: "B", text: "Thích ứng những nhu cầu đời sống và đòi hỏi của sự sinh tồn." },
          { key: "C", text: "Mở rộng lãnh thổ và quyền lực." },
          { key: "D", text: "Xây dựng các công trình kiến trúc đồ xộ." }
        ],
        correct: "B",
        explanation: "Theo định nghĩa của Hồ Chí Minh (tháng 8/1943): Văn hóa là sự tổng hợp của mọi phương thức sinh hoạt cùng với biểu hiện của nó mà loài người đã sản sinh ra nhằm thích ứng những nhu cầu đời sống và đòi hỏi của sự sinh tồn."
      },
      {
        num: 2,
        question: "Theo Hồ Chí Minh, mối quan hệ giữa chính trị, xã hội và văn hóa được xác định như thế nào?",
        options: [
          { key: "A", text: "Văn hóa phát triển hoàn toàn độc lập, không chịu ảnh hưởng của chính trị." },
          { key: "B", text: "Chính trị và xã hội được giải phóng thì văn hóa mới được giải phóng; chính trị giải phóng mở đường cho văn hóa phát triển." },
          { key: "C", text: "Văn hóa quyết định trực tiếp sự ra đời của thể chế chính trị." },
          { key: "D", text: "Kinh tế phát triển sau khi văn hóa đã hoàn thiện." }
        ],
        correct: "B",
        explanation: "Hồ Chí Minh chỉ rõ: Chính trị và xã hội có được giải phóng thì văn hóa mới được giải phóng. Chính trị giải phóng sẽ mở đường cho văn hóa phát triển."
      },
      {
        num: 3,
        question: "Luận điểm nào sau đây thể hiện quan điểm của Hồ Chí Minh về vai trò của văn hóa nghệ thuật trong sự nghiệp cách mạng?",
        options: [
          { key: "A", text: "Văn hóa nghệ thuật cũng là một mặt trận, anh chị em nghệ sĩ là chiến sĩ trên mặt trận ấy." },
          { key: "B", text: "Văn hóa nghệ thuật chỉ mang tính chất giải trí đơn thuần." },
          { key: "C", text: "Văn hóa nghệ thuật phải đứng ngoài các cuộc đấu tranh chính trị." },
          { key: "D", text: "Văn hóa nghệ thuật chỉ dành riêng cho giới trí thức." }
        ],
        correct: "A",
        explanation: "Trong thư gửi các họa sĩ nhân dịp Triển lãm hội họa (1951), Bác Hồ khẳng định: 'Văn hóa nghệ thuật cũng là một mặt trận. Anh chị em là chiến sĩ trên mặt trận ấy'."
      },
      {
        num: 4,
        question: "Trong thời kỳ kháng chiến chống thực dân Pháp, Hồ Chí Minh xác định nền văn hóa mới Việt Nam gồm những tính chất nào?",
        options: [
          { key: "A", text: "Dân tộc, khoa học, đại chúng." },
          { key: "B", text: "Dân tộc, hiện đại, nhân văn." },
          { key: "C", text: "Khoa học, tiến bộ, toàn cầu." },
          { key: "D", text: "Dân tộc, xã hội chủ nghĩa, đại chúng." }
        ],
        correct: "A",
        explanation: "Nền văn hóa mới của nước Việt Nam độc lập mang 3 tính chất nền tảng: Dân tộc, Khoa học và Đại chúng."
      },
      {
        num: 5,
        question: "Mối quan hệ giữa giữ gìn bản sắc văn hóa dân tộc và tiếp thu văn hóa nhân loại theo tư tưởng Hồ Chí Minh là:",
        options: [
          { key: "A", text: "Giữ nguyên mọi tập quán cổ truyền mà không cần thay đổi." },
          { key: "B", text: "Giữ gìn cốt cách văn hóa dân tộc đồng thời chủ động tiếp thu tinh hoa văn hóa nhân loại." },
          { key: "C", text: "Bài trừ toàn bộ các yếu tố văn hóa từ bên ngoài." },
          { key: "D", text: "Đồng hóa hoàn toàn văn hóa dân tộc theo chuẩn mực quốc tế." }
        ],
        correct: "B",
        explanation: "Hồ Chí Minh chủ trương phải giữ gìn và phát huy cốt cách văn hóa dân tộc; đồng thời mở rộng giao lưu, tiếp thu có chọn lọc những tinh hoa văn hóa của nhân loại."
      }
    ]
  },
  {
    id: 2,
    title: "MỐC 2: TƯ TƯỞNG HỒ CHÍ MINH VỀ ĐẠO ĐỨC",
    shortTitle: "Mốc 2: Đạo Đức",
    image: "images/dao_duc.jpg",
    puzzleTitle: "Mảnh Ghép Lịch Sử: Tấm Gương Đạo Đức Cách Mạng",
    puzzleDesc: "Đổi chỗ các mảnh ghép để hoàn thiện bức tranh đạo đức cách mạng và mở khóa Mốc 3!",
    startQNum: 6,
    questions: [
      {
        num: 6,
        question: "Hồ Chí Minh khẳng định vị trí của đạo đức đối với người cách mạng là:",
        options: [
          { key: "A", text: "Yếu tố sinh ra sau khi hoàn thành nhiệm vụ." },
          { key: "B", text: "Gốc, là nền tảng tinh thần của người cách mạng." },
          { key: "C", text: "Tài năng nổi bật nhất." },
          { key: "D", text: "Phương tiện hỗ trợ phụ trong công tác." }
        ],
        correct: "B",
        explanation: "Bác Hồ luôn nhấn mạnh: Đạo đức là gốc của người cách mạng, 'Cũng như sông thì có nguồn mới có nước, không có nguồn thì sông cạn. Cây phải có gốc, không có gốc thì cây héo'."
      },
      {
        num: 7,
        question: "Phẩm chất đạo đức bao trùm quan trọng nhất và chi phối các phẩm chất đạo đức khác trong tư tưởng Hồ Chí Minh là:",
        options: [
          { key: "A", text: "Cần, kiệm, liêm, chính." },
          { key: "B", text: "Trung với nước, hiếu với dân." },
          { key: "C", text: "Chí công vô tư." },
          { key: "D", text: "Tinh thần quốc tế trong sáng." }
        ],
        correct: "B",
        explanation: "'Trung với nước, hiếu với dân' là phẩm chất đạo đức bao trùm quan trọng nhất, chi phối và định hướng cho mọi phẩm chất đạo đức cách mạng khác."
      },
      {
        num: 8,
        question: "Các phẩm chất 'Cần, Kiệm, Liêm, Chính, Chí công vô tư' trong tư tưởng Hồ Chí Minh được xem là:",
        options: [
          { key: "A", text: "Nội dung cốt lõi của đạo đức cách mạng, gắn liền với hoạt động hằng ngày của mỗi người." },
          { key: "B", text: "Yêu cầu chỉ dành riêng cho cán bộ cấp cao." },
          { key: "C", text: "Khái niệm đạo đức cũ không còn tác dụng." },
          { key: "D", text: "Chuẩn mực chỉ áp dụng trong lĩnh vực kinh tế." }
        ],
        correct: "A",
        explanation: "'Cần, Kiệm, Liêm, Chính, Chí công vô tư' là nội dung cốt lõi của đạo đức cách mạng Việt Nam, gắn liền với nếp sống, tư cách và hành vi hàng ngày của mọi người."
      },
      {
        num: 9,
        question: "Nguyên tắc rèn luyện đạo đức nào dưới đây gắn liền với 'đạo làm gương' và câu nói 'Một tấm gương sống còn có giá trị hơn một trăm bài diễn văn tuyên truyền'?",
        options: [
          { key: "A", text: "Tu dưỡng đạo đức suốt đời." },
          { key: "B", text: "Xây đi đôi với chống." },
          { key: "C", text: "Nói đi đôi với làm, phải nêu gương về đạo đức." },
          { key: "D", text: "Tự phê bình và phê bình." }
        ],
        correct: "C",
        explanation: "Nguyên tắc 'Nói đi đôi với làm, phải nêu gương về đạo đức' đòi hỏi mỗi cán bộ đảng viên phải lấy hành động thực tế làm gương, nói được làm được, tránh nói suông."
      },
      {
        num: 10,
        question: "Hồ Chí Minh ví việc tự giác tu dưỡng đạo đức cách mạng hằng ngày giống như công việc gì?",
        options: [
          { key: "A", text: "Trồng cây gây rừng." },
          { key: "B", text: "Rửa mặt hằng ngày." },
          { key: "C", text: "Mài gươm luyện võ." },
          { key: "D", text: "Đi chợ hằng ngày." }
        ],
        correct: "B",
        explanation: "Hồ Chí Minh căn dặn: Đạo đức cách mạng phải thường xuyên rèn luyện, tu dưỡng bền bỉ hằng ngày giống như việc 'rửa mặt hằng ngày', ngày nào cũng phải chú ý giữ gìn cho trong sạch."
      }
    ]
  },
  {
    id: 3,
    title: "MỐC 3: TƯ TƯỞNG HỒ CHÍ MINH VỀ CON NGƯỜI",
    shortTitle: "Mốc 3: Con Người",
    image: "images/con_nguoi.jpg",
    puzzleTitle: "Mảnh Ghép Lịch Sử: Trọng Trách Trồng Người",
    puzzleDesc: "Đổi chỗ các mảnh ghép để hoàn thiện bức tranh cuối cùng và hoàn thành xuất sắc khóa ôn tập!",
    startQNum: 11,
    questions: [
      {
        num: 11,
        question: "Nét đặc trưng trong quan niệm của Hồ Chí Minh về con người là nhìn nhận con người:",
        options: [
          { key: "A", text: "Chung chung, trừu tượng." },
          { key: "B", text: "Mang tính lịch sử - cụ thể, gắn với các điều kiện và mối quan hệ xã hội cụ thể." },
          { key: "C", text: "Theo số phận định mệnh an bài." },
          { key: "D", text: "Thuần túy là sinh vật tự nhiên." }
        ],
        correct: "B",
        explanation: "Hồ Chí Minh luôn nhìn nhận con người mang tính lịch sử - cụ thể, trong mối quan hệ xã hội hiện thực, giai cấp, dân tộc và thời đại chứ không nhìn nhận chung chung trừu tượng."
      },
      {
        num: 12,
        question: "Trong tư tưởng Hồ Chí Minh, con người giữ vị trí như thế nào đối với sự nghiệp cách mạng?",
        options: [
          { key: "A", text: "Vừa là mục tiêu, vừa là động lực của cách mạng." },
          { key: "B", text: "Chỉ là công cụ thực hiện mục tiêu cách mạng." },
          { key: "C", text: "Là đối tượng thụ động của chính sách." },
          { key: "D", text: "Chỉ là phương tiện sản xuất vật chất." }
        ],
        correct: "A",
        explanation: "Con người vừa là mục tiêu cao nhất (mọi chủ trương, đường lối đều vì hạnh phúc của nhân dân), vừa là động lực quyết định thắng lợi của mọi giai đoạn cách mạng."
      },
      {
        num: 13,
        question: "Câu nói nổi tiếng của Hồ Chí Minh: 'Vì lợi ích mười năm thì phải trồng cây, vì lợi ích trăm năm thì phải trồng người' khẳng định điều gì?",
        options: [
          { key: "A", text: "Xây dựng con người là yêu cầu khách quan, có ý nghĩa chiến lược lâu dài." },
          { key: "B", text: "Tầm quan trọng của việc phát triển lâm nghiệp." },
          { key: "C", text: "Nhiệm vụ mở rộng diện tích trồng cây xanh." },
          { key: "D", text: "Việc quy hoạch đô thị ngắn hạn." }
        ],
        correct: "A",
        explanation: "Câu nói khẳng định 'trồng người' là sự nghiệp chiến lược cơ bản, lâu dài và có ý nghĩa quyết định đối với tương lai phát triển bền vững của đất nước."
      },
      {
        num: 14,
        question: "Theo Hồ Chí Minh, mục tiêu xây dựng con người mới xã hội chủ nghĩa là phát triển con người toàn diện:",
        options: [
          { key: "A", text: "Vừa 'hồng' vừa 'chuyên'." },
          { key: "B", text: "Giỏi lý luận hơn thực hành." },
          { key: "C", text: "Ưu tiên thể lực hơn trí lực." },
          { key: "D", text: "Chỉ tập trung vào kỹ năng chuyên môn." }
        ],
        correct: "A",
        explanation: "Con người mới xã hội chủ nghĩa phải phát triển toàn diện, có sự gắn kết hài hòa giữa đức và tài, tức là vừa 'hồng' (phẩm chất cách mạng) vừa 'chuyên' (năng lực chuyên môn giỏi)."
      },
      {
        num: 15,
        question: "Hồ Chí Minh nhấn mạnh yếu tố nào có vị trí rất quan trọng đối với việc hình thành tính nết 'hiền, dữ' của con người ('Hiền, dữ của con người không phải là tính sẵn. Phần nhiều do...')?",
        options: [
          { key: "A", text: "Tự nhiên." },
          { key: "B", text: "Giáo dục." },
          { key: "C", text: "Môi trường địa lý." },
          { key: "D", text: "Di truyền." }
        ],
        correct: "B",
        explanation: "Trong bài thơ 'Nửa đêm' (tập thơ Nhật ký trong tù), Bác viết: 'Hiền, dữ phải đâu là tính sẵn / Phần nhiều do giáo dục mà nên'."
      }
    ]
  }
];

// --- 2. SOUND SYSTEM (WEB AUDIO API) ---
class SoundSystem {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {}
  }

  playCorrect() {
    if (!this.enabled) return;
    this.init();
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.09;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.28);
      });
    } catch (e) {}
  }

  playWrong() {
    if (!this.enabled) return;
    this.init();
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc1.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.35);
      osc2.frequency.setValueAtTime(145, this.ctx.currentTime);
      osc2.frequency.linearRampToValueAtTime(95, this.ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);
      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.35);
      osc2.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }

  playTileSwap() {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {}
  }

  playMilestoneWin() {
    if (!this.enabled) return;
    this.init();
    try {
      const chords = [
        [523.25, 659.25, 783.99],          // C major
        [587.33, 739.99, 880.00],          // D major
        [659.25, 830.61, 987.77],          // E major
        [783.99, 987.77, 1174.66, 1567.98] // G chord with high G
      ];
      chords.forEach((chord, step) => {
        chord.forEach(freq => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = this.ctx.currentTime + step * 0.18;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.14, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.45);
        });
      });
    } catch (e) {}
  }

  playVictory() {
    if (!this.enabled) return;
    this.init();
    try {
      const fanfare = [
        { f: 523.25, d: 0.15, t: 0 },
        { f: 523.25, d: 0.15, t: 0.18 },
        { f: 523.25, d: 0.15, t: 0.36 },
        { f: 659.25, d: 0.35, t: 0.54 },
        { f: 783.99, d: 0.25, t: 0.90 },
        { f: 659.25, d: 0.18, t: 1.18 },
        { f: 783.99, d: 0.50, t: 1.38 },
        { f: 1046.50, d: 0.80, t: 1.90 }
      ];
      fanfare.forEach(item => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + item.t;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + item.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + item.d);
      });
    } catch (e) {}
  }
}

// --- 3. FIREWORKS & CONFETTI ENGINE ---
class FireworksEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.running = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(x, y, count = 50) {
    const colors = ['#f5c542', '#ffd700', '#ff4d4d', '#ff7878', '#22c55e', '#38bdf8', '#ffffff'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.particles.push({
        x: x || this.canvas.width / 2,
        y: y || this.canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: Math.random() * 3 + 2,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.012
      });
    }
    if (!this.running) {
      this.running = true;
      this.loop();
    }
  }

  triggerCelebration() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.burst(w * 0.3, h * 0.4, 40);
    this.burst(w * 0.7, h * 0.35, 40);
    setTimeout(() => this.burst(w * 0.5, h * 0.3, 50), 300);
    setTimeout(() => this.burst(w * 0.2, h * 0.5, 40), 600);
    setTimeout(() => this.burst(w * 0.8, h * 0.45, 40), 900);
  }

  loop() {
    if (!this.running) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.loop());
    } else {
      this.running = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// --- 4. MAIN GAME CONTROLLER ---
class GameApp {
  constructor() {
    this.sound = new SoundSystem();
    this.fireworks = new FireworksEngine(document.getElementById('fireworks-canvas'));
    // Socket.IO with custom server URL support (for Vercel frontend + Render backend)
    const params = new URLSearchParams(window.location.search);
    const customServer = params.get('server') || localStorage.getItem('hcm202_server_url') || '';
    if (typeof io !== 'undefined') {
      try {
        this.socket = customServer ? io(customServer) : io();
      } catch (e) {
        console.warn('Socket connection error:', e);
        this.socket = null;
      }
    } else {
      this.socket = null;
    }

    // Audience / Player state
    this.playerName = '';
    this.playerStartTime = null;
    this.playerTimerInterval = null;

    // Game state
    this.currentMilestoneIdx = 0; // 0, 1, 2
    this.currentQuestionIdx = 0;  // 0 to 4 within milestone
    this.currentStreak = 0;
    this.totalAttempts = 0;
    this.isAnswering = false;

    // Puzzle state
    this.puzzleBoardState = []; // array of 9 tile original indices [0..8]
    this.selectedTileIdx = null;
    this.draggedTileIdx = null;
    this.countdownTimer = null;

    // DOM Elements
    this.dom = {
      // Screens
      screenJoin: document.getElementById('screen-join'),
      screenWaiting: document.getElementById('screen-waiting'),
      screenQuiz: document.getElementById('screen-quiz'),
      screenPuzzle: document.getElementById('screen-puzzle'),
      screenVictory: document.getElementById('screen-victory'),

      // Header
      playerTimerDisplay: document.getElementById('player-timer-display'),
      btnSound: document.getElementById('btn-sound'),
      btnRule: document.getElementById('btn-rule'),
      stepNodes: [
        document.getElementById('step-node-1'),
        document.getElementById('step-node-2'),
        document.getElementById('step-node-3')
      ],
      connectors: [
        document.getElementById('connector-1'),
        document.getElementById('connector-2')
      ],

      // Screen Join
      formPlayerJoin: document.getElementById('form-player-join'),
      inputPlayerName: document.getElementById('input-player-name'),
      joinErrorBox: document.getElementById('join-error-box'),

      // Screen Waiting
      waitingPlayerName: document.getElementById('waiting-player-name'),
      waitingRoomCount: document.getElementById('waiting-room-count'),
      waitingStatusText: document.getElementById('waiting-status-text'),

      // Quiz
      quizMilestoneTag: document.getElementById('quiz-milestone-tag'),
      quizProgressText: document.getElementById('quiz-progress-text'),
      quizStreakBadge: document.getElementById('quiz-streak-badge'),
      quizProgressBar: document.getElementById('quiz-progress-bar'),
      questionNumberDisplay: document.getElementById('question-number-display'),
      questionText: document.getElementById('question-text'),
      optionsContainer: document.getElementById('options-container'),

      // Puzzle
      puzzleTitle: document.getElementById('puzzle-title'),
      puzzleInstruction: document.getElementById('puzzle-instruction'),
      puzzleBoard: document.getElementById('puzzle-board'),
      puzzleStatus: document.getElementById('puzzle-status'),
      puzzleMatchedCount: document.getElementById('puzzle-matched-count'),
      puzzleReferenceImg: document.getElementById('puzzle-reference-img'),
      puzzleSuccessModal: document.getElementById('puzzle-success-modal'),
      puzzleSuccessMsg: document.getElementById('puzzle-success-msg'),
      btnPuzzleContinue: document.getElementById('btn-puzzle-continue'),

      // Victory
      playerFinalRank: document.getElementById('player-final-rank'),
      playerFinalTime: document.getElementById('player-final-time'),
      finalTotalAttempts: document.getElementById('final-total-attempts'),
      btnReviewAll: document.getElementById('btn-review-all'),

      // Modals
      modalWrong: document.getElementById('modal-wrong'),
      modalCorrectText: document.getElementById('modal-correct-text'),
      modalExplanationText: document.getElementById('modal-explanation-text'),
      modalCountdownText: document.getElementById('modal-countdown-text'),
      modalCountdownFill: document.getElementById('modal-countdown-fill'),
      btnRetryNow: document.getElementById('btn-retry-now'),

      modalRule: document.getElementById('modal-rule'),
      btnCloseRule: document.getElementById('btn-close-rule'),
      btnCloseRuleOk: document.getElementById('btn-close-rule-ok'),

      modalReview: document.getElementById('modal-review'),
      btnCloseReview: document.getElementById('btn-close-review'),
      btnCloseReviewOk: document.getElementById('btn-close-review-ok'),
      reviewListContainer: document.getElementById('review-list-container')
    };

    this.bindEvents();
    this.populateReviewModal();
    this.initSocketEvents();
  }

  // --- SCREEN SWITCHING ---
  showScreen(screenElement) {
    [this.dom.screenJoin, this.dom.screenWaiting, this.dom.screenQuiz, this.dom.screenPuzzle, this.dom.screenVictory]
      .filter(Boolean)
      .forEach(s => s.classList.remove('active'));
    
    if (screenElement) {
      screenElement.classList.add('active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- STEPPER UPDATE ---
  updateStepper() {
    this.dom.stepNodes.forEach((node, idx) => {
      node.classList.remove('active', 'completed');
      if (idx < this.currentMilestoneIdx) {
        node.classList.add('completed');
      } else if (idx === this.currentMilestoneIdx) {
        node.classList.add('active');
      }
    });

    this.dom.connectors.forEach((conn, idx) => {
      conn.classList.remove('completed');
      if (idx < this.currentMilestoneIdx) {
        conn.classList.add('completed');
      }
    });
  }

  // --- STOPWATCH ---
  formatTime(ms) {
    if (!ms || ms < 0) return '00:00.0';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
  }

  startPlayerStopwatch(startTime) {
    this.playerStartTime = startTime || Date.now();
    if (this.playerTimerInterval) clearInterval(this.playerTimerInterval);

    this.playerTimerInterval = setInterval(() => {
      const elapsed = Date.now() - this.playerStartTime;
      this.dom.playerTimerDisplay.textContent = `⏱️ ${this.formatTime(elapsed)}`;
    }, 100);
  }

  stopPlayerStopwatch() {
    if (this.playerTimerInterval) {
      clearInterval(this.playerTimerInterval);
      this.playerTimerInterval = null;
    }
  }

  // --- EVENT BINDINGS ---
  bindEvents() {
    // Sound toggle
    this.dom.btnSound.addEventListener('click', () => {
      this.sound.enabled = !this.sound.enabled;
      this.dom.btnSound.innerHTML = this.sound.enabled 
        ? '<span class="icon-speaker">🔊</span>' 
        : '<span class="icon-speaker">🔇</span>';
      this.dom.btnSound.title = this.sound.enabled ? 'Tắt âm thanh' : 'Bật âm thanh';
    });

    // Rule modal
    this.dom.btnRule.addEventListener('click', () => {
      this.sound.playClick();
      this.dom.modalRule.classList.add('active');
    });
    this.dom.btnCloseRule.addEventListener('click', () => {
      this.dom.modalRule.classList.remove('active');
    });
    this.dom.btnCloseRuleOk.addEventListener('click', () => {
      this.dom.modalRule.classList.remove('active');
    });

    // Form Player Join Submit
    if (this.dom.formPlayerJoin) {
      this.dom.formPlayerJoin.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameVal = this.dom.inputPlayerName.value.trim();
        if (!nameVal) return;

        this.sound.playClick();
        this.dom.joinErrorBox.style.display = 'none';

        if (this.socket && this.socket.connected) {
          this.socket.emit('player_join', { name: nameVal });
        } else if (this.socket && !this.socket.disconnected) {
          // Socket is in progress of connecting, emit and set fallback timeout
          this.socket.emit('player_join', { name: nameVal });
          setTimeout(() => {
            if (!this.playerName && this.dom.screenJoin && this.dom.screenJoin.classList.contains('active')) {
              const goSolo = confirm('Không thể kết nối tới phòng thi đấu của Quản trò. Bạn có muốn bắt đầu ở chế độ Tự ôn tập cá nhân không?');
              if (goSolo) {
                this.playerName = nameVal;
                this.startPlayerStopwatch();
                this.startMilestone(0);
              }
            }
          }, 1500);
        } else {
          // Standalone / Offline mode directly
          this.playerName = nameVal;
          this.startPlayerStopwatch();
          this.startMilestone(0);
        }
      });
    }

    // Wrong answer retry button
    this.dom.btnRetryNow.addEventListener('click', () => {
      this.sound.playClick();
      this.handleRetryNow();
    });

    // Puzzle Continue
    this.dom.btnPuzzleContinue.addEventListener('click', () => {
      this.sound.playClick();
      this.dom.puzzleSuccessModal.classList.remove('show');
      this.handlePuzzleCompleteProceed();
    });

    // Victory actions
    this.dom.btnReviewAll.addEventListener('click', () => {
      this.sound.playClick();
      this.dom.modalReview.classList.add('active');
    });
    this.dom.btnCloseReview.addEventListener('click', () => {
      this.dom.modalReview.classList.remove('active');
    });
    this.dom.btnCloseReviewOk.addEventListener('click', () => {
      this.dom.modalReview.classList.remove('active');
    });
  }

  // --- SOCKET.IO EVENTS FOR AUDIENCE ---
  initSocketEvents() {
    if (!this.socket) return;

    // Join Success
    this.socket.on('join_success', (data) => {
      this.playerName = data.name;
      this.dom.waitingPlayerName.textContent = `Thí Sinh: ${data.name}`;
      this.dom.waitingRoomCount.textContent = data.playerCount || 1;
      this.showScreen(this.dom.screenWaiting);
      this.sound.playCorrect();
    });

    // Join Error (e.g. Room Locked after start)
    this.socket.on('join_error', (data) => {
      this.dom.joinErrorBox.textContent = `⚠️ ${data.message}`;
      this.dom.joinErrorBox.style.display = 'block';
      this.sound.playWrong();
    });

    // Room update (participant counter)
    this.socket.on('room_update', (data) => {
      if (this.dom.waitingRoomCount) {
        this.dom.waitingRoomCount.textContent = data.playerCount || 0;
      }
    });

    // Game Started by Admin!
    this.socket.on('game_started', (data) => {
      this.sound.playMilestoneWin();
      this.fireworks.triggerCelebration();

      // Start player stopwatch
      this.startPlayerStopwatch(data.startTime);

      // Begin Mốc 1 (Câu 1)
      this.startMilestone(0);
    });

    // Player finished acknowledgement & official rank
    this.socket.on('player_finished_ack', (data) => {
      const medal = data.rank === 1 ? '🥇 QUÁN QUÂN' : (data.rank === 2 ? '🥈 Á QUÂN' : (data.rank === 3 ? '🥉 QUÝ QUÂN' : ''));
      this.dom.playerFinalRank.textContent = `HẠNG #${data.rank} ${medal}`;
      this.dom.playerFinalTime.textContent = `Thời Gian Hoàn Thành: ${data.finishTimeFormatted}`;
    });

    // Game reset by Admin
    this.socket.on('game_reset', (data) => {
      this.stopPlayerStopwatch();
      this.currentMilestoneIdx = 0;
      this.currentQuestionIdx = 0;
      this.currentStreak = 0;
      this.totalAttempts = 0;
      this.dom.playerTimerDisplay.textContent = '⏱️ 00:00.0';
      this.updateStepper();
      this.dom.joinErrorBox.style.display = 'none';
      this.showScreen(this.dom.screenJoin);
      alert(data.message || 'Trận đấu đã được quản trị viên đặt lại.');
    });

    // Player kicked by Admin
    this.socket.on('player_kicked', (data) => {
      alert(data.message || 'Bạn đã bị mời ra khỏi phòng.');
      this.showScreen(this.dom.screenJoin);
    });
  }

  // --- PROGRESS NOTIFICATION TO SERVER ---
  sendProgress(step) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('player_progress', {
        milestone: this.currentMilestoneIdx + 1,
        question: this.currentQuestionIdx + 1,
        step: step || 'quiz',
        attempts: this.totalAttempts
      });
    }
  }

  // --- QUIZ LOGIC ---
  startMilestone(milestoneIdx) {
    this.currentMilestoneIdx = milestoneIdx;
    this.currentQuestionIdx = 0;
    this.updateStepper();
    this.showScreen(this.dom.screenQuiz);
    this.renderQuestion();
  }

  renderQuestion() {
    const milestone = GAME_DATA[this.currentMilestoneIdx];
    const qData = milestone.questions[this.currentQuestionIdx];

    this.isAnswering = false;
    this.dom.quizMilestoneTag.textContent = milestone.title;
    this.dom.quizProgressText.textContent = `Câu hỏi ${this.currentQuestionIdx + 1} / ${milestone.questions.length}`;
    this.dom.quizStreakBadge.textContent = `🔥 Chuỗi đúng: ${this.currentStreak}`;
    
    // Progress bar width
    const progressPercent = ((this.currentQuestionIdx + 1) / milestone.questions.length) * 100;
    this.dom.quizProgressBar.style.width = `${progressPercent}%`;

    this.dom.questionNumberDisplay.textContent = `CÂU ${qData.num}`;
    this.dom.questionText.textContent = qData.question;

    // Send live progress to Admin
    this.sendProgress('quiz');

    // Render options
    this.dom.optionsContainer.innerHTML = '';
    qData.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `
        <span class="option-key">${opt.key}</span>
        <span class="option-text">${opt.text}</span>
      `;
      btn.addEventListener('click', () => this.handleOptionSelect(opt.key, btn, qData));
      this.dom.optionsContainer.appendChild(btn);
    });
  }

  handleOptionSelect(selectedKey, clickedBtn, qData) {
    if (this.isAnswering) return;
    this.isAnswering = true;
    this.totalAttempts++;

    const allBtns = this.dom.optionsContainer.querySelectorAll('.option-btn');
    allBtns.forEach(btn => btn.classList.add('disabled'));

    if (selectedKey === qData.correct) {
      // CORRECT ANSWER
      clickedBtn.classList.add('correct');
      this.sound.playCorrect();
      this.currentStreak++;
      this.dom.quizStreakBadge.textContent = `🔥 Chuỗi đúng: ${this.currentStreak}`;

      setTimeout(() => {
        const milestone = GAME_DATA[this.currentMilestoneIdx];
        if (this.currentQuestionIdx + 1 < milestone.questions.length) {
          this.currentQuestionIdx++;
          this.renderQuestion();
        } else {
          // Finished all 5 questions of this milestone!
          this.sound.playMilestoneWin();
          this.fireworks.triggerCelebration();
          setTimeout(() => {
            this.startPuzzleMode();
          }, 800);
        }
      }, 900);
    } else {
      // WRONG ANSWER
      clickedBtn.classList.add('wrong');
      allBtns.forEach(btn => {
        const key = btn.querySelector('.option-key').textContent.trim();
        if (key === qData.correct) {
          btn.classList.add('correct');
        }
      });
      this.sound.playWrong();
      this.currentStreak = 0;

      setTimeout(() => {
        this.showWrongModal(qData);
      }, 700);
    }
  }

  showWrongModal(qData) {
    const correctOpt = qData.options.find(o => o.key === qData.correct);
    this.dom.modalCorrectText.textContent = `${correctOpt.key}. ${correctOpt.text}`;
    this.dom.modalExplanationText.textContent = qData.explanation;

    const startNum = GAME_DATA[this.currentMilestoneIdx].startQNum;
    this.dom.modalCountdownText.textContent = `Tự động quay lại câu số ${startNum} sau 3 giây...`;

    this.dom.modalCountdownFill.style.transition = 'none';
    this.dom.modalCountdownFill.style.width = '100%';
    void this.dom.modalCountdownFill.offsetWidth;
    this.dom.modalCountdownFill.style.transition = 'width 3s linear';
    this.dom.modalCountdownFill.style.width = '0%';

    this.dom.modalWrong.classList.add('active');

    let secondsLeft = 3;
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    this.countdownTimer = setInterval(() => {
      secondsLeft--;
      if (secondsLeft > 0) {
        this.dom.modalCountdownText.textContent = `Tự động quay lại câu số ${startNum} sau ${secondsLeft} giây...`;
      } else {
        clearInterval(this.countdownTimer);
        this.handleRetryNow();
      }
    }, 1000);
  }

  handleRetryNow() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    this.dom.modalWrong.classList.remove('active');
    this.currentQuestionIdx = 0;
    this.currentStreak = 0;
    this.renderQuestion();
  }

  // --- PUZZLE LOGIC (3x3 TILES) ---
  startPuzzleMode() {
    const milestone = GAME_DATA[this.currentMilestoneIdx];
    this.showScreen(this.dom.screenPuzzle);

    this.dom.puzzleTitle.textContent = milestone.puzzleTitle;
    this.dom.puzzleInstruction.textContent = milestone.puzzleDesc;
    this.dom.puzzleReferenceImg.src = milestone.image;

    // Send live progress to Admin
    this.sendProgress('puzzle');

    const img = new Image();
    img.onload = () => {
      this.dom.puzzleBoard.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
      this.initPuzzleTiles();
    };
    img.src = milestone.image;
  }

  initPuzzleTiles() {
    this.shufflePuzzleBoard();
  }

  shufflePuzzleBoard() {
    this.selectedTileIdx = null;
    const pieces = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    let shuffled;
    do {
      shuffled = [...pieces];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    } while (shuffled.filter((val, idx) => val === idx).length > 3);

    this.puzzleBoardState = shuffled;
    this.renderPuzzleBoard();
  }

  renderPuzzleBoard() {
    const milestone = GAME_DATA[this.currentMilestoneIdx];
    this.dom.puzzleBoard.innerHTML = '';

    let matchedCount = 0;

    this.puzzleBoardState.forEach((pieceIdx, slotIdx) => {
      const tile = document.createElement('div');
      tile.className = 'puzzle-tile';
      tile.dataset.slot = slotIdx;
      tile.dataset.piece = pieceIdx;
      tile.draggable = true;

      const col = pieceIdx % 3;
      const row = Math.floor(pieceIdx / 3);
      const bgX = col * 50;
      const bgY = row * 50;

      tile.style.backgroundImage = `url('${milestone.image}')`;
      tile.style.backgroundSize = '300% 300%';
      tile.style.backgroundPosition = `${bgX}% ${bgY}%`;

      const isMatched = pieceIdx === slotIdx;
      if (isMatched) {
        tile.classList.add('matched');
        matchedCount++;
      }

      if (this.selectedTileIdx === slotIdx) {
        tile.classList.add('selected');
      }

      // Click to Swap interaction
      tile.addEventListener('click', () => this.handleTileClick(slotIdx));

      // HTML5 Drag & Drop interaction
      tile.addEventListener('dragstart', (e) => {
        this.draggedTileIdx = slotIdx;
        e.dataTransfer.setData('text/plain', slotIdx);
        tile.style.opacity = '0.5';
      });

      tile.addEventListener('dragend', () => {
        tile.style.opacity = '1';
        this.draggedTileIdx = null;
      });

      tile.addEventListener('dragover', (e) => {
        e.preventDefault();
      });

      tile.addEventListener('drop', (e) => {
        e.preventDefault();
        const fromSlot = parseInt(e.dataTransfer.getData('text/plain'), 10);
        const toSlot = slotIdx;
        if (!isNaN(fromSlot) && fromSlot !== toSlot) {
          this.swapTiles(fromSlot, toSlot);
        }
      });

      this.dom.puzzleBoard.appendChild(tile);
    });

    this.dom.puzzleMatchedCount.textContent = `${matchedCount} / 9 mảnh đúng vị trí`;
    this.checkPuzzleCompletion();
  }

  handleTileClick(slotIdx) {
    if (this.selectedTileIdx === null) {
      this.selectedTileIdx = slotIdx;
      this.sound.playClick();
      this.renderPuzzleBoard();
    } else if (this.selectedTileIdx === slotIdx) {
      this.selectedTileIdx = null;
      this.sound.playClick();
      this.renderPuzzleBoard();
    } else {
      const firstSlot = this.selectedTileIdx;
      this.selectedTileIdx = null;
      this.swapTiles(firstSlot, slotIdx);
    }
  }

  swapTiles(slotA, slotB) {
    const temp = this.puzzleBoardState[slotA];
    this.puzzleBoardState[slotA] = this.puzzleBoardState[slotB];
    this.puzzleBoardState[slotB] = temp;

    this.sound.playTileSwap();
    this.renderPuzzleBoard();
  }

  checkPuzzleCompletion() {
    const isComplete = this.puzzleBoardState.every((val, idx) => val === idx);
    if (isComplete) {
      this.sound.playMilestoneWin();
      this.fireworks.triggerCelebration();

      const milestone = GAME_DATA[this.currentMilestoneIdx];
      if (this.currentMilestoneIdx < 2) {
        this.dom.puzzleSuccessMsg.textContent = `Bạn đã ghép thành công bức tranh ${milestone.shortTitle}! Hãy sẵn sàng bước sang ${GAME_DATA[this.currentMilestoneIdx + 1].shortTitle}.`;
        this.dom.btnPuzzleContinue.innerHTML = `
          <span>BƯỚC SANG ${GAME_DATA[this.currentMilestoneIdx + 1].shortTitle.toUpperCase()}</span>
          <span class="btn-arrow">➔</span>
        `;
      } else {
        this.dom.puzzleSuccessMsg.textContent = `Bạn đã hoàn thành trọn vẹn cả 3 mảnh ghép lịch sử! Nhấp vào nút bên dưới để xem thành tích vinh danh.`;
        this.dom.btnPuzzleContinue.innerHTML = `
          <span>XEM BẢNG VINH DANH CHIẾN THẮNG</span>
          <span class="btn-arrow">🏆</span>
        `;
      }

      setTimeout(() => {
        this.dom.puzzleSuccessModal.classList.add('show');
      }, 600);
    }
  }

  handlePuzzleCompleteProceed() {
    if (this.currentMilestoneIdx < 2) {
      this.startMilestone(this.currentMilestoneIdx + 1);
    } else {
      this.showVictoryScreen();
    }
  }

  // --- VICTORY SCREEN ---
  showVictoryScreen() {
    this.stopPlayerStopwatch();
    this.sound.playVictory();
    this.fireworks.triggerCelebration();
    setTimeout(() => this.fireworks.triggerCelebration(), 800);

    this.dom.finalTotalAttempts.textContent = this.totalAttempts;

    // Send finish event to Server
    if (this.socket && this.socket.connected) {
      this.socket.emit('player_finish', {
        attempts: this.totalAttempts
      });
    } else {
      const elapsed = Date.now() - (this.playerStartTime || Date.now());
      this.dom.playerFinalRank.textContent = 'HOÀN THÀNH XUẤT SẮC 🌟';
      this.dom.playerFinalTime.textContent = `Thời Gian Hoàn Thành: ${this.formatTime(elapsed)}`;
    }

    this.showScreen(this.dom.screenVictory);
  }

  // --- REVIEW MODAL ---
  populateReviewModal() {
    this.dom.reviewListContainer.innerHTML = '';
    GAME_DATA.forEach(milestone => {
      milestone.questions.forEach(q => {
        const item = document.createElement('div');
        item.className = 'review-item';
        const correctOpt = q.options.find(o => o.key === q.correct);
        item.innerHTML = `
          <div class="review-q-title"><strong>Câu ${q.num}:</strong> ${q.question}</div>
          <div class="review-correct-ans">✓ Đáp án đúng: [${correctOpt.key}] ${correctOpt.text}</div>
          <div class="review-exp">💡 <em>${q.explanation}</em></div>
        `;
        this.dom.reviewListContainer.appendChild(item);
      });
    });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.gameApp = new GameApp();
});
