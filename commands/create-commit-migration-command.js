const childProcess = require('child_process');
const createMigrationCommand = require('./create-migration-command');
const { getSqlFilesFromString } = require('./utils')

module.exports = function (config, logger, hash) {
    childProcess.exec(`git show --name-only ${hash} | grep -i '.sql' | grep -v \'migrations\' | grep -v \'table\'`, async function(err, stdout) {
        let files = await getSqlFilesFromString(stdout)
        files.forEach(file => {
            setTimeout(() => {
                if(!file.err){
                    createMigrationCommand(config, logger, file.name, file.content)
                }
            }, 1)
        })

    });
};
