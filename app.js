const STORAGE_KEY = "szd-vda-daily-v1";

let currentFocusIndex = 0;
let currentMapFilter = "all";
let currentFactorFilter = "all";

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
  skyMars: {
    title: "Skyscript: Mars",
    url: "https://www.skyscript.co.uk/mars.html",
    theme: "воля к действию, напор, конфликт, смелость"
  },
  astroSaturn: {
    title: "Astrodienst: Saturn",
    url: "https://www.astro.com/astrowiki/en/Saturn",
    theme: "границы, ответственность, зрелость, дисциплина"
  },
  skySaturn: {
    title: "Skyscript: Saturn",
    url: "https://www.skyscript.co.uk/saturn.html",
    theme: "ограничения, структура, выдержка, долг"
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
  skyUranus: {
    title: "Skyscript: Uranus",
    url: "https://www.skyscript.co.uk/uranus.html",
    theme: "перемены, независимость, внезапное нарушение шаблона"
  },
  astroNeptune: {
    title: "Astrodienst: Neptune",
    url: "https://www.astro.com/astrowiki/en/Neptune",
    theme: "интуиция, вдохновение, растворение, риск иллюзии"
  },
  skyNeptune: {
    title: "Skyscript: Neptune",
    url: "https://www.skyscript.co.uk/neptune.html",
    theme: "воображение, идеализация, тонкое восприятие, неясность"
  }
};

