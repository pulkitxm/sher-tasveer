"use client";

import type React from "react";
import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Upload, Check, Download, Share, Edit, RotateCw } from "lucide-react";

interface ImageUploaderProps {
  onImageProcessed?: (resultImageUrl: string) => void;
  placeholderImage?: string;
}

interface ImagePosition {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotation: number;
}

export function ImageUploader({ onImageProcessed,placeholderImage }: ImageUploaderProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
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
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const processImage = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);

    try {
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
      placeholderImg.src = placeholderImage.src;

      await new Promise((resolve) => {
        placeholderImg.onload = resolve;
      });

      const scaleFactor = 3;
      canvas.width = placeholderImg.width * scaleFactor;
      canvas.height = placeholderImg.height * scaleFactor;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.scale(scaleFactor, scaleFactor);

      ctx.drawImage(placeholderImg, 0, 0, placeholderImg.width, placeholderImg.height);

      const uploadedImg = new window.Image();
      uploadedImg.crossOrigin = "anonymous";
      uploadedImg.src = uploadedImage;

      await new Promise((resolve) => {
        uploadedImg.onload = resolve;
      });

      const baseScale = Math.min(placeholderImg.width / uploadedImg.width, placeholderImg.height / uploadedImg.height);
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
        ctx.drawImage(uploadedImg, -newWidth / 2, -newHeight / 2, newWidth, newHeight);
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

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-md mx-auto">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {!uploadedImage ? (
        <div className="w-full flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-lg">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div className="text-center space-y-1">
            <h3 className="font-medium">Upload an image</h3>
            <p className="text-sm text-muted-foreground">Drop your image here or click to browse</p>
          </div>
          <Button onClick={handleUploadClick} variant="secondary" size="sm">
            Select Image
          </Button>
        </div>
      ) : (
        <div className="w-full space-y-3">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden border bg-muted/20">
            <Image src={uploadedImage} alt="Uploaded image" fill className="object-contain" priority />
          </div>

          {/* Hidden controls by default */}
          <Collapsible open={isControlsOpen} onOpenChange={setIsControlsOpen} className="w-full border rounded-lg">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex w-full justify-between p-2 h-auto rounded-md text-sm">
                <span>{isControlsOpen ? "Hide controls" : "Adjust image"}</span>
                {isControlsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="p-3 space-y-3">
              <div className="grid gap-3 text-sm">
                {/* Simplified controls with less space */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label htmlFor="position-x" className="text-xs">
                      Position X
                    </Label>
                    <span className="text-xs text-muted-foreground">{position.x}%</span>
                  </div>
                  <Slider
                    id="position-x"
                    min={0}
                    max={100}
                    step={1}
                    value={[position.x]}
                    onValueChange={(values) => setPosition((prev) => ({ ...prev, x: values[0] }))}
                    className="h-4"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label htmlFor="position-y" className="text-xs">
                      Position Y
                    </Label>
                    <span className="text-xs text-muted-foreground">{position.y}%</span>
                  </div>
                  <Slider
                    id="position-y"
                    min={0}
                    max={100}
                    step={1}
                    value={[position.y]}
                    onValueChange={(values) => setPosition((prev) => ({ ...prev, y: values[0] }))}
                    className="h-4"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label htmlFor="scale" className="text-xs">
                      Size
                    </Label>
                    <span className="text-xs text-muted-foreground">{(position.scale * 100).toFixed(0)}%</span>
                  </div>
                  <Slider
                    id="scale"
                    min={0.2}
                    max={2}
                    step={0.05}
                    value={[position.scale]}
                    onValueChange={(values) => setPosition((prev) => ({ ...prev, scale: values[0] }))}
                    className="h-4"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label htmlFor="opacity" className="text-xs">
                      Opacity
                    </Label>
                    <span className="text-xs text-muted-foreground">{(position.opacity * 100).toFixed(0)}%</span>
                  </div>
                  <Slider
                    id="opacity"
                    min={0.1}
                    max={1}
                    step={0.05}
                    value={[position.opacity]}
                    onValueChange={(values) => setPosition((prev) => ({ ...prev, opacity: values[0] }))}
                    className="h-4"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label htmlFor="rotation" className="text-xs">
                      Rotation
                    </Label>
                    <span className="text-xs text-muted-foreground">{position.rotation}°</span>
                  </div>
                  <Slider
                    id="rotation"
                    min={0}
                    max={360}
                    step={1}
                    value={[position.rotation]}
                    onValueChange={(values) => setPosition((prev) => ({ ...prev, rotation: values[0] }))}
                    className="h-4"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPosition({
                      x: 50,
                      y: 50,
                      scale: 0.8,
                      opacity: 1.0,
                      rotation: 0,
                    });
                  }}
                  className="text-xs h-8 mt-1 flex gap-1.5 items-center"
                >
                  <RotateCw className="h-3 w-3" />
                  Reset
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Button
            onClick={processImage}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-1" />
                Generate Image
              </>
            )}
          </Button>
        </div>
      )}

      {resultImage && (
        <div className="w-full space-y-3 mt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Result</h3>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setIsControlsOpen(true)} className="text-xs h-7 px-2">
                <Edit className="h-3 w-3 mr-1" /> Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setResultImage(null)} className="text-xs h-7 px-2">
                Reset
              </Button>
            </div>
          </div>

          <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
            <Image src={resultImage} alt="Result image" fill className="object-contain" priority quality={100} />
          </div>

          <div className="flex gap-2 w-full">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                const link = document.createElement("a");
                link.href = resultImage;
                link.download = "custom-image-result.png";
                link.click();
              }}
              className="flex-1 flex items-center justify-center gap-1 h-9"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                try {
                  if (navigator.share) {
                    fetch(resultImage)
                      .then((res) => res.blob())
                      .then((blob) => {
                        const file = new File([blob], "custom-image-result.png", { type: "image/png" });
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
              className="flex-1 flex items-center justify-center gap-1 h-9"
            >
              <Share className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      )}

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
