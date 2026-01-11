import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

// Validación de longitud de clave de encriptación
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  console.error("La clave de encriptación debe tener 32 caracteres.");
  process.exit(1);
}

const dbFilePath = path.join(process.cwd(), 'src', 'utils', 'json', 'db.json');

app.use(bodyParser.json());
app.use(cors());

// Funciones de encriptación y desencriptación
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  const [iv, encryptedData] = text.split(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'), 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Inicializar el archivo de la base de datos en caso de estar vacío o no existir
const initializeDb = () => {
  if (!fs.existsSync(dbFilePath) || fs.readFileSync(dbFilePath, 'utf-8').trim() === '') {
    const initialData = { users: [] };
    fs.writeFileSync(dbFilePath, encrypt(JSON.stringify(initialData)), 'utf-8');
  }
};

// Obtener el siguiente ID disponible basado en los usuarios actuales
const getNextId = (users) => {
  return users.length ? Math.max(...users.map(user => user.id)) + 1 : 1;
};

// Leer usuarios desencriptando el archivo
const readUsers = () => {
  const encryptedData = fs.readFileSync(dbFilePath, 'utf-8');
  return JSON.parse(decrypt(encryptedData)).users;
};

// Guardar usuarios encriptando el archivo
const writeUsers = (users) => {
  fs.writeFileSync(dbFilePath, encrypt(JSON.stringify({ users })), 'utf-8');
};

// Inicializar la base de datos
initializeDb();

// Rutas CRUD
app.get('/users', (req, res) => {
  try {
    const users = readUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer los usuarios' });
  }
});

app.get('/users/:id', (req, res) => {
  try {
    const users = readUsers();
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer el usuario' });
  }
});

app.post('/users', (req, res) => {
  try {
    const users = readUsers();
    const newUser = { ...req.body, id: getNextId(users) };
    users.push(newUser);
    writeUsers(users);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el usuario' });
  }
});

app.put('/users/:id', (req, res) => {
  try {
    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) return res.status(404).json({ error: 'Usuario no encontrado' });

    users[userIndex] = { ...users[userIndex], ...req.body };
    writeUsers(users);
    res.json(users[userIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

app.delete('/users/:id', (req, res) => {
  try {
    let users = readUsers();
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) return res.status(404).json({ error: 'Usuario no encontrado' });

    users = users.filter(u => u.id !== parseInt(req.params.id));
    writeUsers(users);
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});