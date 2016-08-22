function C = cwt(signal, scale, str);
% C = CWT2(SIGNAL, SCALE, STR) computes the continuous wavelet transform of
% input SIGNAL in scales defined in SCALE. The mexican hat is always used
% as mother wavelet. The third parameter STR is ignored; it is only for 
% compatibility with Matlab's CWT function.

if iscolumn(signal)
    signal = signal';
end
%% Define mexican hat (mother wavelet)

lower_bound = -8;
upper_bound = 8;
step = (upper_bound-lower_bound)/255;
t = lower_bound:step:upper_bound;

% use direct implementation:
psi = ((2/(sqrt(3)*pi^0.25)) * (1-t.^2).*exp(-(t.^2)/2)); % Note the typo in (8) of [1]
psi = cumsum([0 psi])*step;
% use Matlab's implementation:
% psi = cumsum((2/(sqrt(3)*pi^0.25)) * (1-t.^2).*exp(-(t.^2)/2))*step; % Note the typo in (8) of [1]

% scale = 1:64;
C = zeros(length(scale), length(signal));
%% Compute wavelet coefficients for desired scales
for s = scale
    % compute the number of samples for scaling function
    N = (upper_bound-lower_bound)*s+1; 
    % The following will maximize symmetry in sampled function
    j1 = linspace(0, (length(psi)+1)/2, (N+1)/2+1);
    j2 = linspace((length(psi)+1)/2, (length(psi)+1), (N+1)/2+1);
    j = [ceil(j1(round(2:(N+1)/2+1-1))),(length(psi)+1)/2 , floor(j2(round(2:(N+1)/2+1-1)))];
    % sample the mother wavelet on a uniform scale
    psi_scale = fliplr(psi(j));
    % apply convolution
    tmp = -diff(length(j)/(upper_bound-lower_bound)*(1/sqrt(s)).*(conv(psi_scale, signal)));
    % or use Matlab's implementation:
%     tmp = diff((-sqrt(s)).*(conv(psi_scale, signal)));
    % get rid of boundaries
    C(s-scale(1) + 1, :) = tmp((length(psi_scale)-1)/2 : end-(length(psi_scale)-1)/2);
end

%% FFT implementation (might be more efficient)
% C = [];
% for s = scale
%     omega = 0:2*pi/(length(signal) + (upper_bound - lower_bound)*s-1):2*pi;
%     om_sq = omega.^2;
% %     psi_scale_freq = -4*pi^2*om_sq.*exp(-4*pi^2*om_sq*s^2/2);
% % psi_scale_freq = om_sq.*exp(-om_sq/2);
%         psi_scale = fliplr(psi(round(1+((lower_bound:1/s:upper_bound)-lower_bound)/step)));
%         psi_scale_freq = fft(psi_scale, length(signal)+length(psi_scale) - 1);
%     signal_freq = fft(signal, length(signal)+length(psi_scale) - 1);
%     tmp = 1/sqrt(s)*real(ifft(psi_scale_freq.*signal_freq));
%     C(s-scale(1)+1, :) = tmp((length(psi_scale)-1)/2 : end-(length(psi_scale)-1)/2-1);
% end

%% References
% [1] Legarreta et al., "Continuous Wavelet Transform Modulus Maxima
% Analysis of the Electrocardiogram: Beat Characterisation and beat-to-beat
% measurement", Int. J. Wavelets, Multiresolution and Inf. Proc., Vol. 3,
% No. 1(2005), pp. 19--42.