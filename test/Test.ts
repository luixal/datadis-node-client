import DatadisClient from "../src/DatadisClient";
import { PASSWORD, USERNAME, TIMEOUT, DATE, RETRY_CONFIG } from "./testValues";

async function main() {
  const client = new DatadisClient(USERNAME, PASSWORD, TIMEOUT, RETRY_CONFIG);

  console.log(`Logging in and getting supplies for user ${USERNAME}`)
  await client.login();
  const supplies = await client.getSupplies();
  console.log(`Supplies (${supplies.length}):`);
  console.log(supplies);

  console.log(`Getting consumptions for supplies...`);
  for (const supply of supplies) {
    const consumptions = await client.getConsumptionData(supply, DATE, DATE)
    console.log(`Consumptions found for CUPS ${supply.cups} (${consumptions.length}):\n\n`)
    console.log(consumptions[0]);
    console.log('\n');
    console.log(consumptions[consumptions.length - 1]);
  }
}

main();