const natalFactors = [
  {
    id: "sun",
    type: "planet",
    title: "Солнце",
    placement: "Рыбы, 10 дом",
    meaning: "Воля, жизненная сила, право быть видимой и собирать личный вектор вокруг смысла.",
    advice: "Выбирать действия, где твоя интуиция, помощь и профессиональная позиция становятся видимыми для других.",
    target: "Сказать или показать от своего имени: разбор, вывод, позицию, услугу, кейс.",
    avoid: "Считать, что сначала надо стать идеальной, а уже потом проявляться.",
    risk: "Внутренний свет остается в частном поле, а статус не закрепляется.",
    practice: "Один публичный экспертный жест в день: пост, голосовое, консультационный вывод, мини-разбор.",
    sourceIds: ["astroSun", "astroPisces", "astroTenth", "skyTenth"]
  },
  {
    id: "moon",
    type: "planet",
    title: "Луна",
    placement: "Рак, 8 дом",
    meaning: "Эмоциональная потребность в безопасности, тонкая реакция на близость, риск, доверие и уязвимость.",
    advice: "Сначала признавать чувство, затем отделять его от факта и от реальной задачи.",
    target: "Перед ответом назвать себе: что я чувствую, что произошло, какой следующий шаг взрослый.",
    avoid: "Реагировать из обиды, проверять людей молчанием или защищаться до прояснения фактов.",
    risk: "Чувствительность становится управлением через тревогу, а не навигацией.",
    practice: "Пауза 90 секунд перед сложным сообщением, затем одна короткая фраза потребности.",
    sourceIds: ["astroMoon", "astroCancer", "skyCancer", "astroEighth", "skyEighth"]
  },
  {
    id: "mars",
    type: "planet",
    title: "Марс",
    placement: "в связке с Сатурном",
    meaning: "Действие, инициатива, защита границ и способность переводить напряжение в поступок.",
    advice: "Делать маленький конкретный шаг до того, как тревога начнет разрастаться в сценарии.",
    target: "Уточнить, написать, назначить срок, закрыть одну задачу, сказать прямо.",
    avoid: "Копить напряжение, затем обрывать контакт или резко доказывать свою правоту.",
    risk: "Энергия действия застревает между импульсом и внутренним запретом.",
    practice: "Формула Марса: один глагол, один адресат, один срок.",
    sourceIds: ["astroMars", "skyMars", "astroSaturn", "skySaturn"]
  },
  {
    id: "saturn",
    type: "planet",
    title: "Сатурн",
    placement: "границы, ответственность, статус",
    meaning: "Зрелость, форма, дисциплина, способность держать обещание, цену, срок и профессиональную роль.",
    advice: "Давать интуиции структуру: правила, этапы, условия, повторяемую методику.",
    target: "Зафиксировать объем, цену, срок, формат или критерий результата.",
    avoid: "Обещать слишком много, брать чужую часть ответственности, размывать договоренности.",
    risk: "Без формы смысл утекает, а усталость маскируется под заботу.",
    practice: "Перед каждым новым делом записать границу: что входит, что не входит, когда завершено.",
    sourceIds: ["astroSaturn", "skySaturn", "astroTenth", "skyTenth"]
  },
  {
    id: "uranus",
    type: "planet",
    title: "Уран",
    placement: "напряжение к личной системе",
    meaning: "Свобода, обновление, внезапные развороты и желание выйти из тесной схемы.",
    advice: "Оставлять себе пространство выбора, но не превращать свободу в резкий разрыв.",
    target: "Менять формат осознанно: предложить новый вариант, а не исчезнуть без объяснения.",
    avoid: "Срывать договоренность из-за ощущения внутренней тесноты.",
    risk: "Рывок к свободе может разрушать то, что можно было перестроить мягче.",
    practice: "Если хочется все отменить, сначала предложить один обновленный формат или новый срок.",
    sourceIds: ["astroUranus", "skyUranus", "astroAspect"]
  },
  {
    id: "neptune",
    type: "planet",
    title: "Нептун",
    placement: "Рыбы, интуиция, туман",
    meaning: "Тонкое восприятие, вдохновение, сострадание, способность видеть невидимый смысл.",
    advice: "Доверять интуиции, но переводить ее в проверяемые формулировки, факты и действия.",
    target: "Оформить ощущение в вывод: что я вижу, почему это важно, что делать дальше.",
    avoid: "Идеализировать, спасать, обещать из сочувствия или оставлять смысл без формы.",
    risk: "Ценность растворяется в тумане, если не названы границы и следующий шаг.",
    practice: "Каждую интуитивную мысль завершать строкой: практическая рекомендация.",
    sourceIds: ["astroNeptune", "skyNeptune", "astroPisces", "astroSaturn"]
  },
  {
    id: "pisces",
    type: "sign",
    title: "Рыбы",
    placement: "знак Солнца",
    meaning: "Смысл, помощь, эмпатия, творчество, духовная и психологическая чувствительность.",
    advice: "Строить профессиональность вокруг тонкого понимания людей, но не растворяться в их запросах.",
    target: "Выбрать дело, где есть смысл, польза, обучение, творчество или помогающая функция.",
    avoid: "Делать только механическое или становиться удобной за счет своей энергии.",
    risk: "Сострадание без границ превращается в спасательство.",
    practice: "Проверка перед согласием: это мой вклад или я компенсирую чужую часть?",
    sourceIds: ["astroPisces", "astroNeptune", "skySaturn"]
  },
  {
    id: "cancer",
    type: "sign",
    title: "Рак",
    placement: "знак Луны",
    meaning: "Память, забота, восприимчивость, привязанность, потребность в эмоциональной защищенности.",
    advice: "Не спорить со своей чувствительностью, а давать ей контейнер: слова, границы, факты.",
    target: "Назвать потребность прямо и мягко, не пряча ее в обиду.",
    avoid: "Ждать, что другой сам догадается, и наказывать дистанцией.",
    risk: "Защитная реакция может подменить реальный контакт.",
    practice: "Фраза дня: мне важно вот это, я предлагаю такой шаг.",
    sourceIds: ["astroCancer", "skyCancer", "astroMoon"]
  },
  {
    id: "tenthHouse",
    type: "house",
    title: "10 дом",
    placement: "профессия, статус, общественная роль",
    meaning: "Поле видимости, достижений, репутации, ответственности и признания результатов.",
    advice: "Собирать не только внутреннюю уверенность, но и внешние доказательства профессиональной ценности.",
    target: "Опубликовать кейс, обновить портфолио, назвать роль, показать результат или попросить отзыв.",
    avoid: "Оставлять достижения в личных заметках и считать статус чем-то нескромным.",
    risk: "Работы много, но социальное подтверждение не накапливается.",
    practice: "Каждую неделю добавлять один артефакт статуса: кейс, отзыв, результат, публикацию.",
    sourceIds: ["astroTenth", "skyTenth", "astroSun", "astroSaturn"]
  },
  {
    id: "eighthHouse",
    type: "house",
    title: "8 дом",
    placement: "глубина, страхи, чужие ресурсы, трансформация",
    meaning: "Темы уязвимости, доверия, денег, кризисов, слияния и внутренней перестройки.",
    advice: "Работать с тревогой через факты, границы и минимальное действие, а не через контроль всего.",
    target: "Проверить реальный риск, отделить свое от чужого, сделать один шаг вместо прокручивания сценариев.",
    avoid: "Снижать цену из страха, спасать другого или отдавать управление тревоге.",
    risk: "Сильная глубина превращается в внутреннее давление, если нет выхода в действие.",
    practice: "Таблица из трех строк: факт, страх, следующий шаг.",
    sourceIds: ["astroEighth", "skyEighth", "astroMoon", "astroSaturn"]
  },
  {
    id: "marsSaturn",
    type: "aspect",
    title: "Марс и Сатурн",
    placement: "связка действия и дисциплины",
    meaning: "Напряжение между импульсом и контролем, которое можно превратить в устойчивую силу.",
    advice: "Не ждать вдохновения для действия, а задавать маленькую рамку и выполнять ее.",
    target: "Сделать один ограниченный по времени шаг: 20 минут, один документ, одно сообщение.",
    avoid: "То давить на себя, то полностью останавливаться.",
    risk: "Сила уходит в внутреннее сопротивление вместо внешнего результата.",
    practice: "Таймер на 20 минут и ясный критерий готовности.",
    sourceIds: ["astroMars", "skyMars", "astroSaturn", "skySaturn", "astroAspect"]
  },
  {
    id: "uranusNeptuneTension",
    type: "aspect",
    title: "Напряжения к Урану и Нептуну",
    placement: "внезапность, туман, идеализация",
    meaning: "Риск качелей между резкой свободой и растворением в неопределенности.",
    advice: "Каждую сильную эмоцию или вдохновение проверять реальностью: фактами, сроками, границами.",
    target: "Не исчезать и не обещать в тумане, а назвать новый формат, факт или ближайший шаг.",
    avoid: "Резко менять курс, идеализировать людей, делать выводы без проверки.",
    risk: "Можно потерять ясность именно там, где нужна взрослая навигация.",
    practice: "Три вопроса: что известно, что я додумываю, какой шаг проверит реальность?",
    sourceIds: ["astroUranus", "skyUranus", "astroNeptune", "skyNeptune", "astroAspect"]
  },
  {
    id: "sunPiscesTenth",
    type: "synthesis",
    title: "Солнце в Рыбах в 10 доме",
    placement: "главная профессиональная связка",
    meaning: "Твой ресурс раскрывается, когда тонкое видение становится публичной пользой и профессиональной ролью.",
    advice: "Строить экспертность как авторский метод помощи: интуиция плюс структура плюс видимый результат.",
    target: "Упаковать одно наблюдение в понятный продукт: разбор, консультацию, рубрику, методику.",
    avoid: "Оставаться только в эмпатии без статуса, цены, формы и авторства.",
    risk: "Чем сильнее внутренний смысл, тем больнее его невидимость.",
    practice: "Каждый день: один смысловой вывод и одна внешняя форма для него.",
    sourceIds: ["astroSun", "astroPisces", "astroTenth", "skyTenth", "astroNeptune", "astroSaturn"]
  },
  {
    id: "moonCancerEighth",
    type: "synthesis",
    title: "Луна в Раке и 8 дом",
    placement: "эмоциональная глубина и безопасность",
    meaning: "Чувствительность тонко считывает риск, но ей нужна взрослая опора, чтобы не управлять через страх.",
    advice: "Создавать безопасность через ясность: что я чувствую, что реально происходит, где моя граница.",
    target: "В сложной теме денег, близости или доверия сначала проверить факты, потом действовать.",
    avoid: "Сливаться, спасать, подозревать, молчать или снижать ценность работы из тревоги.",
    risk: "Эмоциональная глубина может стать закрытой системой, если не выводить ее в слова.",
    practice: "Одна честная фраза вместо внутреннего сценария.",
    sourceIds: ["astroMoon", "astroCancer", "skyCancer", "astroEighth", "skyEighth", "astroSaturn"]
  }
];

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
    title: "Проявить экспертность через ясную форму",
    text: "Это не прогноз, а рабочая точка настройки: перевести тонкое наблюдение в понятный вывод или рекомендацию и показать его вовне.",
    szd: "Опубликовать короткий экспертный разбор: наблюдение, вывод, рекомендация, следующий шаг.",
    vda: "Перед эмоциональной реакцией уточнить: я сейчас защищаюсь или решаю реальную задачу?",
    risk: "Остаться в подготовке и отложить видимый профессиональный шаг.",
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
    title: "Подтвердить профессиональную ценность фактом",
    text: "Фокус дня: зафиксировать одно видимое доказательство результата. Так статус опирается не на внутреннее напряжение, а на факты.",
    szd: "Добавить кейс, отзыв, результат или фрагмент портфолио туда, где это могут увидеть.",
    vda: "При сомнении свериться с фактами: опыт, результат, рынок, ценность.",
    risk: "Обесценить работу или снизить цену до проверки реальной картины.",
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
    title: "Помогать без спасательства",
    text: "Фокус дня: сохранять заботу, не беря чужую ответственность. Помощь должна иметь границы, иначе энергия уходит из твоего контура.",
    szd: "Сформулировать предложение услуги, консультации или продукта от первого лица.",
    vda: "Спросить себя: это моя зона ответственности или я беру чужую часть?",
    risk: "Спасать партнера или клиента за счет своей энергии и ясности.",
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
    title: "Превратить интуицию в метод",
    text: "Фокус дня: дать ощущению структуру: этапы, критерии, вывод и следующий шаг. Так тонкое видение становится профессиональным инструментом.",
    szd: "Описать один процесс как мини-методику: диагностика, вывод, рекомендация, следующий шаг.",
    vda: "Если появляется тревога, перевести ее в три простых действия.",
    risk: "Остаться в ощущениях и не довести смысл до рабочей формы.",
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
    title: "Сказать прямо, не исчезая",
    text: "Фокус дня: в напряжении не уходить в молчание и не обрывать контакт, а коротко назвать потребность, границу и следующий шаг.",
    szd: "Сформулировать одну профессиональную позицию без лишних оправданий.",
    vda: "В конфликте заменить молчание фразой: мне важно вот это, я предлагаю такой шаг.",
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

