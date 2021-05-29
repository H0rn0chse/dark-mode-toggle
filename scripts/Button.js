import { ThemeHandler } from "./ThemeHandler.js";
import { ToggleAnimation } from "./ToggleAnimation.js";

export class Button {
    constructor (player, container) {
        this.player = player;

        this.player.load("./assets/animationData.json");
        this.player.setSpeed(2);
        container.addEventListener("click", (evt) => {
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
                this.player.seek(this.animations.toLight.end);
                this.currentAnimation = "toLight";
                break;
            case "dark":
                this.player.seek(this.animations.toDark.end);
                this.currentAnimation = "toDark";
                break;
        }
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