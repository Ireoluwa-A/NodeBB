'use strict';

// const careers = require('../careers');
// const events = require('../events');
// const user = require('../user');
// const groups = require('../groups');
// const privileges = require('../privileges');

const careersAPI = module.exports;

careersAPI.get = async function (caller, data) {
    console.log("Getting careers api")
    return {"Getting": "careers"}
};

careersAPI.create = async function (caller, data) {
    // const response = await categories.create(data);
    // const categoryObjs = await categories.getCategories([response.cid], caller.uid);
    // return categoryObjs[0];
    return {"Getting": "careers"}
};