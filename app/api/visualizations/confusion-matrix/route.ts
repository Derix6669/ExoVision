import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock confusion matrix data
    const confusionMatrix = {
      matrix: [
        [850, 50], // True Negatives, False Positives
        [30, 920], // False Negatives, True Positives
      ],
      labels: ["False Positive", "Confirmed"],
      metrics: {
        accuracy: 0.956,
        precision: 0.948,
        recall: 0.968,
        f1_score: 0.958,
      },
    }

    return NextResponse.json(confusionMatrix)
  } catch (error) {
    console.error("[v0] Confusion matrix error:", error)
    return NextResponse.json({ error: "Failed to generate confusion matrix" }, { status: 500 })
  }
}
