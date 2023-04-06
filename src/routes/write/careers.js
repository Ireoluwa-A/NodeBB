'use strict';

const router = require('express').Router();
const middleware = require('../../middleware');
const controllers = require('../../controllers');
const routeHelpers = require('../helpers');

const { setupApiRoute } = routeHelpers;

module.exports = function () {
    console.log("Api careers router")
    const middlewares = [middleware.ensureLoggedIn];
    // setupApiRoute(router, 'get', '/register/test', [], console.log("HI 1"));
    setupApiRoute(router, 'post', '/register', [...middlewares], controllers.write.career.register);
    return router;
};

