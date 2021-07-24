import fs from "fs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-porter";
// custom
import { replaceStyleTemplate } from "./rollup-plugins/replaceStyleTemplate.js";

export default [
    {
        input: "src/build/webcomponent.js",
        output: [
            {
                file: "dist/bundle.js",
                format: "iife",
                name: "darkModeToggle",
                plugins: [
                    replaceStyleTemplate({
                        src: "dist/bundle.css",
                        target: "dist/bundle.js"
                    }),
                ]
            },
            {
                file: "dist/bundle.min.js",
                format: "iife",
                name: "darkModeToggle",
                plugins: [
                    terser(),
                    replaceStyleTemplate({
                        src: "dist/bundle.min.css",
                        target: "dist/bundle.min.js"
                    }),
                ]
            }
        ],
        plugins: [
            json({
                compact: true,
            }),
            css({
                raw: "dist/bundle.css",
                minified: "dist/bundle.min.css",
            })
        ]
    }
];