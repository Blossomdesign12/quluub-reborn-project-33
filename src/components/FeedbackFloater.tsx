
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FeedbackFloater = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) return;
    
    try {
      setIsSending(true);
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Feedback sent",
        description: "Thank you for your feedback!",
      });
      
      setFeedback("");
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <div className="bg-background border rounded-lg shadow-lg p-4 w-80">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Send Feedback</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder="Share your thoughts or report an issue..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px] mb-3"
              disabled={isSending}
            />
            
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSending || !feedback.trim()}
              >
                {isSending ? "Sending..." : "Send"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FeedbackFloater;
