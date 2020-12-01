import mysql from 'mysql2';

export default {
    getConnection: () => mysql.createConnection({
        host: 'localhost',
        user: 'ethan',
        database: 'friendbook',
        password: '12345Abc',
        port: 3306
    })
};