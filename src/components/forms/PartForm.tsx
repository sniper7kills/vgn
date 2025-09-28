import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { partSchema, type PartFormData } from "../../lib/validations";
import { useAmplifyClient } from "../../hooks/useAmplifyClient";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

export default function PartForm() {
  const client = useAmplifyClient();
  const form = useForm({
    resolver: zodResolver(partSchema),
    defaultValues: {
      name: "",
      partNumber: "",
      category: "OTHER",
      condition: "USED_GOOD",
      fitsModels: [],
      description: "",
      cost: "",
      isAvailable: true,
      garageId: "",
    },
  });

  const onSubmit = useCallback(async (data: PartFormData) => {
    try {
      console.log("Part form data:", data);
      
      // Create the part with Amplify
      const result = await client.models.Part.create({
        name: data.name,
        partNumber: data.partNumber,
        category: data.category,
        condition: data.condition,
        fitsModels: data.fitsModels,
        description: data.description,
        cost: data.cost,
        isAvailable: data.isAvailable,
        garageId: data.garageId,
        images: [],
      });

      console.log("Part created:", result);
      alert("Part created successfully!");
      form.reset();
    } catch (error) {
      console.error("Error creating part:", error);
      alert("Error creating part. Please try again.");
    }
  }, [client]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add Part to Inventory</CardTitle>
        <CardDescription>
          Add a motorcycle part to your garage's inventory for veteran projects.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Part Information</h3>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="S&S Super E Carburetor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="partNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part Number</FormLabel>
                  <FormControl>
                    <Input placeholder="11-0420" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ENGINE">Engine</SelectItem>
                        <SelectItem value="FRAME">Frame & Body</SelectItem>
                        <SelectItem value="ELECTRICAL">Electrical</SelectItem>
                        <SelectItem value="WHEELS">Wheels & Tires</SelectItem>
                        <SelectItem value="SUSPENSION">Suspension</SelectItem>
                        <SelectItem value="BRAKES">Brakes</SelectItem>
                        <SelectItem value="EXHAUST">Exhaust</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NEW">New</SelectItem>
                        <SelectItem value="USED_EXCELLENT">Used - Excellent</SelectItem>
                        <SelectItem value="USED_GOOD">Used - Good</SelectItem>
                        <SelectItem value="USED_FAIR">Used - Fair</SelectItem>
                        <SelectItem value="REBUILD_REQUIRED">Rebuild Required</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed description of the part, its condition, and any special notes..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Pricing and Availability */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing & Availability</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost *</FormLabel>
                    <FormControl>
                      <Input placeholder="Free, $150, Trade, At Cost, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-gray-500 mt-1">Enter price, "Free", "Trade", "At Cost", etc.</p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="garageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garage ID *</FormLabel>
                    <FormControl>
                      <Input placeholder="garage123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Part is currently available</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            Add Part to Inventory
          </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
