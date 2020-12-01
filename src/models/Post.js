import query from '../utils/query.js';

/**
 * @typedef { {
 *  text_body: string,
 *  fk_poster_id: number
 * }} PostObj
 */

const Post = {

    // propagates a list of posts posted by a user
    // each post contains a "likers" property, which contains an array of users that liked the post.
    /**
     * @param {number} userID
     * @param {(err, result) => void} callback
     */
    findByUserID: (userID, callback) => {
        const sql = "SELECT * FROM post WHERE fk_poster_id = ? ORDER BY created_at DESC;";
        query(sql, callback, userID, (err, posts) => {
            const postIDs = posts.map(post => post.id);
            Post.findLikersByPostIDs(postIDs, (error, likersByPostID) => {
                if (error) {
                    return callback(error, null);
                }
                for (let i = 0; i < posts.length; i++) {
                    posts[i].likers = likersByPostID[posts[i].id];
                }
                return callback(null, posts);
            });
        });
    },

    /**
     * @param {number} postID
     * @param {(err, result) => void} callback
     */
    findByID: (postID, callback) => {
        const sql = "SELECT * FROM post WHERE id = ?;";
        query(sql, callback, postID);
    },

    /**
     * @param {(err, result) => void} callback
     */
    findAll: callback => {
        const sql = "SELECT * FROM post;";
        query(sql, callback);
    },

    /**
     * @param {PostObj} post
     * @param {(err, result) => void} callback
     */
    insert: (post, callback) => {
        const sql = "INSERT INTO post (text_body, fk_poster_id) VALUES (?, ?);";
        query(sql, callback, [post.text_body, post.fk_poster_id]);
    },

    /**
     * @param {number} postID
     * @param {PostObj} post
     * @param {(err, result) => void} callback
     */
    edit: (postID, post, callback) => {
        const sql = "UPDATE post SET text_body = ? WHERE id = ?;";
        query(sql, callback, [post.text_body, postID]);
    },

    /**
     * @param {number} postID
     * @param {(err) => void} callback
     */
    delete: (postID, callback) => {
        const sql = "DELETE FROM post WHERE id = ?";
        query(sql, callback, postID);
    },

    /**
     * @param {number} postID
     * @param {number} likerID
     * @param {(err) => void} callback
     */
    like: (postID, likerID, callback) => {
        const sql = "INSERT INTO likes (fk_user_id, fk_post_id) VALUES (?, ?);";
        query(sql, callback, [likerID, postID]);
    },

    /**
     * @param {number} postID
     * @param {number} likerID
     * @param {(err) => void} callback
     */
    unlike: (postID, likerID, callback) => {
        const sql = "DELETE FROM likes WHERE fk_user_id = ? AND fk_post_id = ?;";
        query(sql, callback, [likerID, postID]);
    },

    /**
     * @param {number} postID
     * @param {(err, result) => void} callback
     */
    findLikers: (postID, callback) => {
        const sql = "SELECT user.* FROM user INNER JOIN likes WHERE likes.fk_user_id = user.id AND likes.fk_post_id = ?;";
        query(sql, callback, postID);
    },

    // returns a object that maps post id to an array of likers of that post
    /**
     * @param {Array<number>} postIDs
     * @param {(err, results) => void} callback
     */
    findLikersByPostIDs: (postIDs, callback) => {
        // we have to manually handle this edge case because
        // mysql doesn't allow empty lists.
        if (postIDs.length === 0) {
            process.nextTick(() => {
                return callback(null, {});
            });
        }
        const sql = "SELECT user.*, likes.fk_post_id FROM user INNER JOIN likes WHERE likes.fk_user_id = user.id AND likes.fk_post_id IN (?);";
        query(sql, callback, [postIDs], (error, likers) => {
            if (error) {
                return callback(error, null);
            }
            const likersByPostID = {};
            // initialize all post ids keys with an empty array
            for (let i = 0; i < postIDs.length; i++) {
                const postID = postIDs[i];
                likersByPostID[postID] = [];
            }
            for (let i = 0; i < likers.length; i++) {
                const liker = likers[i];
                likersByPostID[liker.fk_post_id].push(liker);
            }
            return callback(null, likersByPostID);
        });
    }
}

export default Post;