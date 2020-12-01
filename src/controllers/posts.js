import express from 'express';
import Post from '../models/Post.js';
import { json, urlencoded } from 'body-parser';

const router = express.Router();

router.use(json());
router.use(urlencoded({ extended: false }));

router.route('/posts')
    .get((req, res) => {
        Post.findAll((err, result) => {
            if (err) {
                res.sendStatus(500);
            }
            else {
                res.status(200).json(result);
            }
        });
    })
    .post((req, res) => {
        const { posterID, text } = req.body;
        Post.insert({ text_body: text, fk_poster_id: posterID }, (err, result) => {
            if (err) {
                res.sendStatus(500);
            }
            else {
                res.status(201).json({ 'New ID': result.insertId });
            }
        });
    });

router.route('/posts/:postID')
    .get((req, res) => {
        const postID = parseInt(req.params.postID);
        Post.findByID(postID, (err, result) => {
            if (err) {
                res.sendStatus(500);
            }
            else if (result === null) {
                res.sendStatus(404);
            }
            else {
                res.status(200).json(result[0]);
            }
        });
    })
    .put((req, res) => {
        const postID = parseInt(req.params.postID);
        const postObj = req.body;
        Post.edit(postID, postObj, (err, result) => {
            if (err) {
                res.sendStatus(500);
            }
            else {
                res.sendStatus(204);
            }
        });
    })
    .delete((req, res) => {
        const postID = parseInt(req.params.postID);
        Post.delete(postID, err => {
            if (err) {
                res.sendStatus(500);
            }
            else {
                res.sendStatus(204);
            }
        });
    });

router.route('/posts/:postID/likers/:likerID')
    .post((req, res) => {
        const { postID, likerID } = req.params;
        Post.like(parseInt(postID), parseInt(likerID), err => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    res.sendStatus(201);
                }
                else {
                    res.sendStatus(500);
                }
            }
            else {
                res.sendStatus(201);
            }
        });
    })
    .delete((req, res) => {
        const { postID, likerID } = req.params;
        Post.unlike(parseInt(postID), parseInt(likerID), err => {
            if (err) {
                res.sendStatus(500);
            }
            else {
                res.sendStatus(204);
            }
        });
    });

router.route('/users/:userID/posts')
    .get((req, res) => {
        const { userID } = req.params;
        Post.findByUserID(parseInt(userID), (err, result) => {
            if (err) {
                res.sendStatus(500);
            }
            else {
                res.status(200).json(result);
            }
        });
    });

router.route('/posts/:postID/likers')
    .get((req, res) => {
        const { postID } = req.params;
        Post.findLikers(parseInt(postID), (err, results) => {
            if (err) {
                res.sendStatus(500);
            }
            else {
                res.status(200).json(results);
            }
        });
    });

export default router;