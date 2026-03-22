const apiKey = "cd7b84aa1639dc60616aabd13012eec2";

// Функція отримання погоди (українською)
async function checkWeather(city, target = "main") {
    const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}&lang=uk`;
    
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Місто не знайдено");
        const data = await res.json();
        
        if (target === "main") {
            // Анімація оновлення
            const mainCard = document.querySelector(".main-side");
            mainCard.style.opacity = "0.5";
            
            setTimeout(() => {
                document.getElementById("cityName").innerText = data.name;
                document.getElementById("mainTemp").innerText = Math.round(data.main.temp) + "°C";
                document.getElementById("description").innerText = data.weather[0].description;
                document.getElementById("mainIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
                mainCard.style.opacity = "1";
            }, 300);

        } else {
            // Оновлення для міні-карток
            document.getElementById(`temp-${target}`).innerText = Math.round(data.main.temp) + "°C";
        }
    } catch (err) {
        if (target === "main") alert("Помилка: " + err.message);
    }
}

// Автовизначення місця (Українською)
function initGeo() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=uk`;
            
            try {
                const res = await fetch(url);
                const data = await res.json();
                
                const toast = document.getElementById("weatherToast");
                document.getElementById("toastCity").innerText = "Погода поруч: " + data.name;
                document.getElementById("toastTemp").innerText = Math.round(data.main.temp) + "°C, " + data.weather[0].description;
                document.getElementById("toastIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                
                toast.classList.add("show");
                checkWeather(data.name); // Встановлюємо як основне місто
            } catch (e) { console.log("Гео-дані недоступні"); }
        });
    }
}

// Обробка пошуку
document.getElementById("cityInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter" && e.target.value !== "") {
        checkWeather(e.target.value);
        e.target.value = "";
    }
});

// Клік на алерти
document.querySelectorAll(".alert-item").forEach(item => {
    item.onclick = () => alert("Деталі сповіщення: " + item.innerText);
});

// Запуск при завантаженні
window.onload = () => {
    checkWeather("Київ"); // Місто за замовчуванням
    checkWeather("London", "London");
    checkWeather("Madrid", "Madrid");
    initGeo(); // Запит геолокації
};