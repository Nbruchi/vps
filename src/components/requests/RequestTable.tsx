
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

interface SlotRequest {
  id: string;
  userId: string;
  vehicleId: string;
  slotId?: string;
  requestStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  vehicle?: Vehicle;
  slot?: ParkingSlot;
  user?: {
    name: string;
    email: string;
  };
}

interface RequestTableProps {
  requests: SlotRequest[];
  onEdit?: (request: SlotRequest) => void;
  onDelete?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isAdmin?: boolean;
}

const RequestTable = ({ 
  requests, 
  onEdit, 
  onDelete, 
  onApprove, 
  onReject, 
  isAdmin = false 
}: RequestTableProps) => {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Type</TableHead>
            {isAdmin && <TableHead>User</TableHead>}
            <TableHead>Requested On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned Slot</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 7 : 6} className="text-center py-8 text-muted-foreground">
                No parking requests found
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.vehicle?.plateNumber || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {request.vehicle?.vehicleType || "N/A"}
                  </Badge>
                </TableCell>
                {isAdmin && (
                  <TableCell>{request.user?.name || "N/A"}</TableCell>
                )}
                <TableCell>{formatDate(request.createdAt)}</TableCell>
                <TableCell>{getStatusBadge(request.requestStatus)}</TableCell>
                <TableCell>{request.slot?.slotNumber || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {request.requestStatus === 'pending' && (
                      <>
                        {onEdit && (
                          <Button variant="ghost" size="sm" onClick={() => onEdit(request)}>
                            ✏️
                          </Button>
                        )}
                        
                        {onDelete && (
                          <Button variant="ghost" size="sm" onClick={() => onDelete(request.id)}>
                            🗑️
                          </Button>
                        )}
                        
                        {isAdmin && onApprove && (
                          <Button variant="ghost" size="sm" onClick={() => onApprove(request.id)}>
                            ✓
                          </Button>
                        )}
                        
                        {isAdmin && onReject && (
                          <Button variant="ghost" size="sm" onClick={() => onReject(request.id)}>
                            ✕
                          </Button>
                        )}
                      </>
                    )}
                    
                    {request.requestStatus !== 'pending' && (
                      <span className="text-xs text-muted-foreground py-1">
                        {request.requestStatus === 'approved' ? 'Approved' : 'Rejected'}
                      </span>
                    )}
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

export default RequestTable;
