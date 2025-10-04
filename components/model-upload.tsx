"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, CheckCircle2, FileCode, X, AlertCircle } from "lucide-react"

interface UploadedModel {
  name: string
  size: number
  uploadedAt: Date
}

export function ModelUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedModel, setUploadedModel] = useState<UploadedModel | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const modelFile = files.find(
      (file) =>
        file.name.endsWith(".pkl") ||
        file.name.endsWith(".joblib") ||
        file.name.endsWith(".h5") ||
        file.name.endsWith(".pt") ||
        file.name.endsWith(".pth"),
    )

    if (modelFile) {
      await uploadModel(modelFile)
    }
  }, [])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await uploadModel(file)
    }
  }, [])

  const uploadModel = async (file: File) => {
    setValidationError(null)

    const validExtensions = [".pkl", ".joblib", ".h5", ".pt", ".pth"]
    const hasValidExtension = validExtensions.some((ext) => file.name.endsWith(ext))

    if (!hasValidExtension) {
      setValidationError("Invalid file type. Please upload .pkl, .joblib, .h5, .pt, or .pth file")
      return
    }

    if (file.size > 500 * 1024 * 1024) {
      setValidationError("File size must be less than 500MB")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Create FormData and upload to backend
    const formData = new FormData()
    formData.append("model", file)

    try {
      const response = await fetch("/api/upload-model", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setUploadedModel({
          name: file.name,
          size: file.size,
          uploadedAt: new Date(),
        })
      }
    } catch (error) {
      console.error("[v0] Model upload error:", error)
    } finally {
      clearInterval(interval)
      setIsUploading(false)
      setUploadProgress(100)
    }
  }

  const removeModel = () => {
    setUploadedModel(null)
    setUploadProgress(0)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <section id="model" className="relative px-4 py-16">
      <div className="container relative z-10 mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">Upload ML Model</h2>
          <p className="text-lg text-muted-foreground">
            Upload your trained exoplanet classification model (Primary: .pkl for scikit-learn)
          </p>
        </div>

        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Model Management</CardTitle>
            <CardDescription>Upload and manage your machine learning models</CardDescription>
          </CardHeader>
          <CardContent>
            {validationError && (
              <div className="mb-4 rounded-lg border border-destructive bg-destructive/10 p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <p className="text-sm text-destructive">{validationError}</p>
                </div>
              </div>
            )}

            {!uploadedModel ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/30"
                }`}
              >
                <Upload className={`mb-4 h-12 w-12 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {isDragging ? "Drop your model here" : "Upload Model File"}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Drag and drop your model file here, or click to browse
                </p>
                <p className="mb-6 text-xs text-muted-foreground">
                  <span className="font-semibold text-primary">Recommended: .pkl (scikit-learn)</span>
                  <br />
                  Also supported: .joblib, .h5 (Keras), .pt/.pth (PyTorch)
                </p>
                <input
                  type="file"
                  id="model-upload"
                  className="hidden"
                  accept=".pkl,.joblib,.h5,.pt,.pth"
                  onChange={handleFileSelect}
                />
                <label htmlFor="model-upload">
                  <Button variant="outline" asChild>
                    <span>Select File</span>
                  </Button>
                </label>

                {isUploading && (
                  <div className="mt-6 w-full max-w-md">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Uploading...</span>
                      <span className="text-foreground">{uploadProgress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-muted/20 p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <FileCode className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{uploadedModel.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(uploadedModel.size)} • Uploaded{" "}
                          {uploadedModel.uploadedAt.toLocaleTimeString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={removeModel}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-chart-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Model ready for predictions</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
