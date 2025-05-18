
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

interface SlotTableProps {
  slots: ParkingSlot[];
  onEdit: (slot: ParkingSlot) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

const SlotTable = ({ slots, onEdit, onDelete, isAdmin = false }: SlotTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Slot Number</TableHead>
            <TableHead>Vehicle Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            {isAdmin && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {slots.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 6 : 5} className="text-center py-8 text-muted-foreground">
                No parking slots found
              </TableCell>
            </TableRow>
          ) : (
            slots.map((slot) => (
              <TableRow key={slot.id}>
                <TableCell className="font-medium">{slot.slotNumber}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {slot.vehicleType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {slot.size}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">{slot.location}</TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={
                      slot.status === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }
                  >
                    {slot.status}
                  </Badge>
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(slot)}>
                        ✏️
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onDelete(slot.id)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SlotTable;
