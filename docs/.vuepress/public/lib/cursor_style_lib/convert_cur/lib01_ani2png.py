import sys, os, subprocess

current_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), "win2xcur")
sys.path.insert(0, current_directory)

from win2xcur.main import win2xcur

if __name__ == "__main__":
    win2xcur.main()
