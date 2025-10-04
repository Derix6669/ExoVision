import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock model metrics
    const metrics = {
      accuracy: 0.956,
      precision: 0.948,
      recall: 0.968,
      f1_score: 0.958,
      auc_roc: 0.982,
      total_samples: 1850,
      training_time: "2.3s",
      model_type: "Random Forest",
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error("[v0] Metrics error:", error)
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
