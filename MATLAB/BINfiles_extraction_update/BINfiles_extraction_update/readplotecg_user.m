function [  ] = readplotecg_user( userName )
%UNTITLED5 Summary of this function goes here
%   Detailed explanation goes here

tic;
user=userName;
path=['C:\Users\Josi\Documents\KUL\Thesis\Coding\experimentData\' user '\BINS'];

% list_users=dir('D:\SWEET\Preprocessed');
% 
% % Make directories
% for user_nr=3:length(list_users)
%     user=list_users(user_nr).name;
%     mkdir(['D:\SWEET\Preprocessed\' user '\Stingray\'], 'Extracted files');
%     mkdir(['D:\SWEET\Preprocessed\' user '\Stingray\'], 'Preprocessed');
% end



folders=dir(path);
for i=3:length(folders);
    clearvars -except folders i path user
    close all
%     [name, path]=uigetfile('f:\*.bin','Open ECG file');   
    name=folders(i).name;
    [FH,DH,PL] = read_data_file(strcat([path '\'],name));

%     clear Cfg;
%     Cfg.Plot.PlotRawADCValues = 0;
%     Cfg.ECG.VrefADC  = 1.050;                                                 % (V) Refence voltage of the ADC.
%     Cfg.ECG.GainAfe  = 70;                                                 % () Thus 1mV at the input maps to 280mV at the ADC-input.
%     Cfg.ECG.MaxValue = 2048;                                                % Maximum RAW ECG-value
%     Cfg.ECG.Fs       = DH.ECGfs;                                            % (Hz) Sampling frequency of ECG-signal
%     plot_ecg(PL, Cfg);

    Start_date_num= datenum(char(SR_time(DH.LocalTime.year,DH.LocalTime.day,DH.LocalTime.hour,DH.LocalTime.minute,DH.LocalTime.second)));    

    ECG=PL.ECG;
    ACC=PL.AX;
    
    if numel(num2str(i-2))==1;
        save(['C:\Users\Josi\Documents\KUL\Thesis\Coding\experimentData\' user '\MAT\DATA00' num2str(i-2)], 'Start_date_num','ECG','ACC');
    else
        save(['C:\Users\Josi\Documents\KUL\Thesis\Coding\experimentData\' user '\MAT\DATA0' num2str(i-2)], 'Start_date_num','ECG','ACC');

    end
end
toc;




end

