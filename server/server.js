const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = 3001;
const { parse } = require("csv-parse/sync");

const POS_FILE = "./positions.json";
const COMP_FILE = "./competencies.json";

function readPositions() {
  return JSON.parse(fs.readFileSync(POS_FILE, "utf-8"));
}
function writePositions(arr) {
  fs.writeFileSync(POS_FILE, JSON.stringify(arr, null, 2));
}

function readCompetencies() {
  return JSON.parse(fs.readFileSync(COMP_FILE, "utf-8"));
}
function writeCompetencies(arr) {
  fs.writeFileSync(COMP_FILE, JSON.stringify(arr, null, 2));
}

const INT_FILE = "./integrations.json";

function readTokens() {
  return JSON.parse(fs.readFileSync(INT_FILE, "utf-8"));
}
function writeTokens(obj) {
  fs.writeFileSync(INT_FILE, JSON.stringify(obj, null, 2));
}

let tokensCache = readTokens();

app.use(cors());
app.use(bodyParser.json());
app.use(express.text({ type: "text/*" }));

function convertDateToText(dateStr) {
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];
  const [year, month, day] = dateStr.split("-"); // "2022-02-15" -> ["2022", "02", "15"]
  const monthName = months[parseInt(month, 10) - 1]; // получаем название месяца
  return `${day} ${monthName} ${year}`; // "15 февраля 2022"
}

const DATA_FILE = "./data.json";

// Вспомогательные функции для работы с файлом
function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}
function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
}

function writeUsers(arr) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(arr, null, 2));
}

const positionMap = {
  Backend: "Backend-разработчик",
  Frontend: "Frontend-разработчик",
  Analyst: "Аналитик",
  Manager: "Менеджер",
  Designer: "Дизайнер",
  Fullstack: "Fullstack",
};

const genderMap = {
  Male: "Мужчина",
  Female: "Женщина",
};

const stackMap = {
  "C#": "С#",
  React: "React",
  Java: "Java",
  PHP: "PHP",
  Figma: "Figma",
  Word: "Word",
};

// Универсальная функция для приведения к массиву
function toArray(param) {
  if (param === undefined) return [];
  return Array.isArray(param) ? param : [param];
}

app.get("/api/Employee", auth(), (req, res) => {
  let data = readData();
  const { Name, Gender, Position, Stack, Page = 1, Count = 10 } = req.query;

  // Поиск по имени
  if (Name) {
    data = data.filter((e) =>
      e.name.toLowerCase().includes(Name.toLowerCase())
    );
  }

  // Фильтр по полу
  const genderArr = toArray(Gender).map((g) => genderMap[g] || g);
  if (genderArr.length) {
    data = data.filter((e) => genderArr.includes(e.gender));
  }

  // Фильтр по позиции
  const positionArr = toArray(Position).map((p) => positionMap[p] || p);
  if (positionArr.length) {
    data = data.filter((e) => positionArr.includes(e.position));
  }

  // Фильтр по стеку технологий
  const stackArr = toArray(Stack).map((s) => stackMap[s] || s);
  if (stackArr.length) {
    data = data.filter((e) => {
      if (!e.stack || e.stack.length < stackArr.length) return false;
      console.log(e);
      return true;
    });
  }

  // Пагинация
  const page = Number(Page);
  const count = Number(Count);
  const start = (page - 1) * count;
  const paginated = data.slice(start, start + count);

  res.json(paginated);
});

// Получить сотрудника по id
app.get("/api/Employee/:id", auth(), (req, res) => {
  const data = readData();
  const employee = data.find((e) => e.id == req.params.id);
  if (employee) res.json(employee);
  else res.status(404).json({ message: "Not found" });
});

// Создать сотрудника
app.post("/api/Employee", auth("PM"), (req, res) => {
  const data = readData();

  const maxId = data.reduce(
    (max, employee) => (employee.id > max ? employee.id : max),
    0
  );
  const newId = maxId + 1;

  const newEmployee = {
    ...req.body,
    id: newId,
    birthdate: convertDateToText(req.body.birthdate),
    dateOfEmployment: convertDateToText(req.body.dateOfEmployment),
  };
  data.unshift(newEmployee);

  writeData(data);

  res.status(201).json(newEmployee);
});

