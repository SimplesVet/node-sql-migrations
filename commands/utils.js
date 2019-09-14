

const fs = require('fs');

async function getSqlFilesFromString(string) {
    let fileList = string.split('\n')
                        .filter(line => line.includes('.sql'))

    let sqlObjects = returnSqlFilesContent(fileList)
    return sqlObjects
}

function returnSqlFilesContent(sqlFileList) {
    let sqlFiles = sqlFileList.map(file => {
        file = file.replace('\t', '')
        return new Promise(function(resolve, reject) {
            fs.readFile(file, "utf8", (err, content) => {
                let migrationName = file.split('/').pop()
                migrationName = migrationName.replace('.sql', '')

                resolve({
                    name: migrationName,
                    error: err,
                    content: content
                })
            })
        })
    })

    return Promise.all(sqlFiles)
}

module.exports = {
    getSqlFilesFromString,
    returnSqlFilesContent,
}
