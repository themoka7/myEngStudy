/* 아빠 영어 — 뉴스/아티클 산출 훈련
 * 설계 원칙
 *  1) 인풋이 아니라 산출. 모든 문항은 한글 → 영어 타이핑이 기본.
 *  2) 숙어는 쪼개지 않는다. 문장째로 넣고 문장째로 꺼낸다.
 *  3) 긴 문장은 짧은 결정 네 번. 확장 드릴로 그 감각을 만든다.
 *  4) 3분 안에 끝난다. 틈틈이 여러 번이 몰아서 한 번을 이긴다.
 */
(function () {
  'use strict';

  var KEY = 'myeng.dad.v1';
  var INTERVALS = [1, 2, 4, 8, 16];            // box 1~5 → 며칠 뒤 다시
  var COST = { chunk: 1, pp: 2, expand: 3, read: 2 };
  var BUDGET = { 3: 6, 7: 14, 15: 30 };

  // ── 저장소 ────────────────────────────────
  var S = load();

  function today() {
    var d = new Date(), z = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
  }
  function addDays(days) {
    var d = new Date(); d.setDate(d.getDate() + days);
    var z = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
  }
  function load() {
    var base = { version: 1, cards: {}, log: {}, streak: 0, lastDay: null };
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return base;
      var o = JSON.parse(raw);
      return {
        version: 1,
        cards: o.cards || {},
        log: o.log || {},
        streak: o.streak || 0,
        lastDay: o.lastDay || null
      };
    } catch (e) { return base; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* 시크릿 모드 등 */ }
  }

  // ── 카드 목록 ─────────────────────────────
  function allCards() {
    var D = window.DATA || {}, out = [];
    (D.chunks || []).forEach(function (d) { out.push({ id: d.id, type: 'chunk', data: d }); });
    (D.expand || []).forEach(function (d) { out.push({ id: d.id, type: 'expand', data: d }); });
    (D.pp || []).forEach(function (d) { out.push({ id: d.id, type: 'pp', data: d }); });
    (D.read || []).forEach(function (d) { out.push({ id: d.id, type: 'read', data: d }); });
    return out;
  }
  function isDue(id) {
    var st = S.cards[id];
    return !st || !st.due || st.due <= today();
  }
  function isNew(id) { return !S.cards[id]; }

  // ── 세션 구성 ─────────────────────────────
  function buildSession(minutes) {
    var budget = BUDGET[minutes] || 6;
    var cards = allCards();
    var due = [], fresh = [];
    cards.forEach(function (c) {
      if (isNew(c.id)) fresh.push(c);
      else if (isDue(c.id)) due.push(c);
    });
    // 복습은 밀린 순(due 오래된 순), 신규는 데이터 순서 유지
    due.sort(function (a, b) {
      var x = S.cards[a.id].due || '', y = S.cards[b.id].due || '';
      return x < y ? -1 : x > y ? 1 : 0;
    });
    shuffleWithinDay(due);

    var picked = [], spent = 0;
    function take(list) {
      for (var i = 0; i < list.length; i++) {
        var c = list[i], cost = COST[c.type] || 1;
        if (spent + cost > budget) continue;
        picked.push(c); spent += cost;
        if (spent >= budget) return;
      }
    }
    take(due);
    if (spent < budget) take(interleave(fresh));
    return picked;
  }

  // 신규 카드를 데이터 순서대로 주면 청크만 40장 내리 나온다.
  // 타입별로 고르게 흩어 놓아 한 세션 안에 네 종류가 섞이게 한다.
  function interleave(list) {
    var by = {}, order = ['chunk', 'expand', 'pp', 'read'], picks = [];
    order.forEach(function (t) { by[t] = []; });
    list.forEach(function (c) { (by[c.type] || (by[c.type] = [])).push(c); });
    order.forEach(function (t) {
      var arr = by[t] || [], n = arr.length;
      if (!n) return;
      var step = list.length / n;
      arr.forEach(function (c, i) { picks.push({ pos: (i + 0.5) * step, c: c }); });
    });
    picks.sort(function (a, b) { return a.pos - b.pos; });
    return picks.map(function (p) { return p.c; });
  }
  function shuffleWithinDay(arr) {
    // 같은 due끼리만 섞어서 밀린 순서는 지키되 매번 같은 순서로 나오지 않게
    var i = 0;
    while (i < arr.length) {
      var j = i;
      while (j < arr.length && (S.cards[arr[j].id].due || '') === (S.cards[arr[i].id].due || '')) j++;
      for (var k = j - 1; k > i; k--) {
        var r = i + Math.floor(Math.random() * (k - i + 1));
        var t = arr[k]; arr[k] = arr[r]; arr[r] = t;
      }
      i = j;
    }
  }

  function grade(id, correct) {
    var st = S.cards[id] || { box: 0, seen: 0, wrong: 0 };
    st.seen = (st.seen || 0) + 1;
    if (correct) st.box = Math.min(5, (st.box || 0) + 1);
    else { st.box = Math.max(1, (st.box || 1) - 1); st.wrong = (st.wrong || 0) + 1; }
    st.due = addDays(INTERVALS[st.box - 1]);
    S.cards[id] = st;
  }

  function logDay(n, ok) {
    var d = today();
    if (!S.log[d]) S.log[d] = { cards: 0, correct: 0 };
    S.log[d].cards += n;
    S.log[d].correct += ok;
    if (S.lastDay !== d) {
      S.streak = (S.lastDay === addDaysFrom(d, -1)) ? S.streak + 1 : 1;
      S.lastDay = d;
    }
    save();
  }
  function addDaysFrom(dstr, delta) {
    var p = dstr.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]);
    d.setDate(d.getDate() + delta);
    var z = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
  }

  // ── 채점 ──────────────────────────────────
  function norm(s) {
    return String(s || '')
      .replace(/[‘’‛]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[–—]/g, '-')
      .toLowerCase()
      .replace(/[-\/]/g, ' ')
      .replace(/[.,;:!?"()\[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function tokens(s) { return norm(s).split(' ').filter(Boolean); }

  function levenshtein(a, b) {
    if (a === b) return 0;
    var m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    var prev = new Array(n + 1), cur = new Array(n + 1), i, j;
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
      cur[0] = i;
      for (j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      var t = prev; prev = cur; cur = t;
    }
    return prev[n];
  }

  // 오타로 봐줄 만한 차이인가.
  // rose/rise 처럼 같은 길이의 한 글자 치환은 시제 차이일 수 있으므로 절대 봐주지 않는다.
  function typoLike(a, b) {
    var la = a.length, lb = b.length;
    if (Math.abs(la - lb) === 1 && Math.min(la, lb) >= 4 && levenshtein(a, b) === 1) return true;
    if (la === lb && la >= 4) {                      // 인접 두 글자 뒤바뀜 (teh ↔ the)
      for (var i = 0; i < la - 1; i++) {
        if (a[i] === b[i]) continue;
        return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2);
      }
    }
    return false;
  }

  // 'ok' 정확 / 'near' 오타 수준(정답 인정) / 'bad' 오답
  function check(input, answer) {
    var A = tokens(input), B = tokens(answer);
    if (!A.length) return 'bad';
    if (A.join(' ') === B.join(' ')) return 'ok';
    if (A.length !== B.length) return 'bad';          // 단어를 빼먹거나 더한 건 오답
    var wrong = -1;
    for (var i = 0; i < A.length; i++) {
      if (A[i] === B[i]) continue;
      if (wrong >= 0) return 'bad';                   // 두 군데 이상 다르면 오답
      wrong = i;
    }
    return typoLike(A[wrong], B[wrong]) ? 'near' : 'bad';
  }

  // 정답 문장에서 사용자가 못 맞춘 단어를 표시 (LCS 기반)
  // 'data-driven' 처럼 한 단어가 정규화 후 두 토큰이 되는 경우가 있어,
  // 원문 단어 → 정규화 토큰 목록의 대응을 들고 비교한다.
  function diffHtml(input, answer) {
    var A = tokens(input);
    var words = answer.split(/\s+/).filter(Boolean);
    var flat = [], owner = [];
    words.forEach(function (w, k) {
      tokens(w).forEach(function (t) { flat.push(t); owner.push(k); });
    });
    var m = A.length, n = flat.length, i, j;
    var dp = [];
    for (i = 0; i <= m; i++) dp.push(new Array(n + 1).fill(0));
    for (i = 1; i <= m; i++)
      for (j = 1; j <= n; j++)
        dp[i][j] = A[i - 1] === flat[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    var hit = new Array(n).fill(false);
    i = m; j = n;
    while (i > 0 && j > 0) {
      if (A[i - 1] === flat[j - 1]) { hit[j - 1] = true; i--; j--; }
      else if (dp[i - 1][j] >= dp[i][j - 1]) i--; else j--;
    }
    var wordHit = words.map(function () { return null; });   // null = 대응 토큰 없음
    for (j = 0; j < n; j++) {
      var k = owner[j];
      wordHit[k] = wordHit[k] === null ? hit[j] : (wordHit[k] && hit[j]);
    }
    return words.map(function (w, k) {
      var cls = (wordHit[k] === false) ? 'miss' : 'hit';
      return '<span class="' + cls + '">' + esc(w) + '</span>';
    }).join(' ');
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ── DOM ───────────────────────────────────
  var $ = function (sel) { return document.querySelector(sel); };
  var viewHome = $('#view-home'), viewSession = $('#view-session'), viewResult = $('#view-result');

  function show(v) {
    [viewHome, viewSession, viewResult].forEach(function (el) { el.classList.add('hidden'); });
    v.classList.remove('hidden');
    window.scrollTo(0, 0);
  }

  function renderHome() {
    var cards = allCards();
    var dueN = 0, newN = 0, learned = 0;
    cards.forEach(function (c) {
      if (isNew(c.id)) newN++;
      else { if (isDue(c.id)) dueN++; if ((S.cards[c.id].box || 0) >= 4) learned++; }
    });
    $('#stat-due').textContent = dueN;
    $('#stat-new').textContent = newN;
    $('#stat-learned').textContent = learned;
    $('#stat-streak').textContent = S.streak || 0;
    var t = S.log[today()];
    $('#today-line').textContent = t
      ? '오늘 ' + t.cards + '문항 · 정답 ' + t.correct + '개'
      : '오늘은 아직 시작 전입니다.';
    show(viewHome);
  }

  // ── 세션 실행 ─────────────────────────────
  var run = null;

  function startSession(minutes) {
    var queue = buildSession(minutes);
    if (!queue.length) {
      alert('지금 풀 카드가 없습니다. 복습 일정이 돌아오면 다시 열어 주세요.');
      return;
    }
    run = {
      queue: queue, idx: 0, total: queue.length,
      done: 0, ok: 0, misses: [], retried: {}
    };
    show(viewSession);
    nextCard();
  }

  function nextCard() {
    if (run.idx >= run.queue.length) return finish();
    var card = run.queue[run.idx];
    $('#progress-bar').style.width = Math.round(run.idx / run.queue.length * 100) + '%';
    $('#counter').textContent = (run.idx + 1) + ' / ' + run.queue.length;
    var host = $('#card-host');
    host.innerHTML = '';
    var render = { chunk: renderChunk, expand: renderExpand, pp: renderPP, read: renderRead }[card.type];
    render(host, card);
  }

  // 카드 하나를 끝냄. correct=false면 이번 세션 안에서 한 번 더 만난다.
  function finishCard(card, correct) {
    if (!run.retried[card.id]) {
      grade(card.id, correct);
      run.done++;
      if (correct) run.ok++; else run.misses.push(card);
      save();
    }
    if (!correct && !run.retried[card.id]) {
      run.retried[card.id] = true;
      run.queue.push(card);       // 같은 세션 끝에 재출제
    }
    run.idx++;
    nextCard();
  }

  function finish() {
    $('#progress-bar').style.width = '100%';
    logDay(run.done, run.ok);
    var pct = run.done ? Math.round(run.ok / run.done * 100) : 0;
    $('#result-big').textContent = run.ok + ' / ' + run.done;
    $('#result-sub').textContent = '정답률 ' + pct + '% · 오늘 누적 ' + (S.log[today()] ? S.log[today()].cards : 0) + '문항';
    var box = $('#result-review');
    if (!run.misses.length) {
      box.innerHTML = '<div class="foot">틀린 문항이 없습니다. 내일 복습 일정에 다시 올라옵니다.</div>';
    } else {
      box.innerHTML = '<h2>다시 볼 것</h2>' + run.misses.map(function (c) {
        var q, a;
        if (c.type === 'chunk') { q = c.data.chunk + ' — ' + c.data.gloss; a = c.data.en; }
        else if (c.type === 'expand') { q = c.data.topic + ' (확장)'; a = c.data.steps[c.data.steps.length - 1].en; }
        else if (c.type === 'pp') { q = c.data.verb.join(' - '); a = c.data.slots[0].en; }
        else { q = c.data.topic + ' (청킹)'; a = c.data.whole; }
        return '<div class="review-item"><div class="q">' + esc(q) + '</div><div class="a">' + esc(a) + '</div></div>';
      }).join('');
    }
    show(viewResult);
  }

  // ── 타입별 화면 ───────────────────────────
  // 공통: 한글 프롬프트 + 입력 + 채점
  function typingBlock(host, opts) {
    // opts: { tag, tagClass, above(html), ko, hint(html), answer, tip, onDone(correct) }
    var wrap = document.createElement('div');
    wrap.className = 'card';
    wrap.innerHTML =
      '<span class="tag ' + (opts.tagClass || '') + '">' + esc(opts.tag) + '</span>' +
      (opts.above || '') +
      '<div class="prompt-ko">' + esc(opts.ko) + '</div>' +
      (opts.hint ? '<div class="hint">' + opts.hint + '</div>' : '') +
      '<textarea class="answer" rows="2" spellcheck="false" autocapitalize="off" ' +
      'placeholder="영어로 입력 후 Enter"></textarea>' +
      '<div class="feedback"></div>' +
      '<div class="row end" style="margin-top:12px">' +
      '<button class="btn ghost sm" data-act="reveal">모르겠음</button>' +
      '<button class="btn sm" data-act="submit">확인</button>' +
      '</div>';
    host.appendChild(wrap);

    var ta = wrap.querySelector('textarea');
    var fb = wrap.querySelector('.feedback');
    var btnRow = wrap.querySelector('.row');
    var settled = false, settledAt = 0;
    ta.focus();

    function settle(verdict) {
      if (settled) return;
      settled = true; settledAt = Date.now();
      var correct = verdict === 'ok' || verdict === 'near';
      ta.disabled = true;
      var head = verdict === 'ok' ? '정확합니다'
        : verdict === 'near' ? '오타 수준 — 정답 처리했습니다'
          : '다시 보겠습니다';
      fb.innerHTML =
        '<div class="verdict ' + (verdict === 'ok' ? 'ok' : verdict === 'near' ? 'near' : 'bad') + '">' +
        '<div class="head">' + head + '</div>' +
        '<div class="answer-line">' + diffHtml(ta.value, opts.answer) + '</div>' +
        '</div>' +
        (opts.tip ? '<div class="tip">' + esc(opts.tip) + '</div>' : '');
      btnRow.innerHTML = '<span class="foot" style="margin:0">Enter 로 다음</span>' +
        '<div class="spacer"></div><button class="btn sm" data-act="next">다음</button>';
      btnRow.querySelector('[data-act="next"]').focus();
      opts.onSettled && opts.onSettled(correct);
    }

    wrap.addEventListener('click', function (e) {
      var act = e.target.getAttribute && e.target.getAttribute('data-act');
      if (act === 'submit') settle(check(ta.value, opts.answer));
      else if (act === 'reveal') { ta.value = ''; settle('bad'); }
      else if (act === 'next') opts.onNext();
    });
    wrap.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
      e.preventDefault();
      if (!settled) settle(check(ta.value, opts.answer));
      else if (Date.now() - settledAt > 350) opts.onNext();   // 연타로 정답을 지나치지 않게
    });
  }

  function renderSingle(host, card, opts) {
    var correct = true;
    typingBlock(host, {
      tag: opts.tag, tagClass: opts.tagClass, above: opts.above,
      ko: opts.ko, hint: opts.hint, answer: opts.answer, tip: opts.tip,
      onSettled: function (c) { correct = c; },
      onNext: function () { finishCard(card, correct); }
    });
  }
  function renderChunk(host, card) {
    var d = card.data;
    renderSingle(host, card, {
      tag: '청크',
      ko: d.ko,
      hint: '이 덩어리를 쓸 것: <b>' + esc(d.chunk) + '</b> <span style="color:var(--text-faint)">— ' + esc(d.gloss) + '</span>',
      answer: d.en,
      tip: d.tip
    });
  }

  // 여러 문항을 순차로 푸는 카드(확장/과거분사)
  function renderSteps(host, card, cfg) {
    // cfg: { tag, tagClass, steps:[{ko, answer, above, hint, tip}], onAllDone }
    var i = 0, allOk = true;
    function step() {
      host.innerHTML = '';
      var s = cfg.steps[i];
      var correct = true;
      typingBlock(host, {
        tag: cfg.tag + ' ' + (i + 1) + '/' + cfg.steps.length, tagClass: cfg.tagClass,
        above: s.above || '', ko: s.ko, hint: s.hint, answer: s.answer, tip: s.tip,
        onSettled: function (c) { correct = c; if (!c) allOk = false; },
        onNext: function () {
          i++;
          if (i < cfg.steps.length) step();
          else finishCard(card, allOk);
        }
      });
    }
    step();
  }

  function renderExpand(host, card) {
    var d = card.data;
    var steps = d.steps.map(function (st, k) {
      var ladder = '<ul class="ladder">' + d.steps.map(function (x, n) {
        var cls = n < k ? 'done' : (n === k ? 'cur' : '');
        var body = n < k ? esc(x.en) : (n === k ? '— 지금 단계 —' : '·');
        return '<li class="' + cls + '" data-n="' + (n + 1) + '">' + body + '</li>';
      }).join('') + '</ul>';
      return {
        above: '<div style="margin-top:12px;font-size:13px;color:var(--text-faint)">' + esc(d.topic) + '</div>' +
          ladder + '<div class="add-note">＋ ' + esc(st.add) + '</div>',
        ko: st.ko,
        answer: st.en,
        tip: k === d.steps.length - 1 ? '뼈대에서 네 번 만에 여기까지 왔다. 긴 문장은 외우는 게 아니라 이렇게 쌓는 것이다.' : ''
      };
    });
    renderSteps(host, card, { tag: '확장', tagClass: 'ex', steps: steps });
  }

  function renderPP(host, card) {
    var d = card.data;
    var head = '<div style="margin-top:12px" class="hint">' +
      '<b class="mono">' + esc(d.verb[0]) + ' – ' + esc(d.verb[1]) + ' – ' + esc(d.verb[2]) + '</b>' +
      ' <span style="color:var(--text-faint)">' + esc(d.meaning) + '</span></div>';
    var slotTip = {
      '수동': 'be + p.p. — 뉴스 문장의 절반은 여기다.',
      '완료': 'have/has/had + p.p. — 시점이 아니라 "지금까지"를 말한다.',
      '수식': 'p.p. 가 명사를 꾸민다. 앞에서 꾸미면 한 단어, 뒤에서 꾸미면 덩어리.'
    };
    var steps = d.slots.map(function (sl) {
      return {
        above: head + '<div class="add-note" style="margin-top:6px">슬롯: ' + esc(sl.type) + '</div>',
        ko: sl.ko,
        answer: sl.en,
        tip: slotTip[sl.type] || ''
      };
    });
    renderSteps(host, card, { tag: '분사', tagClass: 'pp', steps: steps });
  }

  function renderRead(host, card) {
    var d = card.data, shown = 0;
    var wrap = document.createElement('div');
    wrap.className = 'card';
    host.appendChild(wrap);

    function draw() {
      var lines = d.chunks.map(function (c, k) {
        var pending = k >= shown;
        return '<div class="chunkline' + (pending ? ' pending' : '') + '">' +
          '<div class="en">' + esc(c.en) + '</div>' +
          (pending ? '' : '<div class="ko">' + esc(c.ko) + '</div>') +
          '</div>';
      }).join('');
      var finished = shown >= d.chunks.length;
      wrap.innerHTML =
        '<span class="tag rd">청킹 리딩</span>' +
        '<div style="margin-top:12px;font-size:13px;color:var(--text-faint)">' + esc(d.topic) +
        ' · 왼쪽에서 오른쪽으로 한 방향. 되돌아가지 않는다.</div>' +
        '<div style="margin-top:10px">' + lines + '</div>' +
        (finished
          ? '<div class="whole">' + esc(d.whole) + '</div>' +
            '<div class="tip">' + esc(d.focus) + '</div>' +
            '<div class="row end" style="margin-top:14px">' +
            '<button class="btn ghost sm" data-act="vague">애매했다</button>' +
            '<button class="btn sm" data-act="got">막힘없이 읽힘</button></div>'
          : '<div class="row end" style="margin-top:14px">' +
            '<span class="foot" style="margin:0">Enter 또는 클릭으로 한 덩어리씩</span>' +
            '<div class="spacer"></div>' +
            '<button class="btn sm" data-act="more">다음 덩어리</button></div>');
      if (!finished) {                     // 판정 버튼에 포커스를 두면 Enter 가 오답을 눌러버린다
        var b = wrap.querySelector('[data-act]');
        b && b.focus();
      }
    }

    wrap.addEventListener('click', function (e) {
      var act = e.target.getAttribute && e.target.getAttribute('data-act');
      if (act === 'more') { shown++; draw(); }
      else if (act === 'got') finishCard(card, true);
      else if (act === 'vague') finishCard(card, false);
    });
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && shown < d.chunks.length) { e.preventDefault(); shown++; draw(); }
    });
    draw();
  }

  // ── 내보내기 / 가져오기 ───────────────────
  function exportData() {
    var blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'myeng-progress-' + today() + '.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  function importData(file) {
    var fr = new FileReader();
    fr.onload = function () {
      try {
        var o = JSON.parse(fr.result);
        if (!o || typeof o !== 'object' || !o.cards) throw new Error('형식이 맞지 않습니다');
        S = { version: 1, cards: o.cards || {}, log: o.log || {}, streak: o.streak || 0, lastDay: o.lastDay || null };
        save(); renderHome();
        alert('진도를 불러왔습니다.');
      } catch (e) { alert('불러오기 실패: ' + e.message); }
    };
    fr.readAsText(file);
  }

  // ── 이벤트 배선 ───────────────────────────
  Array.prototype.forEach.call(document.querySelectorAll('.mode'), function (b) {
    b.addEventListener('click', function () { startSession(+b.getAttribute('data-min')); });
  });
  $('#btn-quit').addEventListener('click', function () {
    if (run && run.done) { logDay(run.done, run.ok); }
    run = null; renderHome();
  });
  $('#btn-home').addEventListener('click', renderHome);
  $('#btn-again').addEventListener('click', function () { startSession(3); });
  $('#btn-export').addEventListener('click', exportData);
  $('#file-import').addEventListener('change', function (e) {
    if (e.target.files && e.target.files[0]) importData(e.target.files[0]);
    e.target.value = '';
  });
  $('#btn-reset').addEventListener('click', function () {
    if (!confirm('진도를 모두 지웁니다. 계속할까요?')) return;
    S = { version: 1, cards: {}, log: {}, streak: 0, lastDay: null };
    save(); renderHome();
  });
  $('#btn-theme').addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme');
    var next = cur === 'dark' ? 'light' : cur === 'light' ? '' : 'dark';
    if (next) document.documentElement.setAttribute('data-theme', next);
    else document.documentElement.removeAttribute('data-theme');
    try { localStorage.setItem('myeng.theme', next); } catch (e) { }
  });
  try {
    var th = localStorage.getItem('myeng.theme');
    if (th) document.documentElement.setAttribute('data-theme', th);
  } catch (e) { }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !viewSession.classList.contains('hidden')) {
      $('#btn-quit').click();
    }
  });

  renderHome();
})();
