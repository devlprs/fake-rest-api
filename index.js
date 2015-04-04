'use strict';
var fs = require('fs');

var start = require('./start');
var packageJson = require('./package.json');

var program = require('commander');

program.version(packageJson.version);

program.command('start')
    .description('Starting fake REST API service')
    .option('-c, --config <s>', 'config', null)
    .action(function (cmd, options) {
        var config;

        var configPath = cmd.config;

        if (configPath) {

            configPath = String(configPath);

            if (!fs.existsSync(configPath)) {
                console.log('no config file "' + configPath + '"');
                return;
            }

            var configText = fs.readFileSync(configPath);

            try  {
                config = JSON.parse(configText);
            } catch (e) {
                console.log('config must be valid JSON');
                return;
            }

        } else {
            config = {};
        }

        start(config);
    });

program.parse(process.argv);