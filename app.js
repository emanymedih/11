const STORAGE_KEY = "szd-vda-daily-v1";

let currentFocusIndex = 0;

const indicators = [
  {
    id: "visibleExpertise",
    group: "СЗД",
    title: "Публичная экспертность",
    essence: "Писать, говорить, вести канал, давать разборы, консультировать.",
    target: "Сделать один видимый экспертный шаг от своего имени.",
    avoid: "Прятаться в подготовку, ждать идеальной формы, оставаться невидимой.",
    risk: "Сила есть, но ее не видят и не связывают с тобой."
  },
  {
    id: "meaningfulUse",
    group: "СЗД",
    title: "Польза и смысл",
    essence: "Работа, где есть помощь, психология, обучение, творчество или социальная польза.",
    target: "Выбрать действие, которое кому-то реально помогает или проясняет ситуацию.",
    avoid: "Делать только механическое, чужое или бессмысленное.",
    risk: "Витальность падает, если действие не связано со смыслом."
  },
  {
    id: "methodPackaging",
    group: "СЗД",
    title: "Методика вместо тумана",
    essence: "Интуиция становится системой: диагностика, этапы, выводы, рекомендации.",
    target: "Оформить ощущение в структуру, схему, чеклист или понятный вывод.",
    avoid: "Оставаться на уровне 'я чувствую', не показывая опору мысли.",
    risk: "Ценность сложно увидеть, если нет формы."
  },
  {
    id: "professionalResponsibility",
    group: "СЗД",
    title: "Профессиональная ответственность",
    essence: "Вести проект, делать авторский продукт, выступать от своего имени.",
    target: "Взять авторство за решение, продукт, позицию или следующий шаг.",
    avoid: "Ждать разрешения, быть только помощницей, не называть свою роль.",
    risk: "Ответственность есть, но статус остается незафиксированным."
  },
  {
    id: "statusProof",
    group: "СЗД",
    title: "Подтверждение статуса",
    essence: "Кейсы, результаты, отзывы, портфолио, публикации.",
    target: "Зафиксировать одно доказательство ценности: результат, отзыв, кейс, публикацию.",
    avoid: "Обесценивать результат или считать его недостаточно важным.",
    risk: "Цена и уверенность проседают без видимых подтверждений."
  },
  {
    id: "emotionalPause",
    group: "ВДА",
    title: "Пауза перед реакцией",
    essence: "Перед обидой спросить: я защищаюсь или решаю задачу?",
    target: "Сделать паузу и назвать реальную задачу до ответа.",
    avoid: "Реагировать из обиды, защиты или внутренней тревоги.",
    risk: "Эмоция начинает управлять действием."
  },
  {
    id: "anxietyToAction",
    group: "ВДА",
    title: "Тревога в действие",
    essence: "План, уточнение договоренности, звонок, маленькая закрытая задача.",
    target: "Перевести тревогу в один конкретный следующий шаг.",
    avoid: "Крутить сценарии в голове без внешнего действия.",
    risk: "Тревога растет, если не получает формы."
  },
  {
    id: "directCommunication",
    group: "ВДА",
    title: "Прямая коммуникация",
    essence: "Не молчаливое наказание, а ясная формулировка потребности и шага.",
    target: "Сказать: мне важно вот это, я предлагаю такой шаг.",
    avoid: "Молчать, исчезать, наказывать дистанцией.",
    risk: "Контакт становится полем обиды, а не решения."
  },
  {
    id: "moneyFacts",
    group: "ВДА",
    title: "Деньги через факты",
    essence: "Опыт, результат, рынок и ценность вместо автоматического снижения цены.",
    target: "Перед уступкой проверить факты и ценность работы.",
    avoid: "Снижать цену из страха или желания быть удобной.",
    risk: "Ценность уходит первой, а усталость приходит следом."
  },
  {
    id: "responsibilityBoundary",
    group: "ВДА",
    title: "Граница ответственности",
    essence: "Не спасать партнера или клиента, а отделять свое от чужого.",
    target: "Спросить: это моя ответственность или я беру чужую?",
    avoid: "Спасать, тащить, додумывать и компенсировать за другого.",
    risk: "Энергия уходит в чужой контур."
  }
];

