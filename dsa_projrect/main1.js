// Node for doubly linked list
function Node(data) {
  this.data = data;
  this.prev = null;
  this.next = null;
}

// Doubly linked list
function DoublyLinkedList() {
  this.head = null;
  this.tail = null;

  this.add = function (data) {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
  };

  // Add a method to remove a node
  this.remove = function (node) {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
  };

  // Add a method to search for a song and play it
  this.searchAndPlay = function (searchTerm) {
    let current = this.head;
    while (current) {
      if (current.data.toLowerCase().includes(searchTerm)) {
        playSong(current);
        return; // Stop searching after the first match
      }
      current = current.next;
    }

    // If the song is not found, you can display a message or handle it as needed
    alert("Song not found");
  };
}

const songList = new DoublyLinkedList();
const playlist = new DoublyLinkedList();
let currentSongNode = null;

// Sample songs
songList.add("abcdefu");
songList.add("Afghan Jalebi");
songList.add("Ainvayi Ainvayi");
songList.add("Apna Time Aayega");
songList.add("Back In Black");
songList.add("Chaleya");
songList.add("Lover(Taylor Swift)");

const audio = document.getElementById("audio");
//changes made for search

function searchSong() {
  const searchInput = document.getElementById("search-input");
  const searchTerm = searchInput.value.trim().toLowerCase();

  // Search for the song in the songList
  let songFound = false;
  let current = songList.head;
  while (current) {
    if (current.data.toLowerCase().includes(searchTerm)) {
      playSong(current);
      songFound = true;
      break; // Stop searching after the first match
    }
    current = current.next;
  }

  // Display the "Song not found" pop-up message
  const notFoundMessage = document.getElementById("not-found-message");
  if (!songFound) {
    notFoundMessage.style.opacity = 1;
    notFoundMessage.style.display = "block";

    // Fade away the message after a few seconds
    setTimeout(() => {
      fadeOut(notFoundMessage);
    }, 2000); // Adjust the duration as needed
  } else {
    notFoundMessage.style.display = "none";
  }
}

// Function to fade out an element
function fadeOut(element) {
  let opacity = 1;
  const fadeOutInterval = setInterval(() => {
    if (opacity > 0) {
      opacity -= 0.1;
      element.style.opacity = opacity;
    } else {
      clearInterval(fadeOutInterval);
      element.style.display = "none";
      element.style.opacity = 1; // Reset opacity for future display
    }
  }, 100);
}
// Update the playSong function to include time update event listener
function playSong(songNode) {
  currentSongNode = songNode;
  document.getElementById("current-song").innerText = "Current Song: " + songNode.data;
  audio.src = `Songs/${songNode.data}.mp3`; // Replace with the actual path to your MP3 files
  audio.play();

  // Update the seek slider and total duration
  audio.addEventListener("timeupdate", function () {
    updateSeekSlider();
    updateTotalDuration();
  });
}

// Add function to update seek slider
function updateSeekSlider() {
  const seekSlider = document.querySelector(".seek_slider");
  const currentTime = audio.currentTime;
  const duration = audio.duration;

  if (!isNaN(duration)) {
    seekSlider.value = (currentTime / duration) * 100;
    updateCurrentTime();
  }
}

// Add function to update current time
function updateCurrentTime() {
  const currentTime = document.querySelector(".current-time");
  const minutes = Math.floor(audio.currentTime / 60);
  const seconds = Math.floor(audio.currentTime % 60);
  currentTime.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Add function to update total duration
function updateTotalDuration() {
  const totalDuration = document.querySelector(".total-duration");
  const minutes = Math.floor(audio.duration / 60);
  const seconds = Math.floor(audio.duration % 60);
  totalDuration.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Add function to handle seek slider change
function seekTo() {
  const seekSlider = document.querySelector(".seek_slider");
  const seekValue = seekSlider.value;
  const duration = audio.duration;

  if (!isNaN(duration)) {
    const newPosition = (seekValue / 100) * duration;
    audio.currentTime = newPosition;
  }
}

// Add function to handle volume slider change
function setVolume() {
  const volumeSlider = document.querySelector(".volume_slider");
  const volumeValue = volumeSlider.value;
  audio.volume = volumeValue / 100;
}

// ... (existing code)

  
  function nextSong() {
    if (currentSongNode && currentSongNode.next) {
      playSong(currentSongNode.next);
    }
  }
  
  function prevSong() {
    if (currentSongNode && currentSongNode.prev) {
      playSong(currentSongNode.prev);
    }
  }
  
  function togglePlayPause() {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }
  
  function addToPlaylist() {
    if (currentSongNode) {
      playlist.add(currentSongNode.data);
      renderPlaylist();
    }
  }
  
  function removeFromPlaylist(songNode) {
    // Find the node in the playlist and remove it
    let current = playlist.head;
    while (current) {
      if (current === songNode) {
        playlist.remove(current);
        break;
      }
      current = current.next;
    }
    renderPlaylist();
  }
  
  
  function renderPlaylist() {
    const playlistElement = document.getElementById("playlist");
    playlistElement.innerHTML = "";
    let current = playlist.head;
    while (current) {
      const li = document.createElement("li");
      li.innerText = current.data;
  
      const removeButton = document.createElement("button");
      removeButton.innerText = "Remove";
      // Pass a copy of the current song node to the removeFromPlaylist function
      removeButton.onclick = ((node) => () => removeFromPlaylist(node))(current);
  
      li.appendChild(removeButton);
      playlistElement.appendChild(li);
      current = current.next;
    }
  }
  
  playSong(songList.head);
  
  function showPlaylist() {
    const playlistContainer = document.getElementById("playlist-container");
    playlistContainer.style.display = "block";
    document.getElementById("playlist-name-container").style.display = "block";
    renderPlaylist();
  }
  
  function hidePlaylist() {
    const playlistContainer = document.getElementById("playlist-container");
    playlistContainer.style.display = "none";
    document.getElementById("playlist-name-container").style.display = "none";
  }
  
  function playPlaylist() {
    let current = playlist.head;
  
    // Play songs in sequence
    const playNext = () => {
      if (current) {
        playSong(current);
        current = current.next;
        audio.onended = playNext;
      }
    };
  
    playNext();
  }
  
  // Additional Functions for Playlist Name
  function setPlaylistName() {
    const playlistNameInput = document.getElementById("playlist-name-input");
    const playlistName = playlistNameInput.value.trim();
  
    if (playlistName !== "") {
      // Add your logic to save or use the playlist name as needed
      document.getElementById("playlist-name").innerText = `Playlist: ${playlistName}`;
    }
  }
  