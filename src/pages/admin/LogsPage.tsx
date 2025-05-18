
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import SearchInput from '@/components/shared/SearchInput';
import Pagination from '@/components/shared/Pagination';
import { ActionLog } from '@/types';
import { useListLogsQuery } from '@/store/slices/logApiSlice';
import { toast } from 'sonner';
import { useAppSelector } from '@/store';
import { useNavigate } from 'react-router-dom';

const LogsPage = () => {
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

  // Pagination and search states
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [search, setSearch] = useState('');

  // RTK Query hook
  const { 
    data: logsData, 
    isLoading: isLoadingLogs,
    isFetching: isFetchingLogs,
    error: logsError 
  } = useListLogsQuery({ 
    page: pagination.page, 
    limit: pagination.limit, 
    search: search || undefined 
  }, {
    skip: !isAdmin // Skip the query if user is not admin
  });

  // Derived state
  const loading = isLoadingLogs || isFetchingLogs;
  const logs = logsData?.items || [];
  const totalItems = logsData?.total || 0;
  const totalPages = logsData?.totalPages || 0;

  // Show error toast if logs fetch fails
  useEffect(() => {
    if (logsError) {
      toast.error('Failed to load action logs');
      console.error('Error fetching logs:', logsError);
    }
  }, [logsError]);

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

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  if (!isAdmin) {
    return null; // Don't render anything while redirecting
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Action Logs</h1>
          <p className="text-muted-foreground">
            View system activity and user actions
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <SearchInput
            placeholder="Search logs..."
            value={search}
            onChange={handleSearchChange}
            onSearch={handleSearch}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.userName || `User ID: ${log.userId}`}</TableCell>
                      <TableCell>{formatDateTime(log.timestamp)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
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
      </div>
    </DashboardLayout>
  );
};

export default LogsPage;
