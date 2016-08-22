% QRS Detector
% Iñaki Romero 
% IMEC - Eindhoven
% Version 2 - 24 August 2009
%
% Description:
%   This Algorithm finds the location of the QRS complexes from within an ECG signal.
%   The input could be a signal of any time length (with a minimum length
%   of 2 seconds).
%
% Usage:
%   qrs = QRSDet(ecg,fs,th,fsc,FR);
%   qrs = QRSDet(ecg,fs,31,17,0.5);
%
% Inputs: 
%   ecg: vector which contains the ECG signal.
%   fs: <Samples/Second> Sample Frequency. (fs=198 if not specified)
%   th: <Percentage> Threshold that controls the sensitivity of the 
%       algorithm (th=31 if not specified)
%   fsc: <Hz> Frequency to be analysed. (fsc=17 if not specified)
%   FR: weight the value of the old threshold in the calculation
%                of the new threshold. (FR=0.5 if not specified)
%
% Output:
%   qrs: <Seconds> Vector which contains the location of the QRS complexes.