import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

/*== VETERAN'S GARAGE NETWORK DATA SCHEMA ================================
Complete data structure for the Veteran's Garage Network application
supporting garages, clubs, projects, inventory, events, and route planning.
=========================================================================*/

const schema = a.schema({

  // Location - The GPS location for putting on a map.
  Location: a.customType({
    name: a.string(), // Name of the location
    title: a.string(),
    description: a.string(),
    type: a.enum(['GARAGE', 'MEETUP', 'WAYPOINT', 'LANDMARK', 'OTHER']),
    stop: a.boolean(),
    lat: a.float().required(),
    long: a.float().required(),
  }),

  // Address - The location of something.
  Address: a.customType({
    street: a.string().required(),
    city: a.string().required(),
    state: a.string().required(),
    zip: a.string().required(),
    country: a.string(),
    location: a.ref('Location')
  }),

  // Contact - The method for getting in touch with a garage or club.
  Contact: a.customType({
    name: a.string().required(),
    title: a.string(),
    // TODO: Restrict email to authenticated users only
    email: a.email(),
    // TODO: Restrict phone to authenticated users only  
    phone: a.phone().required(),
    website: a.url(),
    preference: a.enum(['CALL', 'TEXT', 'EMAIL', 'ANY'])
  }),

  // Garage - Provides space, tools, resources to veterans.
  Garage: a.model({
    id: a.id(),
    name: a.string().required(),
    address: a.ref('Address'),
    contacts: a.ref('Contact').array(),
    description: a.string(),
    hoursOfOperation: a.string(), // e.g., "Mon-Fri: 9am-5pm"
    specialties: a.string().array(), // e.g., ["American V-Twins", "Metric Cruisers"]
    amenities: a.string().array(), // e.g., ["Welding", "Machine Shop", "Paint Booth"]
    isActive: a.boolean().default(true),
    website: a.url(),
    images: a.string().array(), // S3 URLs for garage photos
    // Relations
    projects: a.hasMany('Project', 'garageId'),
    parts: a.hasMany('Part', 'garageId'),
  }).authorization(
    allow => [
      // TODO: Implement proper authorization - garage owners should manage their own garages
      // TODO: Only authenticated users should see contact details
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
    isActive: a.boolean().default(true),
    images: a.string().array(), // S3 URLs for club photos
    // Relations
    hostedEvents: a.hasMany('Event', 'hostClubId'),
  }).authorization(
    allow => [
      // TODO: Implement proper authorization - club officers should manage their clubs
      // TODO: Only authenticated users should see contact details
      allow.publicApiKey().to(['read']),
    ]
  ),

  // Project - A bike that is being built/repaired for/by a veteran
  Project: a.model({
    id: a.id(),
    title: a.string().required(),
    description: a.string(),
    veteranId: a.string().required(), // AWS Cognito user ID
    veteranName: a.string().required(), // Display name for the veteran
    status: a.enum(['PLANNING', 'IN_PROGRESS', 'STALLED', 'COMPLETED']),
    progressPercentage: a.integer().default(0),
    startDate: a.date(),
    targetCompletionDate: a.date(),
    actualCompletionDate: a.date(),
    images: a.string().array(), // S3 URLs for project photos
    garageId: a.id(),
    // Relations
    garage: a.belongsTo('Garage', 'garageId'),
    partsNeeded: a.hasMany('ProjectPart', 'projectId'),
  }).authorization(
    allow => [
      // TODO: Implement owner-based authorization - veterans should only manage their own projects
      // TODO: Garage owners should be able to view/edit projects at their garage
      allow.publicApiKey().to(['read']),
    ]
  ),

  // Part - A bike part that a club/garage has for veteran projects
  Part: a.model({
    id: a.id(),
    name: a.string().required(),
    partNumber: a.string(),
    category: a.enum(['ENGINE', 'FRAME', 'ELECTRICAL', 'WHEELS', 'SUSPENSION', 'BRAKES', 'EXHAUST', 'OTHER']),
    condition: a.enum(['NEW', 'USED_EXCELLENT', 'USED_GOOD', 'USED_FAIR', 'REBUILD_REQUIRED']),
    fitsModels: a.string().array(), // e.g., ["Harley Evo", "Shovelhead", "VTX1800"]
    description: a.string(),
    images: a.string().array(), // S3 URLs for part photos
    cost: a.string().required(), // "Free", "$150", "Trade", "At Cost", etc.
    isAvailable: a.boolean().default(true),
    garageId: a.id().required(),
    // Relations
    garage: a.belongsTo('Garage', 'garageId'),
    projectParts: a.hasMany('ProjectPart', 'partId'),
  }).authorization(
    allow => [
      // TODO: Implement garage-based authorization - only garage owners should manage their inventory
      // TODO: Authenticated users should be able to request parts
      allow.publicApiKey().to(['read']),
    ]
  ),

  // ProjectPart - Junction table linking projects to needed parts
  ProjectPart: a.model({
    id: a.id(),
    projectId: a.id().required(),
    partId: a.id(), // Optional - may be null if part not yet in inventory
    partName: a.string().required(), // For parts not yet in inventory
    isObtained: a.boolean().default(false),
    notes: a.string(),
    priority: a.enum(['HIGH', 'MEDIUM', 'LOW']),
    // Relations
    project: a.belongsTo('Project', 'projectId'),
    part: a.belongsTo('Part', 'partId'),
  }).authorization(
    allow => [
      // TODO: Implement project-based authorization - only project owners should manage their parts list
      allow.publicApiKey().to(['read']),
    ]
  ),

  // Event - An event hosted by a club at a location (Can include a ride)
  Event: a.model({
    id: a.id(),
    title: a.string().required(),
    description: a.string(),
    address: a.ref('Address'),
    website: a.string(),
    eventType: a.enum(['RIDE', 'WORKSHOP', 'SOCIAL', 'FUNDRAISER', 'MEETING']),
    startDateTime: a.datetime().required(),
    endDateTime: a.datetime(),
    registrationTime: a.time(), // Time when registration opens
    ksuTime: a.time(), // Kick Stands Up time for rides
    maxParticipants: a.integer(),
    currentParticipants: a.integer().default(0),
    registrationRequired: a.boolean().default(false),
    hostClubId: a.id(),
    // Relations
    hostClub: a.belongsTo('Club', 'hostClubId'),
    ride: a.hasOne('Ride', 'eventId'),
    registrations: a.hasMany('EventRegistration', 'eventId'),
  }).authorization(
    allow => [
      // TODO: Implement club-based authorization - only club officers should manage their events
      allow.publicApiKey().to(['read'])
    ]
  ),

  // Ride - The plan for what roads to take during a ride
  Ride: a.model({
    id: a.id(),
    name: a.string(),
    description: a.string(),
    start: a.ref('Address'),
    end: a.ref('Address'),
    points: a.ref('Location').array(), // Waypoints along the route
    distance: a.float(), // in miles
    estimatedDuration: a.integer(), // in minutes
    difficultyLevel: a.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
    routeData: a.json(), // Full route export data from route planner
    createdBy: a.string(), // AWS Cognito user ID
    isPublic: a.boolean().default(true),
    eventId: a.id(),
    // Relations
    event: a.belongsTo('Event', 'eventId'),
  }).authorization(
    allow => [
      // TODO: Implement user-based authorization - users should manage their own routes
      // TODO: Event organizers should manage event routes
      allow.publicApiKey().to(['read']),
    ]
  ),

  // EventRegistration - User registration for events
  EventRegistration: a.model({
    id: a.id(),
    eventId: a.id().required(),
    userId: a.string().required(), // AWS Cognito user ID
    userName: a.string().required(), // Display name for the user
    registrationDate: a.datetime(),
    status: a.enum(['REGISTERED', 'ATTENDED', 'NO_SHOW', 'CANCELLED']),
    notes: a.string(),
    // Relations
    event: a.belongsTo('Event', 'eventId'),
  }).authorization(
    allow => [
      // TODO: Implement owner-based authorization - users should only manage their own registrations
      // TODO: Event organizers should view all registrations for their events
      allow.publicApiKey().to(['read']),
    ]
  ),

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

/*== FRONTEND INTEGRATION EXAMPLES =======================================
Examples of how to use this schema in your React components:
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>()

// Example: Fetch all garages with their parts
const { data: garages } = await client.models.Garage.list({
  include: {
    parts: true,
    projects: true,
  }
});

// Example: Fetch projects with progress tracking
const { data: projects } = await client.models.Project.list({
  include: {
    garage: true,
    partsNeeded: {
      include: {
        part: true
      }
    }
  }
});

// Example: Fetch upcoming events with rides
const { data: events } = await client.models.Event.list({
  filter: {
    startDateTime: {
      gt: new Date().toISOString()
    }
  },
  include: {
    hostClub: true,
    ride: true,
    registrations: true,
  }
});

// Example: Search parts by category
const { data: engineParts } = await client.models.Part.list({
  filter: {
    category: { eq: 'ENGINE' },
    isAvailable: { eq: true }
  },
  include: {
    garage: true
  }
});
*/

/*== SECURITY TODO LIST ===================================================
The following authorization and security measures need to be implemented:

1. USER MANAGEMENT:
   - Implement user roles (Veteran, GarageOwner, ClubOfficer, Admin)
   - Add user profile management
   - Implement user verification for veterans

2. GARAGE AUTHORIZATION:
   - Only garage owners can create/update/delete their garages
   - Only garage owners can manage their parts inventory
   - Garage owners can view/assist with projects at their location

3. PROJECT AUTHORIZATION:
   - Veterans can only create/update/delete their own projects
   - Garage owners can view/comment on projects at their garage
   - Public can view completed projects for inspiration

4. PART AUTHORIZATION:
   - Only garage owners can add/update/delete parts in their inventory
   - Authenticated users can request parts
   - Implement part request/approval workflow

5. EVENT AUTHORIZATION:
   - Only club officers can create/update/delete club events
   - Users can register/unregister for events
   - Event organizers can manage registrations

6. PRIVACY CONTROLS:
   - Contact information should only be visible to authenticated users
   - User personal information should be protected
   - Implement data retention policies

7. CONTENT MODERATION:
   - Implement content filtering for descriptions and comments
   - Add reporting system for inappropriate content
   - Admin controls for content management

8. API SECURITY:
   - Implement rate limiting
   - Add input validation and sanitization
   - Secure file upload for images
=========================================================================*/
