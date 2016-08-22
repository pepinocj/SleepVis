
function epochdata = max2epochs(data, fs, epoch)
% function epochdata = max2epochs(data, fs, epoch)
% Function 'max2epochs' converts data to epochs of length epoch. It takes the max
% values per second and sums these values over the epoch length. This is
% equivalent to the Actiwatch preprocessing.
%
% input:
%   - data: time series
%   - fs: sampling frequency of time series data
%   - epoch: required epoch length in seconds
%
% output:
%   - epochdata: series of epochs with length epoch

data = data(:);         % force column vector
N = length(data);
seconds = floor(N/fs);  % length in seconds
data = abs(data);       % rectify

% reshape data to samples-by-seconds matrix
data = data(1:seconds*fs);
data = reshape(data, fs, seconds);

% find max per second (i.e. across column)
data = max(data, [], 1);

% reshape data to epoch-by-epochs matrix
data = data(:);
N = length(data);
nepochs = floor(N/epoch);
data = data(1:nepochs*epoch);

% sum per epoch (i.e. across column)
data = reshape(data, epoch, nepochs);
epochdata = sum(data,1);

epochdata = epochdata(:);   % force column vector
end