const focusDeck = [
  {
    title: "Экспертность в ясной форме",
    text: "Сегодня важен один видимый шаг: не просто почувствовать, а оформить интуицию в понятный вывод, структуру или рекомендацию.",
    szd: "Опубликовать короткий экспертный разбор: наблюдение, вывод, рекомендация.",
    vda: "Перед эмоциональной реакцией спросить: я защищаюсь или решаю задачу?",
    risk: "Спрятаться в подготовку и отложить проявление.",
    targets: [
      "Опубликовать или отправить один экспертный разбор.",
      "Назвать вывод и рекомендацию, а не только ощущение.",
      "Отметить в карте показатель 'Методика вместо тумана'."
    ],
    avoids: [
      "Дорабатывать бесконечно без публикации.",
      "Объяснять слишком много, чтобы заслужить право говорить.",
      "Ставить свою мысль в режим черновика на весь день."
    ],
    risks: [
      "Видимость не случится, если действие останется внутри.",
      "Туманная формулировка может обесценить точный смысл."
    ]
  },
  {
    title: "Статус через доказательство",
    text: "День подходит для маленького, но видимого подтверждения профессиональной ценности.",
    szd: "Добавить один кейс, отзыв, результат или фрагмент портфолио туда, где это могут увидеть.",
    vda: "При сомнении проверить факты: опыт, результат, рынок, ценность.",
    risk: "Обесценить работу или снизить цену до проверки реальности.",
    targets: [
      "Зафиксировать один результат, отзыв, кейс или публикацию.",
      "Сверить цену или ценность с фактами, а не с тревогой.",
      "Отметить в карте показатель 'Подтверждение статуса'."
    ],
    avoids: [
      "Снижать цену автоматически.",
      "Называть результат случайностью.",
      "Оставлять доказательства ценности только в личных заметках."
    ],
    risks: [
      "Без фиксации результата статус снова становится невидимым.",
      "Тревога может подменить реальную оценку работы."
    ]
  },
  {
    title: "Граница как форма заботы",
    text: "Сегодня важно помогать из взрослой позиции: оставлять себе свое, а другим оставлять их ответственность.",
    szd: "Сформулировать одно предложение услуги, консультации или продукта от первого лица.",
    vda: "Спросить себя: это моя ответственность или я беру чужую?",
    risk: "Спасать партнера или клиента за счет своей энергии.",
    targets: [
      "Назвать свою роль, услугу или границу простыми словами.",
      "Отделить свою ответственность от чужой в одной ситуации.",
      "Отметить в карте показатель 'Граница ответственности'."
    ],
    avoids: [
      "Додумывать и компенсировать за другого.",
      "Давать больше, чем было согласовано.",
      "Путать заботу с спасательством."
    ],
    risks: [
      "Энергия уйдет в чужой контур.",
      "Польза обернется усталостью, если граница не названа."
    ]
  },
  {
    title: "Интуиция становится методикой",
    text: "Хороший день для упаковки: назвать этапы, критерии, выводы и следующий шаг.",
    szd: "Описать один процесс как мини-методику: диагностика, вывод, рекомендация, следующий шаг.",
    vda: "Если появляется тревога, перевести ее в список из трех простых действий.",
    risk: "Остаться в ощущениях и не довести смысл до формы.",
    targets: [
      "Описать один процесс через этапы: вход, диагностика, вывод, шаг.",
      "Сделать из ощущения схему, чеклист или мини-инструкцию.",
      "Отметить в карте показатель 'Методика вместо тумана'."
    ],
    avoids: [
      "Говорить только 'мне кажется' без опор.",
      "Откладывать упаковку, пока не станет идеально.",
      "Смешивать все выводы в один большой ком."
    ],
    risks: [
      "Смысл не станет продуктом без структуры.",
      "Тревога может съесть энергию упаковки."
    ]
  },
  {
    title: "Прямое слово вместо исчезновения",
    text: "Если что-то задевает, сегодня важно не пропадать, а говорить достаточно ясно и коротко.",
    szd: "Сформулировать одну профессиональную позицию без лишних оправданий.",
    vda: "В конфликте заменить молчание фразой: мне важно вот это, я предлагаю вот такой шаг.",
    risk: "Молчание как наказание, уход в обиду или резкий обрыв контакта.",
    targets: [
      "Сформулировать одну позицию или просьбу коротко и прямо.",
      "Вместо исчезновения назвать следующий шаг.",
      "Отметить в карте показатель 'Прямая коммуникация'."
    ],
    avoids: [
      "Молчать, чтобы другой сам догадался.",
      "Резко обрывать контакт без формулировки.",
      "Доказывать свою правоту длинным объяснением."
    ],
    risks: [
      "Обида начнет управлять контактом.",
      "Неназванная потребность превратится в дистанцию."
    ]
  }
];

const fields = [
  "morningFocus",
  "morningSzd",
  "morningVda",
  "morningCommitment",
  "eveningDone",
  "eveningAligned",
  "eveningLeak",
  "eveningTomorrow"
];

const $ = (id) => document.getElementById(id);

function todayKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatToday() {
  const date = new Date();
  $("weekday").textContent = new Intl.DateTimeFormat("ru-RU", { weekday: "long" }).format(date);
  $("dateLabel").textContent = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(date);
}

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function getTodayEntry() {
  return readStore()[todayKey()] || {};
}

function collectEntry() {
  const entry = fields.reduce((draft, field) => {
    draft[field] = $(field).value.trim();
    return draft;
  }, {});

  entry.focusIndex = currentFocusIndex;
  entry.indicatorScores = collectIndicatorScores();
  entry.actionChecks = collectActionChecks();
  return entry;
}

function fillEntry(entry) {
  fields.forEach((field) => {
    $(field).value = entry[field] || "";
  });
}

function saveEntry() {
  const store = readStore();
  store[todayKey()] = {
    ...collectEntry(),
    savedAt: new Date().toISOString()
  };
  writeStore(store);
  updateMeter(store[todayKey()]);
  renderManifestations(store[todayKey()]);
  renderHistory();
}

function clearToday() {
  fillEntry({});
  const store = readStore();
  delete store[todayKey()];
  writeStore(store);
  applyFocus(new Date().getDate(), {});
  renderIndicators({});
  renderManifestations({});
  updateMeter({});
  renderHistory();
}

function applyFocus(index, entry = getTodayEntry()) {
  currentFocusIndex = normalizeFocusIndex(index);
  const item = focusDeck[currentFocusIndex];
  $("focusTitle").textContent = item.title;
  $("focusText").textContent = item.text;
  $("szdSuggestion").textContent = item.szd;
  $("vdaSuggestion").textContent = item.vda;
  $("riskSuggestion").textContent = item.risk;

  if (!$("morningFocus").value.trim()) $("morningFocus").value = item.text;
  if (!$("morningSzd").value.trim()) $("morningSzd").value = item.szd;
  if (!$("morningVda").value.trim()) $("morningVda").value = item.vda;
  renderDailyLists(item, entry);
}

function normalizeFocusIndex(index) {
  const parsed = Number(index);
  if (!Number.isFinite(parsed)) return 0;
  return Math.abs(Math.trunc(parsed)) % focusDeck.length;
}

function renderDailyLists(item, entry = {}) {
  renderActionList("target", item.targets, entry);
  renderActionList("avoid", item.avoids, entry);
  renderActionList("risk", item.risks, entry);
}

function renderActionList(kind, items, entry = {}) {
  const list = $(`${kind}ActionList`);
  const checks = entry.actionChecks || {};
  list.innerHTML = items.map((text, index) => {
    const actionId = `${kind}-${currentFocusIndex}-${index}`;
    const checked = checks[actionId] ? "checked" : "";
    return `
      <label class="action-row ${kind}">
        <input class="action-toggle" type="checkbox" data-action-id="${actionId}" ${checked}>
        <span>${escapeHtml(text)}</span>
      </label>
    `;
  }).join("");

  list.querySelectorAll(".action-toggle").forEach((input) => {
    input.addEventListener("change", saveEntry);
  });
}

function renderIndicators(entry = {}) {
  const scores = entry.indicatorScores || {};
  $("indicatorGrid").innerHTML = indicators.map((indicator) => {
    const score = Number(scores[indicator.id] || 0);
    const groupClass = indicator.group === "СЗД" ? "sun" : "moon";

    return `
      <article class="indicator-card ${groupClass}">
        <header>
          <span>${indicator.group}</span>
          <h4>${escapeHtml(indicator.title)}</h4>
        </header>
        <p>${escapeHtml(indicator.essence)}</p>
        <dl>
          <div>
            <dt>Целевое</dt>
            <dd>${escapeHtml(indicator.target)}</dd>
          </div>
          <div>
            <dt>Избегать</dt>
            <dd>${escapeHtml(indicator.avoid)}</dd>
          </div>
          <div>
            <dt>Риск</dt>
            <dd>${escapeHtml(indicator.risk)}</dd>
          </div>
        </dl>
        <div class="score-control" aria-label="Уровень проявления">
          <button class="score-button ${score === 0 ? "selected" : ""}" type="button" data-indicator-id="${indicator.id}" data-score="0">0</button>
          <button class="score-button ${score === 1 ? "selected" : ""}" type="button" data-indicator-id="${indicator.id}" data-score="1">1</button>
          <button class="score-button ${score === 2 ? "selected" : ""}" type="button" data-indicator-id="${indicator.id}" data-score="2">2</button>
          <span>${scoreLabel(score)}</span>
        </div>
      </article>
    `;
  }).join("");

  $("indicatorGrid").querySelectorAll(".score-button").forEach((button) => {
    button.addEventListener("click", () => {
      setIndicatorScore(button.dataset.indicatorId, Number(button.dataset.score));
      saveEntry();
    });
  });

  updateMeter(entry);
}

