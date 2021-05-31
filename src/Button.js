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
    initialTheme: undefined,
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

        const innerWidth = this._getInnerWidth();
        this.innerContainer = document.createElement("div");
        this.innerContainer.style.width = `${innerWidth}px`;
        this.innerContainer.style.height = `${innerWidth}px`;

        this.outerContainer.appendChild(this.innerContainer);
        container.appendChild(this.outerContainer);

        this.outerContainer.addEventListener("click", (evt) => {
            this._toggle();
        });

        this.player = lottie.loadAnimation({
            container: this.innerContainer,
            renderer: "svg",
            animationData: animationData,
            loop: false,
            autoplay: false,
        });
        this.player.addEventListener("DOMLoaded", (evt) => {
            this._setContainerWidth();
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

        const { useThemeHandler, initialTheme } = this.options;
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

    _getOuterWidth () {
        return this.options.height * RATIO;
    }

    _getInnerWidth () {
        return this.options.width * OUTER_RATIO;
    }

    _setContainerWidth () {
        const width = this.options.width;
        const height = this.options.width / RATIO;
        this.outerContainer.style.width = `${width}px`;
        this.outerContainer.style.height = `${height}px`;
    }

    _getInverseAnimation () {
        return this.currentAnimation === "toDark" ? "toLight" : "toDark";
    }

    _getTheme () {
        return this.currentAnimation === "toDark" ? "dark" : "light";
    }

    _toggle () {
        const nextAnim = this._getInverseAnimation();
        const data = this.animations[nextAnim];

        this.wrapper.play(data.start, data.end);

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
