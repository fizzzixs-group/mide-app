/* ===== business.js — MIDE v0.3 «Бизнес» (локальная версия) ===== */
(function (root) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function money(n) { return new Intl.NumberFormat('ru-RU').format(Math.round(n || 0)) + ' ₽'; }
  function uid(p) { return p + '_' + Date.now().toString(36) + '_' + Math.floor(Math.random() * 9999); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  const COUNTRY = {
    'Россия': { f: 1, c: 1, cur: '₽' },
    'Беларусь': { f: 0.55, c: 1, cur: '₽' },
    'Украина': { f: 0.65, c: 1, cur: '₽' },
    'Казахстан': { f: 0.8, c: 1, cur: '₽' },
    'Сербия': { f: 0.9, c: 1.05, cur: '₽' },
    'Германия': { f: 2.6, c: 1.2, cur: '₽' },
    'Франция': { f: 2.7, c: 1.2, cur: '₽' },
    'Польша': { f: 1.3, c: 1.15, cur: '₽' },
    'США': { f: 3.2, c: 1.3, cur: '₽' },
    'Канада': { f: 2.9, c: 1.25, cur: '₽' },
    'Израиль': { f: 2.4, c: 1.1, cur: '₽' }
  };

  const CITIES = {
    'Россия': ['Москва','Санкт-Петербург','Новосибирск','Екатеринбург','Казань','Нижний Новгород','Челябинск','Самара','Омск','Ростов-на-Дону','Уфа','Красноярск','Воронеж','Пермь','Волгоград','Краснодар','Саратов','Тюмень','Тольятти','Ижевск','Барнаул','Ульяновск','Иркутск','Хабаровск','Ярославль','Владивосток','Махачкала','Томск','Оренбург','Кемерово','Новокузнецк','Рязань','Астрахань','Пенза','Липецк','Киров','Чебоксары','Балашиха','Калининград','Тула','Курск','Севастополь','Сочи','Ставрополь','Улан-Удэ','Тверь','Магнитогорск','Иваново','Брянск','Белгород','Сургут','Владимир','Нижний Тагил','Архангельск','Чита','Калуга','Смоленск','Волжский','Череповец','Орёл','Саранск','Владикавказ','Мурманск','Якутск','Тамбов','Грозный','Стерлитамак','Кострома','Петрозаводск','Йошкар-Ола','Новороссийск','Химки','Мытищи','Подольск','Люберцы','Красногорск','Одинцово','Реутов','Домодедово','Щёлково'],
    'Беларусь': ['Минск','Гомель','Могилёв','Витебск','Гродно','Брест','Бобруйск','Барановичи','Борисов','Пинск','Орша','Мозырь','Солигорск','Новополоцк','Лида'],
    'Украина': ['Киев','Харьков','Одесса','Днепр','Донецк','Запорожье','Львов','Кривой Рог','Николаев','Мариуполь','Луганск','Винница','Херсон','Полтава','Чернигов','Черкассы','Житомир','Сумы','Хмельницкий','Черновцы'],
    'Казахстан': ['Алматы','Астана','Шымкент','Караганда','Актобе','Тараз','Павлодар','Усть-Каменогорск','Семей','Атырау','Костанай','Кызылорда','Актау','Петропавловск','Уральск','Темиртау','Туркестан','Кокшетау'],
    'Сербия': ['Белград','Нови-Сад','Ниш','Крагуевац','Суботица','Зренянин','Чачак','Нови-Пазар'],
    'Германия': ['Берлин','Мюнхен','Гамбург','Кёльн','Франкфурт','Штутгарт','Дюссельдорф','Лейпциг','Дортмунд','Эссен','Бремен','Дрезден'],
    'Франция': ['Париж','Марсель','Лион','Тулуза','Ницца','Нант','Страсбург','Монпелье','Бордо','Лилль'],
    'Польша': ['Варшава','Краков','Лодзь','Вроцлав','Познань','Гданьск','Щецин','Быдгощ','Люблин','Катовице'],
    'США': ['Нью-Йорк','Лос-Анджелес','Чикаго','Хьюстон','Финикс','Филадельфия','Сан-Антонио','Сан-Диего','Даллас','Сан-Хосе','Остин','Майами'],
    'Канада': ['Торонто','Монреаль','Ванкувер','Калгари','Эдмонтон','Оттава','Виннипег','Квебек'],
    'Израиль': ['Тель-Авив','Иерусалим','Хайфа','Беэр-Шева','Нетания','Ришон-ле-Цион']
  };

  const TYPES = [
    { id: 'metro', name: 'Ларёк в переходе метро', short: 'Ларёк в метро', rent: 9000, cov: 1.0, cap: 30 },
    { id: 'under', name: 'Подводный магазин', short: 'Подводный', rent: 22000, cov: 1.5, cap: 40 },
    { id: 'deadmall', name: 'Магазин в захудалом ТЦ', short: 'Захудалый ТЦ', rent: 40000, cov: 2.2, cap: 60 },
    { id: 'mall', name: 'Большой магазин в ТРЦ', short: 'ТРЦ', rent: 110000, cov: 3.8, cap: 120 },
    { id: 'street', name: 'Огромный магазин на улице', short: 'На улице', rent: 260000, cov: 6.0, cap: 250 },
    { id: 'airport', name: 'Киоск в аэропорту', short: 'Аэропорт', rent: 70000, cov: 3.0, cap: 50 },
    { id: 'flagship', name: 'Флагман на центральной улице', short: 'Флагман', rent: 400000, cov: 7.5, cap: 300 }
  ];

  const CAPITALS = { 'Москва':1.9,'Санкт-Петербург':1.5,'Киев':1.4,'Минск':1.3,'Алматы':1.4,'Астана':1.35,'Белград':1.3,'Берлин':1.5,'Париж':1.6,'Варшава':1.35,'Нью-Йорк':1.8,'Торонто':1.5,'Тель-Авив':1.5 };

  let LOCS = null;
  function locations() {
    if (LOCS) return LOCS;
    const out = [];
    Object.keys(CITIES).forEach(function (country) {
      const cf = COUNTRY[country];
      CITIES[country].forEach(function (city) {
        const cityF = CAPITALS[city] || 1;
        TYPES.forEach(function (t) {
          out.push({
            id: 'loc_' + out.length,
            country: country,
            city: city,
            type: t.id,
            typeName: t.name,
            short: t.short,
            rent: Math.round(t.rent * cf.f * cityF / 100) * 100,
            cov: +(t.cov * cf.c * cityF).toFixed(2),
            cap: t.cap
          });
        });
      });
    });
    LOCS = out;
    return out;
  }

  function ensure(state) {
    if (!state.biz) state.biz = { list: [], seq: 1 };
    if (!Array.isArray(state.biz.list)) state.biz.list = [];
    return state.biz;
  }
  function biz() {
    const b = ensure(root.App.state);
    return b.list.find(function (x) { return x.id === ui.bizId; }) || b.list[0] || null;
  }
  function save() { try { root.App.save(); } catch (e) { } }

  const ui = { screen: 'home', tab: 'stores', bizId: null, locCountry: 'Россия', locType: 'all', locQ: '', sup: null, tick: null };

  function newBiz(name, country) {
    const x = {
      id: uid('biz'), name: name || 'Tech Store', country: country || 'Россия',
      created: Date.now(), stores: [], warehouse: [], employees: [],
      online: null, marketer: null, ads: [], revenue: 0, sold: 0
    };
    ensure(root.App.state).list.push(x);
    ui.bizId = x.id; ui.screen = 'biz'; ui.tab = 'stores';
    save();
    return x;
  }

  function tabBar(b) {
    const tabs = [
      ['stores','Точки'], ['reach','Охват'], ['suppliers','Поставщики'],
      ['warehouse','Склад'], ['staff','Сотрудники'], ['online','Онлайн-магазин'], ['marketing','Маркетинг']
    ];
    return '<div class="biz-tabs">' + tabs.map(function (t) {
      return '<button class="biz-tab' + (ui.tab === t[0] ? ' on' : '') + '" onclick="window.Business.tab(\'' + t[0] + '\')">' + t[1] + '</button>';
    }).join('') + '</div>';
  }

  function homeHTML() {
    const st = root.App.state;
    const data = ensure(st);
    const list = data.list;
    let h = '<div class="biz-hero">' +
      '<div class="biz-hero-t">Бизнес</div>' +
      '<div class="biz-hero-s">v0.3 · магазины, поставки и охват</div></div>';
    if (!list.length) {
      h += '<div class="biz-card biz-empty"><b>У тебя пока нет бизнеса</b><p>Открой первый магазин и начни продавать телефоны по всей стране.</p>' +
        '<button class="btn primary" onclick="window.Business.create()">Открыть новый бизнес</button></div>';
    } else {
      h += '<button class="biz-open-new" onclick="window.Business.create()">+ Открыть новый бизнес</button>';
      h += '<div class="biz-section">Мои бизнесы</div>';
      h += list.map(function (b) {
        return '<button class="biz-list-item" onclick="window.Business.open(\'' + b.id + '\')">' +
          '<span class="biz-list-ico">' + esc((b.name || 'B').slice(0, 1).toUpperCase()) + '</span>' +
          '<span class="biz-list-main"><b>' + esc(b.name) + '</b><span>' + esc(b.country) + ' · ' + b.stores.length + ' точек · ' + b.warehouse.length + ' телефонов</span></span>' +
          '<span class="biz-list-arrow">›</span></button>';
      }).join('');
    }
    return h;
  }

  function bizHTML(b) {
    let h = '<div class="biz-head">' +
      '<button class="biz-back" onclick="window.Business.home()">←</button>' +
      '<div class="biz-title"><b>' + esc(b.name) + '</b><span>' + esc(b.country) + ' · ' + b.stores.length + ' точек</span></div>' +
      '<div class="biz-bal">' + money(root.App.state.balance) + '</div></div>' + tabBar(b);
    h += '<div class="biz-body">';
    if (ui.tab === 'stores') h += storesHTML(b);
    else if (ui.tab === 'reach') h += reachHTML(b);
    else if (ui.tab === 'suppliers') h += suppliersHTML(b);
    else if (ui.tab === 'warehouse') h += warehouseHTML(b);
    else if (ui.tab === 'staff') h += staffHTML(b);
    else if (ui.tab === 'online') h += onlineHTML(b);
    else if (ui.tab === 'marketing') h += marketingHTML(b);
    h += '</div>';
    return h;
  }

  function storesHTML(b) {
    let h = '<button class="biz-open-new" onclick="window.Business.chooseLocation()">+ Добавить точку</button>';
    if (!b.stores.length) {
      h += '<div class="biz-card biz-empty"><b>Точек нет</b><p>Добавь первый магазин: от ларька в метро до флагмана.</p></div>';
    } else {
      h += b.stores.map(function (s) {
        return '<div class="biz-store"><div class="biz-store-top"><b>' + esc(s.short) + '</b><span>' + money(s.rent) + '/мес</span></div>' +
          '<div class="biz-store-sub">' + esc(s.city) + ', ' + esc(s.country) + ' · охват ' + s.cov + ' · склад ' + s.stock.length + '/' + s.cap + '</div>' +
          '<div class="biz-store-bar"><i style="width:' + Math.min(100, s.stock.length / s.cap * 100) + '%"></i></div></div>';
      }).join('');
    }
    return h;
  }

  function reachHTML(b) {
    const phones = b.warehouse.length + b.stores.reduce(function (n, s) { return n + s.stock.length; }, 0);
    const top = {};
    b.warehouse.concat.apply(b.warehouse, b.stores.map(function (s) { return s.stock; })).forEach(function (p) {
      top[p.modelId] = (top[p.modelId] || 0) + 1;
    });
    const topId = Object.keys(top).sort(function (a, c) { return top[c] - top[a]; })[0];
    const topName = topId && root.Engine.MODELS_BY_ID[topId] ? root.Engine.MODELS_BY_ID[topId].name : '—';
    const topPct = phones ? Math.round((top[topId] || 0) / phones * 100) : 0;
    const byCountry = {};
    b.stores.forEach(function (s) { byCountry[s.country] = (byCountry[s.country] || 0) + s.cov; });
    const max = Math.max.apply(null, Object.keys(byCountry).map(function (k) { return byCountry[k]; }).concat([1]));
    const bars = Object.keys(byCountry).sort(function (a, c) { return byCountry[c] - byCountry[a]; }).map(function (k) {
      return '<div class="biz-bar-row"><span>' + esc(k) + '</span><div class="biz-bar"><i style="width:' + Math.round(byCountry[k] / max * 100) + '%"></i></div><b>' + byCountry[k].toFixed(1) + '</b></div>';
    }).join('');
    return '<div class="biz-card"><div class="biz-card-h">Общий охват</div>' +
      '<div class="biz-stats"><div><b>' + phones + '</b><span>телефонов</span></div>' +
      '<div><b>' + b.stores.length + '</b><span>точек</span></div>' +
      '<div><b>' + (b.marketer ? 'есть' : 'нет') + '</b><span>маркетолог</span></div></div></div>' +
      '<div class="biz-card"><div class="biz-card-h">Самый популярный телефон</div>' +
      '<div class="biz-top-phone"><b>' + esc(topName) + '</b><span>' + topPct + '% продаж</span></div></div>' +
      '<div class="biz-card"><div class="biz-card-h">Охват по странам</div>' + (bars || '<div class="biz-empty">Добавь точки, чтобы увидеть охват</div>') + '</div>';
  }

  function suppliersHTML(b) {
    if (!ui.sup) ui.sup = { count: 100, brand: 'all', model: 'all', searchUntil: 0, results: null, order: null, dutyUntil: 0 };
    const s = ui.sup;
    const brands = ['all'].concat(Object.keys(root.Engine.MODELS_BY_ID.reduce ? {} : {})).slice(0, 1);
    const allBrands = Array.from(new Set(Object.keys(root.Engine.MODELS_BY_ID).map(function (id) { return root.Engine.MODELS_BY_ID[id].brand; }))).sort();
    const models = s.brand === 'all' ? [] : Object.keys(root.Engine.MODELS_BY_ID).map(function (id) { return root.Engine.MODELS_BY_ID[id]; }).filter(function (m) { return m.brand === s.brand; }).sort(function (a, c) { return a.name.localeCompare(c.name); });
    let h = '<div class="biz-card"><div class="biz-card-h">Заказ у поставщика</div>' +
      '<div class="biz-field"><label>Количество (20–5000)</label><input id="sup-count" type="number" min="20" max="5000" value="' + s.count + '"></div>' +
      '<div class="biz-field"><label>Бренд</label><select id="sup-brand" onchange="window.Business.supBrand(this.value)"><option value="all">Все бренды</option>' +
      allBrands.map(function (x) { return '<option value="' + esc(x) + '"' + (s.brand === x ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join('') + '</select></div>' +
      '<div class="biz-field"><label>Модель</label><select id="sup-model"' + (s.brand === 'all' ? ' disabled' : '') + '><option value="all">Все модели</option>' +
      models.map(function (m) { return '<option value="' + m.id + '"' + (s.model === m.id ? ' selected' : '') + '>' + esc(m.name) + '</option>'; }).join('') + '</select></div>';
    if (s.searchUntil > Date.now()) {
      h += '<div class="biz-timer">Поиск поставщиков… <b>' + Math.ceil((s.searchUntil - Date.now()) / 1000) + ' сек</b></div>';
    } else if (s.results) {
      h += '<div class="biz-supply-res">' + s.results.map(function (r, i) {
        return '<div class="biz-supply-row"><div><b>' + esc(r.name) + '</b><span>' + r.count + ' шт · доставка ' + r.days + ' сек</span></div>' +
          '<button class="btn sm primary" onclick="window.Business.order(' + i + ')">' + money(r.total) + '</button></div>';
      }).join('') + '</div>';
    } else {
      h += '<button class="btn primary" style="width:100%;margin-top:10px" onclick="window.Business.supSearch()">Найти поставщика</button>';
    }
    h += '</div>';
    if (s.order) h += '<div class="biz-card"><div class="biz-card-h">Доставка</div>' + orderStatus(s) + '</div>';
    return h;
  }

  function orderStatus(s) {
    const o = s.order;
    if (!o) return '';
    if (o.arrived) return '<div class="biz-ok">Заказ пришёл на склад бизнеса: ' + o.count + ' телефонов</div>';
    if (o.dutyUntil && Date.now() > o.dutyUntil && !o.dutyPaid) {
      return '<div class="biz-warn">Пошлина не оплачена — заказ отменён. Вернулось 80%.</div>';
    }
    let h = '<div class="biz-timer">Доставка: ' + Math.max(0, Math.ceil((o.arriveAt - Date.now()) / 1000)) + ' сек</div>';
    if (o.duty > 0 && !o.dutyPaid) {
      h += '<div class="biz-warn">Пошлина ' + money(o.duty) + ' · оплатить за ' + Math.max(0, Math.ceil((o.dutyUntil - Date.now()) / 1000)) + ' сек</div>' +
        '<button class="btn primary" onclick="window.Business.payDuty()">Оплатить пошлину</button>';
    }
    return h;
  }

  function warehouseHTML(b) {
    const total = b.warehouse.length + b.stores.reduce(function (n, s) { return n + s.stock.length; }, 0);
    let h = '<div class="biz-card"><div class="biz-card-h">Склад бизнеса</div>' +
      '<div class="biz-stats"><div><b>' + total + '</b><span>всего</span></div>' +
      '<div><b>' + b.warehouse.length + '</b><span>на складе</span></div>' +
      '<div><b>' + b.stores.length + '</b><span>точек</span></div></div>' +
      '<button class="btn" style="width:100%;margin-top:10px" onclick="window.Business.autoStock()">Разложить по точкам автоматически</button></div>';
    if (b.warehouse.length) {
      const groups = {};
      b.warehouse.forEach(function (p) { const k = p.modelId; (groups[k] = groups[k] || []).push(p); });
      h += '<div class="biz-card"><div class="biz-card-h">На складе</div>' + Object.keys(groups).map(function (k) {
        const m = root.Engine.MODELS_BY_ID[k] || {};
        return '<div class="biz-item"><span>' + esc(m.name || k) + '</span><b>' + groups[k].length + ' шт</b></div>';
      }).join('') + '</div>';
    }
    return h;
  }

  function staffHTML(b) {
    let h = '<div class="biz-card"><div class="biz-card-h">Сотрудники</div>' +
      '<div class="biz-sub">Продавец: 25 000 ₽ за час реального времени. Без продавца точка не продаёт.</div>' +
      '<button class="btn primary" style="width:100%;margin-top:10px" onclick="window.Business.hire()">Нанять продавца · 25 000 ₽</button>' +
      '<button class="btn" style="width:100%;margin-top:8px" onclick="window.Business.autoStaff()">Распределить автоматически</button></div>';
    if (b.employees.length) {
      h += '<div class="biz-card"><div class="biz-card-h">Штат · ' + b.employees.length + '</div>' + b.employees.map(function (e) {
        const st = b.stores.find(function (x) { return x.id === e.storeId; });
        return '<div class="biz-item"><span>' + esc(e.name) + ' · ' + (st ? esc(st.short + ', ' + st.city) : 'не назначен') + '</span>' +
          '<button class="btn sm" onclick="window.Business.assignStaff(\'' + e.id + '\')">Назначить</button></div>';
      }).join('') + '</div>';
    }
    return h;
  }

  function onlineHTML(b) {
    if (!b.online) {
      return '<div class="biz-card biz-empty"><b>Интернет-магазин не открыт</b><p>Сайт продаёт телефоны со склада. Нужен домен и доставка.</p>' +
        '<button class="btn primary" onclick="window.Business.createOnline()">Открыть интернет-магазин</button></div>';
    }
    const o = b.online;
    return '<div class="biz-card"><div class="biz-card-h">' + esc(o.name) + '</div>' +
      '<div class="biz-browser"><div class="biz-url">https://' + esc(o.domain) + '</div>' +
      '<div class="biz-site ' + esc(o.template) + '" style="--biz-accent:' + esc(o.color) + '"><b>' + esc(o.name) + '</b><span>Смартфоны с гарантией</span>' +
      '<div class="biz-site-grid"><i></i><i></i><i></i></div></div></div>' +
      '<div class="biz-item"><span>Шаблон</span><b>' + esc(o.template) + '</b></div>' +
      '<div class="biz-item"><span>Доставка</span><b>' + esc(o.contract || 'не подключена') + '</b></div>' +
      '<button class="btn" style="width:100%;margin-top:8px" onclick="window.Business.changeOnline()">Изменить сайт</button></div>';
  }

  function marketingHTML(b) {
    const levels = [['1','Обычный','29 000 ₽/час'],['2','Опытный','60 000 ₽/час'],['3','Профи','200 000 ₽/мес']];
    let h = '<div class="biz-card"><div class="biz-card-h">Маркетолог</div>';
    h += b.marketer ? '<div class="biz-ok">' + esc(b.marketer.name) + ' · уровень ' + b.marketer.level + '</div>' :
      levels.map(function (l) {
        return '<button class="biz-mk" onclick="window.Business.hireMarketer(\'' + l[0] + '\')"><b>' + l[1] + '</b><span>' + l[2] + '</span></button>';
      }).join('');
    h += '</div><div class="biz-card"><div class="biz-card-h">Реклама</div>' +
      '<div class="biz-sub">Реклама повышает охват магазинов и сайта. Минимум +22%, максимум +400%.</div>' +
      '<button class="btn primary" style="width:100%;margin-top:10px" onclick="window.Business.buyAd()">Купить рекламу</button></div>';
    if (b.ads.length) {
      h += '<div class="biz-card"><div class="biz-card-h">Активные кампании</div>' + b.ads.map(function (a) {
        return '<div class="biz-item"><span>' + esc(a.country) + ' · ' + esc(a.place) + '</span><b>+' + a.boost + '%</b></div>';
      }).join('') + '</div>';
    }
    return h;
  }

  /* ---------- действия ---------- */
  function create() {
    root.App.modal(
      '<h3>Новый бизнес</h3><div class="sub">Название может быть любым, например Tech Store.</div>' +
      '<div class="field"><label>Название</label><input id="biz-name" type="text" maxlength="28" placeholder="Tech Store"></div>' +
      '<div class="field"><label>Страна</label><select id="biz-country">' + Object.keys(COUNTRY).map(function (c) { return '<option>' + c + '</option>'; }).join('') + '</select></div>' +
      '<div class="btn-row"><button class="btn ghost" onclick="window.App.closeModal()">Отмена</button>' +
      '<button class="btn primary" onclick="window.Business.createGo()">Создать</button></div>'
    );
  }
  function createGo() {
    const name = (document.getElementById('biz-name').value || 'Tech Store').trim().slice(0, 28);
    const country = document.getElementById('biz-country').value;
    newBiz(name, country);
    root.App.closeModal();
    root.App.appsOpen('business');
  }

  function chooseLocation() {
    const list = locations();
    const countries = Object.keys(CITIES);
    const filtered = list.filter(function (l) {
      return (ui.locCountry === 'all' || l.country === ui.locCountry) &&
        (ui.locType === 'all' || l.type === ui.locType) &&
        (!ui.locQ || (l.city + ' ' + l.typeName).toLowerCase().indexOf(ui.locQ.toLowerCase()) >= 0);
    }).slice(0, 60);
    let h = '<h3>Добавить точку</h3><div class="sub">Всего ' + list.length + ' локаций. Показаны первые 60 по фильтру.</div>' +
      '<div class="biz-filters"><select id="loc-country" onchange="window.Business.locCountry(this.value)"><option value="all">Все страны</option>' +
      countries.map(function (c) { return '<option' + (ui.locCountry === c ? ' selected' : '') + '>' + c + '</option>'; }).join('') + '</select>' +
      '<select id="loc-type" onchange="window.Business.locType(this.value)"><option value="all">Все типы</option>' +
      TYPES.map(function (t) { return '<option value="' + t.id + '"' + (ui.locType === t.id ? ' selected' : '') + '>' + t.short + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><input id="loc-q" type="text" placeholder="Город" value="' + esc(ui.locQ) + '" oninput="window.Business.locQ(this.value)"></div>' +
      '<div class="biz-loc-list">' + filtered.map(function (l) {
        return '<button class="biz-loc" onclick="window.Business.openLoc(\'' + l.id + '\')"><span><b>' + esc(l.typeName) + '</b>' +
          '<i>' + esc(l.city) + ', ' + esc(l.country) + '</i></span><span class="biz-loc-price">' + money(l.rent) + '<i>охват ' + l.cov + '</i></span></button>';
      }).join('') + '</div>' +
      '<button class="btn ghost" style="width:100%" onclick="window.App.closeModal()">Закрыть</button>';
    root.App.modal(h);
  }
  function openLoc(id) {
    const l = locations().find(function (x) { return x.id === id; });
    if (!l) return;
    const b = biz(); if (!b) return;
    if (root.App.state.balance < l.rent) { root.App.toast('Не хватает денег на аренду', 'bad'); return; }
    root.App.state.balance -= l.rent;
    b.stores.push({ id: uid('st'), locId: l.id, city: l.city, country: l.country, type: l.type, short: l.short, typeName: l.typeName, rent: l.rent, cov: l.cov, cap: l.cap, stock: [] });
    save(); root.App.closeModal(); root.App.toast('Точка открыта: ' + l.short + ', ' + l.city, 'good');
    root.App.appsOpen('business');
  }

  function supSearch() {
    const b = biz(); if (!b) return;
    ui.sup.count = Math.max(20, Math.min(5000, parseInt(document.getElementById('sup-count').value, 10) || 100));
    ui.sup.brand = document.getElementById('sup-brand').value;
    const modelEl = document.getElementById('sup-model');
    ui.sup.model = modelEl ? modelEl.value : 'all';
    ui.sup.searchUntil = Date.now() + 30000;
    ui.sup.results = null;
    root.App.appsOpen('business');
    setTimeout(function () {
      const s = ui.sup;
      if (!s || s.searchUntil > Date.now()) return;
      const count = s.count;
      const disc = Math.min(0.40, count / 12000);
      const pool = Object.keys(root.Engine.MODELS_BY_ID).map(function (id) { return root.Engine.MODELS_BY_ID[id]; })
        .filter(function (m) { return s.brand === 'all' || m.brand === s.brand; })
        .filter(function (m) { return s.model === 'all' || m.id === s.model; });
      const m = pool[Math.floor(Math.random() * pool.length)] || { name: 'Смартфон', base: 20000 };
      const days = { 'Россия':12,'Беларусь':14,'Украина':15,'Казахстан':16,'Сербия':20,'Польша':22,'Германия':25,'Франция':28,'Израиль':30,'Канада':35,'США':40 }[b.country] || 25;
      s.results = [{ name: m.name + ' · опт', count: count, unit: Math.round(m.base * (1 - disc)), total: Math.round(m.base * (1 - disc) * count), days: days }];
      s.searchUntil = 0;
      if (root.App.view === 'apps' && root.App.appsApp === 'business') root.App.appsOpen('business');
    }, 30000);
  }
  function supBrand(v) { ui.sup.brand = v; ui.sup.results = null; root.App.appsOpen('business'); }
  function order(i) {
    const b = biz(); const s = ui.sup; if (!b || !s || !s.results) return;
    const r = s.results[i];
    if (root.App.state.balance < r.total) { root.App.toast('Не хватает денег', 'bad'); return; }
    root.App.state.balance -= r.total;
    const duty = b.country === 'Россия' ? Math.min(50000, Math.round(r.total * 0.05)) : 0;
    s.order = { count: r.count, modelId: null, total: r.total, arriveAt: Date.now() + r.days * 1000, duty: duty, dutyPaid: duty === 0, dutyUntil: duty ? Date.now() + 600000 : 0, arrived: false, refunded: false };
    s.results = null;
    save(); root.App.appsOpen('business'); root.App.toast('Заказ оформлен', 'good');
  }
  function payDuty() {
    const o = ui.sup && ui.sup.order; if (!o) return;
    if (root.App.state.balance < o.duty) { root.App.toast('Не хватает на пошлину', 'bad'); return; }
    root.App.state.balance -= o.duty; o.dutyPaid = true; save(); root.App.appsOpen('business');
  }
  function addOrderToWarehouse() {
    const b = biz(); const s = ui.sup; if (!b || !s || !s.order || s.order.arrived) return;
    const o = s.order;
    if (o.duty && !o.dutyPaid) {
      if (Date.now() > o.dutyUntil) {
        root.App.state.balance += Math.round(o.total * 0.8);
        o.arrived = true; o.refunded = true; save(); root.App.appsOpen('business');
      }
      return;
    }
    const pool = Object.keys(root.Engine.MODELS_BY_ID);
    for (let i = 0; i < o.count; i++) {
      const id = pool[Math.floor(Math.random() * pool.length)];
      const m = root.Engine.MODELS_BY_ID[id];
      const st = m.storages[Math.floor(Math.random() * m.storages.length)];
      b.warehouse.push({ modelId: id, storage: st, cost: Math.round(m.base * 0.8) });
    }
    o.arrived = true; save(); root.App.appsOpen('business'); root.App.toast('Поставка на складе бизнеса', 'good');
  }

  function autoStock() {
    const b = biz(); if (!b || !b.stores.length) return;
    while (b.warehouse.length) {
      const p = b.warehouse.shift();
      const st = b.stores.filter(function (s) { return s.stock.length < s.cap; })[0];
      if (!st) { b.warehouse.unshift(p); break; }
      st.stock.push(p);
    }
    save(); root.App.appsOpen('business'); root.App.toast('Телефоны разложены по точкам', 'good');
  }
  function hire() {
    const b = biz(); if (!b) return;
    if (root.App.state.balance < 25000) { root.App.toast('Нужно 25 000 ₽', 'bad'); return; }
    root.App.state.balance -= 25000;
    b.employees.push({ id: uid('emp'), name: pick(['Артём','Максим','Егор','Алина','Кирилл','Света','Роман','Даша']), level: 1, storeId: null });
    save(); root.App.appsOpen('business'); root.App.toast('Продавец нанят', 'good');
  }
  function autoStaff() {
    const b = biz(); if (!b) return;
    b.employees.forEach(function (e) {
      if (!e.storeId) { const st = b.stores.filter(function (s) { return !b.employees.some(function (x) { return x.storeId === s.id; }); })[0]; if (st) e.storeId = st.id; }
    });
    save(); root.App.appsOpen('business'); root.App.toast('Сотрудники распределены', 'good');
  }
  function assignStaff(id) {
    const b = biz(); const e = b && b.employees.find(function (x) { return x.id === id; }); if (!e) return;
    const st = b.stores.find(function (s) { return !b.employees.some(function (x) { return x.storeId === s.id; }); });
    if (!st) { root.App.toast('Все точки заняты', 'bad'); return; }
    e.storeId = st.id; save(); root.App.appsOpen('business');
  }

  const TLDS = [['com',1200],['ru',299],['io',2500],['net',1100],['org',900],['store',1800],['shop',1600],['tech',3000],['app',2200],['dev',2600],['me',1500],['pro',1400],['online',2000],['site',1700],['xyz',600],['fun',800],['cloud',3200],['ai',55000],['studio',2400],['digital',2800]];
  function createOnline() {
    root.App.modal(
      '<h3>Интернет-магазин</h3><div class="sub">Название, домен, шаблон и доставка. Сайт собирается ~11 секунд.</div>' +
      '<div class="field"><label>Название</label><input id="on-name" type="text" maxlength="24" placeholder="Tech Store"></div>' +
      '<div class="field"><label>Домен</label><select id="on-tld">' + TLDS.map(function (t) { return '<option value="' + t[0] + '">.' + t[0] + ' · ' + money(t[1]) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label>Шаблон · 5 000 ₽</label><select id="on-tpl"><option value="liquid">Liquid Glass</option><option value="material">Material You</option><option value="minimal">Minimal</option></select></div>' +
      '<div class="field"><label>Цвет</label><input id="on-color" type="color" value="#0aa2f5"></div>' +
      '<div class="field"><label>Доставка</label><select id="on-contract"><option>СДЭК</option><option>Почта России</option><option>Amazon Prime</option><option>DHL</option><option>Nova Post</option><option>Israel Post</option></select></div>' +
      '<div class="btn-row"><button class="btn ghost" onclick="window.App.closeModal()">Отмена</button>' +
      '<button class="btn primary" onclick="window.Business.createOnlineGo()">Создать</button></div>'
    );
  }
  function createOnlineGo() {
    const b = biz(); if (!b) return;
    const name = (document.getElementById('on-name').value || 'Tech Store').trim();
    const tld = document.getElementById('on-tld').value;
    const tpl = document.getElementById('on-tpl').value;
    const color = document.getElementById('on-color').value;
    const contract = document.getElementById('on-contract').value;
    const cost = 5000 + (TLDS.find(function (t) { return t[0] === tld; }) || [0, 1000])[1];
    if (root.App.state.balance < cost) { root.App.toast('Нужно ' + money(cost), 'bad'); return; }
    root.App.state.balance -= cost;
    b.online = { name: name, domain: vlad(name) + '.' + tld, template: tpl, color: color, contract: contract, building: true };
    save(); root.App.closeModal(); root.App.appsOpen('business');
    setTimeout(function () {
      if (b.online) b.online.building = false;
      save(); if (root.App.view === 'apps' && root.App.appsApp === 'business') root.App.appsOpen('business');
    }, 11000);
  }
  function vlad(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 20) || 'shop'; }
  function changeOnline() { root.App.toast('Смена сайта: выбери новый домен и шаблон', ''); createOnline(); }

  function hireMarketer(level) {
    const b = biz(); if (!b) return;
    const price = level === '3' ? 200000 : level === '2' ? 60000 : 29000;
    if (root.App.state.balance < price) { root.App.toast('Нужно ' + money(price), 'bad'); return; }
    root.App.state.balance -= price;
    b.marketer = { name: pick(['Аня','Марк','Лиза','Олег']), level: +level };
    save(); root.App.appsOpen('business'); root.App.toast('Маркетолог нанят', 'good');
  }
  function buyAd() {
    const b = biz(); if (!b) return;
    if (root.App.state.balance < 10000) { root.App.toast('Минимум 10 000 ₽', 'bad'); return; }
    root.App.state.balance -= 10000;
    const boost = Math.round(22 + Math.random() * 378);
    b.ads.push({ country: b.country, place: b.stores[0] ? b.stores[0].city : 'онлайн', boost: boost });
    save(); root.App.appsOpen('business'); root.App.toast('Реклама запущена: +' + boost + '%', 'good');
  }

  /* ---------- рендер и тики ---------- */
  function viewHTML() {
    const st = root.App.state;
    const b = biz();
    if (!b || ui.screen === 'home') return '<div class="biz-page">' + homeHTML() + '</div>';
    return '<div class="biz-page">' + bizHTML(b) + '</div>';
  }

  function tick() {
    const s = ui.sup;
    if (!s) return;
    if (s.order && !s.order.arrived) {
      if (s.order.duty && !s.order.dutyPaid && Date.now() > s.order.dutyUntil) {
        root.App.state.balance += Math.round(s.order.total * 0.8);
        s.order.arrived = true; s.order.refunded = true; save(); root.App.appsOpen('business'); return;
      }
      if (Date.now() >= s.order.arriveAt) { addOrderToWarehouse(); return; }
    }
    if (s.searchUntil > Date.now() || (s.order && !s.order.arrived)) {
      if (root.App.view === 'apps' && root.App.appsApp === 'business') root.App.appsOpen('business');
    }
  }
  setInterval(tick, 1000);

  root.Business = {
    appIcon: function () {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20V8l8-4 8 4v12"/><path d="M4 20h16"/><path d="M9 20v-6h6v6"/></svg>';
    },
    viewHTML: viewHTML,
    create: create,
    createGo: createGo,
    open: function (id) { ui.bizId = id; ui.screen = 'biz'; ui.tab = 'stores'; root.App.appsOpen('business'); },
    home: function () { ui.screen = 'home'; root.App.appsOpen('business'); },
    tab: function (t) { ui.tab = t; root.App.appsOpen('business'); },
    chooseLocation: chooseLocation,
    locCountry: function (v) { ui.locCountry = v; chooseLocation(); },
    locType: function (v) { ui.locType = v; chooseLocation(); },
    locQ: function (v) { ui.locQ = v; },
    openLoc: openLoc,
    supSearch: supSearch,
    supBrand: supBrand,
    order: order,
    payDuty: payDuty,
    autoStock: autoStock,
    hire: hire,
    autoStaff: autoStaff,
    assignStaff: assignStaff,
    createOnline: createOnline,
    createOnlineGo: createOnlineGo,
    changeOnline: changeOnline,
    hireMarketer: hireMarketer,
    buyAd: buyAd,
    locationsCount: function () { return locations().length; }
  };
})(window);
