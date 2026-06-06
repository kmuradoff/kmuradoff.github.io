/* ============================================================
   CV DATA — Kamal Muradov — RU / EN
   ============================================================ */
export const CV = {
  // ---- shared / language-agnostic ----
  meta: {
    email: "muradoffk@gmail.com",
    github: "https://github.com/kmuradoff",
    githubHandle: "kmuradoff",
    linkedin: "https://www.linkedin.com/in/muradoffk",
    telegram: "https://t.me/muradoffk",
    hh: "https://hh.ru/resume/",
  },

  graph: {
    nodes: [
      { id: "client",   label: "Client",        group: "edge",  size: 1.0 },
      { id: "gateway",  label: "API Gateway",   group: "edge",  size: 1.1 },
      { id: "crm",      label: "CRM Service",   group: "core",  size: 1.4 },
      { id: "docs",     label: "Docs Service",  group: "core",  size: 1.0 },
      { id: "tasks",    label: "Tasks Service", group: "core",  size: 1.0 },
      { id: "chat",     label: "WS / Chat",     group: "core",  size: 1.0 },
      { id: "kafka",    label: "Kafka",         group: "bus",   size: 1.2 },
      { id: "redis",    label: "Redis",         group: "data",  size: 0.95 },
      { id: "pg",       label: "PostgreSQL",    group: "data",  size: 1.1 },
      { id: "mongo",    label: "MongoDB",       group: "data",  size: 1.0 },
      { id: "k8s",      label: "Kubernetes",    group: "infra", size: 1.15 },
      { id: "obs",      label: "Prometheus",    group: "infra", size: 0.9 },
    ],
    links: [
      ["client", "gateway"], ["gateway", "crm"], ["crm", "docs"],
      ["crm", "tasks"], ["crm", "chat"], ["crm", "kafka"], ["docs", "mongo"],
      ["crm", "pg"], ["tasks", "pg"], ["crm", "redis"], ["kafka", "tasks"],
      ["kafka", "obs"], ["k8s", "crm"], ["k8s", "docs"], ["k8s", "tasks"],
      ["k8s", "chat"], ["obs", "k8s"],
    ],
  },

  stack: [
    { cat: { ru: "Языки", en: "Languages" }, items: ["Java 17", "Kotlin", "Python", "TypeScript", "JavaScript"] },
    { cat: { ru: "Spring & фреймворки", en: "Spring & frameworks" }, items: ["Spring Boot", "Spring Data", "Spring Security", "Spring Cloud", "Ktor", "Koin", "Vue", "React"] },
    { cat: { ru: "Данные и брокеры", en: "Data & messaging" }, items: ["PostgreSQL", "MongoDB", "Redis", "Kafka", "Liquibase", "GridFS"] },
    { cat: { ru: "Инфраструктура", en: "Infrastructure" }, items: ["Kubernetes", "Docker", "Istio", "Jenkins", "Gradle", "Maven", "Prometheus", "Grafana"] },
    { cat: { ru: "Тестирование", en: "Testing" }, items: ["JUnit", "TestContainers", "Gatling"] },
    { cat: { ru: "Протоколы", en: "Protocols" }, items: ["REST", "WebSocket / STOMP", "OAuth", "mDNS", "DASH"] },
  ],

  soft: {
    ru: [
      { t: "Владение задачей end-to-end", d: "От проектирования API до деплоя и мониторинга в проде." },
      { t: "Командная работа и code review", d: "Распределённые команды, ревью через GitHub pull requests." },
      { t: "Решение проблем", d: "Алгоритмическое мышление, отладка распределённых систем." },
      { t: "Самообучение", d: "Быстрое освоение новых стеков: от Android до игровых модов." },
    ],
    en: [
      { t: "End-to-end ownership", d: "From API design to deployment and production monitoring." },
      { t: "Teamwork & code review", d: "Distributed teams, reviews via GitHub pull requests." },
      { t: "Problem solving", d: "Algorithmic mindset, debugging distributed systems." },
      { t: "Self-learning", d: "Fast pickup of new stacks — from Android to game mods." },
    ],
  },

  ru: {
    name: "Кямал Мурадов",
    role: "Java-разработчик",
    tagline: "Backend на Spring · распределённые системы · надёжность",
    available: "Открыт к предложениям",
    summary:
      "Java-разработчик с опытом создания сервисов на Java и работы с реляционными базами данных, контейнерами и серверной инфраструктурой. Участвовал в командных и pet-проектах, близких к продакшену: проектировал API, настраивал окружение, автоматизировал сборку и деплой. Ищу роль, где можно развивать и поддерживать Java-сервисы, улучшать архитектуру и надёжность систем.",

    nav: {
      about: "О себе", experience: "Опыт", stack: "Стек",
      projects: "Проекты", education: "Образование", skills: "Навыки",
      github: "GitHub", contact: "Контакты",
    },

    ui: {
      mode_anim: "Анимация", mode_plain: "Резюме", download: "Скачать PDF",
      theme_light: "Светлая", theme_dark: "Тёмная", present: "наст. время",
      scroll: "листайте вниз", view_github: "Профиль на GitHub",
      view_hh: "Резюме на hh.ru",
      stack_hint: "Наведите · вращайте · технологии, с которыми я работаю",
      key_courses: "Ключевые дисциплины", languages_spoken: "Языки",
      hobbies: "Хобби", other_projects: "Другие проекты",
      print_note: "Версия для печати — переключитесь в режим «Резюме» и нажмите «Скачать PDF».",
      contact_lead: "",
      contact_accent: "Пишу backend, который работает.",
    },

    sections: {
      about: "О себе", experience: "Опыт работы", stack: "Технологический стек",
      projects: "Проекты и кейсы", education: "Образование", skills: "Навыки",
      github: "Open-source и активность", contact: "Связаться со мной",
    },

    experience: [
      {
        role: "Java Backend-разработчик",
        company: "Prompt Tech Solutions LLC",
        period: "Окт. 2022 — наст. время",
        current: true,
        summary: "CRM-платформа для логистической компании: маршрутизация, отслеживание грузов, документооборот и финансы.",
        bullets: [
          "Разработал CRM-платформу для логистики: автоматизация маршрутизации, отслеживания грузов, управления клиентами, документооборота и финансов — сократил долю ручных операций и повысил прозрачность работы.",
          "Реализовал сервис автоматической генерации документов и финансового документооборота (договоры, счета, акты) с хранением файлов в GridFS (MongoDB) и доступом из CRM.",
          "Создал систему управления задачами с приоритизацией, дедлайнами и метриками операционной эффективности.",
          "Сделал сервис обмена сообщениями в реальном времени между сотрудниками и клиентами (WebSocket).",
          "Настроил миграции схем БД на Liquibase, участвовал в развёртывании микросервисов в Kubernetes-кластере.",
          "Писал нагрузочные (Gatling) и интеграционные тесты, настраивал мониторинг через Prometheus/Grafana.",
        ],
        stack: ["Spring Boot", "Spring Data", "Spring Security", "Spring Cloud", "Kafka", "Redis", "PostgreSQL", "MongoDB", "Kubernetes", "Jenkins", "Liquibase", "Gatling", "WebSocket", "JUnit", "TestContainers", "Prometheus", "Grafana", "Istio"],
      },
      {
        role: "Java Mod / Backend-разработчик",
        company: "Alterland · частичная занятость",
        period: "Май 2025 — Сент. 2025",
        summary: "Backend и игровые системы для RP-сервера: квесты, банк, in-game смартфон.",
        bullets: [
          "Разработал систему квестов и диалогов: Java-backend для хранения прогресса игрока и состояний квестов, цепочки диалогов с выбором ответов и наградами.",
          "Реализовал игровую банковскую систему: операции с балансом, переводы, депозиты/снятия, 3D-банкоматы и их GUI в Minecraft-клиенте.",
          "Интегрировал мод с MCEF (Chromium в Minecraft): сверстал in-game смартфон в стиле iPhone и реализовал интерфейс на Vue (звонки, сообщения, карта, банк, кабинет, настройки, мини-игра).",
          "Работал в небольшой распределённой команде: задачи в Trello, ревью кода заказчиком через GitHub pull requests.",
        ],
        stack: ["Java", "Minecraft Forge 1.20.1", "MCEF", "Vue", "REST API", "PostgreSQL", "Kotlin", "Koin", "Ktor", "Git", "Trello"],
      },
      {
        role: "Стажёр Android-разработки",
        company: "Harman",
        period: "Окт. 2021 — Фев. 2022",
        summary: "Интенсив по Java/Android, разработка приложения для штурманов (MVP) в команде.",
        bullets: [
          "Прошёл интенсивную программу по Java и Android-разработке, участвовал в создании приложения для штурманов (MVP) в составе команды.",
          "Разрабатывал функциональность на Java/Kotlin, работал с локальным хранилищем и модульной, поддерживаемой архитектурой.",
        ],
        stack: ["Java", "Kotlin", "Android SDK", "Room", "MVVM", "Maven"],
      },
    ],

    projects: [
      {
        name: "Локальное управление Яндекс.Станциями",
        tag: "Pet-проект · Spring Boot",
        summary: "Локальное приложение, управляющее колонками Яндекс.Станция по локальной сети и воспроизводящее музыку из внешних сервисов в обход облака — с упором на качество звука и низкие задержки.",
        bullets: [
          "Backend на Spring Boot: REST API и WebSocket-слой (STOMP) для обнаружения устройств (mDNS), подключения к колонкам по протоколу Glagol и управления воспроизведением.",
          "Интеграция с музыкальными сервисами: поиск треков/альбомов/плейлистов, потоковое воспроизведение в высоком качестве через DASH с буферизацией в памяти и точной перемоткой.",
          "Локальная авторизация через OAuth-потоки и безопасное хранение токенов на диске.",
          "Production-поставка: фронтенд (React + TS + Vite) встраивается как статика в Spring Boot; упаковка в portable EXE со встроенной JVM через Gradle и jpackage.",
        ],
        stack: ["Java 17", "Spring Boot", "WebSocket / STOMP", "JmDNS", "DASH", "OAuth", "React", "TypeScript", "Vite", "Gradle", "jpackage"],
      },
      {
        name: "Полуавтономный прототип транспорта",
        tag: "Научный проект · Robotics",
        summary: "Прототип транспортного средства на Arduino и Raspberry Pi с компьютерным зрением в реальном времени.",
        bullets: [
          "Собрал полуавтономный прототип на Arduino (сенсоры / управление моторами) и Raspberry Pi (обработка данных).",
          "Реализовал обнаружение дорожных знаков, разметки и препятствий в реальном времени на Python + OpenCV.",
          "Создал систему принятия решений на основе правил для навигации.",
        ],
        stack: ["Python", "OpenCV", "Arduino", "Raspberry Pi"],
      },
    ],

    education: {
      degree: "Бакалавр программной инженерии",
      school: "ННГУ им. Н.И. Лобачевского",
      faculty: "Институт информационных технологий, математики и механики",
      period: "2021 — 2026",
      courses: ["Алгоритмы и структуры данных", "Архитектура ПО", "Встраиваемые системы", "Машинное обучение", "Проектирование баз данных"],
    },

    extra: {
      languages: ["Русский — родной", "Английский", "Азербайджанский", "Турецкий"],
      hobbies: ["Open-source проекты", "Алгоритмические задачи"],
      other: ["Skipper Guide", "Drilling Fluids Formulas"],
    },

    github_note: "Участвую в open-source проектах и регулярно решаю алгоритмические задачи. График активности — иллюстративный.",
  },

  en: {
    name: "Kamal Muradov",
    role: "Java Developer",
    tagline: "Spring backend · distributed systems · reliability",
    available: "Open to opportunities",
    summary:
      "Java developer with experience building services in Java and working with relational databases, containers and server infrastructure. Contributed to team and pet projects close to production: designed APIs, configured environments, automated builds and deployments. Looking for a role where I can grow and maintain Java services and improve the architecture and reliability of systems.",

    nav: {
      about: "About", experience: "Experience", stack: "Stack",
      projects: "Projects", education: "Education", skills: "Skills",
      github: "GitHub", contact: "Contact",
    },

    ui: {
      mode_anim: "Animated", mode_plain: "Resume", download: "Download PDF",
      theme_light: "Light", theme_dark: "Dark", present: "present",
      scroll: "scroll down", view_github: "GitHub profile",
      view_hh: "Resume on hh.ru",
      stack_hint: "Hover · rotate · the tech I work with",
      key_courses: "Key courses", languages_spoken: "Languages",
      hobbies: "Hobbies", other_projects: "Other projects",
      print_note: "Print version — switch to \"Resume\" mode and click \"Download PDF\".",
      contact_lead: "",
      contact_accent: "I build backends that hold.",
    },

    sections: {
      about: "About me", experience: "Work experience", stack: "Tech stack",
      projects: "Projects & case studies", education: "Education", skills: "Skills",
      github: "Open-source & activity", contact: "Get in touch",
    },

    experience: [
      {
        role: "Java Backend Developer",
        company: "Prompt Tech Solutions LLC",
        period: "Oct 2022 — Present",
        current: true,
        summary: "CRM platform for a logistics company: routing, cargo tracking, document workflow and finance.",
        bullets: [
          "Built a CRM platform for logistics: automated routing, cargo tracking, customer management, document workflow and finance — reduced manual operations and improved transparency.",
          "Implemented automatic document generation and financial workflow (contracts, invoices, acts) with files stored in GridFS (MongoDB) and access from the CRM.",
          "Created a task management system with prioritization, deadlines and operational efficiency metrics.",
          "Delivered a real-time messaging service between employees and clients (WebSocket).",
          "Set up DB schema migrations with Liquibase and took part in deploying microservices to a Kubernetes cluster.",
          "Wrote load (Gatling) and integration tests, configured monitoring via Prometheus/Grafana.",
        ],
        stack: ["Spring Boot", "Spring Data", "Spring Security", "Spring Cloud", "Kafka", "Redis", "PostgreSQL", "MongoDB", "Kubernetes", "Jenkins", "Liquibase", "Gatling", "WebSocket", "JUnit", "TestContainers", "Prometheus", "Grafana", "Istio"],
      },
      {
        role: "Java Mod / Backend Developer",
        company: "Alterland · part-time",
        period: "May 2025 — Sep 2025",
        summary: "Backend and game systems for an RP server: quests, banking, in-game smartphone.",
        bullets: [
          "Developed a quest and dialogue system: Java backend storing player progress and quest states, dialogue chains with answer choices and rewards.",
          "Implemented an in-game banking system: balance operations, transfers, deposits/withdrawals, 3D ATMs and their GUI in the Minecraft client.",
          "Integrated the mod with MCEF (Chromium in Minecraft): built an in-game iPhone-style smartphone with a Vue interface (calls, messages, map, bank, account, settings, mini-game).",
          "Worked in a small distributed team: tasks in Trello, code reviewed by the client via GitHub pull requests.",
        ],
        stack: ["Java", "Minecraft Forge 1.20.1", "MCEF", "Vue", "REST API", "PostgreSQL", "Kotlin", "Koin", "Ktor", "Git", "Trello"],
      },
      {
        role: "Android Developer Intern",
        company: "Harman",
        period: "Oct 2021 — Feb 2022",
        summary: "Java/Android intensive, building a navigator app (MVP) within a team.",
        bullets: [
          "Completed an intensive Java and Android program, contributed to a navigator app (MVP) as part of a team.",
          "Developed functionality in Java/Kotlin, worked with local storage and a modular, maintainable architecture.",
        ],
        stack: ["Java", "Kotlin", "Android SDK", "Room", "MVVM", "Maven"],
      },
    ],

    projects: [
      {
        name: "Local Yandex Station control",
        tag: "Pet project · Spring Boot",
        summary: "A local app that controls Yandex Station speakers over the LAN and plays music from external services, bypassing the cloud — focused on sound quality and low latency.",
        bullets: [
          "Spring Boot backend: REST API and WebSocket layer (STOMP) for device discovery (mDNS), connecting to speakers via the Glagol protocol, and playback control.",
          "Music service integration: search of tracks/albums/playlists, high-quality streaming via DASH with in-memory buffering and precise seeking.",
          "Local authorization via OAuth flows and secure on-disk token storage.",
          "Production delivery: the frontend (React + TS + Vite) is embedded as static files into Spring Boot; packaged into a portable EXE with an embedded JVM via Gradle and jpackage.",
        ],
        stack: ["Java 17", "Spring Boot", "WebSocket / STOMP", "JmDNS", "DASH", "OAuth", "React", "TypeScript", "Vite", "Gradle", "jpackage"],
      },
      {
        name: "Semi-autonomous vehicle prototype",
        tag: "Research project · Robotics",
        summary: "A vehicle prototype on Arduino and Raspberry Pi with real-time computer vision.",
        bullets: [
          "Built a semi-autonomous prototype on Arduino (sensors / motor control) and Raspberry Pi (data processing).",
          "Implemented real-time detection of road signs, markings and obstacles with Python + OpenCV.",
          "Created a rule-based decision-making system for navigation.",
        ],
        stack: ["Python", "OpenCV", "Arduino", "Raspberry Pi"],
      },
    ],

    education: {
      degree: "B.Sc. in Software Engineering",
      school: "Lobachevsky State University (UNN)",
      faculty: "Institute of IT, Mathematics and Mechanics",
      period: "2021 — 2026",
      courses: ["Algorithms & data structures", "Software architecture", "Embedded systems", "Machine learning", "Database design"],
    },

    extra: {
      languages: ["Russian — native", "English", "Azerbaijani", "Turkish"],
      hobbies: ["Open-source projects", "Algorithmic problems"],
      other: ["Skipper Guide", "Drilling Fluids Formulas"],
    },

    github_note: "Active in open-source and regularly solving algorithmic problems. The activity graph is illustrative.",
  },
}
