
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

const VehicleTable = ({ vehicles, onEdit, onDelete }: VehicleTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plate Number</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No vehicles found
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.plateNumber}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {vehicle.vehicleType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {vehicle.size}
                  </Badge>
                </TableCell>
                <TableCell>{vehicle.attributes.color || '-'}</TableCell>
                <TableCell>{vehicle.attributes.model || '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(vehicle)}>
                      ✏️
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(vehicle.id)}>
                      🗑️
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VehicleTable;
