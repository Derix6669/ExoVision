import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Generate sample CSV data
    const headers = [
      "source",
      "host_name",
      "discovery_year",
      "discovery_method",
      "pl_rade",
      "pl_bmasse",
      "pl_dens",
      "pl_orbper",
      "pl_eqt",
      "pl_insol",
      "pl_orbsmax",
      "pl_orbeccen",
      "pl_orbincl",
      "pl_tranmid",
      "pl_imppar",
      "pl_trandep",
      "pl_trandur",
      "pl_ratdor",
      "pl_ratror",
      "st_teff",
      "st_logg",
      "st_rad",
      "st_mass",
      "st_dens",
      "st_met",
      "st_lum",
      "st_age",
      "st_vsini",
      "st_rotp",
      "ra",
      "dec",
      "sy_dist",
      "sy_pm",
      "sy_pmra",
      "sy_pmdec",
      "sy_plx",
      "sy_vmag",
      "sy_jmag",
      "sy_hmag",
      "sy_kmag",
      "sy_gaiamag",
      "toi",
      "kepid",
      "k2_name",
      "epic_candname",
      "tic_id",
      "koi_score",
      "koi_fpflag_nt",
      "koi_fpflag_ss",
      "koi_fpflag_co",
      "koi_fpflag_ec",
      "disposition",
    ]

    // Generate 50 sample rows with realistic data
    const rows: string[] = []

    for (let i = 0; i < 50; i++) {
      const isConfirmed = Math.random() > 0.4
      const source = ["Kepler", "TESS", "K2", "Ground"][Math.floor(Math.random() * 4)]
      const method = ["Transit", "Radial Velocity", "Imaging"][Math.floor(Math.random() * 3)]

      const row = [
        source,
        `Star-${String(i).padStart(4, "0")}`,
        String(2009 + Math.floor(Math.random() * 15)),
        method,
        String(0.5 + Math.random() * 5), // pl_rade
        String(0.5 + Math.random() * 10), // pl_bmasse
        String(0.5 + Math.random() * 8), // pl_dens
        String(1 + Math.random() * 500), // pl_orbper
        String(300 + Math.random() * 1500), // pl_eqt
        String(0.1 + Math.random() * 10), // pl_insol
        String(0.01 + Math.random() * 5), // pl_orbsmax
        String(Math.random() * 0.5), // pl_orbeccen
        String(85 + Math.random() * 5), // pl_orbincl
        String(2454900 + Math.random() * 4000), // pl_tranmid
        String(Math.random()), // pl_imppar
        String(0.001 + Math.random() * 0.04), // pl_trandep
        String(1 + Math.random() * 8), // pl_trandur
        String(10 + Math.random() * 30), // pl_ratdor
        String(0.02 + Math.random() * 0.15), // pl_ratror
        String(4500 + Math.random() * 2000), // st_teff
        String(4 + Math.random()), // st_logg
        String(0.5 + Math.random() * 2), // st_rad
        String(0.5 + Math.random() * 2), // st_mass
        String(0.5 + Math.random() * 4), // st_dens
        String(-0.5 + Math.random()), // st_met
        String(0.1 + Math.random() * 5), // st_lum
        String(1 + Math.random() * 10), // st_age
        String(Math.random() * 15), // st_vsini
        String(10 + Math.random() * 30), // st_rotp
        String(Math.random() * 360), // ra
        String(-90 + Math.random() * 180), // dec
        String(50 + Math.random() * 500), // sy_dist
        String(Math.random() * 50), // sy_pm
        String(-50 + Math.random() * 100), // sy_pmra
        String(-50 + Math.random() * 100), // sy_pmdec
        String(0.5 + Math.random() * 20), // sy_plx
        String(10 + Math.random() * 5), // sy_vmag
        String(9 + Math.random() * 5), // sy_jmag
        String(9 + Math.random() * 5), // sy_hmag
        String(9 + Math.random() * 5), // sy_kmag
        String(10 + Math.random() * 5), // sy_gaiamag
        Math.random() > 0.7 ? `TOI-${i}` : "", // toi
        Math.random() > 0.5 ? String(1000000 + Math.floor(Math.random() * 8999999)) : "", // kepid
        Math.random() > 0.8 ? `K2-${i}` : "", // k2_name
        Math.random() > 0.8 ? `EPIC-${100000 + Math.floor(Math.random() * 899999)}` : "", // epic_candname
        Math.random() > 0.6 ? String(10000000 + Math.floor(Math.random() * 89999999)) : "", // tic_id
        String(0.5 + Math.random() * 0.5), // koi_score
        String(Math.random() > 0.9 ? 1 : 0), // koi_fpflag_nt
        String(Math.random() > 0.95 ? 1 : 0), // koi_fpflag_ss
        String(Math.random() > 0.95 ? 1 : 0), // koi_fpflag_co
        String(Math.random() > 0.95 ? 1 : 0), // koi_fpflag_ec
        isConfirmed ? "CONFIRMED" : "FALSE POSITIVE",
      ]

      rows.push(row.join(","))
    }

    const csv = [headers.join(","), ...rows].join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="sample_training_data.csv"',
      },
    })
  } catch (error) {
    console.error("[v0] Error generating sample data:", error)
    return NextResponse.json({ error: "Failed to generate sample data" }, { status: 500 })
  }
}
