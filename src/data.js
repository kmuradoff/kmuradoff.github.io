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
    { cat: { ru: "Языки", en: "Languages" }, items: ["Java 21", "Kotlin", "Python", "TypeScript", "JavaScript"] },
    { cat: { ru: "Spring & фреймворки", en: "Spring & frameworks" }, items: ["Spring Boot", "Spring Data", "Spring Security", "Spring Cloud", "Temporal", "Ktor", "Koin", "Vue", "React"] },
    { cat: { ru: "Данные и брокеры", en: "Data & messaging" }, items: ["PostgreSQL", "MongoDB", "Redis", "Kafka", "Liquibase", "GridFS"] },
    { cat: { ru: "Инфраструктура", en: "Infrastructure" }, items: ["Kubernetes", "Docker", "GCP", "Terraform", "Helm", "GitHub Actions", "Jenkins", "Grafana", "Loki", "Jaeger", "Prometheus"] },
    { cat: { ru: "Тестирование", en: "Testing" }, items: ["JUnit", "TestContainers", "Gatling"] },
    { cat: { ru: "Протоколы", en: "Protocols" }, items: ["REST", "gRPC", "WebSocket / STOMP", "OAuth", "mDNS", "DASH"] },
    { cat: { ru: "Мобильная разработка", en: "Mobile" }, items: ["Kotlin Multiplatform", "Android SDK", "iOS"] },
  ],

  soft: {
    ru: [
      { t: "Владение задачей end-to-end", d: "От проектирования API до деплоя, мониторинга и нагрузочных тестов в проде." },
      { t: "Fullstack-мышление", d: "Backend, мобильная разработка (KMP), DevOps — единая картина системы без слепых зон." },
      { t: "Решение нетривиальных задач", d: "Оркестрация workflow на Temporal, config-driven UI, интеграция Chrome в Minecraft." },
      { t: "Быстрое освоение стеков", d: "За 4 года: Android → Java Backend → DevOps → Kotlin Multiplatform." },
    ],
    en: [
      { t: "End-to-end ownership", d: "API design through deployment, production monitoring, and load testing." },
      { t: "Full-stack mindset", d: "Backend, mobile (KMP), DevOps — complete system picture with no blind spots." },
      { t: "Non-trivial problem solving", d: "Temporal workflow orchestration, config-driven UI, Chromium embedded in Minecraft." },
      { t: "Rapid stack adoption", d: "4 years: Android → Java Backend → DevOps → Kotlin Multiplatform." },
    ],
  },

  ru: {
    name: "Кямал Мурадов",
    role: "Java Backend Engineer",
    tagline: "Java Backend · микросервисы · cloud-native",
    available: "",
    summary:
      "Java Backend Engineer с 4+ годами коммерческого опыта. Специализируюсь на микросервисной архитектуре (Java 21, Spring Boot), cloud-native инфраструктуре (GCP, Kubernetes, Terraform) и оркестрации workflow (Temporal). Владею полным циклом: проектирование API → бизнес-логика → CI/CD → продакшн-мониторинг. Параллельно разрабатываю кроссплатформенные мобильные приложения на Kotlin Multiplatform (iOS + Android).",

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
        role: "Fullstack-разработчик",
        company: "Jayikum Fur Company · Саудовская Аравия",
        period: "Янв. 2026 — наст. время",
        current: true,
        summary: "Мобильный маркетплейс услуг мастеров (Саудовская Аравия): Java-бэкенд, Kotlin Multiplatform приложение (iOS + Android), cloud-native инфраструктура на GCP.",
        bullets: [
          "Разработал микросервисы на Java 21 + Spring Framework: REST API, бизнес-логика сервиса заказов, аутентификация по номеру телефона — полная реализация с нуля.",
          "Внедрил Temporal для оркестрации workflow: автоподбор мастеров, цепочки push-уведомлений, жизненный цикл заказа — исключил потери событий и упростил обработку сбоев.",
          "Создал кроссплатформенное приложение на Kotlin Multiplatform (единая кодовая база iOS + Android): карта мастеров, заказ, чат, оплата, история, config-driven UI.",
          "Развернул инфраструктуру в Google Cloud Platform: Kubernetes (CNPG, Redis, Kafka), Terraform + Helm, self-hosted CI через GitHub ARC.",
          "Настроил полный observability-стек: Grafana (метрики), Loki (логи), Jaeger (распределённая трассировка).",
          "Покрыл API нагрузочными тестами на Gatling — выявил и устранил узкие места до выхода в продакшн.",
        ],
        stack: ["Java 21", "Spring Framework", "Temporal", "Kotlin Multiplatform", "iOS", "Android", "GCP", "Kubernetes", "Terraform", "Helm", "GitHub Actions", "GitHub ARC", "PostgreSQL", "Redis", "Kafka", "Grafana", "Loki", "Jaeger", "Gatling"],
      },
      {
        role: "Java Mod / Backend-разработчик",
        company: "Alterland · частичная занятость",
        period: "Май 2025 — Март 2026",
        summary: "Backend и игровые системы для RP-сервера: квесты, банк, in-game смартфон на Vue с интеграцией Chromium (MCEF).",
        bullets: [
          "Разработал систему квестов и диалогов: Java-backend для хранения прогресса, цепочки диалогов с выбором ответов и наградами.",
          "Реализовал игровую банковскую систему: балансовые операции, переводы, депозиты, 3D-банкоматы с GUI в Minecraft-клиенте.",
          "Интегрировал MCEF (Chromium в Minecraft): in-game смартфон в стиле iPhone — звонки, сообщения, карта, банк, мини-игра на Vue.",
          "Работал в распределённой команде: Trello, code review через GitHub pull requests.",
        ],
        stack: ["Java", "Minecraft Forge 1.20.1", "MCEF", "Vue", "REST API", "PostgreSQL", "Kotlin", "Koin", "Ktor"],
      },
      {
        role: "Java Backend-разработчик",
        company: "Prompt Tech Solutions LLC · Баку",
        period: "Окт. 2022 — Янв. 2026",
        summary: "CRM-платформа для логистики: маршрутизация, отслеживание грузов, документооборот, финансы.",
        bullets: [
          "Разработал CRM-платформу для логистической компании: автоматизация маршрутизации, отслеживания грузов, клиентского документооборота и финансов — сократил долю ручных операций.",
          "Реализовал сервис автогенерации документов (договоры, счета, акты) с хранением в GridFS (MongoDB) — время доступа к файлам снизилось на 40%.",
          "Создал систему управления задачами с приоритизацией, дедлайнами и метриками эффективности; сделал real-time чат на WebSocket.",
          "Настроил Kubernetes-кластер с Prometheus/Grafana, CI/CD через Jenkins и Liquibase-миграции.",
          "Написал нагрузочные (Gatling) и интеграционные тесты (JUnit, TestContainers).",
        ],
        stack: ["Java 17", "Spring Boot", "Spring Security", "Spring Cloud", "Kafka", "Redis", "PostgreSQL", "MongoDB", "Kubernetes", "Jenkins", "Liquibase", "Gatling", "WebSocket", "JUnit", "TestContainers", "Prometheus", "Grafana", "Istio"],
      },
      {
        role: "Стажёр Android-разработчик",
        company: "Harman · Нижний Новгород",
        period: "Окт. 2021 — Фев. 2022",
        summary: "Интенсив по Java/Android, разработка навигационного приложения (MVP) в команде.",
        bullets: [
          "Участвовал в создании навигационного приложения (MVP): разрабатывал модульные компоненты на Java/Kotlin с архитектурой MVVM и Dagger/Hilt.",
          "Улучшил поддерживаемость кода за счёт компонентного подхода и разделения ответственности.",
        ],
        stack: ["Java", "Kotlin", "Android SDK", "MVVM", "Dagger/Hilt", "Room", "Maven"],
      },
    ],

    projects: [
      {
        name: "Локальное управление Яндекс.Станциями",
        tag: "Pet-проект · Spring Boot",
        summary: "Управление колонками Яндекс.Станция по локальной сети в обход облака — высокое качество звука, низкие задержки.",
        bullets: [
          "Backend на Spring Boot: REST API + WebSocket/STOMP для обнаружения устройств (mDNS), подключение по протоколу Glagol и управление воспроизведением.",
          "Интеграция с музыкальными сервисами: поиск треков/альбомов, DASH-стриминг в высоком качестве с буферизацией и точной перемоткой.",
          "Фронтенд (React + TS + Vite) встроен как статика в Spring Boot; упаковка в portable EXE со встроенной JVM через Gradle + jpackage.",
        ],
        stack: ["Java 17", "Spring Boot", "WebSocket / STOMP", "JmDNS", "DASH", "OAuth", "React", "TypeScript", "Vite", "Gradle", "jpackage"],
      },
      {
        name: "Полуавтономный прототип транспорта",
        tag: "Научный проект · Robotics",
        summary: "Прототип на Arduino + Raspberry Pi с компьютерным зрением в реальном времени для обнаружения знаков и препятствий.",
        bullets: [
          "Собрал прототип: Arduino (сенсоры, управление моторами) + Raspberry Pi (обработка данных и зрение).",
          "Обнаружение дорожных знаков, разметки и препятствий в реальном времени на Python + OpenCV.",
          "Rule-based система принятия решений для автономной навигации.",
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
      languages: ["Русский — родной", "Английский — C1", "Азербайджанский — C2", "Лезгинский — C2"],
      hobbies: ["Open-source проекты", "Алгоритмические задачи"],
      other: ["Skipper Guide", "Drilling Fluids Formulas"],
    },

    github_note: "Участвую в open-source проектах и регулярно решаю алгоритмические задачи. График активности — иллюстративный.",
  },

  en: {
    name: "Kamal Muradov",
    role: "Java Backend Engineer",
    tagline: "Java Backend · microservices · cloud-native",
    available: "",
    summary:
      "Java Backend Engineer with 4+ years of commercial experience. Specialized in microservice architecture (Java 21, Spring Boot), cloud-native infrastructure (GCP, Kubernetes, Terraform), and workflow orchestration (Temporal). Full-cycle ownership: API design → business logic → CI/CD → production monitoring. Additional hands-on experience building cross-platform mobile apps with Kotlin Multiplatform (iOS + Android).",

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
        role: "Fullstack Developer",
        company: "Jayikum Fur Company · Saudi Arabia",
        period: "Jan 2026 — Present",
        current: true,
        summary: "Mobile service marketplace (Saudi Arabia): Java microservices backend, Kotlin Multiplatform app (iOS + Android), cloud-native infrastructure on GCP.",
        bullets: [
          "Built microservices in Java 21 + Spring Framework from scratch: REST API, order service business logic, phone-number authentication.",
          "Introduced Temporal for workflow orchestration: master auto-matching, push-notification chains, full order lifecycle — eliminated event loss and simplified failure handling.",
          "Developed a cross-platform mobile app using Kotlin Multiplatform (shared iOS + Android codebase): master map, ordering, chat, payments, order history, config-driven UI.",
          "Deployed and maintained infrastructure on Google Cloud Platform: Kubernetes (CNPG, Redis, Kafka), Terraform + Helm, self-hosted CI via GitHub ARC.",
          "Set up a full observability stack: Grafana (metrics), Loki (logs), Jaeger (distributed tracing).",
          "Covered APIs with Gatling load tests — identified and eliminated bottlenecks before production release.",
        ],
        stack: ["Java 21", "Spring Framework", "Temporal", "Kotlin Multiplatform", "iOS", "Android", "GCP", "Kubernetes", "Terraform", "Helm", "GitHub Actions", "GitHub ARC", "PostgreSQL", "Redis", "Kafka", "Grafana", "Loki", "Jaeger", "Gatling"],
      },
      {
        role: "Java Mod / Backend Developer",
        company: "Alterland · part-time",
        period: "May 2025 — Mar 2026",
        summary: "Backend and game systems for an RP server: quests, banking, in-game Vue smartphone with Chromium (MCEF) integration.",
        bullets: [
          "Developed a quest and dialogue system: Java backend tracking player progress, branching dialogue chains with choices and rewards.",
          "Implemented an in-game banking system: balance operations, transfers, deposits, 3D ATMs with GUI in the Minecraft client.",
          "Integrated MCEF (Chromium in Minecraft): built an in-game iPhone-style smartphone — calls, messages, map, bank, mini-game — on Vue.",
          "Worked in a small distributed team: Trello, code reviewed via GitHub pull requests.",
        ],
        stack: ["Java", "Minecraft Forge 1.20.1", "MCEF", "Vue", "REST API", "PostgreSQL", "Kotlin", "Koin", "Ktor"],
      },
      {
        role: "Java Backend Developer",
        company: "Prompt Tech Solutions LLC · Baku",
        period: "Oct 2022 — Jan 2026",
        summary: "CRM platform for a logistics company: routing, cargo tracking, document workflow and finance.",
        bullets: [
          "Built a logistics CRM platform: automated routing, cargo tracking, customer management, document workflow and finance — reduced manual operations share.",
          "Implemented auto-document generation (contracts, invoices, acts) with GridFS (MongoDB) storage — file access time reduced by 40%.",
          "Created a task management system with prioritization, deadlines, and efficiency metrics; delivered a real-time WebSocket chat service.",
          "Configured a Kubernetes cluster with Prometheus/Grafana monitoring, CI/CD via Jenkins, and Liquibase schema migrations.",
          "Wrote load tests (Gatling) and integration tests (JUnit, TestContainers).",
        ],
        stack: ["Java 17", "Spring Boot", "Spring Security", "Spring Cloud", "Kafka", "Redis", "PostgreSQL", "MongoDB", "Kubernetes", "Jenkins", "Liquibase", "Gatling", "WebSocket", "JUnit", "TestContainers", "Prometheus", "Grafana", "Istio"],
      },
      {
        role: "Android Developer Intern",
        company: "Harman · Nizhny Novgorod",
        period: "Oct 2021 — Feb 2022",
        summary: "Java/Android intensive, building a navigation app (MVP) within a team.",
        bullets: [
          "Contributed to a navigation app MVP: built modular components in Java/Kotlin with MVVM architecture and Dagger/Hilt.",
          "Improved codebase maintainability through a component-first, separation-of-concerns approach.",
        ],
        stack: ["Java", "Kotlin", "Android SDK", "MVVM", "Dagger/Hilt", "Room", "Maven"],
      },
    ],

    projects: [
      {
        name: "Local Yandex Station Control",
        tag: "Pet project · Spring Boot",
        summary: "Controls Yandex Station speakers over the LAN, bypassing the cloud — focused on audio quality and low latency.",
        bullets: [
          "Spring Boot backend: REST API + WebSocket/STOMP for device discovery (mDNS), Glagol protocol connection, and playback control.",
          "Music service integration: track/album search, high-quality DASH streaming with in-memory buffering and precise seeking.",
          "Frontend (React + TS + Vite) embedded as static files in Spring Boot; packaged into a portable EXE with embedded JVM via Gradle + jpackage.",
        ],
        stack: ["Java 17", "Spring Boot", "WebSocket / STOMP", "JmDNS", "DASH", "OAuth", "React", "TypeScript", "Vite", "Gradle", "jpackage"],
      },
      {
        name: "Semi-Autonomous Vehicle Prototype",
        tag: "Research project · Robotics",
        summary: "Arduino + Raspberry Pi prototype with real-time computer vision for sign and obstacle detection.",
        bullets: [
          "Built the prototype: Arduino (sensors, motor control) + Raspberry Pi (data processing and vision).",
          "Real-time detection of road signs, markings, and obstacles with Python + OpenCV.",
          "Rule-based decision-making system for autonomous navigation.",
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
      languages: ["Russian — native", "English — C1", "Azerbaijani — C2", "Lezgian — C2"],
      hobbies: ["Open-source projects", "Algorithmic problems"],
      other: ["Skipper Guide", "Drilling Fluids Formulas"],
    },

    github_note: "Active in open-source and regularly solving algorithmic problems. The activity graph is illustrative.",
  },
}
