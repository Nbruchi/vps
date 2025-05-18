
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Vehicle {
  id: string;
  userId: string;
  plateNumber: string;
  vehicleType: 'car' | 'motorcycle' | 'truck';
  size: 'small' | 'medium' | 'large';
  attributes: {
    color?: string;
    model?: string;
    year?: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface SlotRequestFormData {
  vehicleId: string;
}

interface RequestFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data) => void;
  initialData?: {
    vehicleId: string;
  };
  userId: string;
  isSubmitting?: boolean;
}

// Mock data for vehicles
const mockVehicles: Vehicle[] = [
  {
    id: "1",
    userId: "2",
    plateNumber: "ABC-123",
    vehicleType: "car",
    size: "medium",
    attributes: {
      color: "Blue",
      model: "Toyota Corolla",
      year: 2020,
    },
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-05-15T10:30:00Z",
  },
  {
    id: "2",
    userId: "2",
    plateNumber: "XYZ-789",
    vehicleType: "motorcycle",
    size: "small",
    attributes: {
      color: "Red",
      model: "Honda CBR",
      year: 2021,
    },
    createdAt: "2023-06-20T14:45:00Z",
    updatedAt: "2023-06-20T14:45:00Z",
  }
];

const RequestForm = ({ open, onClose, onSubmit, initialData, userId, isSubmitting = false }: RequestFormProps) => {
  const [formData, setFormData] = useState<SlotRequestFormData>({
    vehicleId: '',
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      try {
        const userVehicles = mockVehicles.filter(v => v.userId === userId);
        setVehicles(userVehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchVehicles();
    }
  }, [userId, open]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        vehicleId: initialData.vehicleId,
      });
    } else {
      // Reset form when adding new request
      setFormData({
        vehicleId: vehicles.length > 0 ? vehicles[0].id : '',
      });
    }
  }, [initialData, vehicles, open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Update Parking Request' : 'New Parking Request'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle-id">Select Vehicle</Label>
              <Select
                value={formData.vehicleId}
                onValueChange={(value) => handleChange('vehicleId', value)}
                disabled={loading}
              >
                <SelectTrigger id="vehicle-id">
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.length === 0 ? (
                    <SelectItem value="" disabled>No vehicles available</SelectItem>
                  ) : (
                    vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.plateNumber} - {vehicle.attributes.model || vehicle.vehicleType}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              
              {vehicles.length === 0 && !loading && (
                <p className="text-sm text-muted-foreground mt-2">
                  You need to add a vehicle before requesting a parking slot.
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || loading || vehicles.length === 0 || !formData.vehicleId}
            >
              {isSubmitting ? 'Submitting...' : initialData ? 'Update Request' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestForm;
