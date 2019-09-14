var MigrationProvider = require('./migration-provider');
var createMigrationCommand = require('./commands/create-migration-command');
var createCommitMigrationCommand = require('./commands/create-commit-migration-command');
var createGitStatusMigrationCommand = require('./commands/create-gitstatus-migration-command');
var runMigrationsCommand = require('./commands/run-migrations-command');
var rollbackMigrationCommand = require('./commands/rollback-migration-command');

var LOGGER = console;

function migrate(config, adapter) {
    var migrationProvider = MigrationProvider(config);
    return runMigrationsCommand(migrationProvider, adapter, config.minMigrationTime, LOGGER).then(function () {
        return adapter.dispose();
    }, function (error) {
        function rethrowOriginalError() {
            throw error;
        }
        return adapter.dispose().then(rethrowOriginalError, rethrowOriginalError);
    });
}

function rollback(config, adapter) {
    var migrationProvider = MigrationProvider(config);
    return rollbackMigrationCommand(migrationProvider, adapter, LOGGER).then(function () {
        return adapter.dispose();
    }, function (error) {
        function rethrowOriginalError() {
            throw error;
        }
        return adapter.dispose().then(rethrowOriginalError, rethrowOriginalError);
    });
}

function run(config) {
    config.adapter = config.adapter || 'pg';

    var Adapter = require('./adapters/' + config.adapter);
    var adapter = Adapter(config, LOGGER);

    var args = process.argv.slice(2);

    console.log(args)

    switch (args[0]) {
        case 'create':
            createMigrationCommand(config, LOGGER, args[1]);
            break;
        case 'commit-create':
            createCommitMigrationCommand(config, LOGGER, args[1]);
            break;
        case 'gitstatus-create':
            createGitStatusMigrationCommand(config, LOGGER)
            break;
        case 'migrate':
            migrate(config, adapter).then(onCliSuccess, onCliError);
            break;
        case 'rollback':
            rollback(config, adapter).then(onCliSuccess, onCliError);
            break;
        default:
            LOGGER.log('exit');
    }

    function onCliSuccess() {
        LOGGER.log('done');
        process.exit();
    }

    function onCliError(error) {
        LOGGER.error('ERROR:', error);
        process.exit(1);
    }
}

module.exports = {
    setLogger: function (logger) {
        LOGGER = logger;
    },
    migrate: migrate,
    rollback: rollback,
    run: run
};
