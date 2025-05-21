"use client"

import type React from "react"

import { useRef, useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Undo2, Save, Download } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export interface SignaturePadProps {
  onSign: (signatureData: string) => void
  width?: number
  height?: number
  backgroundColor?: string
  penColor?: string
  penSize?: number
  title?: string
  description?: string
  renderInCard?: boolean
  cardProps?: Partial<React.ComponentProps<typeof Card>>
  initialSignature?: string
  readOnly?: boolean
  saveButtonText?: string
  clearButtonText?: string
  downloadButtonText?: string
  showDownloadButton?: boolean
  onClear?: () => void
  disabled?: boolean
}

export default function SignaturePad({
  onSign,
  width = 500,
  height = 200,
  backgroundColor = "#f9fafb",
  penColor = "#000000",
  penSize = 2,
  title = "Signature",
  description = "Please sign in the area below",
  renderInCard = true,
  cardProps,
  initialSignature,
  readOnly = false,
  saveButtonText = "Save Signature",
  clearButtonText = "Clear",
  downloadButtonText = "Download",
  showDownloadButton = false,
  onClear,
  disabled = false,
}: SignaturePadProps) {
  // Use window width to adjust canvas size on mobile
  const [canvasWidth, setCanvasWidth] = useState(width)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(!!initialSignature)

  // Initialize canvas
  useEffect(() => {
    const handleResize = () => {
      // On mobile, make canvas width responsive
      if (typeof window !== "undefined") {
        const isMobile = window.innerWidth < 640
        setCanvasWidth(isMobile ? Math.min(window.innerWidth - 40, width) : width)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [width])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvasWidth
    canvas.height = height

    // Set background color
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Set line style
    ctx.lineWidth = penSize
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = penColor

    // Load initial signature if provided
    if (initialSignature) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        setHasSignature(true)
      }
      img.src = initialSignature
    }
  }, [canvasWidth, height, backgroundColor, penColor, penSize, initialSignature])

  // Handle mouse/touch events
  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (readOnly || disabled) return

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      setIsDrawing(true)
      setHasSignature(true)

      // Get coordinates
      const { offsetX, offsetY } = getCoordinates(e, canvas)

      // Start new path
      ctx.beginPath()
      ctx.moveTo(offsetX, offsetY)
    },
    [readOnly, disabled],
  )

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing || readOnly || disabled) return

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Get coordinates
      const { offsetX, offsetY } = getCoordinates(e, canvas)

      // Draw line
      ctx.lineTo(offsetX, offsetY)
      ctx.stroke()
    },
    [isDrawing, readOnly, disabled],
  )

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
  }, [])

  // Get coordinates from mouse or touch event
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()

    if ("touches" in e) {
      // Touch event
      const touch = e.touches[0]
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top,
      }
    } else {
      // Mouse event
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY,
      }
    }
  }

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    setHasSignature(false)

    if (onClear) {
      onClear()
    }
  }, [backgroundColor, onClear])

  // Save signature
  const saveSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Get signature as data URL
    const signatureData = canvas.toDataURL("image/png")

    // Call onSign callback
    onSign(signatureData)

    toast({
      title: "Signature saved",
      description: "Your signature has been saved successfully.",
    })
  }, [onSign])

  // Download signature
  const downloadSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Get signature as data URL
    const signatureData = canvas.toDataURL("image/png")

    // Create a temporary link and trigger download
    const link = document.createElement("a")
    link.href = signatureData
    link.download = "signature.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  const signaturePadContent = (
    <>
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <canvas
              ref={canvasRef}
              className={`border border-gray-200 rounded-lg ${
                !readOnly && !disabled ? "cursor-crosshair" : "cursor-default"
              } touch-none`}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{
                width: "100%",
                height: `${height}px`,
                maxWidth: `${canvasWidth}px`,
                opacity: disabled ? 0.7 : 1,
              }}
            />
          </CardContent>
        </Card>

        {!readOnly && (
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={clearCanvas}
                disabled={!hasSignature || disabled}
                className="flex items-center w-full sm:w-auto py-6 sm:py-2"
              >
                <Undo2 className="mr-2 h-4 w-4" />
                {clearButtonText}
              </Button>

              {showDownloadButton && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={downloadSignature}
                  disabled={!hasSignature || disabled}
                  className="flex items-center w-full sm:w-auto py-6 sm:py-2"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {downloadButtonText}
                </Button>
              )}
            </div>

            <Button
              type="button"
              onClick={saveSignature}
              disabled={!hasSignature || disabled}
              className="flex items-center w-full sm:w-auto py-6 sm:py-2"
            >
              <Save className="mr-2 h-4 w-4" />
              {saveButtonText}
            </Button>
          </div>
        )}
      </div>
    </>
  )

  if (renderInCard) {
    return (
      <Card className="w-full" {...cardProps}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{signaturePadContent}</CardContent>
      </Card>
    )
  }

  return signaturePadContent
}
