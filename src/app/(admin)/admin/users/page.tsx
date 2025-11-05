"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Role, ROLE_LABELS } from "@/types/roles";
import { OperationResult, isSuccess } from "@/lib/operation-result";
import AvatarUpload from "@/components/ui/avatar-upload";
import {
  Edit3,
  Shield,
  Trash2,
  Search,
  User,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Crown,
} from "lucide-react";
import { createLogger } from "@/lib/logging";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  avatar: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface EditUserData {
  name?: string;
  email?: string;
  role?: Role;
  password?: string;
}

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<
    UsersResponse["pagination"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Create logger once and memoize it
  const logger = useMemo(
    () => createLogger({ context: "admin-users-page" }),
    []
  );

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditUserData>({});
  const [editLoading, setEditLoading] = useState(false);

  // Password reset modal state
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter && { role: roleFilter }),
      });

      const response = await fetch(`/api/users?${params}`);
      const result: OperationResult<UsersResponse> = await response.json();

      if (isSuccess(result)) {
        setUsers(result.data.users);
        setPagination(result.data.pagination);
      } else {
        logger.error("Failed to fetch users", {
          err: result.error,
          page: currentPage,
          searchTerm,
          roleFilter,
        });
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      logger.error("Network error fetching users", {
        err: error,
        page: currentPage,
        searchTerm,
        roleFilter,
      });
      toast.error(`Network error: ${error}`);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, roleFilter, logger]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email,
      role: user.role,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    try {
      setEditLoading(true);
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const result: OperationResult<{ user: User }> = await response.json();

      if (isSuccess(result)) {
        await fetchUsers();
        setEditModalOpen(false);
        setSelectedUser(null);
        setEditForm({});
      } else {
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      logger.error("Error updating user", {
        err: error,
        userId: selectedUser.id,
        editForm,
      });
      toast.error("Failed to update user");
    } finally {
      setEditLoading(false);
    }
  };

  const handleResetPassword = (user: User) => {
    setResetPasswordUser(user);
    setNewPassword("");
    setResetPasswordModalOpen(true);
  };

  const handleSavePasswordReset = async () => {
    if (!resetPasswordUser || !newPassword.trim()) return;

    try {
      setResetLoading(true);
      const response = await fetch(`/api/users/${resetPasswordUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      const result: OperationResult<{ user: User }> = await response.json();

      if (isSuccess(result)) {
        setResetPasswordModalOpen(false);
        setResetPasswordUser(null);
        setNewPassword("");
        toast.success("Password reset successfully");
      } else {
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      logger.error("Error resetting password", {
        err: error,
        userId: resetPasswordUser.id,
      });
      toast.error("Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.name || user.email}?`))
      return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });

      const result: OperationResult<{ deleted: boolean }> =
        await response.json();

      if (isSuccess(result)) {
        await fetchUsers();
      } else {
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      logger.error("Error deleting user", {
        err: error,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      });
      toast.error("Failed to delete user");
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-6"></div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="h-4 bg-muted rounded w-32"></div>
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-4 bg-muted rounded w-20"></div>
                </div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex justify-between py-4">
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-4 bg-muted rounded w-48"></div>
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-4 bg-muted rounded w-20"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          User Management
        </h1>
        <p className="text-muted-foreground">
          Manage user accounts, roles, and permissions
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="">All Roles</option>
              {Object.values(Role).map(role => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    Name
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Crown size={16} />
                    Role
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    Status
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Joined
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <AvatarUpload
                        size={32}
                        showUpload={false}
                        userId={user.id}
                        userAvatar={user.avatar}
                        userName={user.name}
                        className=""
                      />
                      <span>{user.name || "No name"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                        user.role === Role.ADMIN
                          ? "bg-destructive/10 text-destructive"
                          : user.role === Role.MODERATOR
                            ? "bg-warning/10 text-warning"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {user.role === Role.ADMIN && <Crown size={12} />}
                      {user.role === Role.MODERATOR && <Shield size={12} />}
                      {user.role === Role.USER && <User size={12} />}
                      {ROLE_LABELS[user.role]}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.emailVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-success/10 text-success">
                        <CheckCircle size={12} />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground">
                        <XCircle size={12} />
                        Unverified
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-muted-foreground" />
                      <span>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        disabled={user.id === session?.user?.id}
                        title="Edit user details"
                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:border-primary/20"
                      >
                        <Edit3 size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetPassword(user)}
                        title="Reset user password"
                        className="h-8 w-8 p-0 hover:bg-warning/10 hover:border-warning/20 hover:text-warning"
                      >
                        <Shield size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                        disabled={user.id === session?.user?.id}
                        title="Delete user"
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={!pagination.hasPrev}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 py-2 text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={!pagination.hasNext}
          >
            Next
          </Button>
        </div>
      )}

      {/* Edit User Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Name
              </label>
              <Input
                value={editForm.name || ""}
                onChange={e =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="User's full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <Input
                type="email"
                value={editForm.email || ""}
                onChange={e =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Role
              </label>
              <select
                value={editForm.role || Role.USER}
                onChange={e =>
                  setEditForm({ ...editForm, role: e.target.value as Role })
                }
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {Object.values(Role).map(role => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={editLoading}>
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog
        open={resetPasswordModalOpen}
        onOpenChange={setResetPasswordModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for this user account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Reset password for{" "}
              {resetPasswordUser?.name || resetPasswordUser?.email}
            </p>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                New Password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResetPasswordModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePasswordReset}
              disabled={resetLoading || !newPassword.trim()}
            >
              {resetLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
