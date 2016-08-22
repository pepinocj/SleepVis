MAIN FILE: readplotecg.m
path is the location where you stored all the BIN files.
The script will extract all BIN files separately and store them in a given location.
It will contain the ECG, ACC and start time information.

ECG:
2 channels, same signal, different amplitude
sampling frequency: 256 Hz

ACC:
3 channels of acceleration in x,y,z dimension
sampling frequency: 32 Hz

Start_time:
Matlab numeric session start time (can be used to make time vector since sampling frequencies are known)
