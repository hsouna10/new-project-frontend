import { useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, Save, X, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ReportScannerProps {
    onSave: (imageDataUrl: string) => void;
    onCancel: () => void;
}

export function ReportScanner({ onSave, onCancel }: ReportScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' } // Prefer back camera on mobile
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
                setError(null);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Impossible d'accéder à la caméra. Vérifiez les autorisations.");
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsStreaming(false);
        }
    }, []);

    const captureImage = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                setCapturedImage(imageDataUrl);
                stopCamera();
            }
        }
    }, [stopCamera]);

    const handleRetake = () => {
        setCapturedImage(null);
        startCamera();
    };

    const handleSave = () => {
        if (capturedImage) {
            onSave(capturedImage);
        }
    };

    // Start camera on mount
    useState(() => {
        startCamera();
    });

    // Clean up on unmount
    useState(() => {
        return () => stopCamera();
    });

    return (
        <Card className="p-4 max-w-2xl mx-auto bg-black/90 text-white border-0">
            <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden mb-4">
                {error ? (
                    <div className="flex items-center justify-center h-full text-red-400 p-4 text-center">
                        {error}
                    </div>
                ) : !capturedImage ? (
                    <>
                        {/* Camera Preview */}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                            onLoadedMetadata={() => videoRef.current?.play()}
                        />
                        <div className="absolute inset-0 border-2 border-white/20 pointer-events-none">
                            {/* Guidelines */}
                            <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20"></div>
                            <div className="absolute top-2/3 left-0 right-0 h-px bg-white/20"></div>
                            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20"></div>
                            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/20"></div>
                        </div>
                    </>
                ) : (
                    /* Captured Image Preview */
                    <img src={capturedImage} alt="Captured Report" className="w-full h-full object-contain" />
                )}

                {/* Hidden Canvas for Capture */}
                <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex justify-between items-center gap-4">
                <Button variant="ghost" onClick={onCancel} className="text-white hover:bg-white/20">
                    <X className="w-6 h-6 mr-2" />
                    Annuler
                </Button>

                {!capturedImage ? (
                    <Button
                        size="lg"
                        className="rounded-full h-16 w-16 p-0 border-4 border-white bg-transparent hover:bg-white/20"
                        onClick={captureImage}
                        disabled={!!error}
                    >
                        <div className="w-12 h-12 bg-white rounded-full"></div>
                    </Button>
                ) : (
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={handleRetake} className="bg-transparent text-white hover:bg-white/20 border-white/50">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reprendre
                        </Button>
                        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                            <Save className="w-4 h-4 mr-2" />
                            Sauvegarder
                        </Button>
                    </div>
                )}

                {/* Spacer logic if needed */}
                <div className="w-20"></div>
            </div>
        </Card>
    );
}
