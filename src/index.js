const base = require("./base");
const provision = require("./provision");
const options = require("./options");
const utils = require("./utils");
var bluebird = require('bluebird');


function getNode(type, id) {
    return base.getObject(options.tableName(type), id);
}

function listNodes(type, token) {
    // TODO - add token to base call and response
    var predicated = base.getSubjectsWithPredicate(options.tableName(type), "id");
    return new bluebird.Promise(function(resolve, reject) {
        predicated.then(function(d) {
            resolve({"nodes": d.subjects, "token": null});
        });
    });
}

function putNode(type, id, obj) {
    obj["id"] = id;
    return base.putObject(options.tableName(type), obj);
}


function deleteNode(type, id) {
    return base.removeObject(options.tableName(type), id);
}


function findNodesWithAttribute(type, attr, token) {
    // TODO - add token to base call and response
    return base.getSubjectsWithPredicate(options.tableName(type), attr);
}

function findAttributes(type, id, attr) {
    // TODO - do this. This would be used to return a single property, which could have multiple values, for a node.
    return {};
}

function filterNodes(type, attr, value, token) {
    // TODO - add token to base call and response
    return base.getSubjectsWithPredicateValue(options.tableName(type), attr, value);
}


exports.getNode = getNode;
exports.putNode = putNode;
exports.deleteNode = deleteNode;
exports.listNodes = listNodes;
exports.findNodesWithAttribute = findNodesWithAttribute;
exports.findAttributes = findAttributes;
exports.filterNodes = filterNodes;


exports.deploy = function(project, tables, environment) {
    return provision.deploy(project, tables, environment);
};

exports.provision = provision;
exports.utils = utils;
exports.options = options;


exports.commonSchema = `
  input PaginationInput {
    # default max_items is 50
    max_items: Int
    token: String
  }

  type PaginationOutput {
    max_items: Int!
    token: String
    count: Int
  }

  type StatusOutput {
    id: String!
    status: Boolean!
    message: String
  }
`;
