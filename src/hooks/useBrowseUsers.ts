
import { useState, useEffect } from 'react';
import { userService } from '@/lib/api-client';
import { User } from '@/types/user';
import { useToast } from '@/components/ui/use-toast';

interface UseBrowseUsersParams {
  country?: string;
  nationality?: string;
}

export const useBrowseUsers = (params: UseBrowseUsersParams = {}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const fetchedUsers = await userService.getBrowseUsers(params);
        console.log("Fetched browse users:", fetchedUsers);
        setUsers(fetchedUsers);
      } catch (err) {
        console.error("Failed to fetch browse users:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch users'));
        toast({
          title: "Error",
          description: "Failed to load potential spouses. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [params.country, params.nationality, toast]);

  return { users, isLoading, error };
};