// Обновить сотрудника
app.put("/api/Employee/:id", auth("PM"), (req, res) => {
  const data = readData();
  const idx = data.findIndex((e) => e.id == req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });

  // Обновляем дату в нужный формат
  const updatedEmployee = {
    ...data[idx],
    ...req.body,
    birthdate: req.body.birthdate
      ? convertDateToText(req.body.birthdate)
      : data[idx].birthdate,
    dateOfEmployment: req.body.dateOfEmployment
      ? convertDateToText(req.body.dateOfEmployment)
      : data[idx].dateOfEmployment,
  };

  // Заменяем старую информацию на новую
  data[idx] = updatedEmployee;

  writeData(data);
  res.json(updatedEmployee);
});

// Удалить сотрудника
app.delete("/api/Employee/:id", auth("PM"), (req, res) => {
  let data = readData();
  const idx = data.findIndex((e) => e.id == req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });
  const removed = data.splice(idx, 1);
  writeData(data);
  res.json(removed[0]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Добавления из файла CSV
const csv = require("csv-parse/sync").parse;

app.post("/api/Employees/bulk", auth("PM"), (req, res) => {
  try {
    const arr = parse(req.body, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const data = readData();
    let maxId = data.reduce((m, e) => Math.max(m, e.id), 0);

    const prepared = arr.map((e) => ({
      ...e,
      id: ++maxId,
      stack: e.stack ? e.stack.split("|") : [],
    }));

    data.unshift(...prepared);
    writeData(data);
    res.status(201).json({ added: prepared.length });
  } catch (err) {
    res.status(400).json({ message: "Ошибка парсинга CSV" });
  }
});

/* ---------- Chat ---------- */

/* ---------- AI-ассистент (заглушка) ---------- */
app.post("/api/assistant", auth(), (req, res) => {
  const { message = "", attachment } = req.body;

  /* -------- если прилетела аналитика -------- */

  if (attachment) {
    if (attachment.type === "analytics") {
      return res.json({
        reply: `Что именно по аналитике вас интересует?
1) Как увеличить показатель velocity
2) Как снизить среднюю нагрузку команды
3) Какие проекты были наиболее рискованными в этот период`,
        ts: Date.now(),
      });
    }

    if (attachment.type === "employee") {
      return res.json({
        reply: `Что вы хотели бы узнать о сотруднике ${attachment.name}?
1) Рекомендации по развитию навыков
2) Как оптимизировать его загрузку
3) С кем в команде он показывает наилучшие результаты
(Выберите пункт или задайте произвольный вопрос.)`,
        ts: Date.now(),
      });
    }
  }

  // Простейший rule-based ответ:
  let reply = "Извините, я ещё учусь. Могу показать команды: help, risk, team";
  if (/help/i.test(message)) reply = "Команды:\n• help\n• team [стек]\n• risk";
  if (/team/i.test(message))
    reply = `Под ваши требования подойдёт Иван Иванов\n(React, Node).`;
  if (/risk/i.test(message))
    reply = "Критичных рисков в проекте не обнаружено.";
  res.json({ reply, ts: Date.now() });
});

/* ---------- Аутентификация ---------- */

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const USERS_FILE = "./users.json";
const JWT_SECRET = process.env.JWT_SECRET || "superSecretKey";
const JWT_EXP = "2h";

// POST /api/auth/login
app.post("/api/auth/login", (req, res) => {
  console.log("LOGIN BODY:", req.body);

  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXP,
  });
  res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role },
  });
});

// Middleware проверки токена
function auth(requiredRole) {
  return (req, res, next) => {
    const header = req.headers["authorization"];
    if (!header) return res.status(401).json({ message: "No token" });
    const [, token] = header.split(" ");
    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if (err) return res.status(401).json({ message: "Bad token" });
      if (requiredRole && payload.role !== requiredRole)
        return res.status(403).json({ message: "Forbidden" });
      req.user = payload;
      next();
    });
  };
}

/* ========= mock Projects storage ========= */
/* ---------- Projects storage (robust) ---------- */
const PROJECTS_FILE = "./projects.json";

