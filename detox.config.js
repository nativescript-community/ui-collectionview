const devices = require('./devices');

module.exports = {
    testRunner: 'jest',
    runnerConfig: 'e2e/config.json',
    configurations: {
        'ng.ios': {
            binaryPath: 'demo-ng/platforms/ios/build/Debug-iphonesimulator/demong.app',
            build: 'cd demo-ng && ns build ios',
            type: 'ios.simulator',
            device: {
                type: devices.ios,
            },
        },
        'ng.android': {
            binaryPath: 'demo-ng/platforms/android/app/build/outputs/apk/debug/app-debug.apk',
            build: 'cd demo-ng && ns build android --detox',
            type: 'android.emulator',
            device: {
                avdName: devices.android,
            },
        },
        'vue.ios': {
            binaryPath: 'demo-vue/platforms/ios/build/Debug-iphonesimulator/demovue.app',
            build: 'cd demo-vue && ns build ios',
            type: 'ios.simulator',
            device: {
                type: devices.ios,
            },
        },
        'vue.android': {
            binaryPath: 'demo-vue/platforms/android/app/build/outputs/apk/debug/app-debug.apk',
            build: 'cd demo-vue && ns build android --detox',
            type: 'android.emulator',
            device: {
                avdName: devices.android,
            },
        },
        'svelte.ios': {
            binaryPath: 'demo-svelte/platforms/ios/build/Debug-iphonesimulator/demosvelte.app',
            build: 'cd demo-svelte && ns build ios',
            type: 'ios.simulator',
            device: {
                type: devices.ios,
            },
        },
        'svelte.android': {
            binaryPath: 'demo-svelte/platforms/android/app/build/outputs/apk/debug/app-debug.apk',
            build: 'cd demo-svelte && ns build android --detox',
            type: 'android.emulator',
            device: {
                avdName: devices.android,
            },
        },
    },
};
