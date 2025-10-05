import { NextResponse } from "next/server"

export async function GET() {
  try {
    const headers = [
      "name",
      "koi_period",
      "koi_duration",
      "koi_impact",
      "koi_depth",
      "koi_prad",
      "koi_insol",
      "koi_model_snr",
      "koi_srad",
      "koi_steff",
      "koi_slogg",
      "koi_fpflag_nt",
      "koi_fpflag_ss",
      "koi_fpflag_co",
      "koi_fpflag_ec",
      "ra",
      "dec",
      "pm_ra",
      "pm_dec",
    ]

    const rows: string[] = []

    for (let i = 0; i < 20; i++) {
      const row = [
        `Candidate-${String(i + 1).padStart(3, "0")}`,
        String((1 + Math.random() * 500).toFixed(3)),
        String((1 + Math.random() * 8).toFixed(2)),
        String(Math.random().toFixed(3)),
        String((100 + Math.random() * 5000).toFixed(1)),
        String((0.5 + Math.random() * 15).toFixed(2)),
        String((0.1 + Math.random() * 2000).toFixed(2)),
        String((10 + Math.random() * 100).toFixed(1)),
        String((0.5 + Math.random() * 2).toFixed(3)),
        String((4000 + Math.random() * 3000).toFixed(1)),
        String((3.5 + Math.random() * 1.5).toFixed(3)),
        String(Math.random() > 0.9 ? 1 : 0),
        String(Math.random() > 0.95 ? 1 : 0),
        String(Math.random() > 0.95 ? 1 : 0),
        String(Math.random() > 0.95 ? 1 : 0),
        String((Math.random() * 360).toFixed(4)),
        String((-90 + Math.random() * 180).toFixed(4)),
        String((-50 + Math.random() * 100).toFixed(2)),
        String((-50 + Math.random() * 100).toFixed(2)),
      ]

      rows.push(row.join(","))
    }

    const csv = [headers.join(","), ...rows].join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="sample_prediction_data.csv"',
      },
    })
  } catch (error) {
    console.error("[v0] Error generating sample prediction data:", error)
    return NextResponse.json({ error: "Failed to generate sample data" }, { status: 500 })
  }
}
