const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const guests = [
  { id: "g01", name: "Martha Méndez Palomares",       emoji: "🎉", color: "#6C63FF", photo: "https://cdn.phototourl.com/member/2026-06-04-c07af0d5-75b4-45f4-9167-f945f4e30635.jpg" },
  { id: "g02", name: "Sonia Segundo Landeros",     emoji: "✈️",  color: "#FF6584", photo: "https://cdn.phototourl.com/member/2026-06-04-fb5643e0-d402-4abe-b7e1-18f28a67641c.jpg" },
  { id: "g03", name: "Ofelia Galván Hernández",  emoji: "🌟",  color: "#43B89C", photo: "https://cdn.phototourl.com/member/2026-06-08-b7e241d4-8c97-4d96-bef4-6aa0649bb610.jpg" },
  { id: "g04", name: "Ana María Treviño González",    emoji: "🎊",  color: "#F5A623", photo: "https://cdn.phototourl.com/member/2026-06-04-67808865-f2fa-4778-bb71-eb745698de22.jpg" },
  { id: "g05", name: "Margarita Catalina Urbina Menchaca",  emoji: "💫",  color: "#E91E8C", photo: "https://cdn.phototourl.com/member/2026-06-04-cc11fab5-699b-46f9-b1db-48a360f92107.jpg" },
  { id: "g06", name: "Nancy Elizabeth Soriano Saavedra",    emoji: "🚀",  color: "#00BCD4", photo: "https://cdn.phototourl.com/member/2026-06-04-8a90ad75-b7d0-4553-8573-faff892be3e0.jpg" },
  { id: "g07", name: "Mirta Alicia García Madrigal",    emoji: "🌈",  color: "#9C27B0", photo: "https://cdn.phototourl.com/member/2026-06-04-3bdc8b0a-a948-462a-b139-ef087ac8dc85.jpg" },
  { id: "g08", name: "Marcelino Valentín Santiago",     emoji: "⭐",  color: "#FF5722", photo: "https://cdn.phototourl.com/member/2026-06-04-909c6747-c5bf-4cff-82a6-1c8a6c3b7abc.jpg" },
  { id: "g09", name: "Elia Karina Mireles Arredondo",   emoji: "🎵",  color: "#4CAF50", photo: "https://cdn.phototourl.com/member/2026-06-04-a27ab90d-050f-4579-81fe-afadfc0c6f53.jpg" },
  { id: "g10", name: "Norma Oralia Aurona Solís",   emoji: "🎯",  color: "#2196F3", photo: "https://cdn.phototourl.com/member/2026-06-04-401d746c-8d4f-4237-b7bb-c0ee2ccef3c0.jpg" },
  { id: "g11", name: "Valeria Yuliana Lira de la Cruz", emoji: "🦋",  color: "#FF9800", photo: "https://cdn.phototourl.com/member/2026-06-08-9abb18f7-120c-4cd2-a5f9-422577a50855.jpg" },
  { id: "g12", name: "Griselda Carolina Cisneros Guerrero",   emoji: "🌺",  color: "#E91E63", photo: "https://cdn.phototourl.com/member/2026-06-08-36547b40-ac44-438c-babf-c2002b133987.jpg" },
  { id: "g13", name: "María del Carmen Trujillo Martínez",      emoji: "🎸",  color: "#009688", photo: "https://cdn.phototourl.com/member/2026-06-08-bd7fc2d5-17d7-4140-9198-f2abfc003002.jpg" },
  { id: "g14", name: "Cesar Augusto Hernández Puente",     emoji: "🏆",  color: "#673AB7", photo: "https://cdn.phototourl.com/member/2026-06-08-2c4f0094-5e4e-4adb-9a43-5b3a1eb65c2b.jpg" },
  { id: "g15", name: "Luz María Villareal Garza",   emoji: "🌸",  color: "#F44336", photo: "https://cdn.phototourl.com/member/2026-06-08-b342e887-8c00-4376-9dda-151d548e3839.jpg" },
  { id: "g16", name: "María Ramona Solís Santibáñez",    emoji: "⚡",  color: "#3F51B5", photo: "https://cdn.phototourl.com/member/2026-06-08-f88df81e-9335-41c5-be23-c62c64243468.jpg" },
  { id: "g17", name: "Roberto Carlos López Salas",   emoji: "🎀",  color: "#00BCD4", photo: "https://cdn.phototourl.com/member/2026-06-08-4890f8a1-1c88-4866-8b16-608ebbe164a3.jpg" },
  { id: "g18", name: "Blanca Leticia Fuentes González",   emoji: "🔥",  color: "#FF6F00", photo: "https://cdn.phototourl.com/member/2026-06-08-465cffb8-8a6f-4951-be46-69d2dfe254fc.jpg" },
  { id: "g19", name: "Gabriela Ortiz",   emoji: "💎",  color: "#7B1FA2", photo: "" },
  { id: "g20", name: "Emilio Reyes",     emoji: "🎭",  color: "#1976D2", photo: "" },
  { id: "g21", name: "Valeria Moreno",   emoji: "🌻",  color: "#388E3C", photo: "" },
  { id: "g22", name: "Alejandro Silva",  emoji: "🎪",  color: "#C62828", photo: "" },
  { id: "g23", name: "Mariana Núñez",    emoji: "🌙",  color: "#AD1457", photo: "" },
  { id: "g24", name: "Rodrigo Pérez",    emoji: "🎮",  color: "#0288D1", photo: "" },
  { id: "g25", name: "Fernanda Soto",    emoji: "🦄",  color: "#6A1B9A", photo: "" },
];

const arrivals = [];

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
  const avatarHTML = guest.photo
    ? `<img src="${guest.photo}" alt="${guest.name}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;border:4px solid rgba(255,255,255,0.3);box-shadow:0 0 40px ${guest.color}88;">`
    : `<div class="avatar">${initials}</div>`;

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
  .avatar-wrap { margin: 1.5rem auto; }
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
<div class="avatar-wrap">${avatarHTML}</div>
<h1>${guest.name}</h1>
<span class="emoji-big">${guest.emoji}</span>
<p class="msg">¡Tu llegada ha sido registrada! Bienvenido a bordo 🎊</p>
<div class="boarding">
  <div class="boarding-label">Hora de llegada</div>
  <div class="boarding-value">${arrivals.find(a=>a.id===guest.id)?.time || ''}</div>
</div>
</body></html>`);
});

app.get('/pantalla', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pantalla.html'));
});

app.get('/api/arrivals', (req, res) => res.json(arrivals));
app.get('/api/guests', (req, res) => res.json(guests));

http.listen(process.env.PORT || 8080, () => console.log('🚀 Servidor corriendo'));
