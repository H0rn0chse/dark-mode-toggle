import { ThemeHandler } from "./ThemeHandler.js";
import { ToggleAnimation } from "./ToggleAnimation.js";

const { lottie } = globalThis;

export class Button {
    constructor (container, options) {
        this.options = options || {};
        this.options.width = this.options.width || 320;

        this.outerContainer = document.createElement("div");
        this.outerContainer.classList.add("toggleContainer", "toggleButton");

        const innerWidth = this._getInnerWidth();
        this.innerContainer = document.createElement("div");
        this.innerContainer.style.width = `${innerWidth}px`;
        this.innerContainer.style.height = `${innerWidth}px`;

        this.outerContainer.appendChild(this.innerContainer);
        container.appendChild(this.outerContainer);

        this.player = lottie.loadAnimation({
            container: this.innerContainer,
            renderer: "svg",
            loop: false,
            autoplay: false,
            path: "assets/animationData.json",
        });
        this.player.addEventListener("DOMLoaded", (evt) => {
            this._setContainerWidth();
        });

        this.player.setSpeed(2);
        this.outerContainer.addEventListener("click", (evt) => {
            this.toggle();
        });

        this.wrapper = new ToggleAnimation(this.player);

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

        const theme = ThemeHandler.getTheme();
        switch (theme) {
            case "light":
                this.player.goToAndStop(this.animations.toLight.end, true);
                this.currentAnimation = "toLight";
                break;
            case "dark":
                this.player.goToAndStop(this.animations.toDark.end, true);
                this.currentAnimation = "toDark";
                break;
        }
    }

    _getInnerWidth () {
        return this.options.width * (320 / 192);
    }

    _setContainerWidth () {
        const width = this.options.width;
        const height = (90 / 192) * this.options.width;
        this.outerContainer.style.width = `${width}px`;
        this.outerContainer.style.height = `${height}px`;
    }

    _getInverseAnimation () {
        return this.currentAnimation === "toDark" ? "toLight" : "toDark";
    }

    _getTheme () {
        return this.currentAnimation === "toDark" ? "dark" : "light";
    }

    toggle () {
        const nextAnim = this._getInverseAnimation();
        const data = this.animations[nextAnim];

        this.wrapper.play(data.start, data.end);

        this.currentAnimation = nextAnim;
        ThemeHandler.setTheme(this._getTheme());
    }
}