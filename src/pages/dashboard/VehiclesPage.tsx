
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import VehicleTable from '@/components/vehicles/VehicleTable';
import VehicleForm from '@/components/vehicles/VehicleForm';
import DeleteConfirmation from '@/components/shared/DeleteConfirmation';
import SearchInput from '@/components/shared/SearchInput';
import Pagination from '@/components/shared/Pagination';
import { Button } from '@/components/ui/button';
import { Vehicle, VehicleFormData } from '@/types';
import { useAppSelector } from '@/store';
import { 
  useListVehiclesQuery, 
  useCreateVehicleMutation, 
  useUpdateVehicleMutation, 
  useDeleteVehicleMutation 
} from '@/store/slices/vehiclesApiSlice';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const VehiclesPage = () => {
  const { userId, role } = useAppSelector((state) => state.auth);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  // Pagination and search states
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [search, setSearch] = useState('');

  // RTK Query hooks
  const { 
    data: vehiclesData, 
    isLoading: isLoadingVehicles,
    isFetching: isFetchingVehicles,
    error: vehiclesError 
  } = useListVehiclesQuery({ 
    page: pagination.page, 
    limit: pagination.limit, 
    search: search || undefined 
  });

  const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation();
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();
  const [deleteVehicle, { isLoading: isDeleting }] = useDeleteVehicleMutation();

  // Derived state
  const isSubmitting = isCreating || isUpdating;
  const loading = isLoadingVehicles || isFetchingVehicles;
  const vehicles = vehiclesData?.items || [];
  const totalItems = vehiclesData?.total || 0;
  const totalPages = vehiclesData?.totalPages || 0;

  // Show error toast if vehicles fetch fails
  useEffect(() => {
    if (vehiclesError) {
      toast.error('Failed to load vehicles');
      console.error('Error fetching vehicles:', vehiclesError);
    }
  }, [vehiclesError]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination({
      page: 1,
      limit: pageSize,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSearch = () => {
    setPagination((prev) => ({
      ...prev,
      page: 1, // Reset to first page on search
    }));
  };

  const handleAdd = () => {
    setSelectedVehicle(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setVehicleToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!vehicleToDelete) return;

    try {
      await deleteVehicle(vehicleToDelete).unwrap();
      toast.success('Vehicle deleted successfully');
      setIsDeleteModalOpen(false);
      setVehicleToDelete(null);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to delete vehicle');
    }
  };

  const handleFormSubmit = async (data: VehicleFormData) => {
    if (!userId) return;

    try {
      if (selectedVehicle) {
        // Update existing vehicle
        await updateVehicle({ id: selectedVehicle.id, data }).unwrap();
        toast.success('Vehicle updated successfully');
      } else {
        // Add new vehicle
        await createVehicle(data).unwrap();
        toast.success('Vehicle added successfully');
      }

      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save vehicle');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground">
            Manage your registered vehicles and their details.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <SearchInput
            placeholder="Search vehicles..."
            value={search}
            onChange={handleSearchChange}
            onSearch={handleSearch}
          />

          <Button onClick={handleAdd} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <VehicleTable
            vehicles={vehicles}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {!loading && (
          <Pagination
            currentPage={pagination.page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pagination.limit}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}

        <VehicleForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={selectedVehicle}
          isSubmitting={isSubmitting}
        />

        <DeleteConfirmation
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={confirmDelete}
          title="Delete Vehicle"
          description="Are you sure you want to delete this vehicle? This action cannot be undone, and any active parking requests for this vehicle will also be deleted."
          isDeleting={isDeleting}
        />
      </div>
    </DashboardLayout>
  );
};

export default VehiclesPage;
