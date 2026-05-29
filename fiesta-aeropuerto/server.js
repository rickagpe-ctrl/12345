const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Lista de invitados - edita aquí con tus 25 amigos
const guests = [
  { id: "g01", name: "Jose Ricardo Almaguer Hernandez",       emoji: "🎉", color: "#6C63FF" },
  { id: "g02", name: "Carlos López",     emoji: "✈️",  color: "#FF6584" },
  { id: "g03", name: "María Rodríguez",  emoji: "🌟",  color: "#43B89C" },
  { id: "g04", name: "José Martínez",    emoji: "🎊",  color: "#F5A623" },
  { id: "g05", name: "Laura Hernández",  emoji: "💫",  color: "#E91E8C" },
  { id: "g06", name: "Miguel Torres",    emoji: "🚀",  color: "#00BCD4" },
  { id: "g07", name: "Sofía Ramírez",    emoji: "🌈",  color: "#9C27B0" },
  { id: "g08", name: "Diego Flores",     emoji: "⭐",  color: "#FF5722" },
  { id: "g09", name: "Valentina Cruz",   emoji: "🎵",  color: "#4CAF50" },
  { id: "g10", name: "Andrés Morales",   emoji: "🎯",  color: "#2196F3" },
  { id: "g11", name: "Isabella Jiménez", emoji: "🦋",  color: "#FF9800" },
  { id: "g12", name: "Sebastián Ruiz",   emoji: "🌺",  color: "#E91E63" },
  { id: "g13", name: "Camila Díaz",      emoji: "🎸",  color: "#009688" },
  { id: "g14", name: "Mateo Vargas",     emoji: "🏆",  color: "#673AB7" },
  { id: "g15", name: "Daniela Castro",   emoji: "🌸",  color: "#F44336" },
  { id: "g16", name: "Samuel Romero",    emoji: "⚡",  color: "#3F51B5" },
  { id: "g17", name: "Natalia Medina",   emoji: "🎀",  color: "#00BCD4" },
  { id: "g18", name: "Lucas Guerrero",   emoji: "🔥",  color: "#FF6F00" },
  { id: "g19", name: "Gabriela Ortiz",   emoji: "💎",  color: "#7B1FA2" },
  { id: "g20", name: "Emilio Reyes",     emoji: "🎭",  color: "#1976D2" },
  { id: "g21", name: "Valeria Moreno",   emoji: "🌻",  color: "#388E3C" },
  { id: "g22", name: "Alejandro Silva",  emoji: "🎪",  color: "#C62828" },
  { id: "g23", name: "Mariana Núñez",    emoji: "🌙",  color: "#AD1457" },
  { id: "g24", name: "Rodrigo Pérez",    emoji: "🎮",  color: "#0288D1" },
  { id: "g25", name: "Fernanda Soto",    emoji: "🦄",  color: "#6A1B9A" },
];

const arrivals = [];
app.get('/test', (req, res) => res.send('Servidor funcionando correctamente'));
// Página de bienvenida para el invitado (se abre al escanear el QR)
app.get('/checkin/:id', (req, res) => {
  const guest = guests.find(g => g.id === req.params.id);
  if (!guest) return res.status(404).send('Invitado no encontrado');

  const alreadyArrived = arrivals.find(a => a.id === guest.id);
  if (!alreadyArrived) {
    const arrival = { ...guest, time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) };
    arrivals.unshift(arrival);
    io.emit('new_arrival', arrival);
  }

  const initials = guest.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  res.send(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>¡Bienvenido!</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
         background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 2rem; }
  .plane { font-size: 3rem; animation: fly 2s ease-in-out infinite alternate; }
  @keyframes fly { from { transform: translateX(-10px) rotate(-5deg); } to { transform: translateX(10px) rotate(5deg); } }
  .avatar { width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
            font-size: 2.5rem; font-weight: 700; color: white; margin: 1.5rem auto;
            background: ${guest.color}; border: 4px solid rgba(255,255,255,0.3);
            box-shadow: 0 0 40px ${guest.color}88; }
  .badge { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
           border-radius: 50px; padding: 6px 20px; font-size: 0.8rem; color: rgba(255,255,255,0.7);
           letter-spacing: 3px; text-transform: uppercase; margin-bottom: 1rem; }
  h1 { color: white; font-size: 2rem; text-align: center; font-weight: 700; }
  .emoji-big { font-size: 4rem; margin: 1rem; display: block; text-align: center; }
  .msg { color: rgba(255,255,255,0.7); text-align: center; font-size: 1rem; margin-top: 0.5rem; max-width: 280px; line-height: 1.6; }
  .boarding { background: linear-gradient(135deg, ${guest.color}, ${guest.color}88); color: white;
              border-radius: 16px; padding: 1.5rem 2rem; margin-top: 2rem; text-align: center; width: 100%; max-width: 300px; }
  .boarding-label { font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; opacity: 0.8; }
  .boarding-value { font-size: 1.1rem; font-weight: 700; margin-top: 2px; }
</style></head><body>
<div class="plane">✈️</div>
<div class="badge">BOARDING PASS</div>
<div class="avatar">${initials}</div>
<h1>${guest.name}</h1>
<span class="emoji-big">${guest.emoji}</span>
<p class="msg">¡Tu llegada ha sido registrada! Bienvenido a bordo 🎊</p>
<div class="boarding">
  <div class="boarding-label">Hora de llegada</div>
  <div class="boarding-value">${arrivals.find(a=>a.id===guest.id)?.time || ''}</div>
</div>
</body></html>`);
});

// Pantalla del proyector
app.get('/pantalla', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pantalla.html'));
});

// API para obtener llegadas
app.get('/api/arrivals', (req, res) => res.json(arrivals));
app.get('/api/guests', (req, res) => res.json(guests));
app.get('/debug', (req, res) => {
  const fs = require('fs');
  const files = {
    dirname: __dirname,
    public: fs.existsSync(path.join(__dirname, 'public')) ? fs.readdirSync(path.join(__dirname, 'public')) : 'NO EXISTE',
    root: fs.readdirSync(__dirname)
  };
  res.json(files);
});
http.listen(process.env.PORT || 8080, () => console.log('🚀 Servidor corriendo'));