function renderNatalFactors() {
  syncFactorButtons();

  const filteredFactors = natalFactors.filter((factor) => {
    if (currentFactorFilter === "all") return true;
    return factor.type === currentFactorFilter;
  });

  if (!filteredFactors.length) {
    $("factorGrid").innerHTML = '<div class="map-empty">В этом фильтре пока нет показателей.</div>';
    return;
  }

  $("factorGrid").innerHTML = filteredFactors.map((factor) => {
    const sourceLinks = factor.sourceIds.map((sourceId) => sourceLink(sourceId)).join("");

    return `
      <article class="factor-card ${factor.type}">
        <header>
          <span>${factorTypeLabel(factor.type)}</span>
          <h4>${escapeHtml(factor.title)}</h4>
          <p>${escapeHtml(factor.placement)}</p>
        </header>
        <p class="factor-meaning">${escapeHtml(factor.meaning)}</p>
        <dl>
          <div>
            <dt>Совет</dt>
            <dd>${escapeHtml(factor.advice)}</dd>
          </div>
          <div>
            <dt>Целевое действие</dt>
            <dd>${escapeHtml(factor.target)}</dd>
          </div>
          <div>
            <dt>Избегать</dt>
            <dd>${escapeHtml(factor.avoid)}</dd>
          </div>
          <div>
            <dt>Риск</dt>
            <dd>${escapeHtml(factor.risk)}</dd>
          </div>
        </dl>
        <div class="practice-line">
          <span>практика</span>
          <p>${escapeHtml(factor.practice)}</p>
        </div>
        <div class="source-links">${sourceLinks}</div>
      </article>
    `;
  }).join("");
}

function syncFilterButtons() {
  document.querySelectorAll(".filter-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === currentMapFilter);
  });
}

function syncFactorButtons() {
  document.querySelectorAll(".factor-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.factorFilter === currentFactorFilter);
  });
}

function factorTypeLabel(type) {
  const labels = {
    planet: "планета",
    sign: "знак",
    house: "дом",
    aspect: "аспект",
    synthesis: "связка"
  };
  return labels[type] || "показатель";
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
  const scores = { ...(getTodayEntry().indicatorScores || {}) };
  indicators.forEach((indicator) => {
    const selected = document.querySelector(`.score-button.selected[data-indicator-id="${indicator.id}"]`);
    if (selected) {
      scores[indicator.id] = Number(selected.dataset.score);
    } else if (!(indicator.id in scores)) {
      scores[indicator.id] = 0;
    }
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
  renderNatalFactors();
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

  document.querySelectorAll(".factor-button").forEach((button) => {
    button.addEventListener("click", () => {
      currentFactorFilter = button.dataset.factorFilter;
      renderNatalFactors();
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
