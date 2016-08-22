function [ filtered_signal ] = myLowPassFilter( signal,max_f,length )
%UNTITLED2 Summary of this function goes here
%   Detailed explanation goes here

s = fft(signal);

[m,n] = size(s);
t_s = abs(s/length);
filtered_fft = zeros(m,1);


filtered_fft(1:max_f) = s(1:max_f);


filtered_signal = ifft(filtered_fft);


end
