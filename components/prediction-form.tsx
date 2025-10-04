"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Sparkles, CheckCircle2, XCircle, Loader2, AlertCircle, Download, TrendingUp } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PredictionResult {
  prediction: "confirmed" | "false-positive"
  confidence: number
  probabilities: {
    false_positive: number
    confirmed: number
  }
}

interface CSVResults {
  summary: {
    total: number
    confirmed: number
    false_positive: number
    candidate: number
  }
  predictions: Array<{
    prediction: string
    confidence: number
  }>
}

export function PredictionForm() {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [csvResults, setCsvResults] = useState<CSVResults | null>(null)
  const [showResultsModal, setShowResultsModal] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    orbital_period: "",
    transit_duration: "",
    transit_depth: "",
    planet_radius: "",
    signal_to_noise: "",
    koi_score: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateInputs = (): boolean => {
    const errors: Record<string, string> = {}

    // Orbital Period: 0.1 to 10000 days
    const period = Number.parseFloat(formData.orbital_period)
    if (!formData.orbital_period || Number.isNaN(period)) {
      errors.orbital_period = "Required field"
    } else if (period < 0.1 || period > 10000) {
      errors.orbital_period = "Must be between 0.1 and 10000 days"
    }

    // Transit Duration: 0.1 to 24 hours
    const duration = Number.parseFloat(formData.transit_duration)
    if (!formData.transit_duration || Number.isNaN(duration)) {
      errors.transit_duration = "Required field"
    } else if (duration < 0.1 || duration > 24) {
      errors.transit_duration = "Must be between 0.1 and 24 hours"
    }

    // Transit Depth: 1 to 100000 ppm
    const depth = Number.parseFloat(formData.transit_depth)
    if (!formData.transit_depth || Number.isNaN(depth)) {
      errors.transit_depth = "Required field"
    } else if (depth < 1 || depth > 100000) {
      errors.transit_depth = "Must be between 1 and 100000 ppm"
    }

    // Planet Radius: 0.1 to 30 Earth radii
    const radius = Number.parseFloat(formData.planet_radius)
    if (!formData.planet_radius || Number.isNaN(radius)) {
      errors.planet_radius = "Required field"
    } else if (radius < 0.1 || radius > 30) {
      errors.planet_radius = "Must be between 0.1 and 30 Earth radii"
    }

    // Signal-to-Noise: 1 to 1000
    const snr = Number.parseFloat(formData.signal_to_noise)
    if (!formData.signal_to_noise || Number.isNaN(snr)) {
      errors.signal_to_noise = "Required field"
    } else if (snr < 1 || snr > 1000) {
      errors.signal_to_noise = "Must be between 1 and 1000"
    }

    // KOI Score: 0 to 1
    const score = Number.parseFloat(formData.koi_score)
    if (!formData.koi_score || Number.isNaN(score)) {
      errors.koi_score = "Required field"
    } else if (score < 0 || score > 1) {
      errors.koi_score = "Must be between 0 and 1"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handlePredict = async () => {
    if (!validateInputs()) {
      setError("Please fix validation errors before submitting")
      return
    }

    setIsLoading(true)
    setError(null)
    setPrediction(null)

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orbital_period: Number.parseFloat(formData.orbital_period),
          transit_duration: Number.parseFloat(formData.transit_duration),
          transit_depth: Number.parseFloat(formData.transit_depth),
          planet_radius: Number.parseFloat(formData.planet_radius),
          signal_to_noise: Number.parseFloat(formData.signal_to_noise),
          koi_score: Number.parseFloat(formData.koi_score),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Prediction failed")
      }

      const result = await response.json()
      setPrediction(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("[v0] Prediction error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/predict-csv", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "CSV prediction failed")
      }

      const result = await response.json()
      console.log("[v0] CSV predictions:", result)
      setCsvResults(result)
      setShowResultsModal(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("[v0] CSV upload error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="predict" className="relative px-4 py-16">
      <div className="container relative z-10 mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">Make a Prediction</h2>
          <p className="text-lg text-muted-foreground">Input exoplanet candidate parameters or upload a CSV file</p>
        </div>

        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Exoplanet Classification</CardTitle>
            <CardDescription>Enter the orbital and stellar parameters to classify the candidate</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Input</TabsTrigger>
                <TabsTrigger value="upload">Upload CSV</TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="period">
                      Orbital Period (days) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="period"
                      type="number"
                      placeholder="e.g., 365.25"
                      className={`bg-input ${validationErrors.orbital_period ? "border-destructive" : ""}`}
                      value={formData.orbital_period}
                      onChange={(e) => handleInputChange("orbital_period", e.target.value)}
                      min="0.1"
                      max="10000"
                      step="0.01"
                    />
                    {validationErrors.orbital_period && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.orbital_period}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">
                      Transit Duration (hours) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="e.g., 3.5"
                      className={`bg-input ${validationErrors.transit_duration ? "border-destructive" : ""}`}
                      value={formData.transit_duration}
                      onChange={(e) => handleInputChange("transit_duration", e.target.value)}
                      min="0.1"
                      max="24"
                      step="0.01"
                    />
                    {validationErrors.transit_duration && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.transit_duration}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="depth">
                      Transit Depth (ppm) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="depth"
                      type="number"
                      placeholder="e.g., 1000"
                      className={`bg-input ${validationErrors.transit_depth ? "border-destructive" : ""}`}
                      value={formData.transit_depth}
                      onChange={(e) => handleInputChange("transit_depth", e.target.value)}
                      min="1"
                      max="100000"
                      step="1"
                    />
                    {validationErrors.transit_depth && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.transit_depth}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="radius">
                      Planet Radius (Earth radii) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="radius"
                      type="number"
                      placeholder="e.g., 1.2"
                      className={`bg-input ${validationErrors.planet_radius ? "border-destructive" : ""}`}
                      value={formData.planet_radius}
                      onChange={(e) => handleInputChange("planet_radius", e.target.value)}
                      min="0.1"
                      max="30"
                      step="0.01"
                    />
                    {validationErrors.planet_radius && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.planet_radius}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="snr">
                      Signal-to-Noise Ratio <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="snr"
                      type="number"
                      placeholder="e.g., 15.5"
                      className={`bg-input ${validationErrors.signal_to_noise ? "border-destructive" : ""}`}
                      value={formData.signal_to_noise}
                      onChange={(e) => handleInputChange("signal_to_noise", e.target.value)}
                      min="1"
                      max="1000"
                      step="0.1"
                    />
                    {validationErrors.signal_to_noise && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.signal_to_noise}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="score">
                      KOI Score <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="score"
                      type="number"
                      placeholder="e.g., 0.85"
                      step="0.01"
                      className={`bg-input ${validationErrors.koi_score ? "border-destructive" : ""}`}
                      value={formData.koi_score}
                      onChange={(e) => handleInputChange("koi_score", e.target.value)}
                      min="0"
                      max="1"
                    />
                    {validationErrors.koi_score && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.koi_score}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handlePredict}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Classifying...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Classify Candidate
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="upload" className="space-y-6">
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 p-12 text-center">
                  <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Upload CSV File</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  <input
                    type="file"
                    id="csv-upload"
                    className="hidden"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    disabled={isLoading}
                  />
                  <label htmlFor="csv-upload">
                    <Button variant="outline" asChild disabled={isLoading}>
                      <span>{isLoading ? "Processing..." : "Select File"}</span>
                    </Button>
                  </label>
                  <div className="mt-4">
                    <a href="/sample-training-data.csv" download>
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download Sample CSV
                      </Button>
                    </a>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {error && (
              <div className="mt-6 rounded-lg border border-destructive bg-destructive/10 p-4">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {prediction && (
              <div className="mt-6 rounded-lg border border-border bg-muted/20 p-6">
                <div className="flex items-start gap-4">
                  {prediction.prediction === "confirmed" ? (
                    <CheckCircle2 className="h-8 w-8 text-chart-2" />
                  ) : (
                    <XCircle className="h-8 w-8 text-destructive" />
                  )}
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-foreground">
                      {prediction.prediction === "confirmed" ? "Confirmed Exoplanet" : "False Positive"}
                    </h3>
                    <p className="mb-4 text-muted-foreground">
                      Model confidence: {(prediction.confidence * 100).toFixed(1)}%
                    </p>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full ${prediction.prediction === "confirmed" ? "bg-chart-2" : "bg-destructive"}`}
                        style={{ width: `${prediction.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showResultsModal} onOpenChange={setShowResultsModal}>
        <DialogContent className="max-w-2xl border-border bg-card/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-primary" />
              Classification Results
            </DialogTitle>
            <DialogDescription>
              Analysis complete for {csvResults?.summary.total || 0} exoplanet candidates
            </DialogDescription>
          </DialogHeader>

          {csvResults && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-chart-2/30 bg-chart-2/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Confirmed</p>
                      <p className="text-3xl font-bold text-chart-2">{csvResults.summary.confirmed}</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-chart-2" />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {((csvResults.summary.confirmed / csvResults.summary.total) * 100).toFixed(1)}% of total
                  </p>
                </div>

                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">False Positives</p>
                      <p className="text-3xl font-bold text-destructive">{csvResults.summary.false_positive}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {((csvResults.summary.false_positive / csvResults.summary.total) * 100).toFixed(1)}% of total
                  </p>
                </div>

                <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Candidates</p>
                      <p className="text-3xl font-bold text-primary">{csvResults.summary.candidate || 0}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {(((csvResults.summary.candidate || 0) / csvResults.summary.total) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Classification Distribution</p>
                <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="bg-chart-2"
                    style={{
                      width: `${(csvResults.summary.confirmed / csvResults.summary.total) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-destructive"
                    style={{
                      width: `${(csvResults.summary.false_positive / csvResults.summary.total) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-primary"
                    style={{
                      width: `${((csvResults.summary.candidate || 0) / csvResults.summary.total) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Confirmed Exoplanets</span>
                  <span>False Positives</span>
                  <span>Candidates</span>
                </div>
              </div>

              {/* Statistics */}
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <h4 className="mb-3 font-semibold text-foreground">Analysis Summary</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Candidates Processed:</span>
                    <span className="font-medium text-foreground">{csvResults.summary.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Success Rate:</span>
                    <span className="font-medium text-chart-2">
                      {((csvResults.summary.confirmed / csvResults.summary.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Confidence:</span>
                    <span className="font-medium text-foreground">
                      {(
                        csvResults.predictions.reduce((acc, p) => acc + p.confidence, 0) / csvResults.predictions.length
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
              </div>

              <Button onClick={() => setShowResultsModal(false)} className="w-full" size="lg">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
