import { z } from "zod";

// Address validation schema
export const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required").max(2, "State must be 2 characters"),
  zip: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().default("USA"),
});

// Contact validation schema
export const contactSchema = z.object({
  name: z.string().min(1, "Contact name is required"),
  title: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  preference: z.enum(["CALL", "TEXT", "EMAIL", "ANY"]).optional(),
});

// Location validation schema
export const locationSchema = z.object({
  name: z.string().min(1, "Location name is required"),
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["GARAGE", "MEETUP", "WAYPOINT", "LANDMARK", "OTHER"]),
  stop: z.boolean().default(false),
  lat: z.number().min(-90).max(90),
  long: z.number().min(-180).max(180),
});

// Garage validation schema
export const garageSchema = z.object({
  name: z.string().min(1, "Garage name is required"),
  description: z.string().optional(),
  hoursOfOperation: z.string().optional(),
  specialties: z.array(z.string()).default([]),
  amenities: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  images: z.array(z.string()).default([]),
  address: addressSchema,
  contacts: z.array(contactSchema).min(1, "At least one contact is required"),
});

// Club validation schema
export const clubSchema = z.object({
  name: z.string().min(1, "Club name is required"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean().default(true),
  images: z.array(z.string()).default([]),
  address: addressSchema.optional(),
  contacts: z.array(contactSchema).min(1, "At least one contact is required"),
});

// Project validation schema
export const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().optional(),
  veteranId: z.string().min(1, "Veteran ID is required"),
  veteranName: z.string().min(1, "Veteran name is required"),
  status: z.enum(["PLANNING", "IN_PROGRESS", "STALLED", "COMPLETED"]).default("PLANNING"),
  progressPercentage: z.number().min(0).max(100).default(0),
  startDate: z.string().optional(),
  targetCompletionDate: z.string().optional(),
  actualCompletionDate: z.string().optional(),
  images: z.array(z.string()).default([]),
  garageId: z.string().optional(),
});

// Part validation schema
export const partSchema = z.object({
  name: z.string().min(1, "Part name is required"),
  partNumber: z.string().optional(),
  category: z.enum(["ENGINE", "FRAME", "ELECTRICAL", "WHEELS", "SUSPENSION", "BRAKES", "EXHAUST", "OTHER"]),
  condition: z.enum(["NEW", "USED_EXCELLENT", "USED_GOOD", "USED_FAIR", "REBUILD_REQUIRED"]),
  fitsModels: z.array(z.string()).default([]),
  description: z.string().optional(),
  images: z.array(z.string()).default([]),
  cost: z.string().min(1, "Cost information is required"),
  isAvailable: z.boolean().default(true),
  garageId: z.string().min(1, "Garage selection is required"),
});

// Event validation schema
export const eventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  description: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  eventType: z.enum(["RIDE", "WORKSHOP", "SOCIAL", "FUNDRAISER", "MEETING"]),
  startDateTime: z.string().min(1, "Start date and time is required"),
  endDateTime: z.string().optional(),
  registrationTime: z.string().optional(),
  ksuTime: z.string().optional(),
  maxParticipants: z.number().positive().optional(),
  currentParticipants: z.number().min(0).default(0),
  registrationRequired: z.boolean().default(false),
  hostClubId: z.string().optional(),
  address: addressSchema.optional(),
});

// Ride validation schema
export const rideSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  distance: z.number().positive().optional(),
  estimatedDuration: z.number().positive().optional(),
  difficultyLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"),
  routeData: z.any().optional(),
  createdBy: z.string().min(1, "Creator ID is required"),
  isPublic: z.boolean().default(true),
  eventId: z.string().optional(),
  start: addressSchema.optional(),
  end: addressSchema.optional(),
  points: z.array(locationSchema).default([]),
});

// Event Registration validation schema
export const eventRegistrationSchema = z.object({
  eventId: z.string().min(1, "Event selection is required"),
  userId: z.string().min(1, "User ID is required"),
  userName: z.string().min(1, "User name is required"),
  registrationDate: z.string().optional(),
  status: z.enum(["REGISTERED", "ATTENDED", "NO_SHOW", "CANCELLED"]).default("REGISTERED"),
  notes: z.string().optional(),
});

// Project Part validation schema
export const projectPartSchema = z.object({
  projectId: z.string().min(1, "Project selection is required"),
  partId: z.string().optional(),
  partName: z.string().min(1, "Part name is required"),
  isObtained: z.boolean().default(false),
  notes: z.string().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
});

export type GarageFormData = z.infer<typeof garageSchema>;
export type ClubFormData = z.infer<typeof clubSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type PartFormData = z.infer<typeof partSchema>;
export type EventFormData = z.infer<typeof eventSchema>;
export type RideFormData = z.infer<typeof rideSchema>;
export type EventRegistrationFormData = z.infer<typeof eventRegistrationSchema>;
export type ProjectPartFormData = z.infer<typeof projectPartSchema>;
export type LocationFormData = z.infer<typeof locationSchema>;
