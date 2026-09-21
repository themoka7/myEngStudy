/* 단어장 페이지 — 검색 · 품사 필터 · 뜻 가리기 · 예문 */
(function () {
  'use strict';
  var V = (window.DATA && window.DATA.vocab) || [];
  var $ = function (s) { return document.querySelector(s); };

  try {
    var th = localStorage.getItem('myeng.theme');
    if (th) document.documentElement.setAttribute('data-theme', th);
  } catch (e) { }
  $('#btn-theme').addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme');
    var next = cur === 'dark' ? 'light' : cur === 'light' ? '' : 'dark';
    if (next) document.documentElement.setAttribute('data-theme', next);
    else document.documentElement.removeAttribute('data-theme');
    try { localStorage.setItem('myeng.theme', next); } catch (e) { }
  });

  // 학습 카드의 모든 문장 — 예문을 여기서 찾는다
  var SENTS = [];
  var D = window.DATA || {};
  (D.chunks || []).forEach(function (c) { SENTS.push(c.en); });
  (D.expand || []).forEach(function (e) { e.steps.forEach(function (s) { SENTS.push(s.en); }); });
  (D.pp || []).forEach(function (p) { p.slots.forEach(function (s) { SENTS.push(s.en); }); });
  (D.read || []).forEach(function (r) { SENTS.push(r.whole); });

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  // 표제어나 활용형이 들어간 가장 짧은 문장 하나
  function example(v) {
    var keys = [v.w].concat(v.f || []).map(function (k) { return k.toLowerCase(); });
    var best = null;
    SENTS.forEach(function (s) {
      var low = ' ' + s.toLowerCase().replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ') + ' ';
      var hit = keys.some(function (k) { return low.indexOf(' ' + k + ' ') >= 0; });
      if (hit && (!best || s.length < best.length)) best = s;
    });
    return best;
  }
  function highlight(sentence, v) {
    var keys = [v.w].concat(v.f || []).map(function (k) { return k.toLowerCase(); });
    return sentence.split(/(\s+)/).map(function (w) {
      var core = w.toLowerCase().replace(/[^a-z']/g, '');
      return keys.indexOf(core) >= 0 ? '<b class="hl">' + esc(w) + '</b>' : esc(w);
    }).join('');
  }

  var pos = 'all', masked = false, query = '';

  function matchPos(v) {
    if (pos === 'all') return true;
    if (pos === '형부') return /형|부|전|접/.test(v.pos);
    if (pos === '숙어') return v.pos === '숙어';
    if (pos === '명') return /명/.test(v.pos) && v.pos !== '숙어';
    if (pos === '동') return /동/.test(v.pos) && v.pos !== '숙어';
    return true;
  }
  function render() {
    var q = query.trim().toLowerCase();
    var rows = V.filter(function (v) {
      if (!matchPos(v)) return false;
      if (!q) return true;
      return v.w.toLowerCase().indexOf(q) >= 0 || v.ko.toLowerCase().indexOf(q) >= 0 ||
        (v.f || []).some(function (f) { return f.toLowerCase().indexOf(q) >= 0; });
    }).sort(function (a, b) { return a.w.toLowerCase() < b.w.toLowerCase() ? -1 : 1; });

    $('#count').textContent = rows.length + ' / ' + V.length + '개';
    $('#list').innerHTML = rows.length
      ? '<div class="card vcard">' + rows.map(function (v, i) {
        return '<div class="vrow" data-i="' + i + '">' +
          '<div class="vhead">' +
          '<b class="vw">' + esc(v.w) + '</b>' +
          '<i class="vpos">' + esc(v.pos) + '</i>' +
          '<span class="vko' + (masked ? ' masked' : '') + '">' + esc(v.ko) + '</span>' +
          '</div><div class="vex"></div></div>';
      }).join('') + '</div>'
      : '<div class="card"><div class="foot">찾는 단어가 없습니다.</div></div>';
    $('#list').__rows = rows;
  }

  $('#list').addEventListener('click', function (e) {
    var masked_ = e.target.classList && e.target.classList.contains('masked');
    if (masked_) { e.target.classList.remove('masked'); return; }
    var row = e.target.closest && e.target.closest('.vrow');
    if (!row) return;
    var box = row.querySelector('.vex');
    if (box.innerHTML) { box.innerHTML = ''; return; }
    var v = $('#list').__rows[+row.getAttribute('data-i')];
    var s = example(v);
    box.innerHTML = s
      ? '<div class="exline">' + highlight(s, v) + '</div>'
      : '<div class="exline dim">이 단어가 쓰인 문장을 찾지 못했습니다.</div>';
  });

  $('#q').addEventListener('input', function (e) { query = e.target.value; render(); });
  Array.prototype.forEach.call(document.querySelectorAll('.chip'), function (b) {
    b.addEventListener('click', function () {
      Array.prototype.forEach.call(document.querySelectorAll('.chip'), function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      pos = b.getAttribute('data-pos');
      render();
    });
  });
  $('#btn-mask').addEventListener('click', function () {
    masked = !masked;
    $('#btn-mask').textContent = masked ? '뜻 보이기' : '뜻 가리기';
    render();
  });

  render();
})();
