"use client";

import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Check,
  Download,
  Share,
  RotateCw,
  X,
  Shield,
} from "lucide-react";
import { incrementTeamCount } from "@/actions/team";
import { DELAY_GENERATE } from "@/lib/constants";

interface ImageUploaderProps {
  onImageProcessed?: (resultImageUrl: string) => void;
  placeholderImage?: string;
  slug: string;
}

interface ImagePosition {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotation: number;
}

export function ImageUploader({
  onImageProcessed,
  placeholderImage,
  slug,
}: ImageUploaderProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [position, setPosition] = useState<ImagePosition>({
    x: 50,
    y: 50,
    scale: 0.8,
    opacity: 1.0,
    rotation: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleImageFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));

    if (imageFile) {
      handleImageFile(imageFile);
    }
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const processImage = async () => {
    if (!uploadedImage) return;

    incrementTeamCount(slug);
    setIsProcessing(true);

    try {
      // Add hardcoded delay for trust/processing feel
      await new Promise((resolve) => setTimeout(resolve, DELAY_GENERATE));

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", {
        alpha: true,
        willReadFrequently: true,
        desynchronized: true,
      });

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      const placeholderImg = new window.Image();
      placeholderImg.crossOrigin = "anonymous";
      placeholderImg.src = placeholderImage || "";

      await new Promise((resolve) => {
        placeholderImg.onload = resolve;
      });

      const scaleFactor = 3;
      canvas.width = placeholderImg.width * scaleFactor;
      canvas.height = placeholderImg.height * scaleFactor;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.scale(scaleFactor, scaleFactor);

      ctx.drawImage(
        placeholderImg,
        0,
        0,
        placeholderImg.width,
        placeholderImg.height,
      );

      const uploadedImg = new window.Image();
      uploadedImg.crossOrigin = "anonymous";
      uploadedImg.src = uploadedImage;

      await new Promise((resolve) => {
        uploadedImg.onload = resolve;
      });

      const baseScale = Math.min(
        placeholderImg.width / uploadedImg.width,
        placeholderImg.height / uploadedImg.height,
      );
      const finalScale = baseScale * position.scale;
      const newWidth = uploadedImg.width * finalScale;
      const newHeight = uploadedImg.height * finalScale;

      const x = placeholderImg.width * (position.x / 100) - newWidth / 2;
      const y = placeholderImg.height * (position.y / 100) - newHeight / 2;

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = position.opacity;

      if (position.rotation !== 0) {
        ctx.save();
        ctx.translate(x + newWidth / 2, y + newHeight / 2);
        ctx.rotate((position.rotation * Math.PI) / 180);
        ctx.drawImage(
          uploadedImg,
          -newWidth / 2,
          -newHeight / 2,
          newWidth,
          newHeight,
        );
        ctx.restore();
      } else {
        ctx.drawImage(uploadedImg, x, y, newWidth, newHeight);
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1.0;

      const resultDataUrl = canvas.toDataURL("image/png", 1.0);
      setResultImage(resultDataUrl);

      if (onImageProcessed) {
        onImageProcessed(resultDataUrl);
      }
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Live update result image when controls change
  useEffect(() => {
    if (resultImage && uploadedImage) {
      const timeoutId = setTimeout(() => {
        processImageSilently();
      }, 150); // Small debounce for smooth interaction

      return () => clearTimeout(timeoutId);
    }
  }, [position, resultImage, uploadedImage]);

  const processImageSilently = async () => {
    if (!uploadedImage || !resultImage) return;

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", {
        alpha: true,
        willReadFrequently: true,
        desynchronized: true,
      });

      if (!ctx) return;

      const placeholderImg = new window.Image();
      placeholderImg.crossOrigin = "anonymous";
      placeholderImg.src = placeholderImage || "";

      await new Promise((resolve) => {
        placeholderImg.onload = resolve;
      });

      const scaleFactor = 3;
      canvas.width = placeholderImg.width * scaleFactor;
      canvas.height = placeholderImg.height * scaleFactor;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.scale(scaleFactor, scaleFactor);

      ctx.drawImage(
        placeholderImg,
        0,
        0,
        placeholderImg.width,
        placeholderImg.height,
      );

      const uploadedImg = new window.Image();
      uploadedImg.crossOrigin = "anonymous";
      uploadedImg.src = uploadedImage;

      await new Promise((resolve) => {
        uploadedImg.onload = resolve;
      });

      const baseScale = Math.min(
        placeholderImg.width / uploadedImg.width,
        placeholderImg.height / uploadedImg.height,
      );
      const finalScale = baseScale * position.scale;
      const newWidth = uploadedImg.width * finalScale;
      const newHeight = uploadedImg.height * finalScale;

      const x = placeholderImg.width * (position.x / 100) - newWidth / 2;
      const y = placeholderImg.height * (position.y / 100) - newHeight / 2;

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = position.opacity;

      if (position.rotation !== 0) {
        ctx.save();
        ctx.translate(x + newWidth / 2, y + newHeight / 2);
        ctx.rotate((position.rotation * Math.PI) / 180);
        ctx.drawImage(
          uploadedImg,
          -newWidth / 2,
          -newHeight / 2,
          newWidth,
          newHeight,
        );
        ctx.restore();
      } else {
        ctx.drawImage(uploadedImg, x, y, newWidth, newHeight);
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1.0;

      const resultDataUrl = canvas.toDataURL("image/png", 1.0);
      setResultImage(resultDataUrl);

      if (onImageProcessed) {
        onImageProcessed(resultDataUrl);
      }
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  const resetControls = () => {
    setPosition({
      x: 50,
      y: 50,
      scale: 0.8,
      opacity: 1.0,
      rotation: 0,
    });
  };

  const startOver = () => {
    setUploadedImage(null);
    setResultImage(null);
    resetControls();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {!uploadedImage ? (
        <div
          className={`w-full flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-xl transition-all cursor-pointer hover:bg-muted/50 ${
            isDragOver
              ? "border-primary bg-primary/5 scale-105"
              : "border-muted-foreground/25"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <Upload
            className={`h-12 w-12 transition-colors ${
              isDragOver ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <div className="text-center space-y-2">
            <h3 className="font-medium text-lg">
              {isDragOver ? "Drop your photo here" : "Add your photo"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Drag & drop or click to select
            </p>
          </div>
        </div>
      ) : !resultImage ? (
        <div className="w-full space-y-4">
          <div className="relative">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden border bg-muted/20">
              <Image
                src={uploadedImage}
                alt="Your photo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={startOver}
              className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 hover:bg-background"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={processImage}
            disabled={isProcessing}
            className="w-full h-12 text-base"
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating your image...
              </>
            ) : (
              <>
                <Check className="h-5 w-5 mr-2" />
                Create My Image
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="w-full space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-semibold text-green-700">
              🎉 Your image is ready!
            </h3>
            <p className="text-sm text-muted-foreground">
              Make any final adjustments below
            </p>
          </div>

          <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-green-200 bg-green-50/30">
            <Image
              src={resultImage}
              alt="Your custom image"
              fill
              className="object-contain"
              priority
              quality={100}
            />
          </div>

          {/* Live Controls After Generation */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-xl">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Fine-tune your image</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetControls}
                className="text-xs h-7 px-2"
              >
                <RotateCw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Size</Label>
                  <div className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-md font-medium">
                    {Math.round(position.scale * 100)}%
                  </div>
                </div>
                <Slider
                  min={0.3}
                  max={1.5}
                  step={0.02}
                  value={[position.scale]}
                  onValueChange={(values) =>
                    setPosition((prev) => ({ ...prev, scale: values[0] }))
                  }
                  className="h-6"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Smaller</span>
                  <span>Larger</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Position</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      ← Left | Right →
                    </Label>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[position.x]}
                      onValueChange={(values) =>
                        setPosition((prev) => ({ ...prev, x: values[0] }))
                      }
                      className="h-5"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      ↑ Up | Down ↓
                    </Label>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[position.y]}
                      onValueChange={(values) =>
                        setPosition((prev) => ({ ...prev, y: values[0] }))
                      }
                      className="h-5"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Transparency</Label>
                  <div className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-md font-medium">
                    {Math.round(position.opacity * 100)}%
                  </div>
                </div>
                <Slider
                  min={0.2}
                  max={1}
                  step={0.02}
                  value={[position.opacity]}
                  onValueChange={(values) =>
                    setPosition((prev) => ({ ...prev, opacity: values[0] }))
                  }
                  className="h-5"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>More transparent</span>
                  <span>Solid</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Rotation</Label>
                  <div className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-md font-medium">
                    {position.rotation}°
                  </div>
                </div>
                <Slider
                  min={0}
                  max={360}
                  step={1}
                  value={[position.rotation]}
                  onValueChange={(values) =>
                    setPosition((prev) => ({ ...prev, rotation: values[0] }))
                  }
                  className="h-5"
                />
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPosition((prev) => ({
                        ...prev,
                        rotation: (prev.rotation + 90) % 360,
                      }))
                    }
                    className="text-xs h-7"
                  >
                    Quick rotate 90°
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="default"
              onClick={() => {
                const link = document.createElement("a");
                link.href = resultImage;
                link.download = "my-custom-image.png";
                link.click();
              }}
              className="h-12"
            >
              <Download className="h-5 w-5 mr-2" />
              Download
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                try {
                  if (navigator.share) {
                    fetch(resultImage)
                      .then((res) => res.blob())
                      .then((blob) => {
                        const file = new File([blob], "my-custom-image.png", {
                          type: "image/png",
                        });
                        navigator
                          .share({
                            title: "My Custom Image",
                            files: [file],
                          })
                          .catch(() => copyToClipboard());
                      });
                  } else {
                    copyToClipboard();
                  }
                } catch (error) {
                  console.error("Failed to share image:", error);
                  copyToClipboard();
                }

                async function copyToClipboard() {
                  try {
                    const response = await fetch(resultImage as string);
                    const blob = await response.blob();
                    await navigator.clipboard.write([
                      new ClipboardItem({
                        [blob.type]: blob,
                      }),
                    ]);

                    alert("Image copied to clipboard!");
                  } catch (err) {
                    console.error("Failed to copy image:", err);
                    alert("Could not copy image. Please download instead.");
                  }
                }
              }}
              className="h-12"
            >
              <Share className="h-5 w-5 mr-2" />
              Share
            </Button>
          </div>

          <Button variant="ghost" onClick={startOver} className="w-full">
            Start over with new photo
          </Button>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg mt-2">
        <Shield className="h-4 w-4 text-green-600" />
        <span>
          Your images are processed securely and never saved to our servers
        </span>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
