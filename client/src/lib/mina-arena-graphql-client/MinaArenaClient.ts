import { ApolloClient, HttpLink } from '@apollo/client/core/index.js';
import { InMemoryCache } from '@apollo/client/cache/index.js';
import { GetUnitsQuery } from './queries/get-units';

export class MinaArenaClient {
  client

  constructor() {
    this.client = this.setupClient();
  }

  setupClient() {
    const link = new HttpLink({
      uri: `${import.meta.env.VITE_BACKEND_SERVER_URL}/graphql/`
    });

    const client = new ApolloClient({
      link,
      cache: new InMemoryCache()
    });
    return client;
  }

  async getUnits(): Promise<Unit[]> {
    console.log("Getting Units...")
    const { data } = await this.client.query({
      query: GetUnitsQuery,
    });

    console.log(`response: ${data}`)
    return data.units;
  }

  async getPlayerUnits(): Promise<PlayerUnit[]> {
    const { data } = await this.client.query({
      query: GetUnitsQuery,
    });

    return data;
  }
}
