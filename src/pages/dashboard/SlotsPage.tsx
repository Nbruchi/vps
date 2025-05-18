
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import SlotTable from '@/components/slots/SlotTable';
import SlotForm from '@/components/slots/SlotForm';
import BulkSlotForm from '@/components/slots/BulkSlotForm';
import DeleteConfirmation from '@/components/shared/DeleteConfirmation';
import SearchInput from '@/components/shared/SearchInput';
import Pagination from '@/components/shared/Pagination';
import { Button } from '@/components/ui/button';
import { 
  ParkingSlot, 
  SlotFormData, 
  BulkSlotFormData,
  PaginationParams 
} from '@/types';
import { useAppSelector } from '@/store';
import {
  useListSlotsQuery,
  useCreateSlotMutation,
  useUpdateSlotMutation,
  useDeleteSlotMutation,
  useCreateBulkSlotsMutation
} from '@/store/slices/parkingSlotApiSlice';
import { Plus, ListPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const SlotsPage = () => {
  const { role } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const isAdmin = role === 'admin';

  // Redirect non-admin users
  useEffect(() => {
    if (role && role !== 'admin') {
      navigate('/dashboard');
      toast.error('You do not have permission to access this page');
    }
  }, [role, navigate]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkFormOpen, setIsBulkFormOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);

  // Pagination and search states
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [search, setSearch] = useState('');

  // RTK Query hooks
  const { 
    data: slotsData, 
    isLoading: isLoadingSlots,
    isFetching: isFetchingSlots,
    error: slotsError 
  } = useListSlotsQuery({ 
    page: pagination.page, 
    limit: pagination.limit, 
    search: search || undefined,
    showUnavailable: true // Get all slots (including unavailable ones)
  }, {
    skip: !isAdmin // Skip the query if user is not admin
  });

  const [createSlot, { isLoading: isCreating }] = useCreateSlotMutation();
  const [updateSlot, { isLoading: isUpdating }] = useUpdateSlotMutation();
  const [deleteSlot, { isLoading: isDeleting }] = useDeleteSlotMutation();
  const [createBulkSlots, { isLoading: isCreatingBulk }] = useCreateBulkSlotsMutation();

  // Derived state
  const isSubmitting = isCreating || isUpdating || isCreatingBulk;
  const loading = isLoadingSlots || isFetchingSlots;
  const slots = slotsData?.items || [];
  const totalItems = slotsData?.total || 0;
  const totalPages = slotsData?.totalPages || 0;

  // Show error toast if slots fetch fails
  useEffect(() => {
    if (slotsError) {
      toast.error('Failed to load parking slots');
      console.error('Error fetching parking slots:', slotsError);
    }
  }, [slotsError]);

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
    setSelectedSlot(undefined);
    setIsFormOpen(true);
  };

  const handleBulkAdd = () => {
    setIsBulkFormOpen(true);
  };

  const handleEdit = (slot: ParkingSlot) => {
    setSelectedSlot(slot);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setSlotToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!slotToDelete) return;

    try {
      await deleteSlot(slotToDelete).unwrap();
      toast.success('Parking slot deleted successfully');
      setIsDeleteModalOpen(false);
      setSlotToDelete(null);
    } catch (error) {
      console.error('Error deleting parking slot:', error);
      toast.error('Failed to delete parking slot');
    }
  };

  const handleFormSubmit = async (data: SlotFormData) => {
    try {
      if (selectedSlot) {
        // Update existing slot
        await updateSlot({ id: selectedSlot.id, data }).unwrap();
        toast.success('Parking slot updated successfully');
      } else {
        // Add new slot
        await createSlot(data).unwrap();
        toast.success('Parking slot added successfully');
      }

      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving parking slot:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save parking slot');
    }
  };

  const handleBulkFormSubmit = async (data: BulkSlotFormData) => {
    try {
      const newSlots = await createBulkSlots(data).unwrap();
      toast.success(`${newSlots.length} parking slots added successfully`);
      setIsBulkFormOpen(false);
    } catch (error) {
      console.error('Error adding bulk parking slots:', error);
      toast.error('Failed to add parking slots');
    }
  };

  if (!isAdmin) {
    return null; // Don't render anything while redirecting
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Parking Slots</h1>
          <p className="text-muted-foreground">
            Manage parking slots and their availability.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <SearchInput
            placeholder="Search slots..."
            value={search}
            onChange={handleSearchChange}
            onSearch={handleSearch}
          />

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button onClick={handleAdd} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Slot
            </Button>
            <Button onClick={handleBulkAdd} variant="outline" className="w-full sm:w-auto">
              <ListPlus className="mr-2 h-4 w-4" />
              Bulk Add
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <SlotTable
            slots={slots}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isAdmin={true}
          />
        )}

        {!loading && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            pageSize={pagination.limit}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}

        <SlotForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={selectedSlot}
          isSubmitting={isSubmitting}
        />

        <BulkSlotForm
          open={isBulkFormOpen}
          onClose={() => setIsBulkFormOpen(false)}
          onSubmit={handleBulkFormSubmit}
          isSubmitting={isSubmitting}
        />

        <DeleteConfirmation
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={confirmDelete}
          title="Delete Parking Slot"
          description="Are you sure you want to delete this parking slot? This action cannot be undone."
          isDeleting={isDeleting}
        />
      </div>
    </DashboardLayout>
  );
};

export default SlotsPage;
