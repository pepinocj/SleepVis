function [ filtered_signal ] = mineFilter( signal,min_ampl,length )
%UNTITLED2 Summary of this function goes here
%   Detailed explanation goes here

s = fft(signal);

t_s = abs(s/length);
[m,n] = size(t_s);

for i = 1:m
    if t_s(i) < min_ampl
        s(i) = 0;
    end
    
        
end

filtered_signal = ifft(s);


end

