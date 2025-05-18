
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

interface VehicleFormData {
  plateNumber: string;
  vehicleType: 'car' | 'motorcycle' | 'truck';
  size: 'small' | 'medium' | 'large';
  attributes: {
    color?: string;
    model?: string;
    year?: number | string;
    [key: string]: any;
  };
}

interface VehicleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleFormData) => void;
  initialData?: Vehicle;
  isSubmitting?: boolean;
}

const VehicleForm = ({ open, onClose, onSubmit, initialData, isSubmitting = false }: VehicleFormProps) => {
  const [formData, setFormData] = useState<VehicleFormData>({
    plateNumber: '',
    vehicleType: 'car',
    size: 'medium',
    attributes: {
      color: '',
      model: '',
      year: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        plateNumber: initialData.plateNumber,
        vehicleType: initialData.vehicleType,
        size: initialData.size,
        attributes: { ...initialData.attributes },
      });
    } else {
      // Reset form when adding new vehicle
      setFormData({
        plateNumber: '',
        vehicleType: 'car',
        size: 'medium',
        attributes: {
          color: '',
          model: '',
          year: '',
        },
      });
    }
  }, [initialData, open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAttributeChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert year to number if provided
    const yearValue = formData.attributes.year;
    const attributes = {
      ...formData.attributes,
      year: yearValue ? Number(yearValue) : undefined,
    };
    
    onSubmit({
      ...formData,
      attributes,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plate-number">Plate Number</Label>
              <Input
                id="plate-number"
                value={formData.plateNumber}
                onChange={(e) => handleChange('plateNumber', e.target.value)}
                placeholder="ABC-1234"
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
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicle-size">Size</Label>
                <Select
                  value={formData.size}
                  onValueChange={(value) => handleChange('size', value)}
                >
                  <SelectTrigger id="vehicle-size">
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
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={formData.attributes.color || ''}
                onChange={(e) => handleAttributeChange('color', e.target.value)}
                placeholder="Blue"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.attributes.model || ''}
                  onChange={(e) => handleAttributeChange('model', e.target.value)}
                  placeholder="Toyota Corolla"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.attributes.year || ''}
                  onChange={(e) => handleAttributeChange('year', e.target.value)}
                  placeholder="2023"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Add Vehicle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleForm;
