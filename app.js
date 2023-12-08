const telegrambot = require('node-telegram-bot-api');

const token = '6802319674:AAG3mBMojhnyMZfMZ940IAqo2cnCm7w90bI';

const bot = new telegrambot(token, {polling: true});

const mysql2 = require("mysql2");

const connection = mysql2.createConnection({
    host: "localhost",
    user: "root",
    database: "chatbottests",
    password: ''
});

connection.connect(function(err){
    if(err){
        return console.error("Ошибка: " + err.message);
    }
    else{
        console.log("Подключение к серверу установленно");
    }
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
  

bot.onText(/\/help/, (msg)=>{
    const chatid = msg.chat.id;
    bot.sendMessage(chatid, 'help - возвращает список команд, с их описанием\nsite - отправляет в чат ссылку на сайт октагона\ncreator - отправляет в чат ваше ФИО');
});

bot.onText(/\/site/, (msg)=>{
    const chatid = msg.chat.id;
    bot.sendMessage(chatid, 'https://students.forus.ru/');
});

bot.onText(/\/creator/, (msg)=>{
    const chatid = msg.chat.id;
    bot.sendMessage(chatid, 'Тожиев Роман Шамсиддинович');
});

bot.onText(/\/randomItem/, (msg)=>{
    const chatid = msg.chat.id;
    let dbSize = 0;
    connection.query('select count(*) from items', function(err, results){
        if(err) console.log(err.message);
        else{
            dbSize = results[0]['count(*)'];
            let itemId = getRandomInt(1, dbSize);
            console.log(itemId);
            connection.query('select * from items where id=?', [itemId], function(err, results){
                if(err) console.log(err.message);
                else{
                    console.log(results);
                    for(let res of results){
                        bot.sendMessage(chatid, `(${res.id}) - ${res.name}:${res.description}`);
                    }
                }
            });
        }
    });
});

bot.onText(/\/deleteItem/, (msg)=>{
    const chatid = msg.chat.id;
    let itemId = parseInt(msg.text.substring(12));
    connection.query('delete from items where items.id=?', [itemId], function(err, results){
        if(err) bot.sendMessage(chatid, "Ошибка: " + err.message);
        else bot.sendMessage(chatid, "Успешно");
    });
});

bot.onText(/\/getItemByID/, (msg)=>{
    const chatid = msg.chat.id;
    let itemId = parseInt(msg.text.substring(12));
    connection.query('select * from items where id=?', [itemId], function(err, results){
        if(err) bot.sendMessage(chatid, "Ошибка: " + err.message);
        else {                    
            for(let res of results){
                bot.sendMessage(chatid, `(${res.id}) - ${res.name}:${res.description}`);
            }
        }
    });
});