require("babel-core/register");
require("babel-polyfill");
import express from 'express';
import { createServer } from 'http';
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from 'graphql-tools';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
 
import './config/db';
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import constants from './config/constants';
import middlewares from './config/middlewares';
const app = express();
middlewares(app);

app.use(
  "/graphiql",
  graphiqlExpress({
    endpointURL: constants.GRAPHQL_PATH,
    subscriptionsEndpoint: `ws://localhost:${constants.PORT}${
      constants.SUBSCRIPTIONS_PATH
    }`
  })
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

app.use(
  constants.GRAPHQL_PATH,
  graphqlExpress(req => ({
    schema,
    context: {
      user: req.user
    }
  }))
);

const graphQLServer = createServer(app);
graphQLServer.listen(constants.PORT, err => {
    if (err) {
        console.log(err)
    } else {
        //Creating subscription server
        new SubscriptionServer({
            schema,
            execute,
            subscribe
        }, {
            server: graphQLServer,
            path: constants.SUBSCRIPTIONS_PATH
        })
        console.log(`Server running on ${constants.PORT}`)
    }
});