"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Upload, FileText, File, ImageIcon, Trash2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export interface Media {
  id: string
  url: string
  type: string
  filename: string
  size: number
  createdAt?: number
  updatedAt?: number
}

export interface MediaUploaderProps {
  vehicleId?: string
  assessmentId?: string
  tenantId?: string
  onUpload?: (mediaId: string) => void
  onDelete?: (mediaId: string) => void
  existingMedia?: Media[]
  maxFiles?: number
  maxFileSize?: number // in MB
  allowedFileTypes?: string[]
  title?: string
  description?: string
  renderInCard?: boolean
  cardProps?: Partial<React.ComponentProps<typeof Card>>
  showPreview?: boolean
  previewSize?: "sm" | "md" | "lg"
  multiple?: boolean
  disabled?: boolean
}

export default function MediaUploader({
  vehicleId,
  assessmentId,
  tenantId,
  onUpload,
  onDelete,
  existingMedia = [],
  maxFiles = 10,
  maxFileSize = 10, // 10MB
  allowedFileTypes = ["image/*", "application/pdf", "text/plain"],
  title = "Upload Media Files",
  description = "Drag and drop files here or click to browse",
  renderInCard = true,
  cardProps,
  showPreview = true,
  previewSize = "md",
  multiple = true,
  disabled = false,
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<Media[]>(existingMedia)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mutations
  const generateUploadUrl = useMutation(api.media.generateMediaUploadUrl)
  const saveMediaRecord = useMutation(api.media.saveMediaRecord)
  const deleteMedia = useMutation(api.media.deleteMediaRecord)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Check if adding these files would exceed the max files limit
    if (uploadedFiles.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can upload a maximum of ${maxFiles} files.`,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Check file size
        if (file.size > maxFileSize * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds the maximum file size of ${maxFileSize}MB.`,
            variant: "destructive",
          })
          continue
        }

        // Check file type
        const isAllowedType = allowedFileTypes.some((type) => {
          if (type.endsWith("/*")) {
            const mainType = type.split("/")[0]
            return file.type.startsWith(`${mainType}/`)
          }
          return type === file.type
        })

        if (!isAllowedType) {
          toast({
            title: "File type not allowed",
            description: `${file.name} is not an allowed file type.`,
            variant: "destructive",
          })
          continue
        }

        // Step 1: Get a signed upload URL from Convex
        const { uploadUrl, storageId } = await generateUploadUrl({
          filename: file.name,
          contentType: file.type,
          vehicleId,
          assessmentId,
          tenantId,
        })

        // Step 2: Upload the file to the storage provider
        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        })

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed: ${uploadResponse.statusText}`)
        }

        // Step 3: Save the media record in Convex
        const media = await saveMediaRecord({
          storageId,
          filename: file.name,
          contentType: file.type,
          size: file.size,
          vehicleId,
          assessmentId,
          tenantId,
        })

        // Update the list of uploaded files
        if (media) {
          setUploadedFiles((prev) => [...prev, media as Media])
          if (onUpload) {
            onUpload(media.id)
          }
        }

        // Update progress
        setUploadProgress(((i + 1) / files.length) * 100)
      }

      toast({
        title: "Files uploaded",
        description: `Successfully uploaded ${files.length} file(s)`,
      })

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error uploading files:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = async (id: string) => {
    try {
      if (onDelete) {
        onDelete(id)
      }

      await deleteMedia({ id })

      setUploadedFiles((prev) => prev.filter((file) => file.id !== id))

      toast({
        title: "File removed",
        description: "The file has been removed successfully.",
      })
    } catch (error) {
      console.error("Error removing file:", error)
      toast({
        title: "Error",
        description: "There was an error removing the file. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon className="h-6 w-6" />
    } else if (type.startsWith("text/")) {
      return <FileText className="h-6 w-6" />
    } else {
      return <File className="h-6 w-6" />
    }
  }

  const handlePreviewImage = (url: string) => {
    setPreviewImage(url)
  }

  const previewSizeClasses = {
    sm: "h-24",
    md: "h-32",
    lg: "h-48",
  }

  const uploaderContent = (
    <>
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 md:p-12 text-center">
        <Upload className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          accept={allowedFileTypes.join(",")}
          disabled={disabled || isUploading}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading || uploadedFiles.length >= maxFiles}
          className="py-6 sm:py-2 px-8 sm:px-4"
        >
          {isUploading ? (
            <>
              <LoadingSpinner className="mr-2" />
              Uploading...
            </>
          ) : uploadedFiles.length >= maxFiles ? (
            "Maximum files reached"
          ) : (
            "Select Files"
          )}
        </Button>
      </div>

      {isUploading && (
        <div className="space-y-2 mt-4">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {uploadedFiles.length > 0 && showPreview && (
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium">Uploaded Files</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedFiles.map((file) => (
              <Card key={file.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center p-3 sm:p-4">
                    {getFileIcon(file.type)}
                    <div className="ml-3 flex-1 truncate">
                      <p className="text-sm font-medium truncate">{file.filename}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(file.id)} className="ml-2">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  {file.type.startsWith("image/") && (
                    <div className={`bg-gray-100 ${previewSizeClasses[previewSize]}`}>
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.filename}
                        className="h-full w-full object-cover cursor-pointer"
                        onClick={() => handlePreviewImage(file.url)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="flex justify-center">
              <img src={previewImage || "/placeholder.svg"} alt="Preview" className="max-h-[70vh] object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )

  if (renderInCard) {
    return (
      <Card className="w-full" {...cardProps}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{uploaderContent}</CardContent>
      </Card>
    )
  }

  return uploaderContent
}
