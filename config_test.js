var path = require('path');

module.exports = {
    mysql: {
        migrationsDir: path.resolve(process.cwd(), 'mysql-migrations'),
        adapter: 'mysql',
        user: 'root',
        host: 'localhost',
        db: 'sql_migrations',
        password: 'root',
        port: 3306,
        multipleStatements: true
    },
    postgres: {
        migrationsDir: path.resolve(process.cwd(), 'pg-migrations'),
        adapter: 'pg',
        user: 'postgres',
        host: 'localhost',
        db: 'sql_migrations',
        password: 'postgres',
        port: 5432,
        multipleStatements: true
    }
}
