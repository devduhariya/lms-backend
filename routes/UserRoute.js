// const express = require("express");
const mongoose = require('mongoose');
const User = mongoose.model('user');
const bcrypt = require('bcrypt');

const SALT = 5;

module.exports = (app) => {
    const isNullOrUndefined = (val) => val === null || val === undefined || val === '';
    const AuthMiddleware = async(req, res, next) => {
        if (isNullOrUndefined(req.session) || isNullOrUndefined(req.session.userEmail)) {
            res.status(401).send({ err: "Not logged in" });
        } else {
            next();
        }
    };
    const AdminAuthMiddleware = async(req, res, next) => {
        // console.log('req.session:admin ', req.session);
        // added user key to req
        if (req.session.role === 'User' && req.session.role === '') {
            res.status(401).send({ err: "unauthorized" });
            // console.log('Session', req.session);
        } else {
            next();
        }
    };

    app.post("/signup", async(req, res) => {
        const { firstName, lastName, email, password, role } = req.body;
        
        if(isNullOrUndefined(firstName) || isNullOrUndefined(lastName) || isNullOrUndefined(email) || isNullOrUndefined(password)){
            res.status(400).send({
                err: `please input valid details`,
              });
        }else{
        const existingUser = await User.findOne({ email });
        if (isNullOrUndefined(existingUser)) {
            // we should allow signup
            const hashedPwd = bcrypt.hashSync(password, SALT);
            const newUser = new User({ firstName, lastName, email, role, password: hashedPwd });
            newUser.role = 'User';
            await newUser.save();
            req.session.userId = newUser.email;
            res.status(201).send({ success: "Signed up" });
        } else {
            res.status(400).send({
                err: `email ${email} already exists. Please choose another.`,
            });
        }
    }
    });
    app.post("/login", async(req, res) => {
        const { email, password } = req.body;
        if (isNullOrUndefined(email) || isNullOrUndefined(password)) {
            res.status(400).send({
                message: 'Email or password should not be empty'
            });
        }
        const existingUser = await User.findOne({
            email,
        });

        if (isNullOrUndefined(existingUser)) {
            res.status(401).send({ err: "UserName does not exist." });
        } else {
            const hashedPwd = existingUser.password;
            if (bcrypt.compareSync(password, hashedPwd)) {
                // console.log('req.session', req.session);
                // req.session = {id:existingUser._id};
                // console.log('req.session',req.session);
                req.session.userEmail = existingUser.email;
                req.session.role = existingUser.role;
                // console.log('Session saved email', req.session);
                res.status(200).send({ success: "Logged in" });
            } else {
                res.status(401).send({ err: "Password is incorrect." });
            }
        }
    });
    app.get("/logout", (req, res) => {
        if (!isNullOrUndefined(req.session)) {

            req.session.destroy(() => {
                res.status(200).send('logged out');
            });
        } else {
            res.sendStatus(200);
        }
    });

    app.get('/session', AuthMiddleware, (req, res) => {
        res.status(200).send({ session: req.session });
    })
    app.get('/user-list', AdminAuthMiddleware, async(req, res) => {
        let users = await User.find();
        // console.log('user session',req.session);
        return res.status(200).send(users);
    });
}