
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ParkingSlot {
  id: string;
  slotNumber: string;
  size: 'small' | 'medium' | 'large';
  vehicleType: 'car' | 'motorcycle' | 'truck' | 'any';
  status: 'available' | 'unavailable';
  location: 'north' | 'south' | 'east' | 'west';
  createdAt: string;
  updatedAt: string;
}

interface SlotFormData {
  slotNumber: string;
  vehicleType: 'car' | 'motorcycle' | 'truck' | 'any';
  size: 'small' | 'medium' | 'large';
  location: 'north' | 'south' | 'east' | 'west';
}

interface SlotFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SlotFormData) => void;
  initialData?: ParkingSlot;
  isSubmitting?: boolean;
}

const SlotForm = ({ open, onClose, onSubmit, initialData, isSubmitting = false }: SlotFormProps) => {
  const [formData, setFormData] = useState<SlotFormData>({
    slotNumber: '',
    vehicleType: 'car',
    size: 'medium',
    location: 'north',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        slotNumber: initialData.slotNumber,
        vehicleType: initialData.vehicleType,
        size: initialData.size,
        location: initialData.location,
      });
    } else {
      // Reset form when adding new slot
      setFormData({
        slotNumber: '',
        vehicleType: 'car',
        size: 'medium',
        location: 'north',
      });
    }
  }, [initialData, open]);

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
          <DialogTitle>{initialData ? 'Edit Parking Slot' : 'Add Parking Slot'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slot-number">Slot Number</Label>
              <Input
                id="slot-number"
                value={formData.slotNumber}
                onChange={(e) => handleChange('slotNumber', e.target.value)}
                placeholder="A-001"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle-type">Vehicle Type</Label>
                <Select
                  value={formData.vehicleType}
                  onValueChange={(value) => handleChange('vehicleType', value)}
                >
                  <SelectTrigger id="vehicle-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="any">Any</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slot-size">Size</Label>
                <Select
                  value={formData.size}
                  onValueChange={(value) => handleChange('size', value)}
                >
                  <SelectTrigger id="slot-size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => handleChange('location', value)}
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Add Slot'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SlotForm;