function readProjects() {
  if (!fs.existsSync(PROJECTS_FILE)) return []; // файла нет → []
  const txt = fs.readFileSync(PROJECTS_FILE, "utf-8").trim();
  if (!txt) return []; // пустой файл → []
  try {
    return JSON.parse(txt);
  } catch (e) {
    console.error("projects.json повреждён, перезаписываю []");
    fs.writeFileSync(PROJECTS_FILE, "[]");
    return [];
  }
}

function writeProjects(data) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(data, null, 2));
}

/* ---------- AI-risk mock ---------- */
app.get("/api/projects/:id/analysis", auth(), (req, res) => {
  const { id } = req.params;
  const idx = parseInt(id, 10);
  const now = Math.floor(Date.now() / 60000);
  const riskScore = (idx * 17 + now) % 100;

  /* генерация короткого «мнения» */
  const description =
    riskScore > 70
      ? "Проект движется в очень сжатые сроки, требуя максимальной концентрации команды. " +
        "Ключевые риски связаны с высокой загрузкой критичных специалистов и рефакторингом легаси-кода. " +
        "Бюджет остаётся в пределах плана, но запас по времени невелик. " +
        "Рекомендуется перераспределить задачи и внедрить ежедневный контроль прогресса."
      : "Проект развивается стабильными темпами, сроки реализуемы при текущих ресурсах. " +
        "Команда укомплектована сбалансировано, критичных рисков не выявлено. " +
        "Возможно оптимизировать процесс релизов, сократив время на тестирование. " +
        "Рекомендуется начать планирование масштабирования функционала на следующий спринт.";

  res.json({
    metrics: {
      durationDays: Math.floor(20 + ((idx * 3) % 60)),
      avgLoad: Math.floor(30 + ((idx * 11) % 60)),
      riskScore,
    },
    description, // ← новое поле
    risks:
      riskScore > 70
        ? [
            "Высокая нагрузка ключевого Backend-разработчика",
            "Сжатые сроки по модулю отчётности",
          ]
        : ["Критичных рисков не выявлено"],
    recommendations: [
      "Перераспределить задачи между Frontend-разработчиками",
      "Добавить QA-инженера на фазу тестирования",
    ],
  });
});

/* ---------- обновление состава команды ---------- */
app.put("/api/projects/:id/team", auth("PM"), (req, res) => {
  const { id } = req.params;
  const projects = readProjects();
  const idx = projects.findIndex((p) => p.id == id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });

  projects[idx].team = req.body.team || [];
  writeProjects(projects);
  res.json(projects[idx]);
});

app.post("/api/projects/:id/ask", auth(), (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  // очень простая rule-based заглушка
  let reply = "Поняла. Советую пересмотреть план спринта.";
  if (/болел|болеет|заболел/i.test(message))
    reply =
      "Рекомендуем перераспределить задачи и привлечь резерв из соседней команды.";
  else if (/дедлайн|срок/i.test(message))
    reply =
      "Оцените критические задачи и согласуйте сокращение объёма с заказчиком.";
  else if (/help|помощ/i.test(message))
    reply =
      "Я могу проанализировать риски, дать рекомендации по ресурсам и тайм-менеджменту.";

  res.json({ reply, ts: Date.now() });
});

