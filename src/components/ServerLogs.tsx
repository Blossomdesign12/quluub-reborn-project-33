
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { triggerServerLogs, triggerUserServerLogs } from '@/utils/serverDebugLogger';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export function ServerLogs() {
  const [isLoading, setIsLoading] = useState(false);
  const [logType, setLogType] = useState<'all' | 'user'>('all');
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFetchLogs = async () => {
    setIsLoading(true);
    try {
      if (logType === 'user' && user?.id) {
        const success = await triggerUserServerLogs(user.id);
        if (success) {
          toast({
            title: "Server Logs Generated",
            description: "User logs have been generated on the server.",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to generate user logs on the server.",
            variant: "destructive",
          });
        }
      } else {
        const success = await triggerServerLogs();
        if (success) {
          toast({
            title: "Server Logs Generated",
            description: "System logs have been generated on the server.",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to generate system logs on the server.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error generating logs:", error);
      toast({
        title: "Error",
        description: "Failed to generate logs on the server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Server Debug Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={(value) => setLogType(value as 'all' | 'user')}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All System Logs</TabsTrigger>
            <TabsTrigger value="user" disabled={!user}>User Specific Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Generate logs for all models in the database. This will log users, chats, relationships, 
              and activity data to the server console.
            </p>
          </TabsContent>
          
          <TabsContent value="user" className="mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Generate logs specific to your user account, including your chats, relationships, 
              and activity data.
            </p>
          </TabsContent>
          
          <Button onClick={handleFetchLogs} disabled={isLoading} className="mt-2">
            {isLoading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" /> Generating Logs...
              </>
            ) : (
              "Generate Server Logs"
            )}
          </Button>
        </Tabs>
      </CardContent>
    </Card>
  );
}
