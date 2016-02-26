"use strict";

require('dotenv').load();

const PgDeploy = require('pg-deploy');
const rollup = require('rollup');
const memory = require('rollup-plugin-memory');
const includePaths = require('rollup-plugin-includepaths');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');


const stringReplaceAsync = require('string-replace-async');


const bannerJS = `
    var process = {env: {NODE_ENV: 'production'} };
    var ret = (function ret(v) { this.return_value = v }).bind(this);
`;
const footerJS = `
    if (this.return_value !== undefined && this.return_value !== null) { return this.return_value }
`;


function processWithRollup(code) {
    return rollup.rollup({
        entry: 'main.js',
        plugins: [
            memory({contents: code}),
            includePaths({paths: ['db_modules']}),
            babel({exclude: 'node_modules/**'}),
            nodeResolve({jsnext: true, main: true}),
            commonjs({include: 'node_modules/**'})
        ]
    }).then((bundle) => {
        var result = bundle.generate({
            useStrict: false,
            format: 'iife',
            exports: 'none',
            banner: bannerJS,
            footer: footerJS
        });

        return result.code;
    });
}

function rollupTransformer(fileContent) {
    return stringReplaceAsync(fileContent, /\$js\$([\s\S]*?)\$js\$/, (_match, jsCode) => {
        return processWithRollup(jsCode)
            .then(processed => `$bundledJs$\r\n${processed}\r\n$bundledJs$`)
    })
}

module.exports = new PgDeploy({
    connectionString: process.env.DB_CONNECTION,
    transformations: [rollupTransformer],
    migrations: ['migrations/*.sql'],
    afterScripts: ['api/*.sql']
});
