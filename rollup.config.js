import fs from "fs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-porter";
// custom
import { replaceStyleTemplate } from "./rollup-plugins/replaceStyleTemplate.js";

export default [
    {
        input: "src/build/default.js",
        output: [
            {
                file: "dist/bundle.js",
                format: "iife"
            },
            {
                file: "dist/bundle.min.js",
                format: "iife",
                plugins: [terser()]
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
    },
    {
        input: "src/build/webcomponent.js",
        output: [
            {
                file: "dist/bundle.wc.js",
                format: "iife",
                plugins: [
                    replaceStyleTemplate({
                        src: "dist/bundle.css",
                        target: "dist/bundle.wc.js"
                    }),
                ]
            },
            {
                file: "dist/bundle.wc.min.js",
                format: "iife",
                plugins: [
                    terser(),
                    replaceStyleTemplate({
                        src: "dist/bundle.min.css",
                        target: "dist/bundle.wc.min.js"
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