import User from '../models/User.js';
import express from 'express';
import { json, urlencoded } from 'body-parser';

const router = express.Router();

router.use(json());
router.use(urlencoded({ extended: false }));

router.route('/users')
    .get((req, res) => {
        User.findAll((err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send();
            }
            else {
                res.status(200).json(result);
            }
        });
    })
    .post((req, res) => {
        User.insert(req.body, (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send();
                return;
            };
            res.status(201).send({
                result
            });
        });
    });

router.route("/users/:userID")
    .get((req, res) => {
        const userID = parseInt(req.params.userID);
        // if userID is not a number, send a 400.
        if (isNaN(userID)) {
            res.status(400).send();
            return;
        }

        User.findByID(userID, (error, user) => {
            if (error) {
                res.status(500).send();
                return;
            };

            // send a 404 if user is not found.
            if (user === null) {
                res.status(404).send();
                return;
            };
            res.status(200).send(user);
        });
    })
    .put((req, res) => {
        const userID = parseInt(req.params.userID);
        if (isNaN(userID)) {
            res.status(400).send();
            return;
        }

        User.edit(userID, req.body, (error) => {
            if (error) {
                console.log(error);
                res.status(500).send();
                return;
            };
            res.status(204).send();
        });
    });

router.route("/users/:userID/friends")
    .get((req, res) => {
        const userID = parseInt(req.params.userID);
        User.showFriends(userID, (err, result) => {
            if (err) {
                res.status(500).send();
            }
            else {
                res.status(200).json(result);
            }
        });
    });

router.route("/users/:userID/friends/:friendID")
    .post((req, res) => {
        const userID = parseInt(req.params.userID);
        const friendID = parseInt(req.params.friendID);
        if (userID === friendID) {
            res.status(400).send();
        }
        User.addFriend(userID, friendID, err => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    res.status(201).send();
                }
                else if (err.code === "ER_NO_REFERENCED_ROW_2") {
                    res.status(400).send();
                }
                else {
                    res.status(500).send();
                }
            }
            else {
                res.status(201).send();
            }
        });
    })
    .delete((req, res) => {
        const userID = parseInt(req.params.userID);
        const friendID = parseInt(req.params.friendID);
        if (userID === friendID) {
            res.status(400).send();
        }
        User.removeFriend(userID, friendID, err => {
            if (err) {
                res.sendStatus(500);
            }
            else {
                res.sendStatus(204);
            }
        });
    });

export default router;