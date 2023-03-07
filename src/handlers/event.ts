import { readdirSync } from "fs";
import { join } from "path";
import { EventBuilder, ExtendedClient } from "../structs";

export async function eventHandler(client: ExtendedClient) {
  const categories = readdirSync(join(__dirname, "..", "events"));
  for (const category of categories) {
    const events = readdirSync(join(__dirname, "..", "events", category));
    for (const eventFile of events) {
      const { default: event }: { default: EventBuilder<"ready"> } =
        await import(join(__dirname, "..", "events", category, eventFile));

      if (event.once) {
        client.once(
          event.name,
          (...args) => void event.callback(client, ...args)
        );
      } else {
        client.on(
          event.name,
          (...args) => void event.callback(client, ...args)
        );
      }
    }
  }
}
