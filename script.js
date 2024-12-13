import * as PlayHT from 'playht';
import fs from 'fs';

// Функция для озвучивания текста на русском с использованием PlayHT
async function speakInRussian(text) {
    try {
        // Параметры для русской речи
        const stream = await PlayHT.stream(text, {
            voiceEngine: 'PlayHT2.0-turbo',  // Выбор движка
            voiceId: 's3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-ru/manifest.json',  // Идентификатор русского голоса
            outputFormat: 'mp3',  // Формат вывода
        });

        // Запись потока в файл
        const fileStream = fs.createWriteStream('response.mp3');
        stream.pipe(fileStream);

        fileStream.on('finish', () => {
            // Проигрываем файл с озвучиванием
            const audio = new Audio('response.mp3');
            audio.play();
        });
    } catch (error) {
        console.error("Ошибка при озвучивании:", error);
    }
}

// Функция для начала/остановки распознавания речи
const startBtn = document.getElementById('startBtn');
const status = document.getElementById('status');
const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;
let isRecognizing = false;

// Функция для начала распознавания
function startRecognition() {
    recognition = new speechRecognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false; // Ожидаем завершения фразы
    recognition.maxAlternatives = 1; // Максимум одна альтернатива

    recognition.onstart = () => {
        isRecognizing = true;
        startBtn.classList.add('active');
        startBtn.textContent = 'Остановить';
        status.textContent = 'Распознавание началось...';
        console.log('Распознавание началось');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('Распознанное: ', transcript);
        status.textContent = `Распознанная команда: ${transcript}`;

        // Обработка команд
        handleCommand(transcript);

        // После выполнения команды, сразу начинаем следующее распознавание
        recognition.stop();
        setTimeout(() => {
            recognition.start(); // Перезапускаем распознавание для следующей команды
        }, 500); // Небольшая задержка перед следующим распознаванием
    };

    recognition.onerror = (event) => {
        console.error('Ошибка распознавания: ', event.error);
        status.textContent = `Ошибка распознавания: ${event.error}`;
    };

    recognition.onend = () => {
        if (isRecognizing) {
            recognition.start(); // Начинаем заново, если остановилось
        }
    };

    recognition.start();
}

// Функция для остановки распознавания
function stopRecognition() {
    if (recognition) {
        recognition.stop();
        isRecognizing = false;
        startBtn.classList.remove('active');
        startBtn.textContent = 'Запуск';
        status.textContent = 'Распознавание остановлено.';
        console.log('Распознавание остановлено');
    }
}

// Обработчик для кнопки
startBtn.addEventListener('click', () => {
    if (isRecognizing) {
        stopRecognition(); // Если распознавание активно, останавливаем его
    } else {
        startRecognition(); // Если распознавание не активно, запускаем его
    }
});

// Функция для обработки команд
function handleCommand(command) {
    if (/(открой ютуб|youtube)/i.test(command)) {
        speakInRussian('Ваш запрос выполнен, я открыл YouTube');
        window.open('https://www.youtube.com', '_blank');
    } else if (/(открой google|гугл|google)/i.test(command)) {
        speakInRussian('Я открыл Google');
        window.open('https://www.google.com', '_blank');
    } else if (/(блумберг|blomberg)/i.test(command)) {
        speakInRussian('Я открыл Bloomberg');
        window.open('https://www.bloomberg.com', '_blank');
    } else if (/(инвестинг|investing)/i.test(command)) {
        speakInRussian('Я открыл Investing');
        window.open('https://www.investing.com', '_blank');
    } else if (/(телеграм|telegram)/i.test(command)) {
        speakInRussian('Я открыл Telegram');
        window.open('https://web.telegram.org', '_blank');
    } else if (/(найди|поиск)/i.test(command)) {
        const searchQuery = command.replace(/найди|поиск/i, '').trim();
        if (searchQuery) {
            speakInRussian(`Нашел актуальную информацию про ${searchQuery}`);
            window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
        }
    } else if (/(видео)/i.test(command)) {
        const videoQuery = command.replace(/видео/i, '').trim();
        if (videoQuery) {
            speakInRussian(`Вот актуальные видеоролики на тему: ${videoQuery}`);
            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(videoQuery)}`, '_blank');
        }
    } else if (/(спасибо)/i.test(command)) {
        const responses = [
            'Всегда пожалуйста, сэр.',
            'Рад был вам помочь.',
            'Истенное наслаждение видеть вас за работой, всегда пожалуйста.'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        speakInRussian(randomResponse);
    } else {
        speakInRussian('Извините, я не понял вашу команду');
    }
}
