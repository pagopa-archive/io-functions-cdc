import { AzureFunction, Context } from "@azure/functions";
import { EventHubProducerClient } from "@azure/event-hubs";
import { getConfigOrThrow } from "../utils/config";

const eventHubName = "messages";
const config = getConfigOrThrow();

const cosmosDBTrigger: AzureFunction = async (
  context: Context,
  documents: ReadonlyArray<any>
): Promise<void> => {
  const producer = new EventHubProducerClient(
    config.MESSAGES_EVENTHUB_CONNECTION_STRING,
    eventHubName
  );
  try {
    const batchOptions = {
      partitionKey: "fiscalCode"
    };

    let batch = await producer.createBatch(batchOptions);

    let numEventsSent = 0;

    // add events to our batch
    let i = 0;

    while (!!documents && i < documents.length) {
      // messages can fail to be added to the batch if they exceed the maximum size configured for
      // the EventHub.
      const isAdded = batch.tryAdd({ body: documents[i] });

      if (isAdded) {
        console.log(`Added documents[${i}] to the batch`);
        ++i;
        continue;
      }

      if (batch.count === 0) {
        // If we can't add it and the batch is empty that means the message we're trying to send
        // is too large, even when it would be the _only_ message in the batch.
        //
        // At this point you'll need to decide if you're okay with skipping this message entirely
        // or find some way to shrink it.
        console.log(
          `Message was too large and can't be sent until it's made smaller. Skipping...`
        );
        ++i;
        continue;
      }

      // otherwise this just signals a good spot to send our batch
      console.log(
        `Batch is full - sending ${batch.count} messages as a single batch.`
      );
      await producer.sendBatch(batch);
      numEventsSent += batch.count;

      // and create a new one to house the next set of messages
      batch = await producer.createBatch(batchOptions);
    }

    // send any remaining messages, if any.
    if (batch.count > 0) {
      console.log(
        `Sending remaining ${batch.count} messages as a single batch.`
      );
      await producer.sendBatch(batch);
      numEventsSent += batch.count;
    }

    console.log(`Sent ${numEventsSent} events`);

    if (numEventsSent !== documents.length) {
      throw new Error(
        `Not all messages were sent (${numEventsSent}/${documents.length})`
      );
    }
  } catch (err) {
    console.log("Error when creating & sending a batch of events: ", err);
  }

  await producer.close();
  console.log(`Exiting sendEvents`);
};

export default cosmosDBTrigger;