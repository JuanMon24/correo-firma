import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Clave de encriptación y longitud del IV (32 caracteres para AES-256)
const VITE_ENCRYPTION_KEY = process.env.VITE_ENCRYPTION_KEY;
const IV_LENGTH = 16;

// Validación de la longitud de la clave de encriptación
if (!VITE_ENCRYPTION_KEY || VITE_ENCRYPTION_KEY.length !== 32) {
  throw new Error('La clave de encriptación debe tener exactamente 32 caracteres.');
}

// Función de encriptación
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH); // Genera IV de 16 bytes
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(VITE_ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, 'utf8', 'base64'); // Cambiamos 'hex' a 'base64'
  encrypted += cipher.final('base64'); // Cambiamos 'hex' a 'base64'
  return iv.toString('base64') + ':' + encrypted; // Codificamos IV y texto en base64
}

// Rutas de archivo JSON
const dbFilePath = path.join(process.cwd(), 'src', 'utils', 'json', 'users.json');
const encryptedDbFilePath = path.join(process.cwd(), 'public', 'db', 'users.json');

// Crear el directorio "public/db" si no existe
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Asegura que el directorio existe
ensureDirExists(path.join(process.cwd(), 'public', 'db'));

// Leer y encriptar el archivo JSON
const data = fs.readFileSync(dbFilePath, 'utf-8');
const encryptedData = encrypt(data);

// Guardar el archivo encriptado en la carpeta "public/db" como "users.json"
fs.writeFileSync(encryptedDbFilePath, encryptedData, 'utf-8');

console.log('Archivo JSON encriptado y guardado en:', encryptedDbFilePath);
