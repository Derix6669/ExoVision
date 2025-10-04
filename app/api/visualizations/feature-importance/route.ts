import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

export async function GET() {
  try {
    const metricsFile = join(process.cwd(), "data", "latest_metrics.json")

    try {
      const data = await readFile(metricsFile, "utf-8")
      const { feature_importance } = JSON.parse(data)

      // Convert to array format expected by frontend
      const features = Object.entries(feature_importance).map(([name, importance]) => ({
        name,
        importance: importance as number,
      }))

      return NextResponse.json({ features })
    } catch (fileError) {
      console.log("[v0] No feature importance data found")
      return NextResponse.json({
        features: [],
        message: "No model has been trained yet",
      })
    }
  } catch (error) {
    console.error("[v0] Feature importance error:", error)
    return NextResponse.json({ error: "Failed to generate feature importance" }, { status: 500 })
  }
}
