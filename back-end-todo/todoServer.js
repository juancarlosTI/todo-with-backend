const express = require('express');
const sqlite =  require('sqlite3').verbose();
const cors = require('cors');
// 

const app = express();
const db = new sqlite.Database('./todo.db', (err) => {
    if (err){
        console.error('Erro ao iniciar o banco de dados');
    } else {
        console.log('Banco de dados iniciado');
    }
});

// Criar tabela

db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS todo_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        completed BOOLEAN
      )
    `);
  });

// Middleware
app.use(express.json());
app.use(cors());

// Rota padrão '/'
// app.get('/', (req, res) => {
//     res.send('AQUI É BRAZIL!111!!!!!!!1!!11!');
// });

// GET para obter as tarefas
app.get('/', (req,res) => {
    db.all('SELECT * FROM todo_tasks', (err, rows) => {
        if (err){
            return res.status(500).json({error: err.message});
        }
        res.json(rows);
    });
});

// POST para inscrever as tarefas
app.post('/', (req,res) => {
    let { title, completed } = req.body;
    if (!title){
        return res.status(400).json({error: 'O título da tarefa é obrigatório'});
    } else if (completed === undefined || completed === null){
        completed = false;
    }
    
    // Inserir os dados no banco
    const insertSql = `INSERT INTO todo_tasks (title,completed) VALUES (?,?)`;
    db.run(insertSql,[title, completed], function(err){
        if (err){
            return res.status(400).send('Erro ao cadastrar task!');
        };
        res.status(201).json({message:'Task cadastrada'});
    });
});

app.put('/:id', (req,res) => {
    const { completed } = req.body;
    const { id } = req.params;

    const insertSql = `UPDATE todo_tasks SET completed = ? WHERE id = ?;`;
    db.run(insertSql,[completed,id], function(err){
        if (err){
            return res.status(400).send('Erro ao cadastrar task!');
        };
        res.status(201).json({message:'Task editada'});
    });
    // console.log('Está funcionando o PUT!');
});

// Iniciar o server

app.listen(4005, () => {
    console.log('Servidor rodando em http://localhost:4005');
});

