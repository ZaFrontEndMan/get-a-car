import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

export const useDashboardAuth = () => {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  // Handle automatic redirect on auth state change
  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // If user is not authenticated and not loading, redirect to signin
    if (!user) {
      console.log("User not authenticated, redirecting to signin");
      // navigate('/signin', { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleLogout = async () => {
    try {
      console.log("Starting logout process...");
      await signOut();
      console.log("Logout successful, redirecting...");
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
      // Force navigation even if logout fails
      navigate("/", { replace: true });
    }
  };

  const getUserDisplayName = () => {
    if (!user) return "User";
    const metadata = user.user_metadata;
    if (metadata?.first_name && metadata?.last_name) {
      return `${metadata.first_name} ${metadata.last_name}`;
    }
    return user.email?.split("@")[0] || "User";
  };

  return {
    user,
    handleLogout,
    getUserDisplayName,
    isLoading,
  };
};
