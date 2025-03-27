# Configuration for 15-second motivational clips
$downloadPath = "C:\Users\ty\Desktop\Best Programs I Created\Billionaire Motivation .mp3\sounds"

# Each clip is precisely 15 seconds or less for optimal motivation delivery
$clips = @(
    # Warren Buffett's Key 15-sec Wisdom Segments
    @{name="Buffett Success.mp4"; url="https://www.youtube.com/watch?v=PX5-XyBNi00"; time="0:00-0:15"},
    @{name="Buffett Mindset.mp4"; url="https://www.youtube.com/watch?v=PX5-XyBNi00"; time="1:00-1:15"},
    @{name="Buffett Wisdom.mp4"; url="https://www.youtube.com/watch?v=PX5-XyBNi00"; time="2:00-2:15"},
    
    # Ray Dalio's 15-sec Power Insights
    @{name="Dalio Pain1.mp4"; url="https://www.youtube.com/watch?v=B9XGUpQZY38"; time="0:00-0:15"},
    @{name="Dalio Growth.mp4"; url="https://www.youtube.com/watch?v=B9XGUpQZY38"; time="1:30-1:45"},
    @{name="Dalio Learning.mp4"; url="https://www.youtube.com/watch?v=B9XGUpQZY38"; time="3:00-3:15"},
    
    # Steve Jobs' 15-sec Game-Changing Moments
    @{name="Jobs Vision.mp4"; url="https://www.youtube.com/watch?v=Tuw8hxrFBH8"; time="0:00-0:15"},
    @{name="Jobs Innovation.mp4"; url="https://www.youtube.com/watch?v=Tuw8hxrFBH8"; time="1:15-1:30"},
    @{name="Jobs Legacy.mp4"; url="https://www.youtube.com/watch?v=Tuw8hxrFBH8"; time="2:45-3:00"},
    
    # David Goggins' 15-sec Mental Toughness
    @{name="Goggins Mental.mp4"; url="https://www.youtube.com/watch?v=TLKxdTmk-zc"; time="0:00-0:15"},
    @{name="Goggins Drive.mp4"; url="https://www.youtube.com/watch?v=TLKxdTmk-zc"; time="1:45-2:00"},
    @{name="Goggins Power.mp4"; url="https://www.youtube.com/watch?v=TLKxdTmk-zc"; time="3:15-3:30"},
    
    # Jordan Peterson's 15-sec Responsibility Clips
    @{name="Peterson Purpose.mp4"; url="https://www.youtube.com/watch?v=YL_6OMPywnQ"; time="0:00-0:15"},
    @{name="Peterson Growth.mp4"; url="https://www.youtube.com/watch?v=YL_6OMPywnQ"; time="2:00-2:15"},
    @{name="Peterson Action.mp4"; url="https://www.youtube.com/watch?v=YL_6OMPywnQ"; time="4:00-4:15"}
)

# Download each clip with exact 15-second timing using yt-dlp
foreach ($clip in $clips) {
    Write-Host "Downloading $($clip.name)..."
    # --download-sections parameter ensures each clip is exactly 15 seconds
    & yt-dlp --format "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" --download-sections "*$($clip.time)" -o "$downloadPath\$($clip.name)" $clip.url
}

Write-Host "All 15-second motivational clips downloaded successfully!"
