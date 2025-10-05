"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Sparkles, CheckCircle2, XCircle, Loader2, Download } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PredictionResult {
  prediction: "exoplanet" | "not-exoplanet"
  confidence: number
  probabilities: {
    not_exoplanet: number
    exoplanet: number
  }
}

interface CSVResults {
  summary: {
    total: number
    exoplanet: number
    not_exoplanet: number
  }
  predictions: Array<{
    name: string
    prediction: string
    confidence: number
  }>
}

export function PredictionForm() {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [csvResults, setCsvResults] = useState<CSVResults | null>(null)
  const [showResultsModal, setShowResultsModal] = useState(false)

  const [formData, setFormData] = useState({
    // Orbital and transit properties
    koi_period: "",
    koi_duration: "",
    koi_impact: "",
    koi_depth: "",
    koi_prad: "",
    koi_insol: "",
    koi_model_snr: "",

    // Stellar properties
    koi_srad: "",
    koi_steff: "",
    koi_slogg: "",

    // False positive flags
    koi_fpflag_nt: "0",
    koi_fpflag_ss: "0",
    koi_fpflag_co: "0",
    koi_fpflag_ec: "0",

    // Positional data
    ra: "",
    dec: "",
    pm_ra: "",
    pm_dec: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePredict = async () => {
    setIsLoading(true)
    setError(null)
    setPrediction(null)

    try {
      const payload: Record<string, number> = {}
      Object.entries(formData).forEach(([key, value]) => {
        const num = Number.parseFloat(value)
        payload[key] = Number.isNaN(num) ? 0 : num
      })

      console.log("[v0] Sending prediction request:", payload)

      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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

  const handleDownloadSample = async () => {
    try {
      console.log("[v0] Starting sample prediction data download...")
      const response = await fetch("/api/download-prediction-sample")

      if (!response.ok) {
        throw new Error("Failed to download sample data")
      }

      console.log("[v0] Download response status:", response.status)

      const blob = await response.blob()
      console.log("[v0] Blob created, size:", blob.size)

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "sample_prediction_data.csv"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      console.log("[v0] Download triggered successfully")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download sample data")
      console.error("[v0] Download error:", err)
    }
  }

  return (
    <section id="predict" className="relative px-4 py-16">
      <div className="container relative z-10 mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">Make a Prediction</h2>
          <p className="text-lg text-muted-foreground">
            Input observable exoplanet candidate parameters or upload a CSV file
          </p>
          <div className="mx-auto mt-4 max-w-2xl rounded-lg border border-primary/30 bg-primary/10 p-3">
            <p className="text-sm text-foreground">
              <strong>Note:</strong> This section is for making predictions on new data. If you want to train the model
              with labeled data, scroll up to the "Train Model" section.
            </p>
          </div>
        </div>

        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Exoplanet Classification</CardTitle>
            <CardDescription>
              Enter measurable parameters from your observations to classify the candidate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Input</TabsTrigger>
                <TabsTrigger value="upload">Upload CSV</TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-6">
                <div className="space-y-6">
                  {/* Orbital & Transit Properties */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Orbital & Transit Properties</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="koi_period">Orbital Period (days)</Label>
                        <Input
                          id="koi_period"
                          type="number"
                          step="0.001"
                          placeholder="e.g., 365.25"
                          value={formData.koi_period}
                          onChange={(e) => handleInputChange("koi_period", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="koi_duration">Transit Duration (hours)</Label>
                        <Input
                          id="koi_duration"
                          type="number"
                          step="0.01"
                          placeholder="e.g., 3.5"
                          value={formData.koi_duration}
                          onChange={(e) => handleInputChange("koi_duration", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="koi_impact">Impact Parameter</Label>
                        <Input
                          id="koi_impact"
                          type="number"
                          step="0.001"
                          placeholder="e.g., 0.5"
                          value={formData.koi_impact}
                          onChange={(e) => handleInputChange("koi_impact", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="koi_depth">Transit Depth (ppm)</Label>
                        <Input
                          id="koi_depth"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 1000"
                          value={formData.koi_depth}
                          onChange={(e) => handleInputChange("koi_depth", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="koi_prad">Planet Radius (Earth radii)</Label>
                        <Input
                          id="koi_prad"
                          type="number"
                          step="0.01"
                          placeholder="e.g., 1.2"
                          value={formData.koi_prad}
                          onChange={(e) => handleInputChange("koi_prad", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="koi_insol">Insolation Flux (Earth flux)</Label>
                        <Input
                          id="koi_insol"
                          type="number"
                          step="0.01"
                          placeholder="e.g., 1.0"
                          value={formData.koi_insol}
                          onChange={(e) => handleInputChange("koi_insol", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="koi_model_snr">Signal-to-Noise Ratio</Label>
                        <Input
                          id="koi_model_snr"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 35.5"
                          value={formData.koi_model_snr}
                          onChange={(e) => handleInputChange("koi_model_snr", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stellar Properties */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Stellar Properties</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="koi_srad">Stellar Radius (Solar radii)</Label>
                        <Input
                          id="koi_srad"
                          type="number"
                          step="0.001"
                          placeholder="e.g., 1.0"
                          value={formData.koi_srad}
                          onChange={(e) => handleInputChange("koi_srad", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="koi_steff">Effective Temperature (K)</Label>
                        <Input
                          id="koi_steff"
                          type="number"
                          step="1"
                          placeholder="e.g., 5778"
                          value={formData.koi_steff}
                          onChange={(e) => handleInputChange("koi_steff", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="koi_slogg">Surface Gravity (log g)</Label>
                        <Input
                          id="koi_slogg"
                          type="number"
                          step="0.001"
                          placeholder="e.g., 4.44"
                          value={formData.koi_slogg}
                          onChange={(e) => handleInputChange("koi_slogg", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* False Positive Flags */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">False Positive Flags</h3>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label htmlFor="koi_fpflag_nt">Not Transit-Like (0 or 1)</Label>
                        <Input
                          id="koi_fpflag_nt"
                          type="number"
                          min="0"
                          max="1"
                          placeholder="0"
                          value={formData.koi_fpflag_nt}
                          onChange={(e) => handleInputChange("koi_fpflag_nt", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="koi_fpflag_ss">Stellar Eclipse (0 or 1)</Label>
                        <Input
                          id="koi_fpflag_ss"
                          type="number"
                          min="0"
                          max="1"
                          placeholder="0"
                          value={formData.koi_fpflag_ss}
                          onChange={(e) => handleInputChange("koi_fpflag_ss", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="koi_fpflag_co">Centroid Offset (0 or 1)</Label>
                        <Input
                          id="koi_fpflag_co"
                          type="number"
                          min="0"
                          max="1"
                          placeholder="0"
                          value={formData.koi_fpflag_co}
                          onChange={(e) => handleInputChange("koi_fpflag_co", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="koi_fpflag_ec">Ephemeris Match (0 or 1)</Label>
                        <Input
                          id="koi_fpflag_ec"
                          type="number"
                          min="0"
                          max="1"
                          placeholder="0"
                          value={formData.koi_fpflag_ec}
                          onChange={(e) => handleInputChange("koi_fpflag_ec", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Positional Data */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Sky Position & Motion</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="ra">Right Ascension (degrees)</Label>
                        <Input
                          id="ra"
                          type="number"
                          step="0.0001"
                          placeholder="e.g., 290.1234"
                          value={formData.ra}
                          onChange={(e) => handleInputChange("ra", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dec">Declination (degrees)</Label>
                        <Input
                          id="dec"
                          type="number"
                          step="0.0001"
                          placeholder="e.g., 44.5678"
                          value={formData.dec}
                          onChange={(e) => handleInputChange("dec", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pm_ra">Proper Motion RA (mas/yr)</Label>
                        <Input
                          id="pm_ra"
                          type="number"
                          step="0.01"
                          placeholder="e.g., -10.5"
                          value={formData.pm_ra}
                          onChange={(e) => handleInputChange("pm_ra", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pm_dec">Proper Motion Dec (mas/yr)</Label>
                        <Input
                          id="pm_dec"
                          type="number"
                          step="0.01"
                          placeholder="e.g., 5.2"
                          value={formData.pm_dec}
                          onChange={(e) => handleInputChange("pm_dec", e.target.value)}
                        />
                      </div>
                    </div>
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
                <div className="mb-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={handleDownloadSample}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Sample CSV
                  </Button>
                </div>

                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 p-12 text-center">
                  <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Upload CSV File</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Upload a CSV file with observable exoplanet candidate parameters
                  </p>
                  <input
                    type="file"
                    id="prediction-csv-upload"
                    className="hidden"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    disabled={isLoading}
                  />
                  <label htmlFor="prediction-csv-upload">
                    <Button variant="outline" asChild disabled={isLoading}>
                      <span>{isLoading ? "Processing..." : "Select File"}</span>
                    </Button>
                  </label>
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
                  {prediction.prediction === "exoplanet" ? (
                    <CheckCircle2 className="h-8 w-8 text-chart-2" />
                  ) : (
                    <XCircle className="h-8 w-8 text-destructive" />
                  )}
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-foreground">
                      {prediction.prediction === "exoplanet" ? "Exoplanet Detected" : "Not an Exoplanet"}
                    </h3>
                    <p className="mb-4 text-muted-foreground">
                      Model confidence: {(prediction.confidence * 100).toFixed(1)}%
                    </p>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full ${prediction.prediction === "exoplanet" ? "bg-chart-2" : "bg-destructive"}`}
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
        <DialogContent className="max-w-4xl border-border bg-card/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-primary" />
              Classification Results
            </DialogTitle>
            <DialogDescription>Analysis complete for {csvResults?.summary.total || 0} candidates</DialogDescription>
          </DialogHeader>

          {csvResults && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-chart-2/30 bg-chart-2/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Exoplanets</p>
                      <p className="text-3xl font-bold text-chart-2">{csvResults.summary.exoplanet}</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-chart-2" />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {((csvResults.summary.exoplanet / csvResults.summary.total) * 100).toFixed(1)}% of total
                  </p>
                </div>

                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Not Exoplanets</p>
                      <p className="text-3xl font-bold text-destructive">{csvResults.summary.not_exoplanet}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {((csvResults.summary.not_exoplanet / csvResults.summary.total) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Classification Distribution</p>
                <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="bg-chart-2"
                    style={{
                      width: `${(csvResults.summary.exoplanet / csvResults.summary.total) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-destructive"
                    style={{
                      width: `${(csvResults.summary.not_exoplanet / csvResults.summary.total) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Detailed Results</p>
                <ScrollArea className="h-[300px] rounded-lg border border-border">
                  <div className="p-4">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-card">
                        <tr className="border-b border-border">
                          <th className="pb-2 text-left text-sm font-medium text-muted-foreground">Planet Name</th>
                          <th className="pb-2 text-left text-sm font-medium text-muted-foreground">Classification</th>
                          <th className="pb-2 text-right text-sm font-medium text-muted-foreground">Confidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvResults.predictions.map((pred, idx) => (
                          <tr key={idx} className="border-b border-border/50 last:border-0">
                            <td className="py-3 text-sm font-medium text-foreground">{pred.name}</td>
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                {pred.prediction === "exoplanet" ? (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                                    <span className="text-sm text-chart-2">Exoplanet</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 text-destructive" />
                                    <span className="text-sm text-destructive">Not Exoplanet</span>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="py-3 text-right text-sm text-muted-foreground">
                              {(pred.confidence * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
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
