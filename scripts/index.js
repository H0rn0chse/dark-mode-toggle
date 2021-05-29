import { Button } from "./Button.js";
import { ThemeHandler } from "./ThemeHandler.js";

const container = document.querySelector("#toggleContainer");
const player = document.querySelector("#toggleButton");
const button = new Button(player, container);
