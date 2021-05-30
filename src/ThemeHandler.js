class _ThemeHandler {
    constructor () {
        this.themes = {
            light: document.querySelector("#light"),
            dark: document.querySelector("#dark"),
        };

        const savedTheme = localStorage.getItem("theme");
        const systemTheme = this._initWatcher();
        this._initThemes(savedTheme || systemTheme);
    }

    _getInverseTheme (theme) {
        switch (theme) {
            case "light":
                return this.themes.dark;
            case "dark":
                return this.themes.light;
            default:
        }
    }

    _initWatcher () {
        const colorSchemeQueryList = globalThis.matchMedia("(prefers-color-scheme: dark)");
        colorSchemeQueryList.addEventListener("change", (evt) => {
            const preferDark = colorSchemeQueryList.matches;
            this.setTheme(preferDark ? "dark" : "light");
        });
        const preferDark = colorSchemeQueryList.matches;
        return preferDark ? "dark" : "light";
    }

    _initThemes (theme) {
        this.currentTheme = theme;
        const inverseTheme = this._getInverseTheme(theme);
        inverseTheme.remove();
    }

    setTheme (theme) {
        if (this.currentTheme === theme) {
            return;
        }

        const targetTheme = this.themes[theme].cloneNode();
        targetTheme.addEventListener("load", (evt) => {
            // theme is ready
        }, { once: true });
        document.head.appendChild(targetTheme);
        this.themes[theme] = targetTheme;

        const activeTheme = this._getInverseTheme(theme);
        activeTheme.remove();
        this.currentTheme = theme;

        localStorage.setItem("theme", theme);
    }

    getTheme () {
        return this.currentTheme;
    }
}

export const ThemeHandler = new _ThemeHandler();
globalThis.ThemeHandler = ThemeHandler;
