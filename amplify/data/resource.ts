import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  // Address - The location of something.
  Address: a.customType({
    street: a.string(),
    city: a.string().required(),
    state: a.string().required(),
    zip: a.string().required()
  }),

  Location: a.customType({
      lat: a.float().required(),
      long: a.float().required(),
  }),

  Contact: a.customType({
    name: a.string().required(),
    email: a.email(),
    phone: a.phone().required(),
    preference: a.enum(['CALL', 'TEXT', 'EAMIL', 'ANY']) 
  }),

  // // Garage - Provides space for veterans to work on their bikes
  Garage: a.model({
    id: a.id(),
    name: a.string().required(),
    address: a.ref('Address'),
    contact: a.ref('Contact'),
    description: a.string(),
    hoursOfOperation: a.string(), // e.g., "Mon-Fri: 9am-5pm"
  }),
  
  // // Club - A group of people that support each other
  Club: a.model({
    id: a.id(),
    name: a.string().required(),
    address: a.ref('Address'), // Clubs may not have a fixed physical location
    contact: a.ref('Contact'),
    description: a.string(),
    affiliatedGarages: a.ref('Garage').array()
  }),

  // Ride - The plan for what roads to take during a ride
  // Event - An event hosted by a club at a location (Can include a ride)
  // Project - A bike that is being built/repaired for/by a veteran
  // Part - A bike part that a club/garage has for veteran projects
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
