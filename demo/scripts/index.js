const { ThemeHandler } = globalThis.darkModeToggle;

const button = document.querySelector("#toggle");

button.on("click", (evt) => {
    console.log(`button was clicked: ${evt.theme}`);
});

button.on("animationStart", (evt) => {
    console.log(`animation started: ${evt.theme}`);
});

button.on("animationComplete", (evt) => {
    console.log(`animation completed: ${evt.theme}`);
});

ThemeHandler.on("themeChanged", (evt) => {
    console.log(`Theme changed: ${evt.theme}`);
});

ThemeHandler.on("themeLoaded", (evt) => {
    console.log(`Theme loaded: ${evt.theme}`);
});
