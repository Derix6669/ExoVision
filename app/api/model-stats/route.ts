import { NextResponse } from "next/server"
import { getModelStats, hasTrainedModel } from "@/lib/model-store"

export async function GET() {
  return NextResponse.json({
    model_trained: hasTrainedModel(),
    stats: getModelStats(),
  })
}
