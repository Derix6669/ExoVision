import { type NextRequest, NextResponse } from "next/server"
import { getModelStats } from "@/lib/model-store"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Received prediction request")

    const features = {
      koi_period: Number.parseFloat(body.koi_period) || 0,
      koi_duration: Number.parseFloat(body.koi_duration) || 0,
      koi_impact: Number.parseFloat(body.koi_impact) || 0,
      koi_depth: Number.parseFloat(body.koi_depth) || 0,
      koi_prad: Number.parseFloat(body.koi_prad) || 0,
      koi_insol: Number.parseFloat(body.koi_insol) || 0,
      koi_model_snr: Number.parseFloat(body.koi_model_snr) || 0,
      koi_srad: Number.parseFloat(body.koi_srad) || 0,
      koi_steff: Number.parseFloat(body.koi_steff) || 0,
      koi_slogg: Number.parseFloat(body.koi_slogg) || 0,
      koi_fpflag_nt: Number.parseFloat(body.koi_fpflag_nt) || 0,
      koi_fpflag_ss: Number.parseFloat(body.koi_fpflag_ss) || 0,
      koi_fpflag_co: Number.parseFloat(body.koi_fpflag_co) || 0,
      koi_fpflag_ec: Number.parseFloat(body.koi_fpflag_ec) || 0,
    }

    const model = getModelStats()

    let isConfirmed: boolean
    let confidence: number

    if (model) {
      console.log("[v0] Using trained model for prediction")
      const result = classifyWithTrainedModel(features, model)
      isConfirmed = result.isConfirmed
      confidence = result.confidence
    } else {
      console.log("[v0] No trained model, using heuristic fallback")
      const result = classifyWithHeuristic(features)
      isConfirmed = result.isConfirmed
      confidence = result.confidence
    }

    const prediction = isConfirmed ? "exoplanet" : "not-exoplanet"

    console.log("[v0] Prediction:", prediction, "Confidence:", confidence.toFixed(3))

    return NextResponse.json({
      prediction,
      confidence,
      probabilities: {
        not_exoplanet: isConfirmed ? 1 - confidence : confidence,
        exoplanet: isConfirmed ? confidence : 1 - confidence,
      },
      classification: isConfirmed ? "CONFIRMED" : "FALSE POSITIVE",
      model_used: model ? "trained" : "heuristic",
    })
  } catch (error) {
    console.error("[v0] Prediction error:", error)
    return NextResponse.json({ detail: error instanceof Error ? error.message : "Prediction failed" }, { status: 500 })
  }
}

function classifyWithTrainedModel(
  features: Record<string, number>,
  model: any,
): { isConfirmed: boolean; confidence: number } {
  let confirmedScore = 0
  let falsePositiveScore = 0

  model.features.forEach((feature: string) => {
    const value = features[feature as keyof typeof features] || 0

    const confirmedMean = model.confirmed.means[feature] || 0
    const confirmedStd = model.confirmed.stds[feature] || 1
    const fpMean = model.falsePositive.means[feature] || 0
    const fpStd = model.falsePositive.stds[feature] || 1

    const confirmedDist = Math.abs(value - confirmedMean) / confirmedStd
    const fpDist = Math.abs(value - fpMean) / fpStd

    confirmedScore += Math.exp((-confirmedDist * confirmedDist) / 2)
    falsePositiveScore += Math.exp((-fpDist * fpDist) / 2)
  })

  const confirmedPrior = 0.5
  const fpPrior = 0.5

  confirmedScore *= confirmedPrior
  falsePositiveScore *= fpPrior

  const totalScore = confirmedScore + falsePositiveScore
  const confirmedProb = confirmedScore / totalScore

  return {
    isConfirmed: confirmedProb > 0.5,
    confidence: Math.max(confirmedProb, 1 - confirmedProb),
  }
}

function classifyWithHeuristic(features: Record<string, number>): { isConfirmed: boolean; confidence: number } {
  let score = 0.5

  if (features.koi_period >= 0.5 && features.koi_period <= 5000) score += 0.12
  else if (features.koi_period > 0) score -= 0.1

  if (features.koi_duration >= 0.5 && features.koi_duration <= 12) score += 0.08
  else if (features.koi_duration > 0) score -= 0.05

  if (features.koi_impact >= 0 && features.koi_impact <= 0.9) score += 0.06

  if (features.koi_depth >= 100 && features.koi_depth <= 50000) score += 0.1
  else if (features.koi_depth > 0) score -= 0.08

  if (features.koi_prad >= 0.5 && features.koi_prad <= 20) score += 0.12
  else if (features.koi_prad > 0) score -= 0.1

  if (features.koi_insol >= 0.1 && features.koi_insol <= 5000) score += 0.05

  if (features.koi_model_snr >= 15) score += 0.15
  else if (features.koi_model_snr >= 10) score += 0.08
  else if (features.koi_model_snr > 0) score -= 0.05

  if (features.koi_srad >= 0.5 && features.koi_srad <= 2) score += 0.06
  if (features.koi_steff >= 4000 && features.koi_steff <= 7000) score += 0.06
  if (features.koi_slogg >= 3.5 && features.koi_slogg <= 5) score += 0.04

  if (features.koi_fpflag_nt > 0) score -= 0.2
  if (features.koi_fpflag_ss > 0) score -= 0.15
  if (features.koi_fpflag_co > 0) score -= 0.15
  if (features.koi_fpflag_ec > 0) score -= 0.1

  score = Math.max(0, Math.min(1, score))

  const isConfirmed = score > 0.6
  const confidence = isConfirmed ? Math.min(0.65 + score * 0.3, 0.98) : Math.min(0.65 + (1 - score) * 0.3, 0.95)

  return { isConfirmed, confidence }
}
