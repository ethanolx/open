import query from '../utils/query.js';

/**
 * @typedef {{
 *  full_name: string,
 *  username: string,
 *  bio: string,
 *  date_of_birth: Date
 * }} UserObj
 */

const User = {
    /**
     * @param {number} userID
     * @param {(err, result) => void} callback
     */
    findByID: (userID, callback) => {
        const sql = "SELECT * FROM user WHERE id = ?;";
        query(sql, callback, [userID]);
    },

    /**
     * @param {(err, result) => void} callback
     */
    findAll: (callback) => {
        const sql = "SELECT * FROM user;";
        query(sql, callback);
    },

    /**
     *
     * @param {UserObj} user
     * @param {(err, result) => void} callback
     */
    insert: (user, callback) => {
        const sql = "INSERT INTO user (full_name, username, bio, date_of_birth) VALUES (?, ?, ?, ?);";
        query(sql, callback, Object.values(user));
    },

    /**
     * @param {number} userid
     * @param {UserObj} user
     * @param {(err) => void} callback
     */
    edit: (userid, user, callback) => {
        const sql = "UPDATE user SET full_name = ?, username = ?, bio = ?, date_of_birth = ? WHERE id = ?";
        query(sql, callback, [...Object.values(user), userid]);
    },

    /**
     * @param {number} userid
     * @param {(err, result) => void} callback
     */
    delete: (userid, callback) => {
        const sql = "DELETE FROM user WHERE id = ?;";
        query(sql, callback, [userid]);
    },

    /**
     * @param {number} userIDOne
     * @param {number} userIDTwo
     * @param {(err) => void} callback
     */
    addFriend: (userIDOne, userIDTwo, callback) => {
        const sql = "INSERT INTO friendship (fk_friend_one_id, fk_friend_two_id) VALUES (?, ?);";
        query(sql, callback, [userIDOne, userIDTwo]);
        query(sql, (err) => console.log(err), [userIDTwo, userIDOne]);
    },

    /**
     * @param {number} userIDOne
     * @param {number} userIDTwo
     * @param {(err) => void} callback
     */
    removeFriend: (userIDOne, userIDTwo, callback) => {
        const sql = "DELETE FROM friendship WHERE fk_friend_one_id = ? AND fk_friend_two_id = ? OR fk_friend_one_id = ? AND fk_friend_two_id = ?;";
        query(sql, callback, [userIDOne, userIDTwo, userIDTwo, userIDOne]);
    },

    /**
     * @param {number} userID
     * @param {(err, result) => void} callback
     */
    showFriends: (userID, callback) => {
        const sql = "SELECT * FROM friendship INNER JOIN user ON friendship.fk_friend_one_id = user.id WHERE user.id = ?;";
        query(sql, callback, [userID]);
    }
}

export default User;