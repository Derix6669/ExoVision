"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, PieChart, Activity, Brain, Loader2 } from "lucide-react"

interface ConfusionMatrix {
  matrix: number[][]
  labels: string[]
  metrics: {
    accuracy: number
    precision: number
    recall: number
    f1_score: number
  }
}

interface FeatureImportance {
  features: Array<{ name: string; importance: number }>
}

interface ShapData {
  features: Array<{ name: string; value: number; shap: number }>
  baseValue: number
  prediction: number
}

interface Metrics {
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  auc_roc: number
  total_samples: number
  training_time: string
  model_type: string
}

export function VisualizationSection() {
  const [confusionMatrix, setConfusionMatrix] = useState<ConfusionMatrix | null>(null)
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance | null>(null)
  const [shapData, setShapData] = useState<ShapData | null>(null)
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVisualizations = async () => {
      setIsLoading(true)
      try {
        const [confusionRes, featureRes, shapRes, metricsRes] = await Promise.all([
          fetch("/api/visualizations/confusion-matrix"),
          fetch("/api/visualizations/feature-importance"),
          fetch("/api/visualizations/shap"),
          fetch("/api/visualizations/metrics"),
        ])

        if (confusionRes.ok) setConfusionMatrix(await confusionRes.json())
        if (featureRes.ok) setFeatureImportance(await featureRes.json())
        if (shapRes.ok) setShapData(await shapRes.json())
        if (metricsRes.ok) setMetrics(await metricsRes.json())
      } catch (error) {
        console.error("[v0] Visualization fetch error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVisualizations()
  }, [])

  if (isLoading) {
    return (
      <section id="visualize" className="relative px-4 py-16">
        <div className="container relative z-10 mx-auto max-w-6xl">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="visualize" className="relative px-4 py-16">
      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">Explainable AI</h2>
          <p className="text-lg text-muted-foreground">
            Understand how the model makes predictions with interactive visualizations
          </p>
        </div>

        <Tabs defaultValue="confusion" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="confusion">Confusion Matrix</TabsTrigger>
            <TabsTrigger value="features">Feature Importance</TabsTrigger>
            <TabsTrigger value="shap">SHAP Values</TabsTrigger>
            <TabsTrigger value="metrics">Model Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="confusion" className="mt-6">
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 inline-flex rounded-lg bg-muted/50 p-3">
                  <PieChart className="h-6 w-6 text-chart-2" />
                </div>
                <CardTitle>Confusion Matrix</CardTitle>
                <CardDescription>Model performance breakdown by class</CardDescription>
              </CardHeader>
              <CardContent>
                {confusionMatrix && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      {confusionMatrix.matrix.map((row, i) =>
                        row.map((value, j) => (
                          <div
                            key={`${i}-${j}`}
                            className={`rounded-lg p-6 text-center ${
                              i === j
                                ? "bg-chart-2/20 border-2 border-chart-2"
                                : "bg-destructive/20 border-2 border-destructive"
                            }`}
                          >
                            <div className="text-3xl font-bold text-foreground">{value}</div>
                            <div className="mt-2 text-sm text-muted-foreground">
                              {i === 0 && j === 0 && "True Negatives"}
                              {i === 0 && j === 1 && "False Positives"}
                              {i === 1 && j === 0 && "False Negatives"}
                              {i === 1 && j === 1 && "True Positives"}
                            </div>
                          </div>
                        )),
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="rounded-lg bg-muted/30 p-4 text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {(confusionMatrix.metrics.accuracy * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Accuracy</div>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-4 text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {(confusionMatrix.metrics.precision * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Precision</div>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-4 text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {(confusionMatrix.metrics.recall * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Recall</div>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-4 text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {(confusionMatrix.metrics.f1_score * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">F1 Score</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 inline-flex rounded-lg bg-muted/50 p-3">
                  <BarChart3 className="h-6 w-6 text-chart-1" />
                </div>
                <CardTitle>Feature Importance</CardTitle>
                <CardDescription>Top features contributing to classification decisions</CardDescription>
              </CardHeader>
              <CardContent>
                {featureImportance && (
                  <div className="space-y-4">
                    {featureImportance.features.map((feature) => (
                      <div key={feature.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground">{feature.name}</span>
                          <span className="text-muted-foreground">{(feature.importance * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-gradient-to-r from-chart-1 to-chart-2"
                            style={{ width: `${feature.importance * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shap" className="mt-6">
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 inline-flex rounded-lg bg-muted/50 p-3">
                  <Activity className="h-6 w-6 text-chart-3" />
                </div>
                <CardTitle>SHAP Analysis</CardTitle>
                <CardDescription>Explainable AI for individual predictions</CardDescription>
              </CardHeader>
              <CardContent>
                {shapData && (
                  <div className="space-y-6">
                    <div className="rounded-lg bg-muted/30 p-4">
                      <div className="mb-2 text-sm text-muted-foreground">Prediction</div>
                      <div className="text-3xl font-bold text-foreground">
                        {(shapData.prediction * 100).toFixed(1)}%
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Base value: {(shapData.baseValue * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="space-y-3">
                      {shapData.features.map((feature) => (
                        <div key={feature.name} className="rounded-lg bg-muted/20 p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-medium text-foreground">{feature.name}</span>
                            <span className="text-sm text-muted-foreground">Value: {feature.value}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                  className={`h-full ${feature.shap > 0 ? "bg-chart-2" : "bg-destructive"}`}
                                  style={{ width: `${Math.abs(feature.shap) * 100}%` }}
                                />
                              </div>
                            </div>
                            <span
                              className={`text-sm font-semibold ${feature.shap > 0 ? "text-chart-2" : "text-destructive"}`}
                            >
                              {feature.shap > 0 ? "+" : ""}
                              {feature.shap.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="mt-6">
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 inline-flex rounded-lg bg-muted/50 p-3">
                  <Brain className="h-6 w-6 text-chart-4" />
                </div>
                <CardTitle>Model Metrics</CardTitle>
                <CardDescription>Comprehensive performance statistics</CardDescription>
              </CardHeader>
              <CardContent>
                {metrics && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg bg-gradient-to-br from-chart-1/20 to-chart-2/20 p-6">
                      <div className="text-4xl font-bold text-foreground">{(metrics.accuracy * 100).toFixed(2)}%</div>
                      <div className="mt-2 text-sm text-muted-foreground">Accuracy</div>
                    </div>
                    <div className="rounded-lg bg-gradient-to-br from-chart-2/20 to-chart-3/20 p-6">
                      <div className="text-4xl font-bold text-foreground">{(metrics.precision * 100).toFixed(2)}%</div>
                      <div className="mt-2 text-sm text-muted-foreground">Precision</div>
                    </div>
                    <div className="rounded-lg bg-gradient-to-br from-chart-3/20 to-chart-4/20 p-6">
                      <div className="text-4xl font-bold text-foreground">{(metrics.recall * 100).toFixed(2)}%</div>
                      <div className="mt-2 text-sm text-muted-foreground">Recall</div>
                    </div>
                    <div className="rounded-lg bg-gradient-to-br from-chart-4/20 to-chart-1/20 p-6">
                      <div className="text-4xl font-bold text-foreground">{(metrics.f1_score * 100).toFixed(2)}%</div>
                      <div className="mt-2 text-sm text-muted-foreground">F1 Score</div>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-6">
                      <div className="text-4xl font-bold text-foreground">{(metrics.auc_roc * 100).toFixed(2)}%</div>
                      <div className="mt-2 text-sm text-muted-foreground">AUC-ROC</div>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-6">
                      <div className="text-4xl font-bold text-foreground">{metrics.total_samples}</div>
                      <div className="mt-2 text-sm text-muted-foreground">Total Samples</div>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-6">
                      <div className="text-4xl font-bold text-foreground">{metrics.training_time}</div>
                      <div className="mt-2 text-sm text-muted-foreground">Training Time</div>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-6">
                      <div className="text-4xl font-bold text-foreground">{metrics.model_type}</div>
                      <div className="mt-2 text-sm text-muted-foreground">Model Type</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
