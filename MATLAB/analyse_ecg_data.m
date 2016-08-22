function [ Heart_data ] = analyse_ecg_data( epoch_length,ecg_data,frequency )
%todo: moving window

[data_size,~] = size(ecg_data);
epoch_size = samples_per_epoch(epoch_length,frequency);
result_size = max(1,round(data_size/epoch_size));
%define structure
Heart_data = struct();
%Heart_data.PhysDim=zeros(1,result_size);
%Heart_data.PhysDimCode=zeros(1,result_size);
%Heart_data.datatype=zeros(1,result_size);
Heart_data.N=zeros(1,result_size);
Heart_data.meanNN=zeros(1,result_size);
Heart_data.SDNN=zeros(1,result_size);
Heart_data.RMSSD=zeros(1,result_size);
Heart_data.NN50count1=zeros(1,result_size);
Heart_data.NN50count2=zeros(1,result_size);
Heart_data.NN50count=zeros(1,result_size);
Heart_data.pNN50=zeros(1,result_size);
Heart_data.SD1=zeros(1,result_size);
Heart_data.SD2=zeros(1,result_size);
Heart_data.r_RR=zeros(1,result_size);
Heart_data.HRVindex128=zeros(1,result_size);
%Heart_data.mops=zeros(1,result_size);
%Heart_data.mop=zeros(1,result_size);
%Heart_data.ASpectrum=zeros(1,result_size);
%Heart_data.f=zeros(1,result_size);
Heart_data.VLF=zeros(1,result_size);
Heart_data.LF=zeros(1,result_size);
Heart_data.HF=zeros(1,result_size);
Heart_data.TotalPower=zeros(1,result_size);
Heart_data.LFHFratio=zeros(1,result_size);
Heart_data.LFnu=zeros(1,result_size);
Heart_data.HFnu=zeros(1,result_size);

Heart_data.FFT = struct();
Heart_data.FFT.VLF=zeros(1,result_size);
Heart_data.FFT.LF=zeros(1,result_size);
Heart_data.FFT.HF=zeros(1,result_size);
Heart_data.FFT.TotalPower=zeros(1,result_size);
Heart_data.FFT.LFHFratio=zeros(1,result_size);
Heart_data.FFT.LFnu=zeros(1,result_size);
Heart_data.FFT.HFnu=zeros(1,result_size);

Heart_data.failed=zeros(1,result_size);

%preprocess ibi
%result_ecg = detrend_ECG(raw_sliced_ECG',6);
%[maxima_val,locs_Rwave] = findpeaks(result_ecg,'MinPeakHeight',100,...
%    'MinPeakDistance',50);


[maxima_val,locs_Rwave] = findpeaks(ecg_data,'MinPeakHeight',-5,...
    'MinPeakDistance',50); %beter per epoch?

IBI = getInterBeatIntervals(locs_Rwave);

% Better: 
%   Inputs: 
%   ecg: vector which contains the ECG signal.
%   fs: <Samples/Second> Sample Frequency. (fs=198 if not specified)
%   th: <Percentage> Threshold that controls the sensitivity of the 
%       algorithm (th=31 if not specified)
%   fsc: <Hz> Frequency to be analysed. (fsc=17 if not specified)
%   FR: weight the value of the old threshold in the calculation
%                of the new threshold. (FR=0.5 if not specified)
%
% Output:
%   qrs: <Seconds> Vector which contains the location of the QRS complexes

locations_R_peaks = QRSDet(ecg_data,256,31,17,0.5);
length_locs = length(locations_R_peaks);
IBI = locations_R_peaks(2:length_locs) - locations_R_peaks(1:length_locs-1);

IBI_begin_end = divide_ibi(IBI,epoch_length,data_size);
if IBI_begin_end ~= 0
        


for i = 1:length(IBI_begin_end) %cut'
    
    bounds= IBI_begin_end(i,:)';
    
        
        
    IBI(bounds(1):bounds(2));
    temp = heartratevariability(IBI(bounds(1):bounds(2)));
    
    if(temp.failed)
        
        Heart_data.failed(i) = 1;
        
    else
        fields = fieldnames(Heart_data);
        for j = 1:length(fields)
            if (strcmp(fields{j}, 'FFT'))
                fields_fft = fieldnames(Heart_data.FFT);
                for k = 1:length(fields_fft)
                    Heart_data.FFT.(fields_fft{k})(i) = temp.FFT.(fields_fft{k});
                end
                
                
            else
                if(strcmp(fields{j}, 'N'))
                    Heart_data.(fields{j})(i) = temp.(fields{j})*60/epoch_length;
                else
                    Heart_data.(fields{j})(i) = temp.(fields{j});
                end
                
            end
            
        end
        
    end
    
       
    
    
end
end

Heart_data = flatten_heart_data_struct(Heart_data);

end

