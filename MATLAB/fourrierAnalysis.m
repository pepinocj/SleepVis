Fs = 256;            % Sampling frequency
T = 1/Fs;             % Sampling period
L = 15360*0.25;             % Length of signal
t = (0:L-1)*T;        % Time vector

a = 200000;
Y = fft(ECG(1,[a:a+0.25*15360])');

P2 = abs(Y/L);
P1 = P2(1:L/2+1);
P1(2:end-1) = 2*P1(2:end-1);

f = Fs*(0:(L/2))/L;
figure
subplot(3,1,1)
plot(f,P1)
title('Single-Sided Amplitude Spectrum of X(t)')
xlabel('f (Hz)')
ylabel('|P1(f)|')

subplot(3,1,2)
plot(P2)

subplot(3,1,3)
plot(abs(Y))
hold on

figure
I_Y = ifft(Y);

subplot(2,1,1)
plot(I_Y)

subplot(2,1,2)
k = myLowPassFilter(ECG(1,[a:a+0.25*15360])',700,L);%mineFilter(ECG(1,[a:a+0.25*15360])',1,L);
plot(k)

