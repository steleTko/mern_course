const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    // Проверяем доступность сервера
    if(req.method === 'OPTIONS') {
        return next()
    }

    // Если это обычный запрос по типу POST, GET
    try {
        const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"

        if(!token) {
            return res.status(401).json({ message: 'Нет авторизации' })
        }
        // Если TOKEN все же есть, то нам нужно его распарсить
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        req.user = decoded
        next()
    }
    catch (e) {
        res.status(401).json({ message: 'Нет авторизации' })
    }
}