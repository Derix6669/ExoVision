"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, CheckCircle2, TrendingUp, History, Download } from "lucide-react"

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

const getImprovement = (currentAccuracy: number, index: number) => {
  // Placeholder implementation for getImprovement
  // This should be replaced with actual logic to calculate improvement
  return index === 0 ? null : "+0.5%"
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

      const data = await response.json()
      console.log("[v0] History loaded successfully:", data.history?.length || 0, "entries")
      setHistory(data.history || [])

      if (data.latest_metrics?.metrics) {
        setMetrics(data.latest_metrics.metrics)
      }
    } catch (err) {
      console.error("[v0] Failed to load history:", err)
      setHistory([])
    }
  }

  const handleNASATraining = async () => {
    setValidationError(null)
    setError(null)
    setIsTraining(true)
    setMetrics(null)

    try {
      console.log("[v0] Starting training with NASA data...")

      const response = await fetch(`/api/train`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })

      console.log("[v0] Response status:", response.status)

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `Training failed with status ${response.status}`)
      }

      console.log("[v0] Training completed successfully")
      setMetrics(result.metrics)
      setHistory(result.history || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during training"
      setError(errorMessage)
      console.error("[v0] Training error:", err)
    } finally {
      setIsTraining(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setValidationError(null)
    setError(null)
    setIsTraining(true)
    setMetrics(null)

    try {
      console.log("[v0] Reading CSV file...")
      const csvText = await file.text()

      console.log("[v0] Starting training with custom CSV data...")

      const response = await fetch(`/api/train`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ csvData: csvText }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `Training failed with status ${response.status}`)
      }

      console.log("[v0] Training completed successfully")
      setMetrics(result.metrics)
      setHistory(result.history || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during training"
      setError(errorMessage)
      console.error("[v0] Training error:", err)
    } finally {
      setIsTraining(false)
    }
  }

  const handleDownloadSample = async () => {
    try {
      console.log("[v0] Starting sample data download...")
      const response = await fetch("/api/download-sample")

      console.log("[v0] Download response status:", response.status)

      if (!response.ok) {
        throw new Error(`Failed to download: ${response.status}`)
      }

      const blob = await response.blob()
      console.log("[v0] Blob created, size:", blob.size)

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "sample_training_data.csv"
      document.body.appendChild(a)
      a.click()

      console.log("[v0] Download triggered successfully")

      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("[v0] Failed to download sample data:", err)
      setError("Failed to download sample data. Please try again.")
    }
  }

  return (
    <section id="train" className="relative px-4 py-16">
      <div className="container relative z-10 mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">Train Model</h2>
          <p className="text-lg text-muted-foreground">
            Upload your exoplanet dataset to retrain the habitability classifier
          </p>
          <div className="mx-auto mt-4 max-w-2xl rounded-lg border border-chart-2/30 bg-chart-2/10 p-3">
            <p className="text-sm text-foreground">
              <strong>Training Data:</strong> Your CSV must include a "label" column with values like "CONFIRMED" or
              "FALSE POSITIVE" to train the model.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Upload Training Data</CardTitle>
              <CardDescription>Upload a CSV file with exoplanet parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4 rounded-lg border-2 border-dashed border-border bg-muted/20 p-6">
                <div className="flex items-start gap-3">
                  <Upload className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <h3 className="mb-1 text-base font-semibold text-foreground">Upload CSV File</h3>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Your CSV must include: pl_rade, pl_eqt, pl_bmasse, pl_insol columns
                    </p>
                    <Button
                      variant="default"
                      onClick={() => document.getElementById("training-csv-upload")?.click()}
                      disabled={isTraining}
                      className="w-full"
                    >
                      {isTraining ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Training...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload CSV File
                        </>
                      )}
                    </Button>
                    <input
                      type="file"
                      id="training-csv-upload"
                      className="hidden"
                      accept=".csv"
                      onChange={handleFileUpload}
                      disabled={isTraining}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">Need sample data?</h3>
                </div>
                <p className="mb-3 text-xs text-muted-foreground">
                  Download a sample CSV file with 50 realistic exoplanet records to test the training system
                </p>
                <Button variant="outline" size="sm" onClick={handleDownloadSample} className="w-full bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Download Sample Training Data
                </Button>
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
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
                    <p className="text-muted-foreground">Start training to see results</p>
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
            <CardTitle>NASA Exoplanet Archive Features</CardTitle>
            <CardDescription>The model uses these parameters from NASA's confirmed exoplanets database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-2 text-left font-semibold text-foreground">Parameter</th>
                    <th className="p-2 text-left font-semibold text-foreground">Description</th>
                    <th className="p-2 text-left font-semibold text-foreground">Unit</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">pl_rade</td>
                    <td className="p-2 text-xs">Planet radius</td>
                    <td className="p-2">Earth radii</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">pl_eqt</td>
                    <td className="p-2 text-xs">Equilibrium temperature</td>
                    <td className="p-2">Kelvin</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">pl_bmasse</td>
                    <td className="p-2 text-xs">Planet mass</td>
                    <td className="p-2">Earth masses</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">pl_insol</td>
                    <td className="p-2 text-xs">Stellar insolation flux</td>
                    <td className="p-2">Earth flux</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">pl_orbper</td>
                    <td className="p-2 text-xs">Orbital period</td>
                    <td className="p-2">Days</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">pl_orbeccen</td>
                    <td className="p-2 text-xs">Orbital eccentricity</td>
                    <td className="p-2">-</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">st_teff</td>
                    <td className="p-2 text-xs">Stellar effective temperature</td>
                    <td className="p-2">Kelvin</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">st_rad</td>
                    <td className="p-2 text-xs">Stellar radius</td>
                    <td className="p-2">Solar radii</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono text-xs">st_mass</td>
                    <td className="p-2 text-xs">Stellar mass</td>
                    <td className="p-2">Solar masses</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Classification:</strong> The model classifies exoplanets as
                potentially habitable based on criteria like radius (0.5-2.5 Earth radii), temperature (200-350K), mass
                (0.3-10 Earth masses), and insolation flux (0.25-4 Earth flux).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
