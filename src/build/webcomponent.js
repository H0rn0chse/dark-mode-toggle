import { Button } from "../Button.js";
import { ThemeHandler } from "../ThemeHandler.js";
import { styleTemplate } from "../styleTemplate.js";

class Toggle extends HTMLElement {
    connectedCallback() {
        // Create a shadow root
        this.attachShadow({mode: "open"});

        const options = {
            width: this.getAttribute("width")
        };

        this.shadowRoot.appendChild(styleTemplate.content.cloneNode(true));
        this.button = new Button(this.shadowRoot, options);
    }

    on (...args) {
        return this.button?.on(...args);
    }

    once (...args) {
        return this.button?.once(...args);
    }

    off (...args) {
        return this.button?.off(...args);
    }
}

window.customElements.define("dark-mode-toggle", Toggle);

globalThis.darkModeToggle = {
    Button,
    ThemeHandler,
};