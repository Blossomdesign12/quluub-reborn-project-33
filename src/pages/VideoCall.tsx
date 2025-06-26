import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, VideoOff } from "lucide-react";

// Use dynamic port matching your server
const SIGNALING_SERVER = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}:${window.location.port}/signaling`;
const ICE_SERVERS = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

const VideoCall = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const conversationId = params.get("conversation");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection>();
  const wsRef = useRef<WebSocket | null>(null);

  const [calling, setCalling] = useState(false);

  // Setup signaling
  useEffect(() => {
    if (!conversationId) return;
    const ws = new WebSocket(`${SIGNALING_SERVER}?conversation=${conversationId}`);

    ws.onopen = () => {
      console.log('WebSocket connected');
      wsRef.current = ws;
    };

    ws.onmessage = async (ev) => {
      const data = JSON.parse(ev.data);
      const pc = pcRef.current;
      if (!pc) return;
      switch (data.type) {
        case 'offer': {
          await pc.setRemoteDescription(new RTCSessionDescription(data.payload));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          sendSignal({ type: 'answer', payload: answer });
          break;
        }
        case 'answer':
          await pc.setRemoteDescription(new RTCSessionDescription(data.payload));
          break;
        case 'candidate':
          await pc.addIceCandidate(new RTCIceCandidate(data.payload));
          break;
      }
    };

    ws.onerror = () => { toast({ title: 'WebSocket Error', description: 'Signaling connection failed', variant: 'destructive' }); };
    ws.onclose = () => console.log('WebSocket closed');

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [conversationId]);

  // Helper to send via WebSocket when open
  const sendSignal = (message: any) => {
    const ws = wsRef.current;
    if (!ws) return;
    const data = JSON.stringify(message);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    } else {
      ws.addEventListener('open', () => ws.send(data), { once: true });
    }
  };

  const startCall = async () => {
    if (!conversationId) return;
    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) sendSignal({ type: 'candidate', payload: candidate });
    };

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
    };

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    } catch (err) {
      toast({ title: 'Error', description: 'Cannot access camera/microphone', variant: 'destructive' });
      return;
    }

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    sendSignal({ type: 'offer', payload: offer });
    setCalling(true);
  };

  const endCall = () => {
    pcRef.current?.getSenders().forEach(s => s.track?.stop());
    pcRef.current?.close();
    pcRef.current = undefined;
    setCalling(false);
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="p-4 flex items-center bg-gray-800">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="ml-4 text-xl font-medium">Video Call</h2>
        {calling && (
          <Button variant="destructive" size="sm" onClick={endCall} className="ml-auto">
            <VideoOff className="h-4 w-4 mr-2" /> End Call
          </Button>
        )}
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2 p-2">
        <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover bg-black rounded" />
        <video ref={remoteVideoRef} autoPlay className="w-full h-full object-cover bg-black rounded" />
      </div>
      {!calling && (
        <div className="p-4 bg-gray-800">
          <Button onClick={startCall} className="w-full">
            Start Call
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
