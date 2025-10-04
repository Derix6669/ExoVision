// Shared model statistics storage
let trainedModelStats: any = null

export function setModelStats(stats: any) {
  trainedModelStats = stats
  console.log("[v0] Model stats updated in shared store")
}

export function getModelStats() {
  return trainedModelStats
}

export function hasTrainedModel(): boolean {
  return trainedModelStats !== null
}
