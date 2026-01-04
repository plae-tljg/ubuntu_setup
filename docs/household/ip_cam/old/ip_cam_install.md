# IP Camera Project - Setup Guide

This guide will help you set up the IP Camera project to turn your Android phone into a webcam for monitoring plants.

## Project Overview

The project consists of 4 main components:
1. **Android App** - Runs on your phone, captures video and streams it
2. **VideoServer** - Kotlin server that receives video from the phone and serves it
3. **WebApp** - Web interface to view the stream
4. **WebAppServer** (Optional) - Node.js server for user authentication and screenshot gallery

## Prerequisites

### Required Software

1. **Java Development Kit (JDK)**
   - JDK 8 or higher
   - Check: `java -version`

2. **Android Studio** (for building the Android app)
   - Download from: https://developer.android.com/studio
   - Includes Android SDK and build tools

3. **Node.js and npm** (for WebApp and WebAppServer)
   - Node.js 14+ recommended
   - Check: `node --version` and `npm --version`
   - Download from: https://nodejs.org/

4. **Gradle** (usually comes with Android Studio, but can be installed separately)
   - The project uses Gradle wrapper, so it will download automatically

### Optional (for WebAppServer)

5. **MySQL** (only if you want screenshot gallery functionality)
   - MySQL 5.7+ or MariaDB
   - Install and set up a database

## Setup Instructions

### Step 1: Build the Android App

