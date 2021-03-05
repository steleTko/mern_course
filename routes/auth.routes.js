const {Router} = require('express')
const config = require('config')
// Подключаем npm-пакет для хеширования пароля
const bcrypt = require('bcryptjs')
// Подключаем npm-пакет для авторизации пользователя по токену
const jwt = require('jsonwebtoken')
// Подключаем npm-пакет для валидации полей
const {check, validationResult} = require('express-validator')
// Подключаем модель User предварительно её создав
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post(
    '/register',
    //Валидируем поля с помощью npm-пакета express-validator
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов')
            .isLength({min: 6})
    ],
    async (req, res) => {
        try {
            // Обрабатываем ошибку при валидации и если данные неверные, то отправляем её на фронт
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации'
                })
            }

            //Данные будут прилетать с фронта
            const {email, password} = req.body
            //Проверяем, есть ли пользователь с таким email
            const candidate = await User.findOne({email})

            if (candidate) {
                return res.status(400).json({message: 'Такой пользователь уже существует'})
            }

            // Хешируем пароль пользователя с помощью библиотеки bcrypt
            const hashedPassword = await bcrypt.hash(password, 12)
            // Создаём нового пользователя P.S: не забываем передать захешированный пароль
            const user = new User({email, password: hashedPassword})
            // Ожидаем создание пользователя
            await user.save()

            res.status(201).json({message: 'Пользователь создан'})

        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })


// /api/auth/login
router.post(
    '/login',
    //Валидируем поля с помощью npm-пакета express-validator
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            // Обрабатываем ошибку при входе в систему и если данные неверные, то отправляем её на фронт
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе в систему'
                })
            }


            const {email, password} = req.body

            // Ищем создан ли такой пользователь
            const user = await User.findOne({email})

            if (!user) {
                return res.status(400).json({message: 'Пользователь не найден'})
            }
            // Проверяем совпадение паролей
            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({message: 'Неверный пароль попробуйте снова'})
            }
            // Создаём токен нового пользователя
            const token = jwt.sign(
                // Данные для шифрования
                {userId: user.id},
                // Секретный ключ
                config.get('jwtSecret'),
                // Время на которое действителен token
                {expiresIn: '1h'}
            )

            res.json({token, userId: user.id})
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })

module.exports = router