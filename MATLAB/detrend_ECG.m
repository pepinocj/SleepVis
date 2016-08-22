function [ ECG_data ] = detrend_ECG( noisyECG_withTrend,dimension_fit )
%UNTITLED2 Summary of this function goes here
%   Detailed explanation goes here

[p,s,mu] = polyfit((1:numel(noisyECG_withTrend))',noisyECG_withTrend,dimension_fit);
f_y = polyval(p,(1:numel(noisyECG_withTrend))',[],mu);

ECG_data = noisyECG_withTrend - f_y;        % Detrend data




end

