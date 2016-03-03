"use strict";

require('dotenv').load();

import PgDeploy from 'pg-deploy';

import rollup from 'rollup';
import includePaths from 'rollup-plugin-includepaths';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

import nunjucks from 'nunjucks';

function promisify(fn) {
    return (...args) => {
        return new Promise((resolve, reject) => {
            fn(...args, (err, res) => {
                if (err) { return reject(err) }
                resolve(res);
            });
        })
    }
}

function load(name, path) {
    return rollup.rollup({
        entry: path,
        plugins: [
            includePaths({
                paths: ['db_modules']
            }),
            babel({
                exclude: 'node_modules/**',
                presets: ['es2015-rollup'],
                babelrc: false
            }),
            nodeResolve({
                jsnext: true,
                main: true
            }),
            commonjs({
                include: 'node_modules/**'
            })
        ]
    }).then(bundle => {
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
    return promisify(nunjucksEnv.renderString.bind(nunjucksEnv))(fileContent);
}

function debugTransformer(fileContent) {
    console.log(fileContent);
    return Promise.resolve(fileContent);
}

export default new PgDeploy({
    connectionString: process.env.DB_CONNECTION,
    transformations: [templateTransformer, /* debugTransformer */],
    migrations: ['migrations/*.sql'],
    afterScripts: ['api/*.sql']
});
