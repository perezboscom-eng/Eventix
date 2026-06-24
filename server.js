const express = require('express');
const path = require('path');
const cors = require('cors');
const poolMySQL = require('./conexion'); 
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/favoritos', async (req, res) => {
    const { salonId } = req.body;
    try {
        const [result] = await poolMySQL.execute(
            'INSERT INTO favoritos (salon_id) VALUES (?)',
            [salonId]
        );
        res.json({ mensaje: 'Salón guardado en favoritos', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/favoritos', async (req, res) => {
    try {
        const [rows] = await poolMySQL.execute(`
            SELECT DISTINCT salones.* FROM salones 
            INNER JOIN favoritos ON salones.id = favoritos.salon_id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/salones/:id', async (req, res) => {
    const salonId = req.params.id;
    try {
        const [rows] = await poolMySQL.execute('SELECT * FROM salones WHERE id = ?', [salonId]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Salón no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/salones', async (req, res) => {
    try {
        const [rows] = await poolMySQL.execute('SELECT * FROM salones');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/api/registro', async (req, res) => {
    const { nombre, email, password } = req.body;
    
    try {
        // Verificamos si el email ya existe
        const [existingUser] = await poolMySQL.execute(
            'SELECT id FROM usuarios WHERE email = ?', 
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ 
                status: 'error', 
                message: '¡Este correo electrónico ya está registrado!' 
            });
        }

        await poolMySQL.execute(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, password]
        );

        res.json({ 
            status: 'success', 
            message: 'Usuario registrado exitosamente' 
        });

    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await poolMySQL.execute(
            'SELECT * FROM usuarios WHERE email = ? AND password = ?', 
            [email, password]
        );

        if (rows.length > 0) {
            const usuario = rows[0];
            res.json({ 
                status: 'success', 
                message: 'Inicio de sesión exitoso',
                nombre: usuario.nombre 
            });
        } else {
            res.status(401).json({ 
                status: 'error', 
                message: 'Email o contraseña incorrectos, o usuario inexistente.' 
            });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

app.post('/api/contacto', async (req, res) => {
    const { nombre, email, telefono, asunto, mensaje } = req.body;
    
    try {
        await poolMySQL.execute(
            'INSERT INTO messages (nombre, email, telefono, asunto, mensaje) VALUES (?, ?, ?, ?, ?)',
            [nombre, email, telefono, asunto, mensaje]
        );

        res.json({ 
            status: 'success', 
            message: '¡Mensaje enviado y guardado exitosamente!' 
        });

    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});