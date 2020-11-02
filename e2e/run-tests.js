#!/usr/bin/env node

const { argv } = require('yargs')
    .scriptName('run-tests')
    .usage('Usage: $0 -p num -h num')
    .example('$0', 'Builds and runs e2e testing on all supported platforms and frameworks.')
    .example('$0 -b', 'Build e2e testing f:q
        or all supported platforms and frameworks.')
    .example('$0 -r', 'Run e2e testing for all supported platforms and frameworks.')
    .example('$0 -p ios', 'Builds and runs e2e testing for all frameworks only on iOS.')
    .example('$0 -f ng vue', 'Builds an d runs e2e testing on Angular and Vue.js.')
    .example('$0 -p android -f svelte', 'Builds and runs e2e testing for Svelte on iOS.')
    .option('p', {
        alias: 'platforms',
        default: ['ios', 'android'],
        choices: ['ios', 'android'],
        describe: 'The platforms to test on.',
        type: 'array'
    })
    .option('f', {
        alias: 'frameworks',
        choices: ['ng', 'vue', 'svelte', 'react'],
        describe: 'The frameworks to test on.',
        type: 'array'
    })
    .option('b', {
        alias: 'build',
        default: false,
        describe: 'Flag to ONLY run building of the projects.',
        type: 'boolean'
    })
    .option('r', {
        alias: 'run',
        default: false,
        describe: 'Flag to ONLY run testing (no building) of the projects.',
        type: 'boolean'
    });

const { platforms, frameworks, build, run } = argv;

console.log(platforms);
console.log(frameworks);
console.log(build);
console.log(run);
