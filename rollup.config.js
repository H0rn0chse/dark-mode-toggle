import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-porter';

export default {
    input: 'src/main.js',
    output: [
        {
            file: 'dist/bundle.js',
            format: 'iife'
        },
        {
            file: 'dist/bundle.min.js',
            format: 'iife',
            plugins: [terser()]
        }
    ],
    plugins: [
        json({
            compact: true,
        }),
        css({
            raw: 'dist/bundle.css',
            minified: 'dist/bundle.min.css',
        })
    ]
};