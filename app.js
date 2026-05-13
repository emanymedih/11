const STORAGE_KEY = "szd-vda-daily-v1";

let currentFocusIndex = 0;
let currentMapFilter = "all";

const sourcesVerified = "13 мая 2026";

const sources = {
  astroSun: {
    title: "Astrodienst: Sun",
    url: "https://www.astro.com/astrowiki/en/Sun",
    theme: "жизненная сила, идентичность, творческая интеграция"
  },
  astroPisces: {
    title: "Astrodienst: Pisces",
    url: "https://www.astro.com/astrowiki/en/Pisces",
    theme: "Рыбы, чувствительность, служение, растворение границ"
  },
  astroTenth: {
    title: "Astrodienst: Tenth House",
    url: "https://www.astro.com/astrowiki/en/Tenth_house",
    theme: "профессия, общественная роль, достижения, признание"
  },
  skyTenth: {
    title: "Skyscript: 10th House",
    url: "https://www.skyscript.co.uk/10.html",
    theme: "репутация, честь, профессия, публичное положение"
  },
  astroMoon: {
    title: "Astrodienst: Moon",
    url: "https://www.astro.com/astrowiki/en/Moon",
    theme: "эмоциональные потребности, инстинктивная реакция, безопасность"
  },
  astroCancer: {
    title: "Astrodienst: Cancer",
    url: "https://www.astro.com/astrowiki/en/Cancer",
    theme: "Рак, эмпатия, забота, эмоциональная восприимчивость"
  },
  skyCancer: {
    title: "Skyscript: Cancer",
    url: "https://www.skyscript.co.uk/pdf/signs/cancer/index.html",
    theme: "чувствительность, память, эмоциональные впечатления"
  },
  astroEighth: {
    title: "Astrodienst: Eighth House",
    url: "https://www.astro.com/astrowiki/en/Eighth_house",
    theme: "кризисы, метаморфоза, отпускание, глубинные процессы"
  },
  skyEighth: {
    title: "Skyscript: 8th House",
    url: "https://www.skyscript.co.uk/8.html",
    theme: "страхи, тревога, потери, уязвимость, трансформация"
  },
  astroMars: {
    title: "Astrodienst: Mars",
    url: "https://www.astro.com/astrowiki/en/Mars",
    theme: "инициатива, действие, самоутверждение"
  },
  astroSaturn: {
    title: "Astrodienst: Saturn",
    url: "https://www.astro.com/astrowiki/en/Saturn",
    theme: "границы, ответственность, зрелость, дисциплина"
  },
  astroAspect: {
    title: "Astrodienst: Aspects",
    url: "https://www.astro.com/astrowiki/en/Aspect",
    theme: "напряженные аспекты как потенциал развития"
  },
  astroUranus: {
    title: "Astrodienst: Uranus",
    url: "https://www.astro.com/astrowiki/en/Uranus",
    theme: "освобождение, внезапность, разрыв с привычным"
  },
  astroNeptune: {
    title: "Astrodienst: Neptune",
    url: "https://www.astro.com/astrowiki/en/Neptune",
    theme: "интуиция, вдохновение, растворение, риск иллюзии"
  }
};

