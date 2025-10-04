import { NextResponse } from "next/server"

export async function GET() {
  const csvContent = `orbital_period,transit_duration,transit_depth,planet_radius,signal_to_noise,koi_score,label
54.32,3.45,0.0012,1.8,15.6,0.85,1
89.76,4.21,0.0018,2.3,22.4,0.92,1
12.45,2.11,0.0008,1.2,8.9,0.45,0
145.67,5.67,0.0025,3.1,28.7,0.95,1
23.89,2.89,0.0009,1.5,11.2,0.52,0
67.34,3.78,0.0015,2.0,18.3,0.78,1
98.12,4.56,0.0020,2.5,25.1,0.88,1
34.56,3.12,0.0011,1.6,13.4,0.61,0
156.78,6.23,0.0028,3.4,31.2,0.97,1
45.23,3.34,0.0013,1.9,16.8,0.73,1`

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=exoplanet_training_template.csv",
    },
  })
}
