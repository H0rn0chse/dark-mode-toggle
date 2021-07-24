import { EventBus } from "./EventBus.js";
import { ThemeHandler } from "./ThemeHandler.js";
import { ToggleAnimation } from "./ToggleAnimation.js";

import animationData from "./animationData.json";

const { lottie } = globalThis;

const RATIO = 320 / 149.3333;
const OUTER_RATIO = 320 / 192;

const defaultOptions = {
    width: 320,
    //height: 150,
    useThemeHandler: true,
    theme: undefined,
};

export class Button extends EventBus {
    constructor (container, options) {
        super("ButtonBus");

        this.options = Object.assign({}, defaultOptions, options);
        if (this.options.height) {
            this.options.width = this._getOuterWidth();
        }
        if (this.options.useThemeHandler) {
            ThemeHandler.init();
            ThemeHandler.on("themeChanged", this.onThemeChanged, this);
        }

        this.outerContainer = document.createElement("div");
        this.outerContainer.classList.add("toggleContainer", "toggleButton");
        this.outerContainer.addEventListener("click", (evt) => {
            this._toggle();
        });

        this.innerContainer = document.createElement("div");

        this.outerContainer.appendChild(this.innerContainer);
        container.appendChild(this.outerContainer);

        this.player = lottie.loadAnimation({
            container: this.innerContainer,
            renderer: "svg",
            animationData: animationData,
            loop: false,
            autoplay: false,
        });
        this.player.addEventListener("DOMLoaded", (evt) => {
            this._setWidth();
        });
        this.player.setSpeed(2);

        this.wrapper = new ToggleAnimation(this, this.player);
        this.wrapper.on("animationComplete", this.onAnimationComplete, this);

        this.animations = {
            toDark: {
                start: 2,
                end: 50,
            },
            toLight: {
                start: 51,
                end: 80,
                // end: 96
            },
        };

        const { useThemeHandler, theme: initialTheme } = this.options;
        const theme = initialTheme || (useThemeHandler && ThemeHandler.getTheme());

        switch (theme) {
            case "light":
                this.player.goToAndStop(this.animations.toLight.end, true);
                this.currentAnimation = "toLight";
                break;

            // case "dark":
            default:
                this.player.goToAndStop(this.animations.toDark.end, true);
                this.currentAnimation = "toDark";
                break;
        }
    }

    _setWidth () {
        const innerWidth = this._getInnerWidth();
        this.innerContainer.style.width = `${innerWidth}px`;
        this.innerContainer.style.height = `${innerWidth}px`;

        const width = this.options.width;
        const height = this.options.width / RATIO;
        this.outerContainer.style.width = `${width}px`;
        this.outerContainer.style.height = `${height}px`;
    }

    setWidth (width) {
        if (typeof width !== "number") {
            return new Error("The width is required to be a number!");
        }
        this.options.width = width;
        this._setWidth();
    }

    setHeight (height) {
        if (typeof height !== "number") {
            return new Error("The height is required to be a number!");
        }
        this.options.height = height;
        this.options.width = this._getOuterWidth();
        this._setWidth();
    }

    setTheme (theme, skipAnimation=false) {
        if (theme !== "dark" && theme !== "light") {
            return new Error("The theme is required to be 'dark' or 'light'");
        }
        const currentTheme = this._getTheme();
        if (currentTheme === theme) {
            return;
        }
        this._toggle(skipAnimation);
    }

    _getOuterWidth () {
        return this.options.height * RATIO;
    }

    _getInnerWidth () {
        return this.options.width * OUTER_RATIO;
    }

    _getInverseAnimation () {
        return this.currentAnimation === "toDark" ? "toLight" : "toDark";
    }

    _getTheme () {
        return this.currentAnimation === "toDark" ? "dark" : "light";
    }

    _toggle (skipAnimation) {
        const nextAnim = this._getInverseAnimation();
        const data = this.animations[nextAnim];

        if (skipAnimation) {
            this.wrapper.setFrame(data.end);
        } else {
            this.wrapper.play(data.start, data.end);
        }

        this.currentAnimation = nextAnim;
        const theme = this._getTheme();

        this.emit("click", { theme });
        this.emit("animationStart", { theme });

        if (this.options.useThemeHandler) {
            ThemeHandler.setTheme(theme);
        }
    }

    onAnimationComplete () {
        const theme = this._getTheme();

        this.emit("animationComplete", { theme });
    }

    onThemeChanged (evt) {
        const theme = this._getTheme();
        if (evt.theme !== theme) {
            this._toggle();
        }
    }
}
