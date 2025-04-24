const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

function convertDateToText(dateStr) {
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];
  const [year, month, day] = dateStr.split('-'); // "2022-02-15" -> ["2022", "02", "15"]
  const monthName = months[parseInt(month, 10) - 1]; // получаем название месяца
  return `${day} ${monthName} ${year}`; // "15 февраля 2022"
}

const DATA_FILE = './data.json';

// Вспомогательные функции для работы с файлом
function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}
function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

const positionMap = {
  'Backend': 'Backend-разработчик',
  'Frontend': 'Frontend-разработчик',
  'Analyst':'Аналитик',
  'Manager':'Менеджер',
  'Designer':'Дизайнер',
  'Fullstack':'Fullstack'
};

const genderMap = {
  'Male': 'Мужчина',
  'Female': 'Женщина'
};

const stackMap = {
  'C#': 'С#',
  'React': 'React',
  'Java': 'Java',
  'PHP': 'PHP',
  'Figma': 'Figma',
  'Word': 'Word'
};

// Универсальная функция для приведения к массиву
function toArray(param) {
  if (param === undefined) return [];
  return Array.isArray(param) ? param : [param];
}

app.get('/api/Employee',auth(), (req, res) => {
  let data = readData();
  const { Name, Gender, Position, Stack, Page = 1, Count = 10 } = req.query;

  // Поиск по имени
  if (Name) {
    data = data.filter(e => e.name.toLowerCase().includes(Name.toLowerCase()));
  }

  // Фильтр по полу
  const genderArr = toArray(Gender).map(g => genderMap[g] || g);
  if (genderArr.length) {
    data = data.filter(e => genderArr.includes(e.gender));
  }

  // Фильтр по позиции
  const positionArr = toArray(Position).map(p => positionMap[p] || p);
  if (positionArr.length) {
    data = data.filter(e => positionArr.includes(e.position));
  }

  // Фильтр по стеку технологий
  const stackArr = toArray(Stack).map(s => stackMap[s] || s);
  if (stackArr.length) {
    data = data.filter(e => {
      if (!e.stack || e.stack.length < stackArr.length) return false;
      console.log(e)
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
app.get('/api/Employee/:id',auth(), (req, res) => {
  const data = readData();
  const employee = data.find(e => e.id == req.params.id);
  if (employee) res.json(employee);
  else res.status(404).json({ message: 'Not found' });
});

// Создать сотрудника
app.post('/api/Employee',auth('HR'), (req, res) => {
  const data = readData();

  const maxId = data.reduce((max, employee) => (employee.id > max ? employee.id : max), 0);
  const newId = maxId + 1;

  const newEmployee = { ...req.body, id: newId,
    birthdate: convertDateToText(req.body.birthdate),
    dateOfEmployment: convertDateToText(req.body.dateOfEmployment), 
  };
  data.unshift(newEmployee);

  writeData(data);
  
  res.status(201).json(newEmployee);
});

// Обновить сотрудника
app.put('/api/Employee/:id', auth('HR'), (req, res) => {
  const data = readData();
  const idx = data.findIndex(e => e.id == req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });

  // Обновляем дату в нужный формат
  const updatedEmployee = { 
    ...data[idx], 
    ...req.body,
    birthdate: req.body.birthdate ? convertDateToText(req.body.birthdate) : data[idx].birthdate,
    dateOfEmployment: req.body.dateOfEmployment ? convertDateToText(req.body.dateOfEmployment) : data[idx].dateOfEmployment
  };

  // Заменяем старую информацию на новую
  data[idx] = updatedEmployee;

  writeData(data);
  res.json(updatedEmployee);
});


// Удалить сотрудника
app.delete('/api/Employee/:id',auth('HR'), (req, res) => {
  let data = readData();
  const idx = data.findIndex(e => e.id == req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  const removed = data.splice(idx, 1);
  writeData(data);
  res.json(removed[0]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


/* ---------- Аутентификация ---------- */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const USERS_FILE = './users.json';
const JWT_SECRET = process.env.JWT_SECRET || 'superSecretKey';
const JWT_EXP = '2h';

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  console.log('LOGIN BODY:', req.body);

   const { email, password } = req.body;
   const users = readUsers();
   const user = users.find(u => u.email === email);
   if (!user || !bcrypt.compareSync(password, user.passwordHash))
     return res.status(401).json({ message: 'Invalid credentials' });

   const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
     expiresIn: JWT_EXP
   });
   res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
 });
  
 // Middleware проверки токена
 function auth(requiredRole) {
   return (req, res, next) => {
     const header = req.headers['authorization'];
     if (!header) return res.status(401).json({ message: 'No token' });
     const [, token] = header.split(' ');
     jwt.verify(token, JWT_SECRET, (err, payload) => {
       if (err) return res.status(401).json({ message: 'Bad token' });
       if (requiredRole && payload.role !== requiredRole)
         return res.status(403).json({ message: 'Forbidden' });
       req.user = payload;
       next();
     });
   };
 }