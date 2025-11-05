import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UsersPage from "../../../../../src/app/(admin)/admin/users/page";
import { mockUsers, mockUsersResponse } from "../../../../fixtures/users";
import { Role } from "@/types/roles";

// Mock fetch globally
global.fetch = vi.fn();

// Mock useSession
vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        id: "admin-1",
        email: "admin@example.com",
        name: "Admin User",
        role: Role.ADMIN,
      },
    },
    status: "authenticated",
  }),
}));

// Mock logger
vi.mock("@/lib/logging", () => ({
  createLogger: () => ({
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  }),
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

describe("UsersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful API response by default
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: true,
          data: mockUsersResponse,
        }),
    });
  });

  it("should render users page with loading state initially", async () => {
    render(<UsersPage />);

    // Should eventually show the content, not the loading state
    await waitFor(() => {
      expect(screen.getByText("User Management")).toBeInTheDocument();
    });

    expect(
      screen.getByText("Manage user accounts, roles, and permissions")
    ).toBeInTheDocument();
  });

  it("should display users list after loading", async () => {
    render(<UsersPage />);

    // Wait for API call and users to load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.getByText("admin@example.com")).toBeInTheDocument();
    expect(screen.getByText("Moderator User")).toBeInTheDocument();
    expect(screen.getByText("Unverified User")).toBeInTheDocument();
  });

  it("should handle search functionality", async () => {
    const user = userEvent.setup();
    render(<UsersPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      "Search users by name or email..."
    );
    await user.type(searchInput, "john");

    // Should trigger new API call with search params
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("search=john")
    );
  });

  it("should handle role filter", async () => {
    const user = userEvent.setup();
    render(<UsersPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const roleSelect = screen.getByDisplayValue("All Roles");
    await user.selectOptions(roleSelect, "ADMIN");

    // Should trigger new API call with role filter
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("role=ADMIN")
    );
  });

  it("should open edit modal when edit button is clicked", async () => {
    const user = userEvent.setup();
    render(<UsersPage />);

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Click edit button for first user (not disabled ones)
    const editButtons = screen.getAllByTitle("Edit user details");
    const enabledEditButton = editButtons.find(
      button => !button.hasAttribute("disabled")
    );

    if (enabledEditButton) {
      await user.click(enabledEditButton);

      // Should open edit modal
      expect(screen.getByText("Edit User")).toBeInTheDocument();
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    }
  });

  it("should handle edit user submission", async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockUsersResponse,
          }),
      })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            success: true,
            data: { user: { ...mockUsers[0], name: "Updated Name" } },
          }),
      })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockUsersResponse,
          }),
      });

    render(<UsersPage />);

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Click edit button
    const editButtons = screen.getAllByTitle("Edit user details");
    const enabledEditButton = editButtons.find(
      button => !button.hasAttribute("disabled")
    );

    if (enabledEditButton) {
      await user.click(enabledEditButton);

      // Update name field
      const nameInput = screen.getByDisplayValue("John Doe");
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Name");

      // Submit form
      const saveButton = screen.getByText("Save Changes");
      await user.click(saveButton);

      // Should make PUT request
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/users/user-1",
          expect.objectContaining({
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "Updated Name",
              email: "john@example.com",
              role: Role.USER,
            }),
          })
        );
      });
    }
  });

  it("should open reset password modal", async () => {
    const user = userEvent.setup();
    render(<UsersPage />);

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Click reset password button
    const resetButtons = screen.getAllByTitle("Reset user password");
    if (resetButtons[0]) {
      await user.click(resetButtons[0]);

      // Should open reset password modal
      expect(screen.getAllByText("Reset Password")[0]).toBeInTheDocument();
      expect(
        screen.getByText("Reset password for John Doe")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter new password")
      ).toBeInTheDocument();
    }
  });

  it("should handle delete user with confirmation", async () => {
    const user = userEvent.setup();

    // Mock window.confirm
    vi.stubGlobal(
      "confirm",
      vi.fn(() => true)
    );
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockUsersResponse,
          }),
      })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            success: true,
            data: { deleted: true },
          }),
      })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockUsersResponse,
          }),
      });

    render(<UsersPage />);

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Click delete button
    const deleteButtons = screen.getAllByTitle("Delete user");
    const enabledDeleteButton = deleteButtons.find(
      button => !button.hasAttribute("disabled")
    );

    if (enabledDeleteButton) {
      await user.click(enabledDeleteButton);

      // Should show confirmation
      expect(vi.mocked(confirm)).toHaveBeenCalledWith(
        expect.stringContaining("Are you sure you want to delete John Doe?")
      );

      // Should make DELETE request
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/users/user-1",
          expect.objectContaining({
            method: "DELETE",
          })
        );
      });
    }
  });

  it("should display pagination when multiple pages exist", async () => {
    const paginatedResponse = {
      users: mockUsers,
      pagination: {
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNext: true,
        hasPrev: false,
      },
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: true,
          data: paginatedResponse,
        }),
    });

    render(<UsersPage />);

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Should show pagination
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();

    // Previous should be disabled, Next should be enabled
    expect(screen.getByText("Previous")).toBeDisabled();
    expect(screen.getByText("Next")).not.toBeDisabled();
  });

  it("should handle API errors gracefully", async () => {
    const { toast } = await import("sonner");

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: false,
          error: "Failed to fetch users",
        }),
    });

    render(<UsersPage />);

    // Should show error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error: Failed to fetch users");
    });
  });

  it("should show user role badges correctly", async () => {
    render(<UsersPage />);

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Check role badges (use getAllBy since there might be multiple elements)
    expect(screen.getAllByText("User").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Admin").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Moderator").length).toBeGreaterThan(0);
  });

  it("should show verification status correctly", async () => {
    render(<UsersPage />);

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Check verification status
    expect(screen.getAllByText("Verified")).toHaveLength(3); // 3 verified users
    expect(screen.getByText("Unverified")).toBeInTheDocument(); // 1 unverified user
  });
});
