var fs = require('fs'),
    mkdirp = require('mkdirp'),
    path = require('path');

function writeContent(fileName, content) {
    let lines = content.split('\n')
    let header = lines[0]
    let coluns = header.split('(')[0].split(' ')
    let objParts = {
        actionPos: 0,
        typePos: 1,
        namePos: 2
    }
    let newHeader = ''

    if(coluns[objParts.actionPos].toLowerCase() !== 'drop') {
        let objType = coluns[objParts.typePos]
        let objName = coluns[objParts.namePos]
        if(!header.includes('view')){
            newHeader = `DROP ${objType} IF EXISTS ${objName};\n\n`
        }
    }

    content = `${newHeader}${content};\n`
    return fs.appendFileSync(fileName, content)
}

module.exports = function (config, logger, migrationName, content) {
    var up, down,
        ts = Date.now();

    if (typeof config.migrationsDir !== 'string') {
        throw new Error('configuration "migrationsDir" is missing');
    }

    mkdirp.sync(config.migrationsDir);

    up = ts + '_up_' + migrationName + '.sql';
    down = ts + '_down_' + migrationName + '.sql';

    up = path.resolve(config.migrationsDir, up);
    down = path.resolve(config.migrationsDir, down);

    logger.log(up);
    logger.log(down);

    fs.openSync(up, 'w');
    fs.openSync(down, 'w');

    if(content){
        writeContent(up, content)
    }
};
