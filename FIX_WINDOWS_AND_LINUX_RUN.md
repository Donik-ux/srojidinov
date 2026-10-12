# TOPEX Texnikumi — как запустить на Windows и Linux

## 1) Что нужно исправить для Windows

### Проблема
Скрипт запуска [START.sh](START.sh) рассчитан на Linux/Unix окружение и ожидает, что в проекте есть локальный MongoDB бинарник:

- папка `mongodb/bin/mongod`
- папка `mongodb-data`

В этой среде Windows такого файла нет, поэтому запуск падает ещё до старта backend и frontend.

### Что нужно сделать

#### Вариант A — самый простой для Windows
Не использовать [START.sh](START.sh), а запускать проект вручную:

1. Установить зависимости:

```bash
cd backend
npm install

cd ../frontend
npm install
```

2. Запустить MongoDB in-memory для backend:

```bash
cd backend
node mongo-local.js
```

3. В другом терминале запустить backend:

```bash
cd backend
npm run dev
```

4. В третьем терминале запустить frontend:

```bash
cd frontend
npm run dev -- --host 0.0.0.0
```

5. Открыть в браузере:

- http://localhost:3000/
- admin: http://localhost:3000/login

#### Вариант B — если хочется использовать MongoDB штатно
Нужно установить настоящую MongoDB на Windows или использовать MongoDB Atlas, после чего поправить `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/topex
```

или:

```env
MONGO_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/topex?retryWrites=true
```

После этого можно запускать backend без `mongo-local.js`.

#### Что ещё может мешать
В проекте на Windows иногда не хватает пакета `dompurify` для frontend. Если Vite пишет ошибку про missing dependency, выполните:

```bash
cd frontend
npm install dompurify
```

---

## 2) Как запустить на Linux / WSL

### Самый быстрый способ
Если проект лежит в Linux-окружении и папка `mongodb/` есть, просто выполните:

```bash
cd /path/to/project
bash START.sh
```

### Что делает этот скрипт
- запускает MongoDB
- устанавливает зависимости
- запускает backend на порту 10000
- запускает frontend на порту 3000

### Ожидаемые адреса

- Frontend: http://localhost:3000/
- Backend API: http://localhost:10000/api
- Admin: http://localhost:3000/login

### Учетные данные по умолчанию

- Email: `admin@topex.uz`
- Пароль: `Topex2026!`

---

## 3) Итог

### Для Windows
Нужно не полагаться на [START.sh](START.sh), а запускать проект вручную через:

- `node mongo-local.js`
- `npm run dev` для backend
- `npm run dev -- --host 0.0.0.0` для frontend

### Для Linux / WSL
Нужно использовать [START.sh](START.sh), потому что он специально создан для такого запуска.

---

## 4) Резюме

Если проект должен работать в Windows, то нужно:

- установить зависимости;
- запустить MongoDB in-memory или локальный MongoDB;
- запустить backend и frontend отдельно;
- не использовать Linux-скрипт без Linux-окружения.

Если проект запускается в Linux/WSL, то обычно всё запускается автоматически через один скрипт.
