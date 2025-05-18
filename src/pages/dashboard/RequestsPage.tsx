
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import RequestTable from '@/components/requests/RequestTable';
import RequestForm from '@/components/requests/RequestForm';
import DeleteConfirmation from '@/components/shared/DeleteConfirmation';
import SearchInput from '@/components/shared/SearchInput';
import Pagination from '@/components/shared/Pagination';
import { Button } from '@/components/ui/button';
import { 
  SlotRequest, 
  SlotRequestFormData,
  PaginationParams
} from '@/types';
import { useAppSelector } from '@/store';
import {
  useListRequestsQuery,
  useCreateRequestMutation,
  useUpdateRequestMutation,
  useDeleteRequestMutation, UpdateSlotRequestPayload
} from '@/store/slices/slotRequestApiSlice';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const RequestsPage = () => {
  const { userId, role } = useAppSelector((state) => state.auth);
  const isAdmin = role === 'admin';

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SlotRequest | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

  // Pagination and search states
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [search, setSearch] = useState('');

  // RTK Query hooks
  const { 
    data: requestsData, 
    isLoading: isLoadingRequests,
    isFetching: isFetchingRequests,
    error: requestsError 
  } = useListRequestsQuery({ 
    page: pagination.page, 
    limit: pagination.limit, 
    search: search || undefined 
  }, {
    skip: !userId
  });

  const [createRequest, { isLoading: isCreating }] = useCreateRequestMutation();
  const [updateRequest, { isLoading: isUpdating }] = useUpdateRequestMutation();
  const [deleteRequest, { isLoading: isDeleting }] = useDeleteRequestMutation();

  // Derived state
  const isSubmitting = isCreating || isUpdating;
  const isProcessing = isUpdating;
  const loading = isLoadingRequests || isFetchingRequests;
  const requests = requestsData?.items || [];
  const totalItems = requestsData?.total || 0;
  const totalPages = requestsData?.totalPages || 0;

  // Show error toast if requests fetch fails
  useEffect(() => {
    if (requestsError) {
      toast.error('Failed to load slot requests');
      console.error('Error fetching slot requests:', requestsError);
    }
  }, [requestsError]);

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
    setSelectedRequest(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (request: SlotRequest) => {
    setSelectedRequest(request);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setRequestToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!requestToDelete) return;

    try {
      await deleteRequest(requestToDelete).unwrap();
      toast.success('Request deleted successfully');
      setIsDeleteModalOpen(false);
      setRequestToDelete(null);
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request');
    }
  };

  const handleCreate = async (data: SlotRequestFormData) => {
    if (!userId) return;

    try {
        await createRequest({
          vehicleId: data.vehicleId 
        }).unwrap();
        toast.success('Request submitted successfully');

      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving request:', error);
      toast.error('Failed to save request');
    }
  };

  const handleUpdate = async (id: string, data: UpdateSlotRequestPayload) => {
    if (!userId) return;

    try{
      await updateRequest({
        id: selectedRequest.id,
        data
      }).unwrap();
      toast.success('Request updated successfully');
    }catch (error){
      console.error('Error updating request:', error);
      toast.error('Failed to update request');
    }
  }

  const handleFormSubmit = selectedRequest ? handleUpdate : handleCreate;

  const handleApprove = async (id: string) => {
    try {
      await updateRequest({ 
        id, 
        data: { status: 'approved' } 
      }).unwrap();
      toast.success('Request approved successfully');
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateRequest({ 
        id, 
        data: { status: 'rejected' } 
      }).unwrap();
      toast.success('Request rejected');
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Parking Requests</h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? 'Manage parking slot requests from users'
              : 'Request a parking slot for your vehicle'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <SearchInput
            placeholder="Search requests..."
            value={search}
            onChange={handleSearchChange}
            onSearch={handleSearch}
          />

          {!isAdmin && (
            <Button onClick={handleAdd} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <RequestTable
            requests={requests}
            onEdit={!isAdmin ? handleEdit : undefined}
            onDelete={!isAdmin ? handleDelete : undefined}
            onApprove={isAdmin ? handleApprove : undefined}
            onReject={isAdmin ? handleReject : undefined}
            isAdmin={isAdmin}
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

        {!isAdmin && (
          <RequestForm
            open={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
            initialData={selectedRequest ? { vehicleId: selectedRequest.vehicleId } : undefined}
            userId={userId || ''}
            isSubmitting={isSubmitting}
          />
        )}

        <DeleteConfirmation
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={confirmDelete}
          title="Delete Request"
          description="Are you sure you want to delete this parking request? This action cannot be undone."
          isDeleting={isDeleting}
        />
      </div>
    </DashboardLayout>
  );
};

export default RequestsPage;