function scoreLabel(score) {
  if (score === 2) return "проявлено";
  if (score === 1) return "намечено";
  return "не было";
}

function setIndicatorScore(indicatorId, score) {
  document
    .querySelectorAll(`.score-button[data-indicator-id="${indicatorId}"]`)
    .forEach((button) => {
      button.classList.toggle("selected", Number(button.dataset.score) === score);
    });

  const selected = document.querySelector(`.score-button.selected[data-indicator-id="${indicatorId}"]`);
  const label = selected?.parentElement?.querySelector("span");
  if (label) label.textContent = scoreLabel(score);
}

function collectIndicatorScores() {
  const scores = {};
  indicators.forEach((indicator) => {
    const selected = document.querySelector(`.score-button.selected[data-indicator-id="${indicator.id}"]`);
    scores[indicator.id] = selected ? Number(selected.dataset.score) : 0;
  });
  return scores;
}

function collectActionChecks() {
  const checks = {};
  document.querySelectorAll(".action-toggle").forEach((input) => {
    checks[input.dataset.actionId] = input.checked;
  });
  return checks;
}

function updateMeter(entry = collectEntry()) {
  const scores = entry.indicatorScores || {};
  const manifested = indicators.filter((indicator) => Number(scores[indicator.id] || 0) > 0).length;
  $("meterValue").textContent = `${manifested} / ${indicators.length}`;
  $("meterFill").style.width = `${Math.round((manifested / indicators.length) * 100)}%`;
}

function renderManifestations(entry = collectEntry()) {
  const scores = entry.indicatorScores || {};
  const active = indicators.filter((indicator) => Number(scores[indicator.id] || 0) > 0);
  const list = $("manifestationList");

  if (!active.length) {
    list.innerHTML = '<div class="manifestation-empty">Пока ничего не отмечено. Вернись в карту и поставь 1 или 2 там, где был хотя бы маленький сдвиг.</div>';
    return;
  }

  list.innerHTML = active.map((indicator) => {
    const score = Number(scores[indicator.id] || 0);
    return `
      <article class="manifestation-item">
        <span>${indicator.group}</span>
        <strong>${escapeHtml(indicator.title)}</strong>
        <p>${scoreLabel(score)}: ${escapeHtml(indicator.target)}</p>
      </article>
    `;
  }).join("");
}

function setActiveTab(name) {
  document.querySelectorAll(".tab").forEach((tab) => {
    const active = tab.dataset.tab === name;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  document.querySelectorAll("[data-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === name);
  });
}

function renderHistory() {
  const store = readStore();
  const entries = Object.entries(store).sort(([a], [b]) => b.localeCompare(a));
  const list = $("historyList");

  if (!entries.length) {
    list.innerHTML = '<div class="history-empty">Здесь появятся сохраненные дни.</div>';
    return;
  }

  list.innerHTML = entries.map(([date, entry]) => {
    const scores = entry.indicatorScores || {};
    const count = indicators.filter((indicator) => Number(scores[indicator.id] || 0) > 0).length;
    const label = new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date(`${date}T12:00:00`));

    return `
      <article class="history-item">
        <header>
          <span>${label}</span>
          <span>${count} / ${indicators.length}</span>
        </header>
        ${entry.morningSzd ? `<p><strong>СЗД:</strong> ${escapeHtml(entry.morningSzd)}</p>` : ""}
        ${entry.morningVda ? `<p><strong>ВДА:</strong> ${escapeHtml(entry.morningVda)}</p>` : ""}
        ${entry.eveningAligned ? `<p><strong>Своя линия:</strong> ${escapeHtml(entry.eveningAligned)}</p>` : ""}
        ${entry.eveningTomorrow ? `<p><strong>Завтра:</strong> ${escapeHtml(entry.eveningTomorrow)}</p>` : ""}
      </article>
    `;
  }).join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function boot() {
  const entry = getTodayEntry();
  formatToday();
  fillEntry(entry);
  applyFocus(entry.focusIndex ?? new Date().getDate(), entry);
  renderIndicators(entry);
  renderManifestations(entry);
  renderHistory();

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => setActiveTab(tab.dataset.tab));
  });

  $("refreshFocus").addEventListener("click", () => {
    const next = Math.floor(Math.random() * focusDeck.length);
    applyFocus(next, collectEntry());
    saveEntry();
  });

  $("saveEntry").addEventListener("click", saveEntry);
  $("clearToday").addEventListener("click", clearToday);

  fields.forEach((field) => {
    $(field).addEventListener("input", () => {
      window.clearTimeout(window.autoSaveTimer);
      window.autoSaveTimer = window.setTimeout(saveEntry, 350);
    });
  });
}

boot();
