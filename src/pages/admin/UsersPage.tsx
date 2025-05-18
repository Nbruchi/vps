
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SearchInput from '@/components/shared/SearchInput';
import Pagination from '@/components/shared/Pagination';
import DeleteConfirmation from '@/components/shared/DeleteConfirmation';
import { User, PaginationParams } from '@/types';
import { getUsers } from '@/services/userService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  
  // Redirect non-admin users
  useEffect(() => {
    if (user && !isAdmin) {
      navigate('/dashboard');
      toast.error('You do not have permission to access this page');
    }
  }, [user, isAdmin, navigate]);
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Pagination and search states
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState('');
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: PaginationParams = {
        page: pagination.page,
        limit: pagination.limit,
        search: search || undefined,
      };
      
      const response = await getUsers(params);
      setUsers(response.items);
      setPagination({
        ...pagination,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, pagination.page, pagination.limit]);
  
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
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pageSize),
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
    fetchUsers();
  };
  
  const handleDelete = (id: string) => {
    // In a real application, you would implement proper user deletion
    // For this demo, we'll just show a notification
    toast.info('User deletion is disabled in this demo');
  };

  if (!isAdmin) {
    return null; // Don't render anything while redirecting
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage system users and their roles
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <SearchInput
            placeholder="Search users..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'outline'} className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          disabled={user.id === '1'} // Prevent deleting the main admin
                        >
                          View Details
                        </Button>
                      </TableCell>
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
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            pageSize={pagination.limit}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
