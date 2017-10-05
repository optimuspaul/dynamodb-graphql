const uuidv4 = require('uuid/v4');


function newid() {
    return uuidv4();
}

function shouldBeVectors(fields, obj) {
    fields.forEach(function(field) {
        if(obj.hasOwnProperty(field)) {
            var value = obj[field];
            if(value) {
                if(!Array.isArray(value)) {
                    obj[field] = [value];
                }
            } else {
                obj[field] = [];
            }
        } else {
            obj[field] = [];
        }
    });
}


function shouldBeScalars(fields, obj) {
    fields.forEach(function(field) {
        if(obj.hasOwnProperty(field)) {
            var value = obj[field];
            if(value) {
                if(Array.isArray(value)) {
                    if(value.length > 1) {
                        console.warn("Scalar value has multiple values [" + obj.id + "] field:" + field);
                    }
                    obj[field] = value[0];
                }
            }
        }
    });
}


function applyDefaults(obj, defaults) {
    for(const key in defaults) {
        if(!obj[key]) {
            obj[key] = defaults[key];
        }
    }
}


function only(obj, fields) {
    var result = {};
    fields.forEach(function(field) {
        if(obj[field]) {
            result[field] = obj[field];
        }
    });
    return result;
}


exports.shouldBeVectors = shouldBeVectors;
exports.shouldBeScalars = shouldBeScalars;
exports.applyDefaults = applyDefaults;
exports.newid = newid;
exports.only = only;

