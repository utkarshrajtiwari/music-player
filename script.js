// Music Player Class with REAL AUDIO FILES
class MusicPlayer {
  constructor() {
    // Audio element and playlist
    this.audio = document.getElementById("audioPlayer");
    this.playlist = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isShuffle = false;
    this.isRepeat = false;

    // Get DOM elements
    this.playBtn = document.getElementById("playBtn");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.shuffleBtn = document.getElementById("shuffleBtn");
    this.repeatBtn = document.getElementById("repeatBtn");
    this.volumeSlider = document.getElementById("volumeSlider");
    this.volumeIcon = document.getElementById("volumeIcon");
    this.volumeText = document.getElementById("volumeText");
    this.progressBar = document.getElementById("progressBar");
    this.progress = document.getElementById("progress");
    this.currentTimeSpan = document.getElementById("currentTime");
    this.durationSpan = document.getElementById("duration");
    this.songTitle = document.getElementById("songTitle");
    this.artistName = document.getElementById("artistName");
    this.albumName = document.getElementById("albumName");
    this.albumArt = document.getElementById("albumArt");
    this.playlistContainer = document.getElementById("playlist");

    // Initialize
    this.init();
  }

  init() {
    console.log("🎵 Music Player with REAL AUDIO Initializing...");

    // Add event listeners
    this.playBtn.addEventListener("click", () => this.togglePlay());
    this.prevBtn.addEventListener("click", () => this.prevSong());
    this.nextBtn.addEventListener("click", () => this.nextSong());
    this.shuffleBtn.addEventListener("click", () => this.toggleShuffle());
    this.repeatBtn.addEventListener("click", () => this.toggleRepeat());

    // Volume controls
    this.volumeSlider.addEventListener("input", (e) =>
      this.setVolume(e.target.value)
    );
    this.volumeIcon.addEventListener("click", () => this.toggleMute());

    // Progress bar
    this.progressBar.addEventListener("click", (e) => this.seek(e));

    // Audio events
    this.audio.addEventListener("timeupdate", () => this.updateProgress());
    this.audio.addEventListener("ended", () => this.handleSongEnd());
    this.audio.addEventListener("loadedmetadata", () => this.updateDuration());
    this.audio.addEventListener("canplay", () => this.hideLoading());
    this.audio.addEventListener("loadstart", () => this.showLoading());
    this.audio.addEventListener("error", (e) => this.handleError(e));

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));

    // Load REAL audio files
    this.loadRealAudioSongs();

    // Set initial volume
    this.setVolume(50);

    console.log("✅ Music Player with REAL AUDIO Initialized!");
  }

  // Load songs with REAL working audio files
  loadRealAudioSongs() {
    const realAudioSongs = [
      {
        title: "Memories of a Friend",
        artist: "Gary Strausbaugh",
        album: "Bossa Nova Collection",
        src: "https://www.dropbox.com/s/xci6pjthkc751e8/Memories%20of%20a%20Friend.mp3?raw=1",
        duration: 244, // 4:04
      },
      {
        title: "What a Beautiful Sunset",
        artist: "Angelwing",
        album: "Smooth Jazz Piano",
        src: "https://www.dropbox.com/s/36gyipvdty81o51/What%20a%20beautiful%20Sunset%21%20%28radio%20mix%29%20-%20Angelwing.wav?raw=1",
        duration: 229, // 3:49
      },
      {
        title: "City Lights",
        artist: "The Lemming Shepherds",
        album: "Urban Vibes",
        src: "https://www.dropbox.com/s/mvvwaw1msplnteq/City%20Lights%20-%20The%20Lemming%20Shepherds.mp3?raw=1",
        duration: 75, // 1:15
      },
      {
        title: "Double Violin Concerto",
        artist: "J.S. Bach (Jon Sayles)",
        album: "Classical Guitar Bach",
        src: "https://www.dropbox.com/s/620qqip91g6td9t/Double%20Violin%20Concerto%201st%20Movement%20-%20J.S.%20Bach.mp3?raw=1",
        duration: 257, // 4:17
      },
      {
        title: "Robot Coupe",
        artist: "Lost European",
        album: "Synth Pop Collection",
        src: "https://www.dropbox.com/s/st4revqay97jncu/Robot%20Coupe%20-%20Lost%20European.wav?raw=1",
        duration: 237, // 3:57
      },
      {
        title: "The Calling",
        artist: "Angelwing",
        album: "New Age Guitar",
        src: "https://www.dropbox.com/s/ayf4cwdytqafs70/The%20Calling%20%20-%20Angelwing.mp3?raw=1",
        duration: 197, // 3:17
      },
    ];

    realAudioSongs.forEach((song) => this.addSong(song));

    // Select first song
    if (this.playlist.length > 0) {
      this.loadSong(0);
    }
  }

  // Add song to playlist
  addSong(songData) {
    this.playlist.push(songData);
    this.renderPlaylist();
    console.log(`✅ Added: ${songData.title} by ${songData.artist}`);
  }

  // Render playlist in sidebar
  renderPlaylist() {
    this.playlistContainer.innerHTML = "";

    this.playlist.forEach((song, index) => {
      const songElement = document.createElement("div");
      songElement.className = `playlist-item ${
        index === this.currentIndex ? "active" : ""
      }`;
      songElement.innerHTML = `
                <h4>${song.title}</h4>
                <p>${song.artist} • ${song.album}</p>
                <small style="color: #888; font-size: 0.8rem;">
                    <i class="fas fa-clock"></i> ${this.formatTime(
                      song.duration
                    )}
                </small>
            `;

      songElement.addEventListener("click", () => {
        this.loadSong(index);
        this.play();
      });

      this.playlistContainer.appendChild(songElement);
    });
  }

  // Load a song
  loadSong(index) {
    if (index < 0 || index >= this.playlist.length) return;

    const song = this.playlist[index];
    this.currentIndex = index;

    // Stop current playback
    this.pause();

    // Update UI
    this.songTitle.textContent = song.title;
    this.artistName.textContent = song.artist;
    this.albumName.textContent = song.album;

    // Update album art
    this.albumArt.innerHTML = '<i class="fas fa-music"></i>';

    // Load REAL audio file
    this.audio.src = song.src;
    this.audio.load();

    // Update playlist highlighting
    this.renderPlaylist();

    // Reset progress
    this.resetProgress();

    console.log(`🎵 Loaded: ${song.title} by ${song.artist}`);
    console.log(`🔗 Audio Source: ${song.src}`);
  }

  // Show loading state
  showLoading() {
    this.songTitle.style.opacity = "0.5";
    console.log("⏳ Loading audio...");
  }

  // Hide loading state
  hideLoading() {
    this.songTitle.style.opacity = "1";
    console.log("✅ Audio loaded successfully!");
  }

  // Handle audio errors
  handleError(e) {
    console.error("❌ Audio Error:", e);
    this.songTitle.textContent = "Audio Error - Try next song";
    setTimeout(() => {
      this.nextSong();
    }, 2000);
  }

  // Toggle play/pause
  togglePlay() {
    if (this.playlist.length === 0) {
      this.showMessage("Please add songs to playlist!");
      return;
    }

    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  // Play audio
  play() {
    if (!this.audio.src) {
      this.showMessage("No audio file loaded!");
      return;
    }

    this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        this.updatePlayButton();
        document.body.classList.add("playing");
        console.log("▶️ Playing:", this.playlist[this.currentIndex].title);
      })
      .catch((error) => {
        console.error("❌ Playback failed:", error);
        this.showMessage("Playback failed - Check audio file");
        this.nextSong();
      });
  }

  // Pause audio
  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updatePlayButton();
    document.body.classList.remove("playing");
    console.log("⏸️ Paused");
  }

  // Update play button icon
  updatePlayButton() {
    const icon = this.playBtn.querySelector("i");
    icon.className = this.isPlaying ? "fas fa-pause" : "fas fa-play";
  }

  // Previous song
  prevSong() {
    let newIndex = this.currentIndex - 1;
    if (newIndex < 0) newIndex = this.playlist.length - 1;

    this.loadSong(newIndex);
    if (this.isPlaying) {
      setTimeout(() => this.play(), 100);
    }
  }

  // Next song
  nextSong() {
    let newIndex;

    if (this.isShuffle) {
      do {
        newIndex = Math.floor(Math.random() * this.playlist.length);
      } while (newIndex === this.currentIndex && this.playlist.length > 1);
    } else {
      newIndex = this.currentIndex + 1;
      if (newIndex >= this.playlist.length) newIndex = 0;
    }

    this.loadSong(newIndex);
    if (this.isPlaying) {
      setTimeout(() => this.play(), 100);
    }
  }

  // Toggle shuffle
  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    this.shuffleBtn.classList.toggle("active", this.isShuffle);
    this.showMessage(`Shuffle: ${this.isShuffle ? "ON" : "OFF"}`);
    console.log(`🔀 Shuffle: ${this.isShuffle ? "ON" : "OFF"}`);
  }

  // Toggle repeat
  toggleRepeat() {
    this.isRepeat = !this.isRepeat;
    this.repeatBtn.classList.toggle("active", this.isRepeat);
    this.showMessage(`Repeat: ${this.isRepeat ? "ON" : "OFF"}`);
    console.log(`🔁 Repeat: ${this.isRepeat ? "ON" : "OFF"}`);
  }

  // Set volume
  setVolume(value) {
    const volume = Math.max(0, Math.min(100, value));
    this.audio.volume = volume / 100;
    this.volumeSlider.value = volume;
    this.volumeText.textContent = volume + "%";

    // Update volume icon
    if (volume === 0) {
      this.volumeIcon.className = "fas fa-volume-mute";
    } else if (volume < 50) {
      this.volumeIcon.className = "fas fa-volume-down";
    } else {
      this.volumeIcon.className = "fas fa-volume-up";
    }

    console.log(`🔊 Volume: ${volume}%`);
  }

  // Toggle mute
  toggleMute() {
    if (this.audio.volume > 0) {
      this.lastVolume = this.volumeSlider.value;
      this.setVolume(0);
    } else {
      this.setVolume(this.lastVolume || 50);
    }
  }

  // Seek in song
  seek(e) {
    if (!this.audio.duration) return;

    const rect = this.progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = percent * this.audio.duration;

    this.audio.currentTime = seekTime;
    console.log(`⏭️ Seeked to: ${this.formatTime(seekTime)}`);
  }

  // Update progress bar
  updateProgress() {
    if (this.audio.duration) {
      const percent = (this.audio.currentTime / this.audio.duration) * 100;
      this.progress.style.width = percent + "%";
      this.currentTimeSpan.textContent = this.formatTime(
        this.audio.currentTime
      );
    }
  }

  // Update duration display
  updateDuration() {
    if (this.audio.duration) {
      this.durationSpan.textContent = this.formatTime(this.audio.duration);
      console.log(`⏱️ Duration: ${this.formatTime(this.audio.duration)}`);
    }
  }

  // Reset progress
  resetProgress() {
    this.progress.style.width = "0%";
    this.currentTimeSpan.textContent = "0:00";
  }

  // Handle song end
  handleSongEnd() {
    console.log("🏁 Song ended");

    if (this.isRepeat) {
      this.audio.currentTime = 0;
      this.play();
    } else {
      this.nextSong();
    }
  }

  // Format time in MM:SS
  formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ":" + (secs < 10 ? "0" : "") + secs;
  }

  // Show message to user
  showMessage(message) {
    // Create toast notification
    const toast = document.createElement("div");
    toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1db954;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 1000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease";
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);

    console.log(`💬 Message: ${message}`);
  }

  // Handle keyboard shortcuts
  handleKeyboard(e) {
    if (e.target.tagName === "INPUT") return;

    switch (e.code) {
      case "Space":
        e.preventDefault();
        this.togglePlay();
        break;
      case "ArrowLeft":
        this.prevSong();
        break;
      case "ArrowRight":
        this.nextSong();
        break;
      case "ArrowUp":
        e.preventDefault();
        this.setVolume(parseInt(this.volumeSlider.value) + 10);
        break;
      case "ArrowDown":
        e.preventDefault();
        this.setVolume(parseInt(this.volumeSlider.value) - 10);
        break;
      case "KeyM":
        this.toggleMute();
        break;
    }
  }
}

