import { ApolloClient, HttpLink } from '@apollo/client/core/index.js';
import { InMemoryCache } from '@apollo/client/cache/index.js';

export class MinaArenaClient {
  client

  constructor() {
    this.client = this.setupClient();
  }

  setupClient() {
    const link = new HttpLink({
      uri: process.env.VITE_BACKEND_SERVER_URL
    });

    const client = new ApolloClient({
      link,
      cache: new InMemoryCache()
    });
    return client;
  }
}
