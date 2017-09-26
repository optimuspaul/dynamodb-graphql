var fs = require("fs");


var localConfig = null;

function getLocalConfig() {
    if(localConfig) {
        return localConfig;
    }
    var localConfigLocation = process.env["DDB-GQL-CONFIG"] || "./ddb-gql.json";
    if(fs.existsSync(localConfigLocation)) {
        localConfig = JSON.parse(fs.readFileSync(localConfigLocation));
        return localConfig;
    } else {
        console.warn("`" + localConfigLocation + "` not found, could not load config.")
    }
    return null;
}


function resolve(name, default_value) {
    var value = process.env["DDB-GQL-" + name.toUpperCase()] || null;
    if(value) {
        return value;
    }
    var lc = getLocalConfig();
    if(lc && lc[name]) {
        return lc[name];
    }
    return default_value;
}


exports.getLabels = function() {
    var labels = resolve("labels", []);
    if(labels.split) {
        return labels.split(",");
    }
    return labels;
};

exports.resolve = resolve;
