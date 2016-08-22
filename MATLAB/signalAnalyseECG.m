load('C:\Users\Josi\Documents\MATLAB\ecg data\user1\DATA013.mat')
a = 200000;
b = 100000;%15360 = 256*60 samples per minuut
%werk met kleine windows
raw_sliced_ECG = ECG(1,[a:a+b]); 
t = 1:length(raw_sliced_ECG);

figure
grid on
plot(raw_sliced_ECG)

%result_ecg = detrend_ECG(raw_sliced_ECG',6);
%[maxima_val,locs_Rwave] = findpeaks(result_ecg,'MinPeakHeight',100,...
%    'MinPeakDistance',50);

result_ecg = raw_sliced_ECG';
[maxima_val,locs_Rwave] = findpeaks(result_ecg,'MinPeakHeight',-5,...
    'MinPeakDistance',50);



figure
plot(t,result_ecg); 
grid on
title('Detrended ECG Signal')
xlabel('Samples'); ylabel('Voltage(mV)')
legend('Detrended ECG Signal')


                                
peaks = zeros(length(raw_sliced_ECG),1);
peaks(locs_Rwave) = maxima_val;

figure
plot(t,peaks); 
grid on
title('Locations peaks')
xlabel('Samples'); 
ylabel('Voltage(mV)')

IBI = getInterBeatIntervals(locs_Rwave);

figure
plot(IBI)




