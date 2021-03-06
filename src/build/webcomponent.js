import "../Button.css";
import { Button } from "../Button.js";
import { ThemeHandler } from "../ThemeHandler.js";

const styleTemplate = document.createElement("template");
styleTemplate.innerHTML = `STYLE_TEMPLATE`;

class Toggle extends HTMLElement {
    static get observedAttributes() {
        return [
            "width",
            "height",
            "theme",
        ];
    }

    connectedCallback() {
        // Create a shadow root
        this.attachShadow({ mode: "open" });

        const options = {
            width: this.getAttribute("width"),
            height: this.getAttribute("height"),
            theme: this.getAttribute("theme"),
            useThemeHandler: this.getAttribute("useThemeHandler") ?? true,
        };

        this.shadowRoot.appendChild(styleTemplate.content.cloneNode(true));
        this.button = new Button(this.shadowRoot, options);
        this.button.on("click", (evt) => {
            this.setAttribute("theme", evt.theme)
        })
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue == undefined || oldValue === newValue) {
            return;
        }

        switch (name) {
            case "width":
                this.setWidth(parseInt(newValue, 10));
                break;
            case "height":
                this.setHeight(parseInt(newValue, 10));
                break;
            case "theme":
                this.setTheme(newValue);
                break;
            default:
                throw new Error(`The property ${name} is not supported`);
        }
    }

    setWidth (width) {
        this.button?.setWidth(width);
        this.setAttribute("width", width);
        this.removeAttribute("height");
    }

    setHeight (height) {
        this.button?.setHeight(height);
        this.setAttribute("height", height);
        this.removeAttribute("width");
    }

    setTheme (theme, skipAnimation) {
        this.button?.setTheme(theme, skipAnimation);
        this.setAttribute("theme", theme);
    }

    on (...args) {
        this.button?.on(...args);
        if (ThemeHandler.initialized) {
            ThemeHandler.on(...args);
        }
    }

    once (...args) {
        this.button?.once(...args);
        if (ThemeHandler.initialized) {
            ThemeHandler.once(...args);
        }
    }

    off (...args) {
        this.button?.off(...args);
        if (ThemeHandler.initialized) {
            ThemeHandler.off(...args);
        }
    }
}

window.customElements.define("dark-mode-toggle", Toggle);

globalThis.darkModeToggle = {
    Button,
    ThemeHandler,
};