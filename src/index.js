var base = require("./base");
var provision = require("./provision");
var options = require("./options");

var tableName = new Function("return `"+options.tableNamePattern+"`;");


function getNode(type, id) {
    return base.getObject(tableName.call({type: type}), id);
}

function findNodeWithAttribute(type, attr) {
    return base.getSubjectsWithPredicate(tableName.call({type: type}), attr);
}

function findNodeWithSpecificAttribute(type, attr, value) {
    return base.getSubjectsWithPredicateValue(tableName.call({type: type}), attr, value);
}


exports.getNode = getNode;
exports.findNodeWithAttribute = findNodeWithAttribute;
exports.findNodeWithSpecificAttribute = findNodeWithSpecificAttribute;


exports.deploy = function(project, tables, environment) {
    return provision.deploy(project, tables, environment);
};
