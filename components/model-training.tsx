"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, Loader2, CheckCircle2, TrendingUp, AlertCircle, Download, History } from "lucide-react"

interface TrainingMetrics {
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  train_samples: number
  test_samples: number
}

interface TrainingHistoryEntry {
  timestamp: string
  metrics: TrainingMetrics
  model_path: string
  test_size: number
}

export function ModelTraining() {
  const [isTraining, setIsTraining] = useState(false)
  const [metrics, setMetrics] = useState<TrainingMetrics | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [testSize, setTestSize] = useState("0.2")
  const [validationError, setValidationError] = useState<string | null>(null)
  const [history, setHistory] = useState<TrainingHistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      console.log("[v0] Loading training history...")
      const response = await fetch("/api/train")

      if (!response.ok) {
        console.error("[v0] Failed to load history: HTTP", response.status)
        setHistory([])
        return
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("[v0] Failed to load history: Invalid content type", contentType)
        setHistory([])
        return
      }

      const data = await response.json()
      console.log("[v0] History loaded successfully:", data.history?.length || 0, "entries")
      setHistory(data.history || [])
    } catch (err) {
      console.error("[v0] Failed to load history:", err)
      setHistory([])
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setValidationError(null)
    setError(null)

    if (!file.name.endsWith(".csv")) {
      setValidationError("Please upload a valid CSV file")
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      setValidationError("File size must be less than 50MB")
      return
    }

    const testSizeNum = Number.parseFloat(testSize)
    if (Number.isNaN(testSizeNum) || testSizeNum < 0.1 || testSizeNum > 0.5) {
      setValidationError("Test size must be between 0.1 and 0.5")
      return
    }

    setIsTraining(true)
    setMetrics(null)

    try {
      console.log("[v0] Starting training with file:", file.name)
      const formData = new FormData()
      formData.append("file", file)
      formData.append("test_size", testSize)

      const response = await fetch(`/api/train`, {
        method: "POST",
        body: formData,
      })

      console.log("[v0] Response status:", response.status)

      let result
      try {
        result = await response.json()
      } catch (parseError) {
        console.error("[v0] Failed to parse response as JSON:", parseError)
        throw new Error("Server returned invalid response. Please check if Python and required packages are installed.")
      }

      if (!response.ok) {
        console.error("[v0] Training failed with status:", response.status, "Error:", result.error)
        throw new Error(result.error || `Training failed with status ${response.status}`)
      }

      console.log("[v0] Training completed successfully")
      setMetrics(result.metrics)
      setHistory(result.history || [])

      await loadHistory()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during training"
      setError(errorMessage)
      console.error("[v0] Training error:", err)
    } finally {
      setIsTraining(false)
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch("/api/download-template")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "exoplanet_training_template.csv"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("[v0] Template download error:", err)
      setError("Failed to download template")
    }
  }

  const handleDownloadSample = () => {
    const a = document.createElement("a")
    a.href = "/sample-training-data.csv"
    a.download = "sample-training-data.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const getImprovement = (currentMetric: number, index: number): string | null => {
    if (index === 0 || !history[index - 1]) return null
    const previousMetric = history[index - 1].metrics.accuracy
    const diff = ((currentMetric - previousMetric) / previousMetric) * 100
    return diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`
  }

  return (
    <section id="train" className="relative px-4 py-16">
      <div className="container relative z-10 mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">Train Model</h2>
          <p className="text-lg text-muted-foreground">Upload NASA Kepler data to train the Random Forest classifier</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Upload Training Data</CardTitle>
              <CardDescription>CSV file with NASA Kepler features (koi_period, koi_duration, etc.)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="test-size">
                  Test Set Size <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="test-size"
                  type="number"
                  min="0.1"
                  max="0.5"
                  step="0.05"
                  value={testSize}
                  onChange={(e) => setTestSize(e.target.value)}
                  className="bg-input"
                />
                <p className="text-xs text-muted-foreground">Proportion of data to use for testing (0.1 - 0.5)</p>
              </div>

              <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 p-8 text-center">
                <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
                <h3 className="mb-2 text-base font-semibold text-foreground">Upload Training CSV</h3>
                <p className="mb-4 text-sm text-muted-foreground">NASA Kepler dataset with koi_disposition labels</p>
                <input
                  type="file"
                  id="training-upload"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={isTraining}
                />
                <label htmlFor="training-upload">
                  <Button variant="outline" asChild disabled={isTraining}>
                    <span>
                      {isTraining ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Training...
                        </>
                      ) : (
                        "Select File"
                      )}
                    </span>
                  </Button>
                </label>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="secondary" onClick={handleDownloadTemplate} className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Download CSV Template
                </Button>
                <Button variant="secondary" onClick={handleDownloadSample} className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Download Sample Data
                </Button>
              </div>

              {validationError && (
                <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <p className="text-sm text-destructive">{validationError}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Training Results</CardTitle>
              <CardDescription>Model performance metrics after training</CardDescription>
            </CardHeader>
            <CardContent>
              {metrics ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-chart-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-semibold">Training completed successfully</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                      <span className="text-sm text-muted-foreground">Accuracy</span>
                      <span className="text-lg font-bold text-foreground">{(metrics.accuracy * 100).toFixed(2)}%</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                      <span className="text-sm text-muted-foreground">Precision</span>
                      <span className="text-lg font-bold text-foreground">{(metrics.precision * 100).toFixed(2)}%</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                      <span className="text-sm text-muted-foreground">Recall</span>
                      <span className="text-lg font-bold text-foreground">{(metrics.recall * 100).toFixed(2)}%</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                      <span className="text-sm text-muted-foreground">F1 Score</span>
                      <span className="text-lg font-bold text-foreground">{(metrics.f1_score * 100).toFixed(2)}%</span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg border border-border bg-muted/20 p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>
                        Trained on {metrics.train_samples} samples, tested on {metrics.test_samples} samples
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[300px] items-center justify-center text-center">
                  <div>
                    <div className="mb-4 text-4xl">🤖</div>
                    <p className="text-muted-foreground">Upload training data to see results</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {history.length > 0 && (
          <Card className="mt-6 border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Training History
                  </CardTitle>
                  <CardDescription>Track model improvements over time</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)}>
                  {showHistory ? "Hide" : "Show"} History
                </Button>
              </div>
            </CardHeader>
            {showHistory && (
              <CardContent>
                <div className="space-y-4">
                  {history
                    .slice()
                    .reverse()
                    .map((entry, index) => {
                      const actualIndex = history.length - 1 - index
                      const improvement = getImprovement(entry.metrics.accuracy, actualIndex)

                      return (
                        <div key={entry.timestamp} className="rounded-lg border border-border bg-muted/20 p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground">Training #{actualIndex + 1}</span>
                              {improvement && (
                                <span
                                  className={`text-xs font-medium ${
                                    improvement.startsWith("+") ? "text-chart-2" : "text-destructive"
                                  }`}
                                >
                                  {improvement}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleString()}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Accuracy</p>
                              <p className="text-sm font-semibold text-foreground">
                                {(entry.metrics.accuracy * 100).toFixed(2)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Precision</p>
                              <p className="text-sm font-semibold text-foreground">
                                {(entry.metrics.precision * 100).toFixed(2)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Recall</p>
                              <p className="text-sm font-semibold text-foreground">
                                {(entry.metrics.recall * 100).toFixed(2)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">F1 Score</p>
                              <p className="text-sm font-semibold text-foreground">
                                {(entry.metrics.f1_score * 100).toFixed(2)}%
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 text-xs text-muted-foreground">
                            Samples: {entry.metrics.train_samples} train / {entry.metrics.test_samples} test
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        <Card className="mt-6 border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Required NASA Kepler Features</CardTitle>
            <CardDescription>Your CSV must include these columns from the NASA Kepler dataset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-2 text-left font-semibold text-foreground">Column Name</th>
                    <th className="p-2 text-left font-semibold text-foreground">Description</th>
                    <th className="p-2 text-left font-semibold text-foreground">Example</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">koi_period</td>
                    <td className="p-2 text-xs">Orbital period (days)</td>
                    <td className="p-2">54.32</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">koi_duration</td>
                    <td className="p-2 text-xs">Transit duration (hours)</td>
                    <td className="p-2">3.45</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">koi_impact</td>
                    <td className="p-2 text-xs">Impact parameter</td>
                    <td className="p-2">0.65</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">koi_depth</td>
                    <td className="p-2 text-xs">Transit depth (ppm)</td>
                    <td className="p-2">1200</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">koi_prad</td>
                    <td className="p-2 text-xs">Planet radius (Earth radii)</td>
                    <td className="p-2">1.8</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">koi_insol</td>
                    <td className="p-2 text-xs">Insolation flux (Earth flux)</td>
                    <td className="p-2">0.85</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">koi_model_snr</td>
                    <td className="p-2 text-xs">Signal-to-noise ratio</td>
                    <td className="p-2">15.6</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">koi_srad</td>
                    <td className="p-2 text-xs">Stellar radius (Solar radii)</td>
                    <td className="p-2">1.05</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">koi_steff</td>
                    <td className="p-2 text-xs">Stellar temperature (K)</td>
                    <td className="p-2">5778</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">koi_slogg</td>
                    <td className="p-2 text-xs">Surface gravity (log10)</td>
                    <td className="p-2">4.44</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">koi_fpflag_nt</td>
                    <td className="p-2 text-xs">Not transit-like flag</td>
                    <td className="p-2">0</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">koi_fpflag_ss</td>
                    <td className="p-2 text-xs">Stellar eclipse flag</td>
                    <td className="p-2">0</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">koi_fpflag_co</td>
                    <td className="p-2 text-xs">Centroid offset flag</td>
                    <td className="p-2">0</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">koi_fpflag_ec</td>
                    <td className="p-2 text-xs">Ephemeris match flag</td>
                    <td className="p-2">0</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono text-xs font-bold">koi_disposition</td>
                    <td className="p-2 text-xs font-bold">Target label</td>
                    <td className="p-2 font-bold">CONFIRMED</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Note:</strong> The koi_disposition column should contain "CONFIRMED"
                or "FALSE POSITIVE" labels. Download the template to see the exact format.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
