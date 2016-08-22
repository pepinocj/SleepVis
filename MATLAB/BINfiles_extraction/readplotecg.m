%% READ ECG FILES MAIN
path=['C:\Users\Josi\Documents\KUL\Thesis\Coding\mijnECGData'];

folders=dir(path);
for i=3:length(folders);
    clearvars -except folders i path user
    close all
 
    name=folders(i).name;
    [FH,DH,PL] = read_data_file(strcat([path '\'],name));

    Start_date_num= datenum(char(SR_time(DH.LocalTime.year,DH.LocalTime.day,DH.LocalTime.hour,DH.LocalTime.minute,DH.LocalTime.second)));    

    ECG=PL.ECG;
    ACC=PL.AX;
    
    if numel(num2str(i-2))==1;
        save(['desired location\DATA00' num2str(i-2)], 'Start_date_num','ECG','ACC');
    else
        save(['desired location\DATA0' num2str(i-2)], 'Start_date_num','ECG','ACC');

    end
end


