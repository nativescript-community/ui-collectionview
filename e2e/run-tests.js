#!/usr/bin/env node
const { spawn } = require('child_process');
const { argv } = require('yargs')
    .scriptName('run-tests')
    .usage('Usage: $0 -p num -h num')
    .example('$0', 'Builds and runs e2e testing on all supported platforms and frameworks.')
    .example('$0 -b', 'Build e2e testing for all supported platforms and frameworks.')
    .example('$0 -r', 'Run e2e testing for all supported platforms and frameworks.')
    .example('$0 -p ios', 'Builds and runs e2e testing for all frameworks only on iOS.')
    .example('$0 -f ng vue', 'Builds an d runs e2e testing on Angular and Vue.js.')
    .example('$0 -p android -f svelte', 'Builds and runs e2e testing for Svelte on iOS.')
    .option('p', {
        alias: 'platforms',
        default: ['ios', 'android'],
        choices: ['ios', 'android'],
        describe: 'The platforms to test on.',
        type: 'array',
    })
    .option('f', {
        alias: 'frameworks',
        default: ['ng', 'vue', 'svelte', 'react'],
        choices: ['ng', 'vue', 'svelte', 'react'],
        describe: 'The frameworks to test on.',
        type: 'array',
    })
    .option('b', {
        alias: 'build',
        default: false,
        describe: 'Flag to ONLY run building of the projects.',
        type: 'boolean',
    })
    .option('r', {
        alias: 'run',
        default: false,
        describe: 'Flag to ONLY run testing (no building) of the projects.',
        type: 'boolean',
    });

const { platforms, frameworks, build, run } = argv;
command = generateDetoxCommand(platforms, frameworks, build, run);

console.log(command);

function generateDetoxCommand(platforms, frameworks, build, run) {

    configurations = [];
    for (const platform of platforms) {
        for (const framework of frameworks) {
            configurations.push(`${framework}.${platform}`);
        }
    }

    configurations.sort();

    commands = [];
    if (!build && !run) {
        for (const configuration of configurations) {
            commands.push(`detox build -c ${configuration} && detox test -c ${configuration}`);
        }
    }
    else if(build) {
        for (const configuration of configurations) {
            commands.push(`detox build -c ${configuration}`);
        }
    }
    else if(run) {
        for (const configuration of configurations) {
            commands.push(`detox test -c ${configuration}`);
        }
    }
    else {
        for (const configuration of configurations) {
            commands.push(`detox build -c ${configuration} && detox test -c ${configuration}`);
        }
    }

    let combinedCommand = '';
    for (let i=0; i<commands.length; i++) {
        if (i === commands.length - 1) {
            combinedCommand += `${commands[i]}`;
        }
        else {
            combinedCommand += `${commands[i]} && `;
        }
    }

    return combinedCommand;
}

const ls = spawn(command, { shell : true });

ls.stdout.on('data', (data) => {
    process.stdout.write(`${data}`);
});

ls.stderr.on('data', (data) => {
    process.stderr.write(`${data}`);
});

ls.on('error', (error) => {
    console.log(`error: ${error.message}`);
});

ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});