// Global functions for modal
function openModal() {
  document.getElementById("addModal").style.display = "block";
  console.log("📝 Opening add song modal");
}

function closeModal() {
  document.getElementById("addModal").style.display = "none";
  document.getElementById("songForm").reset();
  console.log("❌ Closing add song modal");
}

// Global variable for music player
let player;

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 DOM Loaded - Starting Music Player with REAL AUDIO...");

  try {
    // Create music player instance
    player = new MusicPlayer();

    // Handle form submission for adding custom songs
    document
      .getElementById("songForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();

        const title = document.getElementById("titleInput").value;
        const artist = document.getElementById("artistInput").value;
        const album = document.getElementById("albumInput").value;
        const file = document.getElementById("fileInput").files[0];

        if (!title || !artist || !album) {
          alert("Please fill all fields!");
          return;
        }

        const songData = {
          title: title,
          artist: artist,
          album: album,
          src: file ? URL.createObjectURL(file) : "",
          duration: 180, // Default duration
        };

        // If audio file is uploaded, get its duration
        if (file) {
          const tempAudio = new Audio();
          tempAudio.onloadedmetadata = function () {
            songData.duration = tempAudio.duration;
            player.renderPlaylist(); // Re-render with correct duration
          };
          tempAudio.src = songData.src;
        }

        player.addSong(songData);
        closeModal();

        console.log(`✅ Added custom song: ${title} by ${artist}`);
      });

    // Close modal when clicking outside
    window.addEventListener("click", function (e) {
      const modal = document.getElementById("addModal");
      if (e.target === modal) {
        closeModal();
      }
    });

    // Add CSS for toast animations
    const style = document.createElement("style");
    style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
    document.head.appendChild(style);

    console.log("✅ All event listeners added successfully!");
  } catch (error) {
    console.error("❌ Error initializing music player:", error);
  }
});

// Instructions for user
console.log(`
🎵 SPOTIFY MUSIC PLAYER WITH REAL AUDIO FILES!
🎧 NOW YOU CAN ACTUALLY HEAR THE MUSIC!

⌨️ Keyboard Shortcuts:
• Space: Play/Pause  
• ← →: Previous/Next song
• ↑ ↓: Volume up/down
• M: Toggle mute
• Click progress bar to seek
• Click volume icon to mute

🎶 Features:
• 6 Real audio tracks loaded
• Working volume control
• Progress bar seeking
• Shuffle & repeat modes
• Add your own audio files
• Console logging for debugging

🔊 Click any song in the playlist to start playing REAL MUSIC!
`);

// Export player for debugging
window.player = player;
