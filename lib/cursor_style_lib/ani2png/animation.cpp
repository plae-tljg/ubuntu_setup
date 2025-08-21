#include <iostream>
#include <chrono>
#include <thread>

using namespace std;

int main() {
    string animationFrames[] = {
        "  (*_*)  ",
        "   (o_o)  ",
        "   (-_-)  ",
        "   (u_u)  "
    };

    int numFrames = sizeof(animationFrames) / sizeof(animationFrames[0]);
    int frameCounter = 0;

    while (true) {
        // Clear the console (for Linux/macOS)
        system("clear");  // Corrected command

        cout << animationFrames[frameCounter] << endl;

        frameCounter = (frameCounter + 1) % numFrames;

        this_thread::sleep_for(chrono::milliseconds(200));
    }

    return 0;
}
