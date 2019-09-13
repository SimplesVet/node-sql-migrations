

const childProcess = require('child_process');
const createMigrationCommand = require('./create-migration-command');
const fs = require('fs');

module.exports = function (config, logger, hash) {
    childProcess.exec(`git show --name-only ${hash} | grep -i '.sql' | grep -v \'table\'`, function(err, stdout) {
        let files = stdout.split('\n')
                            .filter(line => line.includes('.sql'))

        files.forEach(file => {
            fs.readFile(file, "utf8", (err, content) => {
                if(!err){
                    let migrationName = file.split('/').pop()
                    migrationName = migrationName.replace('.sql', '')

                    setTimeout(() => {
                        createMigrationCommand(config, logger, migrationName, content)
                    }, 1)
                }
            })
        })

    });
};
