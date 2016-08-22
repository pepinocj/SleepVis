load('C:\Users\Josi\Documents\MATLAB\ecg data\user1\DATA013.mat')
HeatMap(getRad(ACC),'Colormap', getFourColorMapForRadians(),'DisplayRange',pi)
HeatMap(ACC(2,:)+50)
a = 200000;

plot(ECG(1,[a:a+0.25*15360]))

