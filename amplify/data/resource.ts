import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({

  // Location - The GPS location for putting on a map.
  Location: a.customType({
    title: a.string(),
    description: a.string(),
    stop: a.boolean(),
    lat: a.float().required(),
    long: a.float().required(),
  }),

  // Address - The location of something.
  Address: a.customType({
    street: a.string(),
    city: a.string().required(),
    state: a.string().required(),
    zip: a.string().required(),
    location: a.ref('Location')
  }),

  // Contact - The method for getting in touch with a garage or club.
  Contact: a.customType({
    name: a.string().required(),
    title: a.string(),
    // Restrict email to authenticated users only.
    email: a.email()
      .authorization(
        allow => [allow.authenticated(),]
      ),
    // Restrict phone to authenticated users only.
    phone: a.phone().required()
      .authorization(
        allow => [allow.authenticated(),]
      ),
    preference: a.enum(['CALL', 'TEXT', 'EAMIL', 'ANY']) 
  }),

  // Garage - Provides space, tools, resources to veterans.
  Garage: a.model({
    id: a.id(),
    name: a.string().required(),
    address: a.ref('Address'),
    contacts: a.ref('Contact').array(),
    description: a.string(),
    hoursOfOperation: a.string(), // e.g., "Mon-Fri: 9am-5pm"
  }).authorization(
    allow => [
      // Allow anyone auth'd with an API key to read
      allow.publicApiKey().to(['read']),
    ]
  ),
  
  // Club - A group of people that support each other.
  Club: a.model({
    id: a.id(),
    name: a.string().required(),
    website: a.url(),
    address: a.ref('Address'), // Clubs may not have a fixed physical location
    contacts: a.ref('Contact').array(),
    description: a.string().required(),
  }).authorization(
    allow => [
      // Allow anyone auth'd with an API key to read
      allow.publicApiKey().to(['read']),
    ]
  ),

  // Ride - The plan for what roads to take during a ride
  Ride: a.model({
    id: a.id(),
    name: a.string(),
    description: a.string(),
    start: a.ref('Address'),
    end: a.ref('Address'),
    points: a.ref('Location').array(),
    // Relations
    events: a.belongsTo('Event', 'id')
  }).authorization(
    allow => [
      allow.publicApiKey().to(['read']),
    ]
  ),
  // Event - An event hosted by a club at a location (Can include a ride)
  Event: a.model({
    id: a.id(),
    address: a.ref('Address'),
    title: a.string().required(),
    description: a.string(),
    website: a.string(),
    // Relations
    ride: a.hasOne('Ride', 'id'),
  }).authorization(
    allow => [
      allow.publicApiKey().to(['read'])
    ]
  )
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
