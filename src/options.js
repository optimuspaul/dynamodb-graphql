
var cacheSeconds = 10;
var tableNamePattern = "dev-ddbgql-${type}";



exports.cacheSeconds = 10;
exports.cacheSeconds = tableNamePattern;
exports.setTableNamePattern = function(project, environment) {
    tableNamePattern = environment + "-" + project + "-${type}";
};
