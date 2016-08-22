function [ IBI ] = getInterBeatIntervals( locations_R_peaks )
length_locs = length(locations_R_peaks);

IBI = locations_R_peaks(2:length_locs) - locations_R_peaks(1:length_locs-1);
IBI = IBI/256;

end

