var base = require("./base");
var provision = require("./provision");
var options = require("./options");

var tableName = new Function("return `"+options.tableNamePattern+"`;");


function getNode(type, id) {
    return base.getObject(tableName.call({type: type}), id);
}

function listNodes(type, token) {
    return {"nodes": [], "token": null};
}

function findNodesWithAttribute(type, attr, token) {
    // TODO - add token to base call and response
    return base.getSubjectsWithPredicate(tableName.call({type: type}), attr);
}

function filterNodes(type, attr, value, token) {
    // TODO - add token to base call and response
    return base.getSubjectsWithPredicateValue(tableName.call({type: type}), attr, value);
}


exports.getNode = getNode;
exports.listNodes = listNodes;
exports.findNodesWithAttribute = findNodesWithAttribute;
exports.filterNodes = filterNodes;


exports.deploy = function(project, tables, environment) {
    return provision.deploy(project, tables, environment);
};

exports.provision = provision;

exports.options = options;
