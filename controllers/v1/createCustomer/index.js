const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB();
const ddbTable =  process.env.STARTUP_SIGNUP_TABLE;

const createCustomer = async (req, res) => {
    ddb.putItem({
        'TableName': ddbTable,
        'Item': { 'email': {'S': req.body.email} },
        'Expected': { email: { Exists: false } }        
    }, function(err, data) {
        if (err) {
            var returnStatus = 500;

            if (err.code === 'ConditionalCheckFailedException') {
                returnStatus = 409;
            }

            res.status(returnStatus).end();
            console.log('DDBd Error: ' + err);
        } else {
        }
    });
}

module.exports = createCustomer;