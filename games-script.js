document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM Loaded");

    fetch("https://raw.githubusercontent.com/aplaeo/demogame/refs/heads/main/all-demo.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Data fetched:", data);

            const gamesContainer = document.getElementById('demo-games-container');
            const categoryFilter = document.getElementById('category-filter');

            if (!data.games || data.games.length === 0) {
                console.error("No games found in the data");
                return;
            }

            // สร้างปุ่ม category จากข้อมูลที่มี
            const categories = [...new Set(data.games.map(game => game.category))];
            categories.forEach(category => {
                console.log("Creating button for category:", category);
                let categoryButton = document.createElement('button');
                categoryButton.className = 'category-button';
                categoryButton.setAttribute('data-category', category);
                categoryButton.textContent = category;
                categoryFilter.appendChild(categoryButton);
            });

            // ฟังก์ชันสำหรับแสดงเกมตาม category
            function displayGames(category) {
                console.log("Displaying games for category:", category);
                gamesContainer.innerHTML = '';
                data.games
                    .filter(game => category === 'all' || game.category === category)
                    .forEach(game => {
                        let gameCard = document.createElement('div');
                        gameCard.className = 'game-card';
                        gameCard.innerHTML = `
                            <img src="${game.image}" alt="${game.title}" class="game-image">
                            <p>${game.title}</p>
                            <button onclick="openDemo('${game.demoLink}')" class="play-button">Play Demo</button>
                        `;
                        gamesContainer.appendChild(gameCard);
                    });
            }

            // แสดงเกมทั้งหมดในตอนเริ่มต้น
            displayGames('all');

            // Event listener สำหรับปุ่ม category
            categoryFilter.addEventListener('click', (e) => {
                if (e.target.classList.contains('category-button')) {
                    const selectedCategory = e.target.getAttribute('data-category');
                    displayGames(selectedCategory);
                }
            });
        })
        .catch(error => console.error('Error fetching games:', error));
});

// ฟังก์ชันเปิดเกมใน iframe
function openDemo(link) {
    let demoWindow = window.open("", "Game Demo", "width=800,height=600");
    if (demoWindow) {
        demoWindow.document.write(`
            <html>
                <head><title>Game Demo</title></head>
                <body>
                    <iframe src="${link}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
                </body>
            </html>
        `);
    } else {
        alert("Pop-up ถูกบล็อก กรุณาอนุญาตให้เบราว์เซอร์แสดง Pop-up เพื่อเล่นเกม");
    }
}