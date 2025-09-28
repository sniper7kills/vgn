import { useForm, useFieldArray } from "react-hook-form";
import { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { garageSchema, type GarageFormData } from "../../lib/validations";
import { useAmplifyClient } from "../../hooks/useAmplifyClient";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const SPECIALTY_OPTIONS = [
  "American V-Twins",
  "Metric Cruisers", 
  "Sport Bikes",
  "Touring Bikes",
  "Choppers",
  "Bobbers",
  "Cafe Racers",
  "Adventure Bikes",
  "Dirt Bikes",
  "Vintage Restoration"
];

const AMENITY_OPTIONS = [
  "Welding",
  "Machine Shop",
  "Paint Booth",
  "Tire Mounting",
  "Dyno Tuning",
  "Parts Washing",
  "Compressed Air",
  "Lift/Hoist",
  "Tool Library",
  "Meeting Space"
];

export default function GarageForm() {
  const client = useAmplifyClient();
  const form = useForm({
    resolver: zodResolver(garageSchema),
    defaultValues: {
      name: "",
      description: "",
      hoursOfOperation: "",
      specialties: [],
      amenities: [],
      isActive: true,
      website: "",
      images: [],
      address: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "USA",
      },
      contacts: [
        {
          name: "",
          title: "",
          email: "",
          phone: "",
          website: "",
          preference: "ANY",
        },
      ],
    },
  });

  const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  const onSubmit = useCallback(async (data: GarageFormData) => {
    try {
      console.log("Garage form data:", data);
      
      // Create the garage with Amplify
      const result = await client.models.Garage.create({
        name: data.name,
        description: data.description,
        hoursOfOperation: data.hoursOfOperation,
        specialties: data.specialties,
        amenities: data.amenities,
        isActive: data.isActive,
        website: data.website,
        images: data.images,
        address: data.address,
        contacts: data.contacts,
      });

      console.log("Garage created:", result);
      alert("Garage created successfully!");
      form.reset();
    } catch (error) {
      console.error("Error creating garage:", error);
      alert("Error creating garage. Please try again.");
    }
  }, [client]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Register Your Garage</CardTitle>
        <CardDescription>
          Join the Veteran's Garage Network by registering your garage space.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garage Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Combat Customs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your garage, mission, and what makes it special..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hoursOfOperation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours of Operation</FormLabel>
                    <FormControl>
                      <Input placeholder="Mon-Fri: 9am-5pm, Sat: 8am-4pm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourgarage.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Address</h3>
              
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="Kingston" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <FormControl>
                        <Input placeholder="NY" maxLength={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="12401" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contacts */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendContact({
                    name: "",
                    title: "",
                    email: "",
                    phone: "",
                    website: "",
                    preference: "ANY",
                  })}
                >
                  Add Contact
                </Button>
              </div>

              {contactFields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Contact {index + 1}</h4>
                    {contactFields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeContact(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`contacts.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`contacts.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Shop Manager" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`contacts.${index}.phone`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone *</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`contacts.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="contact@garage.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`contacts.${index}.preference`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Preference</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select preference" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="CALL">Call</SelectItem>
                              <SelectItem value="TEXT">Text</SelectItem>
                              <SelectItem value="EMAIL">Email</SelectItem>
                              <SelectItem value="ANY">Any</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}
            </div>

            {/* Specialties */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Specialties</h3>
              <div className="grid grid-cols-2 gap-2">
                {SPECIALTY_OPTIONS.map((specialty) => (
                  <FormField
                    key={specialty}
                    control={form.control}
                    name="specialties"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(specialty)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), specialty])
                                : field.onChange((field.value || []).filter((value) => value !== specialty))
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{specialty}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {AMENITY_OPTIONS.map((amenity) => (
                  <FormField
                    key={amenity}
                    control={form.control}
                    name="amenities"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(amenity)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), amenity])
                                : field.onChange((field.value || []).filter((value) => value !== amenity))
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{amenity}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Status */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active Garage</FormLabel>
                    <FormDescription>
                      Check this if your garage is currently accepting veteran projects
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Register Garage
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