const indicators = [
  {
    id: "visibleExpertise",
    group: "СЗД",
    title: "Публичная экспертность",
    essence: "Писать, говорить, вести канал, давать разборы, консультировать.",
    target: "Сделать один видимый экспертный шаг от своего имени.",
    avoid: "Прятаться в подготовку, ждать идеальной формы, оставаться невидимой.",
    risk: "Сила есть, но ее не видят и не связывают с тобой.",
    sourceIds: ["astroSun", "astroTenth", "skyTenth"],
    recommendations: [
      "Опирайся на Солнце как центр личности: проявляй не роль помощницы, а собственный авторский вектор.",
      "Используй 10 дом как поле профессии и общественной роли: делай шаги, которые могут быть увидены и признаны.",
      "Показывай экспертность через публичный результат: разбор, консультацию, кейс, вывод, позицию."
    ]
  },
  {
    id: "meaningfulUse",
    group: "СЗД",
    title: "Польза и смысл",
    essence: "Работа, где есть помощь, психология, обучение, творчество или социальная польза.",
    target: "Выбрать действие, которое кому-то реально помогает или проясняет ситуацию.",
    avoid: "Делать только механическое, чужое или бессмысленное.",
    risk: "Витальность падает, если действие не связано со смыслом.",
    sourceIds: ["astroPisces", "astroNeptune", "astroTenth"],
    recommendations: [
      "Проверяй действие по Рыбам: есть ли в нем помощь, смысл, сострадание, творчество или тонкое понимание.",
      "Не растворяйся в пользе без формы: связывай смысл с профессиональной ролью 10 дома.",
      "Выбирай формат, где интуиция становится полезной для другого человека: разбор, обучение, рекомендация."
    ]
  },
  {
    id: "methodPackaging",
    group: "СЗД",
    title: "Методика вместо тумана",
    essence: "Интуиция становится системой: диагностика, этапы, выводы, рекомендации.",
    target: "Оформить ощущение в структуру, схему, чеклист или понятный вывод.",
    avoid: "Оставаться на уровне 'я чувствую', не показывая опору мысли.",
    risk: "Ценность сложно увидеть, если нет формы.",
    sourceIds: ["astroPisces", "astroNeptune", "astroSaturn"],
    recommendations: [
      "Давай Нептуну и Рыбам сосуд Сатурна: схема, этапы, границы, критерии.",
      "Переводи чувствование в метод: наблюдение, символ, вывод, рекомендация, следующий шаг.",
      "Если смысл расплывается, возвращайся к структуре: что я вижу, что это значит, что делать."
    ]
  },
  {
    id: "professionalResponsibility",
    group: "СЗД",
    title: "Профессиональная ответственность",
    essence: "Вести проект, делать авторский продукт, выступать от своего имени.",
    target: "Взять авторство за решение, продукт, позицию или следующий шаг.",
    avoid: "Ждать разрешения, быть только помощницей, не называть свою роль.",
    risk: "Ответственность есть, но статус остается незафиксированным.",
    sourceIds: ["astroSun", "astroTenth", "astroSaturn"],
    recommendations: [
      "10 дом требует авторства: называй свою роль, продукт, решение и область ответственности.",
      "Сатурн усиливает статус через зрелость: обещай только то, что можешь выдержать и довести.",
      "Солнце в профессиональной зоне просит говорить от первого лица: я вижу, я предлагаю, я веду."
    ]
  },
  {
    id: "statusProof",
    group: "СЗД",
    title: "Подтверждение статуса",
    essence: "Кейсы, результаты, отзывы, портфолио, публикации.",
    target: "Зафиксировать одно доказательство ценности: результат, отзыв, кейс, публикацию.",
    avoid: "Обесценивать результат или считать его недостаточно важным.",
    risk: "Цена и уверенность проседают без видимых подтверждений.",
    sourceIds: ["astroTenth", "skyTenth", "astroSaturn"],
    recommendations: [
      "Фиксируй плоды 10 дома: кейсы, признание, отзывы, публикации, результаты труда.",
      "Не оставляй достижения в частном поле: статус появляется, когда результат имеет форму и место.",
      "Используй Сатурн как архив доказательств: регулярно собирай то, что подтверждает компетентность."
    ]
  },
  {
    id: "emotionalPause",
    group: "ВДА",
    title: "Пауза перед реакцией",
    essence: "Перед обидой спросить: я защищаюсь или решаю задачу?",
    target: "Сделать паузу и назвать реальную задачу до ответа.",
    avoid: "Реагировать из обиды, защиты или внутренней тревоги.",
    risk: "Эмоция начинает управлять действием.",
    sourceIds: ["astroMoon", "astroCancer", "skyCancer"],
    recommendations: [
      "Луна показывает первичную реакцию до фильтра сознания: сначала назови чувство, потом выбирай действие.",
      "Рак усиливает восприимчивость: не делай чувствительность доказательством угрозы.",
      "Если включилась защита, создай безопасную паузу и возвращайся к фактам ситуации."
    ]
  },
  {
    id: "anxietyToAction",
    group: "ВДА",
    title: "Тревога в действие",
    essence: "План, уточнение договоренности, звонок, маленькая закрытая задача.",
    target: "Перевести тревогу в один конкретный следующий шаг.",
    avoid: "Крутить сценарии в голове без внешнего действия.",
    risk: "Тревога растет, если не получает формы.",
    sourceIds: ["astroEighth", "skyEighth", "astroMars", "astroSaturn"],
    recommendations: [
      "8 дом связан с тревогой, потерей и глубинной уязвимостью: не игнорируй страх, но не отдавай ему управление.",
      "Марс дает выход через действие: выбери один шаг, который можно сделать сейчас.",
      "Сатурн стабилизирует тревогу через порядок: план, срок, граница, минимальный следующий шаг."
    ]
  },
  {
    id: "directCommunication",
    group: "ВДА",
    title: "Прямая коммуникация",
    essence: "Не молчаливое наказание, а ясная формулировка потребности и шага.",
    target: "Сказать: мне важно вот это, я предлагаю такой шаг.",
    avoid: "Молчать, исчезать, наказывать дистанцией.",
    risk: "Контакт становится полем обиды, а не решения.",
    sourceIds: ["astroMars", "astroSaturn", "astroAspect"],
    recommendations: [
      "Марс отвечает за самоутверждение: говори прямо, но не разрушительно.",
      "Сатурн держит форму контакта: коротко назови границу, срок или условие.",
      "Напряженный аспект лучше проживать как задачу развития: не исчезать, а формулировать следующий шаг."
    ]
  },
  {
    id: "moneyFacts",
    group: "ВДА",
    title: "Деньги через факты",
    essence: "Опыт, результат, рынок и ценность вместо автоматического снижения цены.",
    target: "Перед уступкой проверить факты и ценность работы.",
    avoid: "Снижать цену из страха или желания быть удобной.",
    risk: "Ценность уходит первой, а усталость приходит следом.",
    sourceIds: ["astroTenth", "skyTenth", "astroSaturn", "astroEighth"],
    recommendations: [
      "Цена должна опираться на 10 дом: профессиональную роль, результат, репутацию и ответственность.",
      "Сатурн просит границы обмена: объем, срок, стоимость, условия.",
      "Если страх денег активирует 8 дом, сначала отдели реальный риск от эмоционального сценария."
    ]
  },
  {
    id: "responsibilityBoundary",
    group: "ВДА",
    title: "Граница ответственности",
    essence: "Не спасать партнера или клиента, а отделять свое от чужого.",
    target: "Спросить: это моя ответственность или я беру чужую?",
    avoid: "Спасать, тащить, додумывать и компенсировать за другого.",
    risk: "Энергия уходит в чужой контур.",
    sourceIds: ["astroPisces", "astroNeptune", "astroSaturn", "astroEighth"],
    recommendations: [
      "Рыбы и Нептун дают сострадание, но требуют проверки границ, чтобы помощь не стала растворением.",
      "Сатурн отделяет свое от чужого: что я реально беру, а что остается у другого человека.",
      "8 дом показывает темы слияния и чужих ресурсов: не компенсируй за другого его часть ответственности."
    ]
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
    ],
    sourceIds: ["astroSun", "astroPisces", "astroTenth", "astroNeptune", "astroSaturn"],
    recommendationIds: ["visibleExpertise", "methodPackaging", "professionalResponsibility"]
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
    ],
    sourceIds: ["astroTenth", "skyTenth", "astroSaturn", "astroEighth"],
    recommendationIds: ["statusProof", "moneyFacts"]
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
    ],
    sourceIds: ["astroPisces", "astroNeptune", "astroSaturn", "astroEighth"],
    recommendationIds: ["responsibilityBoundary", "directCommunication"]
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
    ],
    sourceIds: ["astroPisces", "astroNeptune", "astroSaturn"],
    recommendationIds: ["methodPackaging", "anxietyToAction"]
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
    ],
    sourceIds: ["astroMoon", "astroCancer", "astroMars", "astroSaturn", "astroAspect"],
    recommendationIds: ["directCommunication", "emotionalPause"]
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
  updateBrief(store[todayKey()]);
  renderManifestations(store[todayKey()]);
  renderAutoSummary(store[todayKey()]);
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
  updateBrief({});
  renderAutoSummary({});
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
  renderOnlineRecommendations(item);
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
  syncFilterButtons();

  const filteredIndicators = indicators.filter((indicator) => {
    const score = Number(scores[indicator.id] || 0);
    if (currentMapFilter === "szd") return indicator.group === "СЗД";
    if (currentMapFilter === "vda") return indicator.group === "ВДА";
    if (currentMapFilter === "active") return score > 0;
    return true;
  });

  if (!filteredIndicators.length) {
    $("indicatorGrid").innerHTML = '<div class="map-empty">В этом фильтре пока ничего не отмечено.</div>';
    updateMeter(entry);
    renderSourceDock();
    return;
  }

  $("indicatorGrid").innerHTML = filteredIndicators.map((indicator) => {
    const score = Number(scores[indicator.id] || 0);
    const groupClass = indicator.group === "СЗД" ? "sun" : "moon";
    const sourceLinks = indicator.sourceIds.map((sourceId) => sourceLink(sourceId)).join("");
    const recItems = indicator.recommendations
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");

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
        <div class="evidence-block">
          <strong>Рекомендации из источников</strong>
          <ul>${recItems}</ul>
          <div class="source-links">${sourceLinks}</div>
        </div>
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
      if (currentMapFilter === "active") renderIndicators(collectEntry());
    });
  });

  updateMeter(entry);
  updateBrief(entry);
  renderAutoSummary(entry);
  renderSourceDock();
}

