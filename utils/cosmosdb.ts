/**
 * Use a singleton CosmosDB client across functions.
 */
import { CosmosClient } from "@azure/cosmos";
import { getConfigOrThrow } from "./config";

const config = getConfigOrThrow();
const cosmosDBConnectionString = config.COSMOSDB_CONNECTION_STRING;

export const cosmosdbClient = new CosmosClient(cosmosDBConnectionString);
