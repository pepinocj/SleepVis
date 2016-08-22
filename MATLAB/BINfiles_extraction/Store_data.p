% First run readplotecg, then run this function

Info.Time=DH.LocalTime;

ECG=PL.ECG;
ACC=PL.AX;

save('C:\Users\smets83\Documents\Experimenten\Experiment 3\Stingray\user0001\Extracted files\DATA003', 'Info','ECG','ACC');
% 
