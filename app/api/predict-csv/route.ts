import { type NextRequest, NextResponse } from "next/server"
import { getModelStats } from "@/lib/model-store"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ detail: "No file provided" }, { status: 400 })
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json({ detail: "File must be a CSV file" }, { status: 400 })
    }

    const text = await file.text()
    const lines = text.split("\n").filter((line) => line.trim())

    if (lines.length < 2) {
      return NextResponse.json({ detail: "CSV file is empty or invalid" }, { status: 400 })
    }

    const header = lines[0].split(",").map((h) => h.trim())
    console.log("[v0] CSV headers:", header)

    const columnMapping: Record<string, string> = {
      orbital_period: "koi_period",
      transit_duration: "koi_duration",
      impact_parameter: "koi_impact",
      transit_depth: "koi_depth",
      planet_radius: "koi_prad",
      insolation_flux: "koi_insol",
      signal_to_noise: "koi_model_snr",
      stellar_radius: "koi_srad",
      effective_temp: "koi_steff",
      surface_gravity: "koi_slogg",
      fp_not_transit_like: "koi_fpflag_nt",
      fp_stellar_eclipse: "koi_fpflag_ss",
      fp_centroid_offset: "koi_fpflag_co",
      fp_ephemeris_match: "koi_fpflag_ec",
      pmra: "pm_ra",
      pmdec: "pm_dec",
    }

    const model = getModelStats()
    console.log("[v0] Model available:", model !== null)
    if (model) {
      console.log("[v0] Model features:", model.features)
      console.log("[v0] Model confirmed count:", model.confirmed.count)
      console.log("[v0] Model false positive count:", model.falsePositive.count)
    }

    const predictions = []
    let exoplanetCount = 0
    let notExoplanetCount = 0

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim())
      const row: Record<string, number> = {}

      header.forEach((col, idx) => {
        const value = values[idx]
        const num = Number.parseFloat(value)
        const mappedCol = columnMapping[col] || col
        row[mappedCol] = Number.isNaN(num) ? 0 : num
      })

      const features = {
        koi_period: row.koi_period || 0,
        koi_duration: row.koi_duration || 0,
        koi_impact: row.koi_impact || 0,
        koi_depth: row.koi_depth || 0,
        koi_prad: row.koi_prad || 0,
        koi_insol: row.koi_insol || 0,
        koi_model_snr: row.koi_model_snr || 0,
        koi_srad: row.koi_srad || 0,
        koi_steff: row.koi_steff || 0,
        koi_slogg: row.koi_slogg || 0,
        koi_fpflag_nt: row.koi_fpflag_nt || 0,
        koi_fpflag_ss: row.koi_fpflag_ss || 0,
        koi_fpflag_co: row.koi_fpflag_co || 0,
        koi_fpflag_ec: row.koi_fpflag_ec || 0,
      }

      if (i <= 3) {
        console.log(`[v0] Row ${i} features:`, features)
      }

      let isConfirmed: boolean
      let confidence: number

      if (model) {
        const result = classifyWithTrainedModel(features, model)
        isConfirmed = result.isConfirmed
        confidence = result.confidence
        if (i <= 3) {
          console.log(`[v0] Row ${i} trained model result:`, { isConfirmed, confidence })
        }
      } else {
        const result = classifyWithHeuristic(features)
        isConfirmed = result.isConfirmed
        confidence = result.confidence
        if (i <= 3) {
          console.log(`[v0] Row ${i} heuristic result:`, { isConfirmed, confidence })
        }
      }

      if (isConfirmed) exoplanetCount++
      else notExoplanetCount++

      predictions.push({
        row: i,
        prediction: isConfirmed ? "exoplanet" : "not-exoplanet",
        confidence,
        probabilities: {
          not_exoplanet: isConfirmed ? 1 - confidence : confidence,
          exoplanet: isConfirmed ? confidence : 1 - confidence,
        },
      })
    }

    console.log("[v0] CSV prediction summary:", {
      total: predictions.length,
      exoplanet: exoplanetCount,
      not_exoplanet: notExoplanetCount,
      model_used: model ? "trained" : "heuristic",
    })

    return NextResponse.json({
      predictions,
      summary: {
        total: predictions.length,
        exoplanet: exoplanetCount,
        not_exoplanet: notExoplanetCount,
        avg_confidence: predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length,
        model_used: model ? "trained" : "heuristic",
      },
    })
  } catch (error) {
    console.error("[v0] CSV prediction error:", error)
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "CSV prediction failed" },
      { status: 500 },
    )
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
