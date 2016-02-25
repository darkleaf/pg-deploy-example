"use strict";

require('dotenv').load();
const pify = require('pify');

const PgDeploy = require('pg-deploy');
const rollup = require('rollup');
const memory = require('rollup-plugin-memory');
const includePaths = require('rollup-plugin-includepaths');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');


const asyncReplace = pify(require('async-replace'));

function processWithRollup(code) {
    return rollup.rollup({
        entry: 'main.js',
        plugins: [
            memory({contents: code}),
            includePaths({paths: ['db_modules']}),
            babel({exclude: 'node_modules/**'}),
            nodeResolve({jsnext: true}),
            commonjs({include: 'node_modules/**'})
        ]
    }).then((bundle) => {
        var result = bundle.generate({
            format: 'iife',
            exports: 'none',
            banner: 'var ret = (function ret(v) { this.return_value = v }).bind(this);',
            footer: 'if (this.return_value !== undefined && this.return_value !== null) return this.return_value'
        });
        return result.code;
    });
}

function rollupTransformer(fileContent) {
    return asyncReplace(fileContent, /\$js\$([\s\S]*?)\$js\$/, (_match, jsCode, _offset, _string, done) => {
        processWithRollup(jsCode)
            .then(processed => `$bundledJs$${processed}$bundledJs$`)
            .then(function(processed) { done(null, processed) },
                  function(error) { done(error) })
    })
        .then(c => {console.log(c); return c});
}

module.exports = new PgDeploy({
    connectionString: process.env.DB_CONNECTION,
    transformations: [rollupTransformer],
    migrations: ['migrations/*.sql'],
    afterScripts: ['api/*.sql']
});