function syncFilterButtons() {
  document.querySelectorAll(".filter-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === currentMapFilter);
  });
}

function renderOnlineRecommendations(item = focusDeck[currentFocusIndex]) {
  const sourceIds = [...new Set(item.sourceIds || [])];
  const relatedIndicators = (item.recommendationIds || [])
    .map((id) => indicators.find((indicator) => indicator.id === id))
    .filter(Boolean);

  $("onlineRecommendationList").innerHTML = `
    <div class="evidence-meta">
      <span>астро-источники проверены: ${sourcesVerified}</span>
      <span>${sourceIds.length} источника</span>
    </div>
    ${relatedIndicators.map((indicator) => {
      const sourceList = indicator.sourceIds.map((sourceId) => sourceLink(sourceId)).join("");
      const recs = indicator.recommendations.slice(0, 2).map((rec) => `<li>${escapeHtml(rec)}</li>`).join("");
      return `
        <article class="recommendation-card">
          <header>
            <span>${indicator.group}</span>
            <strong>${escapeHtml(indicator.title)}</strong>
          </header>
          <ul>${recs}</ul>
          <div class="source-links">${sourceList}</div>
        </article>
      `;
    }).join("")}
  `;
}

function renderSourceDock() {
  $("sourceDock").innerHTML = `
    <span>авторитетные астрологические источники, проверены: ${sourcesVerified}</span>
    <div>
      ${Object.keys(sources).map((sourceId) => sourceLink(sourceId)).join("")}
    </div>
  `;
}

