
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BulkSlotFormData {
  startNumber: number;
  count: number;
  vehicleType: 'car' | 'motorcycle' | 'truck' | 'any';
  size: 'small' | 'medium' | 'large';
  location: 'north' | 'south' | 'east' | 'west';
}

interface BulkSlotFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BulkSlotFormData) => void;
  isSubmitting?: boolean;
}

const BulkSlotForm = ({ open, onClose, onSubmit, isSubmitting = false }: BulkSlotFormProps) => {
  const [formData, setFormData] = useState<BulkSlotFormData>({
    startNumber: 1,
    count: 10,
    vehicleType: 'car',
    size: 'medium',
    location: 'north',
  });

  const handleChange = (field: string, value: string | number) => {
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
          <DialogTitle>Add Multiple Parking Slots</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-number">Start Number</Label>
                <Input
                  id="start-number"
                  type="number"
                  min="1"
                  value={formData.startNumber}
                  onChange={(e) => handleChange('startNumber', parseInt(e.target.value))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="count">Number of Slots</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.count}
                  onChange={(e) => handleChange('count', parseInt(e.target.value))}
                  required
                />
              </div>
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
            
            <div className="text-sm text-muted-foreground">
              <p>This will create {formData.count} parking slots with numbers from {formData.location.charAt(0).toUpperCase()}-{String(formData.startNumber).padStart(3, '0')} to {formData.location.charAt(0).toUpperCase()}-{String(formData.startNumber + formData.count - 1).padStart(3, '0')}</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Slots'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BulkSlotForm;
