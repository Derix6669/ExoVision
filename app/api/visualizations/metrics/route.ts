import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

export async function GET() {
  try {
    const metricsFile = join(process.cwd(), "data", "latest_metrics.json")

    try {
      const data = await readFile(metricsFile, "utf-8")
      const { metrics, timestamp } = JSON.parse(data)

      return NextResponse.json({
        ...metrics,
        model_type: "Random Forest",
        last_trained: timestamp,
      })
    } catch (fileError) {
      console.log("[v0] No trained model metrics found, returning default")
      return NextResponse.json({
        accuracy: null,
        precision: null,
        recall: null,
        f1_score: null,
        total_samples: 0,
        model_type: "Not trained",
        message: "No model has been trained yet. Upload training data to begin.",
      })
    }
  } catch (error) {
    console.error("[v0] Metrics error:", error)
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
