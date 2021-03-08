import React, {useState,useEffect, useContext} from 'react'
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    // Предварительно создали хук для вывода ошибок с помощью materialize
    const message = useMessage()
    // Предварительно создали хук для отправки данных на сервер
    const {loading, error, request, clearError} = useHttp()
    // State для данных формы
    const [form, setForm] = useState({
        email: '', password: ''
    })
    // С помощью хука следим за ошибками
    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    // Обновляем текстовые input
    useEffect(() => {
        window.M.updateTextFields()
    }, [])
    // Получаем данные из формы логин или пароль взависимости от поле name
    const changeHandler = event => {
        setForm({ ...form, [event.target.name] : event.target.value })
    }

    const registerHandler = async () => {
        try {
            // Данный запрос был уже осуществлён на сервере (регистрируем данные полученные из form)
            const data = await request('/api/auth/register', 'POST', {...form})
            // Выводим данные с помощью хука посредством materialize
            message(data.message)
        }
        // Поле ошибки пустое так как мы уже обработали его в хуке
        catch (e) {}
    }

    const loginHandler = async () => {
        try {
            // Данный запрос был уже осуществлён на сервере (регистрируем данные полученные из form)
            const data = await request('/api/auth/login', 'POST', {...form})
            // Выводим данные с помощью хука посредством materialize
            auth.login(data.token, data.userId)
        }
            // Поле ошибки пустое так как мы уже обработали его в хуке
        catch (e) {}
    }



    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Сократи ссылку</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>

                            <div className="input-field">
                                <input
                                    placeholder="Введите email"
                                    id="email"
                                    type="text"
                                    name="email"
                                    className="yellow-input"
                                    value={form.email}
                                    onChange={changeHandler}
                                />
                                    <label htmlFor="email">Email</label>
                            </div>

                            <div className="input-field">
                                <input
                                    placeholder="Введите пароль"
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="yellow-input"
                                    value={form.password}
                                    onChange={changeHandler}
                                />
                                <label htmlFor="password">Пароль</label>
                            </div>

                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className="btn yellow darken-4"
                            disabled={loading}
                            onClick={loginHandler}
                        >
                            Войти
                        </button>
                        <button
                            className="btn grey lighten-1 black-text"
                            onClick={registerHandler}
                            disabled={loading}
                        >
                            Регистрация
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}