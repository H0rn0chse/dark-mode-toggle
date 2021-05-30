import { Button } from "./Button.js";
import { ThemeHandler } from "./ThemeHandler.js";

const container = document.querySelector("#content");
// width is defined in px
const button = new Button(container, { width: 320 });
