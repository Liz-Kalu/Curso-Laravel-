import Alpine from 'alpinejs';

window.Alpine = Alpine;
Alpine.start();

console.log("app.js cargado");


// ========================
// 🌙 DARK / LIGHT MODE
// ========================
const html = document.documentElement;
const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)");

let currentTheme = localStorage.getItem("theme") || "system";

function applyTheme(theme) {
    if (theme === "dark" || (theme === "system" && isDarkMode.matches)) {
        html.classList.add("dark");
    } else {
        html.classList.remove("dark");
    }
}

applyTheme(currentTheme);

isDarkMode.addEventListener("change", () => {
    if (currentTheme === "system") {
        applyTheme("system");
    }
});


// ========================
// 🎨 THEME MENU
// ========================
const themeMenu = document.getElementById("theme-menu");

if (themeMenu) {

    const icons = {
        light: document.getElementById("light-icon"),
        dark: document.getElementById("dark-icon"),
        system: document.getElementById("system-icon"),
    };

    const themeOptions = document.querySelectorAll("[data-theme-option]");

    function updateThemeUI(theme) {

        Object.entries(icons).forEach(([key, icon]) => {
            if (!icon) return;

            if (key === theme) {
                icon.classList.remove("hidden");
            } else {
                icon.classList.add("hidden");
            }
        });

        themeMenu.classList.add("hidden");
        localStorage.setItem("theme", theme);
        currentTheme = theme;

        applyTheme(theme);
    }

    themeOptions.forEach(option => {
        option.addEventListener("click", () => {
            const theme = option.dataset.themeOption;
            updateThemeUI(theme);
        });
    });

    document.getElementById("toggle-theme-menu")
        ?.addEventListener("click", () => {
            themeMenu.classList.toggle("hidden");
        });
}


// ========================
// 🍔 MOBILE MENU
// ========================
const toggleMobileMenu = document.getElementById("toggle-mobile-menu");

if (toggleMobileMenu) {

    toggleMobileMenu.addEventListener("click", () => {

        const mobileMenu = document.getElementById("mobile-menu");
        const openIcon = document.getElementById("open-menu-icon");
        const closeIcon = document.getElementById("close-menu-icon");

        mobileMenu?.classList.toggle("hidden");
        openIcon?.classList.toggle("hidden");
        closeIcon?.classList.toggle("hidden");

    });

}
