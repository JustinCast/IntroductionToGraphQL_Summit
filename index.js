const express = require('express');
const expressGraphQL = require('express-graphql');

const schema = require('./schema');
const app = express();

app.use('/graph', expressGraphQL({
    schema: schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log(`Hey our incredible server is running on port: 4000`);
});