1. **Open Android Studio**
   - Launch Android Studio
   - Select "Open an Existing Project"
   - Navigate to the `Andorid` folder in your IP-Camera project directory (note: there's a typo in the folder name - it should be "Android")

2. **Wait for Gradle Sync**
   - Android Studio will automatically sync the project
   - It will download dependencies (this may take a few minutes)
   - Make sure you have internet connection

3. **Connect Your Android Phone**
   - Enable Developer Options on your phone:
     - Go to Settings → About Phone
     - Tap "Build Number" 7 times
   - Enable USB Debugging:
     - Settings → Developer Options → USB Debugging
   - Connect phone via USB cable
   - Allow USB debugging when prompted

4. **Build and Install**
   - Click the "Run" button (green play icon) or press `Shift+F10`
   - Select your connected device
   - The app will build and install on your phone

   **OR build from command line:**
   ```bash
   cd /path/to/your/IP-Camera/Andorid
   ./gradlew assembleDebug
   ./gradlew installDebug
   ```

### Step 2: Set Up and Run the VideoServer

The VideoServer is a Kotlin application that receives video from your phone and serves it via:
- WebSocket Server (port 1234)
- MJPEG Server (port 4444)
- Camera Server (port 4321)

1. **Navigate to VideoServer directory**
   ```bash
   cd /path/to/your/IP-Camera/VideoServer
   ```

2. **Build the server**
   ```bash
   ./gradlew build
   ```

3. **Run the server**
   ```bash
   ./gradlew run
   ```
   
   Or if you have the JAR file:
   ```bash
   java -jar build/libs/VideoServer-1.0-SNAPSHOT.jar
   ```

4. **Note the server IP address**
   - On Linux, find your IP: `ip addr show` or `hostname -I`
   - Example: `192.168.0.101`
   - The server will listen on all network interfaces

### Step 3: Configure the Android App

1. **Open the app on your phone**

2. **Go to Settings**
   - Navigate to the settings screen in the app

3. **Enter Camera Server IP**
   - Enter your computer's IP address and port
   - Format: `YOUR_IP:4321`
   - Example: `192.168.0.101:4321`
   - Make sure your phone and computer are on the same network

4. **Start Streaming**
   - Go to the stream screen
   - Click "Start streaming"
   - Your phone should now be sending video to the server

### Step 4: Set Up the WebApp (Optional - for web interface)

1. **Navigate to WebApp directory**
   ```bash
   cd /path/to/your/IP-Camera/WebApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Note:** The project references `webpack serve` but doesn't have a webpack.config.js file. You may need to:
   - Create a webpack.config.js, OR
   - Use a simple HTTP server instead:
     ```bash
     npx http-server public -p 8080
     ```

4. **Access the web app**
   - Open browser: `http://localhost:8080/` or `http://YOUR_SERVER_IP:8080/`
   - Go to settings page: `http://localhost:8080/settings.html`
   - Enter WebSocket server IP: `YOUR_SERVER_IP:1234` (use YOUR server IP with port 1234)
   - Click "Continue" to save
   - Go to stream page: `http://localhost:8080/stream.html`
   - Click "Connect" to view the stream
   
   **Important:** The WebApp uses port **1234** (WebSocket), not port 4321 (which is for the Android app)

### Step 5: Set Up WebAppServer (Optional - for screenshots)

This is only needed if you want to take and save screenshots.

1. **Set up MySQL database**
   ```bash
   mysql -u root -p
   ```
   ```sql
   CREATE DATABASE ipcamera;
   USE ipcamera;
   SOURCE /path/to/your/IP-Camera/WebAppServer/user.sql;
   ```

2. **Configure database connection**
   - Edit `/path/to/your/IP-Camera/WebAppServer/index.js`
   - Update the connection object (lines 10-15):
     ```javascript
     const connection = mysql.createConnection({
         'host': 'localhost',
         'user': 'your_username',
         'password': 'your_password',
         'database': 'ipcamera'
     })
     ```

3. **Install dependencies**
   ```bash
   cd /path/to/your/IP-Camera/WebAppServer
   npm install
   ```

4. **Run the server**
   ```bash
   node index.js
   ```

5. **Update WebApp backend URL** (if needed)
   - Edit `WebApp/public/stream.html`
   - Update `BACKEND_URL` constant to point to your server

6. **Create a user**
   - Go to `http://localhost:8080/register.html`
   - Register a new account

7. **Use screenshot feature**
   - Login at `http://localhost:8080/login.html`
   - Take screenshots from the stream page
   - View gallery at `http://localhost:8080/gallery.html`

## Quick Start (Minimal Setup)

For the simplest setup to just view the stream:

1. **Build and install Android app** (Step 1)
2. **Run VideoServer** (Step 2)
3. **Configure Android app** (Step 3)
4. **View stream in browser**: `http://YOUR_IP:4444`

That's it! You can view the stream directly in your browser or VLC player.

## Viewing the Stream

### Option 1: Direct Browser Access
- Open: `http://YOUR_IP:4444`
- Works in any modern browser

### Option 2: VLC Media Player
- File → Open Network Stream
- Enter: `http://YOUR_IP:4444/`

### Option 3: Web App Interface
- Follow Step 4 above
- More features and better UI

## Troubleshooting

### Android App won't build
- Make sure Android Studio is fully updated
- Check that you have Android SDK 35 installed
- Try: `./gradlew clean` then rebuild

### Can't connect phone to server
- Ensure phone and computer are on the same WiFi network
- Check firewall settings (ports 4321, 4444, 1234 should be open)
- Verify the IP address is correct
- Try pinging from phone: Install a network tool app and ping your computer's IP

### VideoServer won't start
- Check if ports are already in use: `netstat -tulpn | grep -E '4321|4444|1234'`
- Make sure Java is installed: `java -version`
- Check Gradle version compatibility

### WebApp issues
- If `webpack serve` doesn't work, use `npx http-server public -p 8080` instead
- Make sure Node.js is installed: `node --version`

## Network Requirements

- **Same WiFi network**: Phone and computer must be on the same local network
- **Firewall**: Allow incoming connections on ports:
  - 4321 (Camera Server)
  - 4444 (MJPEG Server)
  - 1234 (WebSocket Server)
  - 3000 (WebAppServer, if used)
  - 8080 (WebApp, if used)

## Port Summary

- **4321**: Camera Server (Android app connects here)
- **4444**: MJPEG Server (browser/VLC connects here)
- **1234**: WebSocket Server (WebApp connects here)
- **3000**: WebAppServer (optional, for screenshots)
- **8080**: WebApp development server (optional)

## Next Steps

Once everything is running:
1. Position your phone to monitor your plants
2. Access the stream from any device on your network
3. Set up automated screenshots if needed
4. Consider setting up port forwarding if you want remote access (requires router configuration)