function sourceLink(sourceId) {
  const source = sources[sourceId];
  if (!source) return "";
  return `<a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.title)}</a>`;
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

function getStats(entry = collectEntry()) {
  const scores = entry.indicatorScores || {};
  const szdItems = indicators.filter((indicator) => indicator.group === "СЗД");
  const vdaItems = indicators.filter((indicator) => indicator.group === "ВДА");
  const szdCount = szdItems.filter((indicator) => Number(scores[indicator.id] || 0) > 0).length;
  const vdaCount = vdaItems.filter((indicator) => Number(scores[indicator.id] || 0) > 0).length;
  const active = indicators.filter((indicator) => Number(scores[indicator.id] || 0) > 0);
  const strong = [...active].sort((a, b) => Number(scores[b.id] || 0) - Number(scores[a.id] || 0));
  const quiet = indicators.filter((indicator) => Number(scores[indicator.id] || 0) === 0);
  const actionInputs = Array.from(document.querySelectorAll(".action-toggle"));
  const checkedActions = actionInputs.filter((input) => input.checked).length;

  return {
    szdCount,
    szdTotal: szdItems.length,
    vdaCount,
    vdaTotal: vdaItems.length,
    actionDone: checkedActions,
    actionTotal: actionInputs.length,
    strong,
    quiet
  };
}

function updateBrief(entry = collectEntry()) {
  const stats = getStats(entry);
  $("szdBrief").textContent = `${stats.szdCount} / ${stats.szdTotal}`;
  $("vdaBrief").textContent = `${stats.vdaCount} / ${stats.vdaTotal}`;
  $("actionBrief").textContent = `${stats.actionDone} / ${stats.actionTotal}`;

  if (stats.actionTotal && stats.actionDone === stats.actionTotal) {
    $("dayNudge").textContent = "день собран";
  } else if (stats.strong.length) {
    $("dayNudge").textContent = `держи линию: ${stats.strong[0].title.toLowerCase()}`;
  } else {
    $("dayNudge").textContent = "сначала выбери один шаг";
  }
}

function renderAutoSummary(entry = collectEntry()) {
  const stats = getStats(entry);
  const strongest = stats.strong.slice(0, 2).map((indicator) => indicator.title).join(", ") || "пока не отмечено";
  const attention = stats.quiet.slice(0, 2).map((indicator) => indicator.title).join(", ") || "все ключевые показатели затронуты";
  const actionText = stats.actionTotal
    ? `${stats.actionDone} из ${stats.actionTotal} пунктов отмечено`
    : "чек-лист еще не собран";

  $("autoSummary").innerHTML = `
    <article class="summary-card">
      <span>баланс</span>
      <strong>СЗД ${stats.szdCount}/${stats.szdTotal} · ВДА ${stats.vdaCount}/${stats.vdaTotal}</strong>
      <p>видно, где день ушел во внешнее проявление, а где держалась внутренняя опора</p>
    </article>
    <article class="summary-card">
      <span>сильная линия</span>
      <strong>${escapeHtml(strongest)}</strong>
      <p>это стоит повторить или усилить завтра</p>
    </article>
    <article class="summary-card">
      <span>зона внимания</span>
      <strong>${escapeHtml(attention)}</strong>
      <p>не как провал, а как следующий материал для настройки</p>
    </article>
    <article class="summary-card">
      <span>действия</span>
      <strong>${escapeHtml(actionText)}</strong>
      <p>вечером лучше смотреть на факты, не на внутреннюю оценку</p>
    </article>
  `;
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
  updateBrief(entry);
  renderAutoSummary(entry);
  renderHistory();

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => setActiveTab(tab.dataset.tab));
  });

  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      currentMapFilter = button.dataset.filter;
      renderIndicators(collectEntry());
    });
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
