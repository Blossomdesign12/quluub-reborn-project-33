
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Video, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";

interface VideoCallProps {
  userId: string;
  onEndCall: () => void;
  username: string;
  timeLimit?: number; // Time limit in seconds
}

const VideoCall = ({ userId, onEndCall, username, timeLimit = 300 }: VideoCallProps) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  
  // Mock connection setup (in a real app, this would use WebRTC)
  useEffect(() => {
    // Simulate connection delay
    const timer = setTimeout(() => {
      setIsConnecting(false);
      toast({
        title: "Call Connected",
        description: `You are now in a call with ${username}`,
      });
      
      // Get local video stream (would be real WebRTC in production)
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
            
            // For demo, we're using the same stream as remote video
            // In a real app, this would come from the peer connection
            if (remoteVideoRef.current) {
              // This is just for demonstration
              // In a real app, you'd have separate streams
              setTimeout(() => {
                if (remoteVideoRef.current) {
                  remoteVideoRef.current.srcObject = stream;
                }
              }, 1000);
            }
          })
          .catch((err) => {
            console.error("Error accessing media devices:", err);
            toast({
              title: "Camera Access Error",
              description: "Unable to access your camera or microphone",
              variant: "destructive",
            });
            onEndCall();
          });
      }
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      // Clean up video streams
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [userId, username, toast, onEndCall]);
  
  // Timer countdown for call limit
  useEffect(() => {
    if (!isConnecting && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            toast({
              title: "Call Time Limit Reached",
              description: "Your 5-minute call has ended",
            });
            onEndCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isConnecting, timeLeft, toast, onEndCall]);
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    // In a real app, you would mute the audio track
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTracks = (localVideoRef.current.srcObject as MediaStream).getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted; // We're toggling the current state
      });
    }
  };
  
  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    
    // In a real app, you would disable the video track
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTracks = (localVideoRef.current.srcObject as MediaStream).getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = isVideoOff; // We're toggling the current state
      });
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>
            Call with {username}
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {formatTime(timeLeft)}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative bg-black aspect-video w-full">
          {isConnecting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/80">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
              <p>Connecting to {username}...</p>
            </div>
          )}
          
          {/* Remote video (full size) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted={false}
            className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
          />
          
          {/* Local video (picture-in-picture) */}
          <div className="absolute bottom-4 right-4 w-1/4 aspect-video border-2 border-primary rounded overflow-hidden shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between p-4">
        <div className="flex gap-2">
          <Button
            variant={isMuted ? "destructive" : "outline"}
            size="icon"
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <Button
            variant={isVideoOff ? "destructive" : "outline"}
            size="icon"
            onClick={toggleVideo}
            title={isVideoOff ? "Turn video on" : "Turn video off"}
          >
            {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </Button>
        </div>
        
        <Button
          variant="destructive"
          onClick={onEndCall}
          className="px-6"
        >
          <PhoneOff className="h-5 w-5 mr-2" /> End Call
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VideoCall;
