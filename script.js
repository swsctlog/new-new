const apiKey = 'NfVLdSASKIdlRgGtZY9n21ZUPORudJWt9rbQFSnJ';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=30`;

const starsTableBody = document.getElementById('starsTableBody');
const modal = document.getElementById('modal');
const starName = document.getElementById('starName');
const starDistance = document.getElementById('starDistance');
const starType = document.getElementById('starType');
const starImage = document.getElementById('starImage');
const closeBtn = document.querySelector('.close');

// Функция для заполнения таблицы данными о звездах
function fillTable(data) {
    starsTableBody.innerHTML = '';

    data.forEach(star => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const distanceCell = document.createElement('td');
        const imageCell = document.createElement('td');
        const typeCell = document.createElement('td');

        nameCell.innerText = star.name;
        distanceCell.innerText = star.distance;
        imageCell.innerHTML = `<img src="${star.imageUrl}" alt="${star.name}">`
        typeCell.innerText = star.type;

        row.appendChild(nameCell);
        row.appendChild(distanceCell);
        row.appendChild(imageCell);
        row.appendChild(typeCell);

        row.addEventListener('click', () => {
            starName.innerText = star.name;
            starDistance.innerText = star.distance;
            starType.innerText = star.type;
            starImage.src = star.imageUrl;
            modal.style.display = 'block';
        });

        starsTableBody.appendChild(row);
    });
}

// Функция для закрытия модального окна
function closeModal() {
    modal.style.display = 'none';
}

// Обработчик клика на кнопку закрытия модального окна
closeBtn.addEventListener('click', closeModal);

// Получаем данные о звездах из API сервиса NASA
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        // Преобразуем полученные данные для удобства отображения в таблице
        const stars = data.map(star => ({
            name: star.title,
            distance: star.date,
            imageUrl: star.url,
            type: star.media_type
        }));

        fillTable(stars);
    })
    .catch(error => console.error(error));