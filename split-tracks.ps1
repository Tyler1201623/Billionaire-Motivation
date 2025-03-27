$tracks = @(
    "Buffett Circle",
    "Dalio Pain",
    "Goggins Hard", 
    "Jobs Hungry",
    "Peterson Responsibility"
)

foreach ($track in $tracks) {
    Write-Host "Processing $track..."
    & ffmpeg -i "sounds/$track.mp4" -ss 0 -t 15 -c copy "sounds/${track}_15sec.mp4"
}

Write-Host "All tracks split successfully!"
