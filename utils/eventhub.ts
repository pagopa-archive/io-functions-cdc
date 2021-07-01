import { EventHubProducerClient } from "@azure/event-hubs";
import { getConfigOrThrow } from "../utils/config";

const config = getConfigOrThrow();

export const messagesProducer = new EventHubProducerClient(
    config.MESSAGES_EVENTHUB_CONNECTION_STRING
);

export const messageStatusProducer = new EventHubProducerClient(
    config.MESSAGE_STATUS_EVENTHUB_CONNECTION_STRING
);
