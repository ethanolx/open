import db from '../config/databaseConfig.js';

/**
 * @param {string} sql
 * @param {(err, result) => void} fn
 * @param {any} [params]
 * @param {(err, result) => void} customFn
 * @returns {void}
 */
export default (sql, fn, params = null, customFn = null) => {
    const conn = db.getConnection();
    conn.connect(err => {
        if (err) {
            console.log(err);
            return fn(err, null);
        }
        else {
            console.log(sql + '\n' + params + '\n');
            if (customFn) {
                conn.query(sql, params ? params : null, (er, result) => {
                    conn.end();
                    return customFn(er, result);
                });
            }
            else {
                conn.query(sql, params ? params : null, (er, results) => {
                    conn.end();
                    if (er) {
                        console.log(er);
                        return fn(er, null);
                    }
                    // @ts-ignore
                    else if (results.length === 0) {
                        return fn(null, null);
                    }
                    else {
                        return fn(null, results);
                    }
                });
            }
        }
    });
}