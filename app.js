const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

app.use(express.json({ extended: true }))

// Создаём роуты для приложения (ручки)
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))

const PORT = config.get('PORT') || 5000

// Функция запускает сервер и подключается к mongodb
async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex : true
        })
        app.listen(PORT, () => console.log(`Server has been started on port ${PORT}...`))
    }
    catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()