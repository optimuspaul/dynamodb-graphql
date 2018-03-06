const AWS = require("aws-sdk");
const port = 8001;


process.env.ENVIRONMENT = "local";
process.env.DYNAMODB_URL = `localhost:${port}`;
// process.env.DISABLE_CACHE = 'yes';

AWS.config.region = process.env["aws-region"] || "us-east-1";
AWS.config.dynamodb = {endpoint: `http://localhost:${port}`};



const ddbgql = require("./index");
const dynamodb = ddbgql.base.dynamodb;
let dynamoDbLocalProcess;


exports.startDynamoLocal = async function() {
    if (!dynamoDbLocalProcess) {
        console.log("starting dynamodb-local");
        const dynamoDbLocal = require("dynamo-db-local");
        dynamoDbLocalProcess = await dynamoDbLocal.spawn(port);
        while(true) {
            var tables = await dynamodb.listTables().promise();
            if(tables.TableNames != undefined) return;
        }
    }
}


exports.createTables = async function(tableNames) {
    var prom = dynamodb.listTables().promise();
    await new Promise(async function(resolve, reject) {
        prom.then(async function(data) {
            var existingTables = data.TableNames;
            for(var i=0;i<tableNames.length;i++) {
                var tableName = tableNames[i];
                if(existingTables.indexOf(tableName)<0) {
                    await ddbgql.provision.createTableDirect(tableName);
                }
            }
            resolve();
        })
        .catch(reject);
    });
}

exports.cleanUpTables = async function(tableNames) {
    var prom = dynamodb.listTables().promise();
    await new Promise(async function(resolve, reject) {
        prom.then(async function(data) {
            var existingTables = data.TableNames;
            // inspect the table list
            for(var i=0;i<tableNames.length;i++) {
                try {
                    await dynamodb.deleteTable({TableName: tableNames[i]}).promise();
                    while (true) {
                        var result = await dynamodb.describeTable({TableName: tableNames[i]}).promise();
                        if(result.code == 'ResourceNotFoundException') break;
                    }
                } catch(e) {
                    // console.log(e);
                }
            }
            resolve();
        })
        .catch(reject);
    });
}

async function listTables() {
    var data = await dynamodb.listTables().promise();
    console.log(data.TableNames);
}


exports.killDynamoLocal = async function() {
    if(dynamoDbLocalProcess) {
        dynamoDbLocalProcess.kill();
        dynamoDbLocalProcess = null;
    }
}


process.on('exit', function() {
    console.log("killing me softly");
    exports.killDynamoLocal();
});


exports.doUnitTest = async function(tst, tableList) {
    return new Promise(async function(resolve, reject) {
        var err;
        await exports.createTables(tableList);
        try {
            await tst();
        } catch(e) {
            err = e;
        }
        await exports.cleanUpTables(tableList);
        if(err) {
            reject(err);
        } else {
            resolve();
        }
    });
}


before(async function() {
    await exports.startDynamoLocal();
});


after(async function() {
    await exports.killDynamoLocal();
});
