"use strict";

require('dotenv').load();

const PgDeploy = require('pg-deploy');

const rollup = require('rollup');
const includePaths = require('rollup-plugin-includepaths');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

const stringReplaceAsync = require('string-replace-async');

const nunjucks = require('nunjucks');

function load(name, path) {
    return rollup.rollup({
        entry: path,
        plugins: [
            includePaths({paths: ['db_modules']}),
            babel({exclude: 'node_modules/**'}),
            nodeResolve({jsnext: true, main: true}),
            commonjs({include: 'node_modules/**'})
        ]
    }).then((bundle) => {
        var result = bundle.generate({
            format: 'iife',
            moduleName: name
        });

        return result.code;
    });
}

const nunjucksEnv = new nunjucks.Environment([], { autoescape: false });
nunjucksEnv.addFilter('loadFrom', (name, path, callback) => {
    load(name, path)
        .then(code => callback(null, code))
        .catch(err => callback(err))
}, true);



function templateTransformer(fileContent) {
    return stringReplaceAsync(fileContent, /\$js_template\$([\s\S]*?)\$js_template\$/, (_match, template) => {

        return new Promise((resolve, reject) => {
            nunjucksEnv.renderString(template, (err, res) => {
                if (err) { return reject(err) }
                resolve(res);
            })
        })
            .then(processed => `$js$\r\n${processed}\r\n$js$`)
            .then(p => { console.log(p); return p })


    })



}


module.exports = new PgDeploy({
    connectionString: process.env.DB_CONNECTION,
    transformations: [templateTransformer],
    migrations: ['migrations/*.sql'],
    afterScripts: ['api/*.sql']
});
