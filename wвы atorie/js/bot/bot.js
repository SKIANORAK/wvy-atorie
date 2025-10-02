// bot.js - TELEGRAM BOT
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Токен бота (замени на свой)
const TOKEN = '7969220641:AAGCTj-G2kGav5g4QqR2yx2fV6KUpSByKWQ';
const bot = new TelegramBot(TOKEN, { polling: true });

console.log('🤖 Бот запущен...');

// Команда /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name;
    
    const welcomeMessage = `
👋 Привет, ${userName}!

Я бот магазина *wвы atorie* 🛍️

*Что я умею:*
• Принимать заказы из интернет-магазина
• Уведомлять о новых заказах
• Отвечать на частые вопросы

*Основные команды:*
/help - Помощь и инструкции
/orders - Посмотреть последние заказы
/contact - Связаться с поддержкой

Заказы будут приходить автоматически когда покупатели оформляют заказ на сайте.

Жду ваших заказов! 🎉
    `;

    bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'Markdown',
        reply_markup: {
            keyboard: [
                ['📦 Мои заказы', '🛍️ Каталог'],
                ['📞 Контакты', '❓ Помощь']
            ],
            resize_keyboard: true
        }
    });
});

// Команда /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    
    const helpMessage = `
*📋 Руководство по боту*

*Для администратора:*
• Заказы приходят автоматически с сайта
• На каждый заказ можно ответить кнопками
• Статусы заказов сохраняются

*Для покупателей:*
• Оформляйте заказ на сайте
• Указывайте свой Telegram в контактах
• Я свяжусь с вами для уточнения деталей

*Частые вопросы:*
❓ *Как отследить заказ?*
- Я пришлю трек номер после отправки

❓ *Способы оплаты?*
- Наличные при получении
- Перевод на карту
- Онлайн оплата

❓ *Сроки доставки?*
- 1-3 дня по городу
- 3-7 дней по России

По всем вопросам: @your_username
    `;

    bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// Команда /orders (для просмотра заказов)
bot.onText(/\/orders|📦 Мои заказы/, (msg) => {
    const chatId = msg.chat.id;
    
    // Здесь можно подключить базу данных
    const ordersMessage = `
*📦 Активные заказы:*

*Заказ #001* (15 мин назад)
• BasedGod Hoodie × 1
• Статус: 🟡 Ожидает подтверждения
• Сумма: 3 500 ₽

*Заказ #002* (2 часа назад)  
• White T-Shirt × 2
• Статус: 🟢 Принят в работу
• Сумма: 3 000 ₽

*Всего за сегодня: 2 заказа на 6 500 ₽*
    `;

    bot.sendMessage(chatId, ordersMessage, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [[
                { text: "🔄 Обновить", callback_data: "refresh_orders" },
                { text: "📊 Статистика", callback_data: "stats" }
            ]]
        }
    });
});

// Команда /contact
bot.onText(/\/contact|📞 Контакты/, (msg) => {
    const chatId = msg.chat.id;
    
    const contactMessage = `
*📞 Контактная информация*

*Магазин:* wвы atorie
*Владелец:* @your_username
*Телефон:* +7 (999) 123-45-67
*Email:* shop@wыatorie.ru

*Режим работы:*
Пн-Пт: 10:00 - 20:00
Сб-Вс: 11:00 - 18:00

*Адрес:*
г. Москва, ул. Примерная, д. 123

*Сайт:* https://wыatorie.ru
    `;

    bot.sendMessage(chatId, contactMessage, { 
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [[
                { text: "📞 Позвонить", url: "tel:+79991234567" },
                { text: "📧 Написать", url: "mailto:shop@wыatorie.ru" }
            ]]
        }
    });
});

// Обработка callback-кнопок
bot.on('callback_query', (callbackQuery) => {
    const message = callbackQuery.message;
    const chatId = message.chat.id;
    const data = callbackQuery.data;

    if (data === 'refresh_orders') {
        bot.answerCallbackQuery(callbackQuery.id, { text: '🔄 Обновляем заказы...' });
        // Обновляем список заказов
        bot.sendMessage(chatId, 'Список заказов обновлен!');
    }
    
    if (data === 'stats') {
        const statsMessage = `
*📊 Статистика за месяц*

*Заказы:*
• Всего: 47 заказов
• Выполнено: 45
• В работе: 2

*Финансы:*
• Общая сумма: 156 800 ₽
• Средний чек: 3 336 ₽

*Популярные товары:*
1. BasedGod Hoodie - 23 шт.
2. White T-Shirt - 18 шт.  
3. Crew Neck - 12 шт.
        `;
        
        bot.sendMessage(chatId, statsMessage, { parse_mode: 'Markdown' });
    }
});

// Обработка текстовых сообщений
bot.on('message', (msg) => {
    if (msg.text && !msg.text.startsWith('/')) {
        const chatId = msg.chat.id;
        
        // Простой AI-ответ
        const userMessage = msg.text.toLowerCase();
        
        if (userMessage.includes('привет') || userMessage.includes('здравствуй')) {
            bot.sendMessage(chatId, `Привет, ${msg.from.first_name}! Чем могу помочь? 😊`);
        }
        else if (userMessage.includes('доставка') || userMessage.includes('доставку')) {
            bot.sendMessage(chatId, '🚚 *Информация о доставке:*\n\n• По городу: 1-3 дня\n• По России: 3-7 дней\n• СДЭК, Boxberry\n• Самовывоз: г. Москва', { parse_mode: 'Markdown' });
        }
        else if (userMessage.includes('цена') || userMessage.includes('стоимость')) {
            bot.sendMessage(chatId, '💰 *Цены:*\n\n• Худи: 3 500 ₽\n• Футболки: 1 500 ₽\n• Свитшоты: 2 200 ₽\n\nПолный каталог на сайте!', { parse_mode: 'Markdown' });
        }
        else if (userMessage.includes('каталог') || userMessage.includes('товар')) {
            bot.sendMessage(chatId, '🛍️ *Наш каталог:*\n\nПосмотреть все товары и актуальные цены можно на нашем сайте:\nhttps://wыatorie.ru\n\nИспользуйте сайт для оформления заказов!', { parse_mode: 'Markdown' });
        }
        else {
            bot.sendMessage(chatId, 'Извините, я пока не понимаю этот вопрос. Используйте команды меню или напишите владельцу: @your_username');
        }
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('🤖 Telegram Bot is running!');
});