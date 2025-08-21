#include <iostream>
#include <string>
#include <curl/curl.h>
#include <chrono>
#include <thread>

// Callback function to write received data to a string
size_t writeCallback(char* ptr, size_t size, size_t nmemb, std::string* data) {
    data->append(ptr, size * nmemb);
    return size * nmemb;
}

int main() {
    CURL* curl;
    CURLcode res;
    std::string readBuffer;

    curl = curl_easy_init();
    if (curl) {
        curl_easy_setopt(curl, CURLOPT_URL, "https://www.york.ac.uk/teaching/cws/wws/webpage1.html");
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writeCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);

        res = curl_easy_perform(curl);

        if (res == CURLE_OK) {
            // Basic text extraction & line-by-line printing with delay
            size_t pos = 0;
            size_t nextLine = 0;

            while ((nextLine = readBuffer.find('\n', pos)) != std::string::npos) {
                std::string line = readBuffer.substr(pos, nextLine - pos);

                // Basic HTML tag removal for the current line
                size_t tagStart = 0;
                while ((tagStart = line.find("<", tagStart)) != std::string::npos) {
                    size_t tagEnd = line.find(">", tagStart);
                    if (tagEnd != std::string::npos) {
                        line.erase(tagStart, tagEnd - tagStart + 1);
                    } else {
                        break; // Handle malformed HTML
                    }
                }


                std::cout << line << std::endl;
                std::this_thread::sleep_for(std::chrono::milliseconds(200)); // 200ms delay
                pos = nextLine + 1;
            }

            // Print the last line (if any)
            if (pos < readBuffer.length()) {
              std::string lastLine = readBuffer.substr(pos);
              // Remove HTML tags from the last line (same logic as above)
                size_t tagStart = 0;
                while ((tagStart = lastLine.find("<", tagStart)) != std::string::npos) {
                    size_t tagEnd = lastLine.find(">", tagStart);
                    if (tagEnd != std::string::npos) {
                        lastLine.erase(tagStart, tagEnd - tagStart + 1);
                    } else {
                        break; // Handle malformed HTML
                    }
                }
              std::cout << lastLine << std::endl;
            }


        } else {
            std::cerr << "curl_easy_perform() failed: " << curl_easy_strerror(res) << std::endl;
        }

        curl_easy_cleanup(curl);
    }

    return 0;
}
