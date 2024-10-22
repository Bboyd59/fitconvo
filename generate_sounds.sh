#!/bin/bash

mkdir -p static/sounds

# Generate initiate sound
ffmpeg -f lavfi -i "sine=frequency=1000:duration=0.5" -af "afade=t=in:st=0:d=0.1,afade=t=out:st=0.4:d=0.1" static/sounds/initiate.mp3

# Generate terminate sound
ffmpeg -f lavfi -i "sine=frequency=500:duration=0.5" -af "afade=t=in:st=0:d=0.1,afade=t=out:st=0.4:d=0.1" static/sounds/terminate.mp3

# Generate keypress sound
ffmpeg -f lavfi -i "sine=frequency=2000:duration=0.05" -af "afade=t=in:st=0:d=0.01,afade=t=out:st=0.04:d=0.01" static/sounds/keypress.mp3

# Generate response sound
ffmpeg -f lavfi -i "sine=frequency=1500:duration=0.2" -af "afade=t=in:st=0:d=0.05,afade=t=out:st=0.15:d=0.05" static/sounds/response.mp3

echo "Sound effects generated successfully!"
