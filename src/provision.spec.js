const provision = require('./provision')
const expect = require('chai').expect
const AWS = require('aws-sdk')
const cloudformation = new AWS.CloudFormation()

//--------------------------------------------------
// Tests that the basic API contract is maintained.
//--------------------------------------------------
const functions = [
    "generateCFN",
];


functions.forEach(function(func_name) {
    describe('provision module api', function() {
      describe('"'+func_name+'"', function() {
        it('should export a function', function() {
          expect(provision[func_name]).to.be.a('function');
        });
      });
    });
});


//--------------------------------------------------
// Tests the generateCFN generates what we expect.
//--------------------------------------------------
describe('generateCFN module functionality', function() {
    describe('"generateCFN"', function() {
        it('return a YML formatted cloudformation template with two tables defined and one IAM role', function(done) {
          this.timeout(15000)
            const extraParams = [
            	{name: "Unit", type: "String"},
            	{name: "Product", type: "String"},
            	{name: "Subproduct", type: "String"},
            	{name: "Version", type: "String"},
            ]
            var cfn = provision.generateCFN("UnitTests", ["one", "hat"], extraParams);
            // console.log(cfn);
            cloudformation.validateTemplate({
              TemplateBody: cfn
            }, function(err, data) {
              expect(err).to.be.null;
              // cloudformation.createStack({
              //   StackName: "int-test-dynamodb-graphql",
              //   OnFailure: "DELETE",
              //   TemplateBody: cfn,
              //   Parameters: [{
              //     ParameterKey: 'Unit',
              //     ParameterValue: "test",
              //     UsePreviousValue: false
              //   },{
              //     ParameterKey: 'Product',
              //     ParameterValue: "test",
              //     UsePreviousValue: false
              //   },{
              //     ParameterKey: 'Subproduct',
              //     ParameterValue: "test",
              //     UsePreviousValue: false
              //   },{
              //     ParameterKey: 'Version',
              //     ParameterValue: "test",
              //     UsePreviousValue: false
              //   }],
              //   Capabilities: ["CAPABILITY_NAMED_IAM"]
              // }, function(err, data) {
              //   console.log(err, data)
              //   done()
              // })

            })

        });
    });
});
