import { useForm } from "react-hook-form";
// import { generateClient } from "aws-amplify/data";
// import type { Schema } from "../../../amplify/data/resource";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// const client = generateClient<Schema>();

interface LocationFormData {
  name: string;
  title: string;
  description: string;
  type: "GARAGE" | "MEETUP" | "WAYPOINT" | "LANDMARK" | "OTHER";
  stop: boolean;
  lat: number;
  long: number;
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<LocationFormData>;
}

export default function LocationModal({ isOpen, onClose, initialData }: LocationModalProps) {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<LocationFormData>({
    defaultValues: {
      name: initialData?.name || "",
      title: initialData?.title || "",
      description: initialData?.description || "",
      type: initialData?.type || "WAYPOINT",
      stop: initialData?.stop || false,
      lat: initialData?.lat || 0,
      long: initialData?.long || 0,
    },
  });

  const isStop = watch("stop");

  const onSubmit = async (data: LocationFormData) => {
    try {
      console.log("Location form data:", data);
      
      // In a real application, you might save this to a ride or event
      // For now, we'll just log it and close the modal
      alert(`Location "${data.name}" saved successfully!`);
      reset();
      onClose();
    } catch (error) {
      console.error("Error saving location:", error);
      alert("Error saving location. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Add Waypoint</CardTitle>
              <CardDescription>
                Create a new waypoint for route planning or event location.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location Information</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">Location Name *</label>
                <Input 
                  placeholder="Combat Customs HQ"
                  {...register("name", { required: "Location name is required" })}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input 
                  placeholder="Starting Point"
                  {...register("title")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea 
                  placeholder="Describe this location and any special instructions..."
                  className="min-h-[80px]"
                  {...register("description")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location Type *</label>
                <Select onValueChange={(value) => setValue("type", value as LocationFormData["type"])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GARAGE">Garage</SelectItem>
                    <SelectItem value="MEETUP">Meetup Point</SelectItem>
                    <SelectItem value="WAYPOINT">Waypoint</SelectItem>
                    <SelectItem value="LANDMARK">Landmark</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Coordinates */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Coordinates</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Latitude *</label>
                  <Input 
                    type="number"
                    step="any"
                    placeholder="41.9276"
                    {...register("lat", { 
                      required: "Latitude is required",
                      valueAsNumber: true,
                      min: { value: -90, message: "Latitude must be between -90 and 90" },
                      max: { value: 90, message: "Latitude must be between -90 and 90" }
                    })}
                  />
                  {errors.lat && <p className="text-red-500 text-sm mt-1">{errors.lat.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Longitude *</label>
                  <Input 
                    type="number"
                    step="any"
                    placeholder="-74.0004"
                    {...register("long", { 
                      required: "Longitude is required",
                      valueAsNumber: true,
                      min: { value: -180, message: "Longitude must be between -180 and 180" },
                      max: { value: 180, message: "Longitude must be between -180 and 180" }
                    })}
                  />
                  {errors.long && <p className="text-red-500 text-sm mt-1">{errors.long.message}</p>}
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Click on a map to get coordinates, or use GPS coordinates from your device.
              </p>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Options</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stop"
                  checked={isStop}
                  onCheckedChange={(checked) => setValue("stop", checked as boolean)}
                />
                <label htmlFor="stop" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  This is a planned stop location
                </label>
              </div>
              
              {isStop && (
                <p className="text-sm text-gray-500 ml-6">
                  Riders will stop here during the route (gas, food, rest, etc.)
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Save Location
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