/* ========= POST /api/teams/recommend ========= */
app.post("/api/teams/recommend", auth(), (req, res) => {
  const { skills = [], size = 5 } = req.body;
  const employees = readData();

  // выбираем случайных сотрудников, у кого есть хотя бы 1 нужный skill
  const pool = employees.filter(
    (e) => skills.length === 0 || e.stack?.some((s) => skills.includes(s))
  );
  const picked = [];
  while (picked.length < size && pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  res.json({ members: picked, explain: "random-mock" });
});

/* ========= POST /api/projects ========= */
app.post("/api/projects", auth("PM"), (req, res) => {
  const projects = readProjects();
  const maxId = projects.reduce((m, p) => Math.max(m, p.id || 0), 0) + 1;
  const project = { ...req.body, id: maxId };
  projects.push(project);
  writeProjects(projects);
  res.status(201).json(project);
});

/* ========= GET /api/projects(/:id) ========= */
app.get("/api/projects", auth(), (req, res) => res.json(readProjects()));
app.get("/api/projects/:id", auth(), (req, res) => {
  const p = readProjects().find((p) => p.id == req.params.id);
  p ? res.json(p) : res.status(404).json({ message: "Not found" });
});

/* ---------- Analytics ---------- */
const ANA_FILE = "./analytics.json";
function readAnalytics() {
  return JSON.parse(fs.readFileSync(ANA_FILE, "utf-8"));
}

/* --- заменить старый эндпоинт --- */
app.get("/api/analytics", auth(), (req, res) => {
  const { period = "weekly", start, end } = req.query;
  const ana = readAnalytics();

  /* ---------- CUSTOM (дневной диапазон) ---------- */
  if (period === "custom" && start && end) {
    const w = ana.weekly; // берём weekly
    const daily = [];
    w.forEach((pt) => {
      const d0 = new Date(pt.week); // понедельник
      for (let i = 0; i < 7; i++) {
        const d = new Date(d0);
        d.setDate(d0.getDate() + i);
        const iso = d.toISOString().slice(0, 10); // YYYY-MM-DD
        daily.push({
          day: iso,
          avgLoad: pt.avgLoad,
          velocity: Math.round(pt.velocity / 5), // делим условно
          risk: pt.risk,
          stack: pt.stack,
          absences: pt.absences / 7,
          cost: pt.cost / 5,
          budget: pt.budget / 5,
        });
      }
    });
    const filtered = daily.filter((p) => p.day >= start && p.day <= end);
    return res.json({ period: "custom", data: filtered });
  }

  /* ---------- weekly / monthly как раньше ---------- */
  res.json({ period, data: ana[period] || [] });
});

app.post("/api/analytics/summary", auth(), (req, res) => {
  const { period, start, end } = req.body; // weekly | monthly | custom
  // Заглушка-аналитика

  const txt = `За период ${
    start || period
  } загрузка команды оставалась стабильной и колебалась в пределах 64–70 %. 
Velocity постепенно растёт, что говорит о росте предсказуемости спринтов. 
Финансовые затраты укладываются в бюджет с запасом 8 %, но наблюдается тенденция к увеличению костов. 
Риск-индекс держится на умеренном уровне: ключевые риски связаны с отсутствие QA-ресурсов. `;
  res.json({ reply: txt, ts: Date.now() });
});

/* --- server.js --- */
app.get("/api/Employee/:id/analysis", auth(), (req, res) => {
  const txt = `Специалист показывает высокую эффективность в окружении с сильными фронтенд-разработчиками.
Лучшие результаты достигнуты в паре с Алексеем и Мариной.
Рекомендуется назначать на проекты с React-стеком и короткими итерациями.
Средний KPI за последние 3 месяца – 87 %.
Возможная зона роста – углубить знания Node.js для задач full-stack.`;
  res.json({ reply: txt, ts: Date.now() });
});

// Показать проекты, где участвует данный сотрудник
app.get("/api/Employee/:id/projects", auth(), (req, res) => {
  const empId = Number(req.params.id);
  const projects = readProjects(); // функция из ранее добавленного блока
  const result = projects
    .filter((p) => Array.isArray(p.team) && p.team.some((m) => m.id === empId))
    .map((p) => ({
      id: p.id,
      name: p.name,
      priority: p.priority,
      role: p.team.find((m) => m.id === empId)?.role || "",
      start: p.start,
      end: p.end,
    }));
  res.json(result);
});

/* ---------- Notifications: deadlines & recommendations ---------- */
app.get("/api/notifications", auth(), (req, res) => {
  // Моковые дедлайны
  const deadlines = [
    {
      id: 1,
      text: 'Дедлайн проекта "CRM-система" через 3 дня',
      due: "2025-05-07",
    },
    {
      id: 2,
      text: 'Дедлайн проекта "Мобильное приложение" через 5 дней',
      due: "2025-05-09",
    },
    {
      id: 3,
      text: 'Дедлайн проекта "Внутренний портал" через 2 дня',
      due: "2025-05-06",
    },
  ];

  // Моковые рекомендации
  const recommendations = [
    "Рекомендуется перераспределить задачи для балансировки нагрузки.",
    "Увеличьте состав QA-инженеров для ускорения тестирования.",
    "Подготовьте резерв на случай отпуска ключевых разработчиков.",
    "Планируйте релизы на начало недели, чтобы избежать дедлайнов в пятницу.",
  ];

  res.json({ deadlines, recommendations });
});

app.get("/api/users", auth("PM"), (req, res) => {
  res.json(
    readUsers().map((u) => ({ id: u.id, email: u.email, role: u.role }))
  );
});
app.post("/api/users", auth("PM"), async (req, res) => {
  const { email, password, role } = req.body;
  const users = readUsers();
  const id = Math.max(0, ...users.map((u) => u.id)) + 1;
  const hash = bcrypt.hashSync(password, 10);
  const newUser = { id, email, passwordHash: hash, role };
  users.push(newUser);
  writeUsers(users); // аналогично writeData
  res.status(201).json({ user: { id, email, role } });
});

// Получить список должностей
app.get("/api/positions", auth(), (req, res) => {
  try {
    res.json(readPositions());
  } catch (e) {
    res.status(500).json({ message: "Ошибка чтения positions.json" });
  }
});

// Добавить новую должность
app.post("/api/positions", auth("PM"), (req, res) => {
  const arr = readPositions();
  if (!req.body.name) return res.status(400).json({ message: "Нет name" });
  arr.push(req.body.name);
  writePositions(arr);
  res.status(201).json(arr);
});

// Получить список компетенций
app.get("/api/competencies", auth(), (req, res) => {
  try {
    res.json(readCompetencies());
  } catch (e) {
    res.status(500).json({ message: "Ошибка чтения competencies.json" });
  }
});

// Добавить новую компетенцию
app.post("/api/competencies", auth("PM"), (req, res) => {
  const arr = readCompetencies();
  if (!req.body.name) return res.status(400).json({ message: "Нет name" });
  arr.push(req.body.name);
  writeCompetencies(arr);
  res.status(201).json(arr);
});

// Получить сохранённые токены
app.get("/api/integrations", auth(), (req, res) => {
  try {
    res.json(readTokens());
  } catch (e) {
    res.status(500).json({ message: "Ошибка чтения integrations.json" });
  }
});

// Сохранить токен для сервиса jira|bitrix|1c
app.post("/api/integrations/:svc", auth("PM"), (req, res) => {
  const svc = req.params.svc;
  const { token } = req.body;
  if (!["jira", "bitrix", "1c"].includes(svc))
    return res.status(400).json({ message: "Неверный сервис" });

  const all = readTokens();
  all[svc] = token;
  writeTokens(all);
  res.sendStatus(204);
});

// Удалить токен для сервиса jira|bitrix|1c
app.delete("/api/integrations/:svc", auth("PM"), (req, res) => {
  const svc = req.params.svc;
  if (!["jira", "bitrix", "1c"].includes(svc)) {
    return res.status(400).json({ message: "Неверный сервис" });
  }

  const all = readTokens();
  all[svc] = ""; // сбрасываем токен
  writeTokens(all);
  res.sendStatus(204);
});

// Удалить должность
app.delete("/api/positions/:name", auth("PM"), (req, res) => {
  const arr = readPositions();
  const filtered = arr.filter((p) => p !== req.params.name);
  writePositions(filtered);
  res.sendStatus(204);
});

// Удалить компетенцию
app.delete("/api/competencies/:name", auth("PM"), (req, res) => {
  const arr = readCompetencies();
  const filtered = arr.filter((c) => c !== req.params.name);
  writeCompetencies(filtered);
  res.sendStatus(204);
});

// Удалить пользователя
app.delete("/api/users/:id", auth("PM"), (req, res) => {
  const id = Number(req.params.id);
  let users = readUsers();
  // найдём индекс
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return res.status(404).json({ message: "Не найдено" });
  users.splice(idx, 1);
  writeUsers(users); // реализация аналогична writeData
  res.sendStatus(204);
});
