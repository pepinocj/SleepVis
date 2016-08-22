function [SNR, Srange, Nrange, S, N] = calc_snr(x,Cfg,Analyse)
%SNR = calcSNR(x,Cfg,Analyse)
%INPUT:
% x       - input signal
% Cfg     - 'auto' (automatic SNR calculation [default])
%             or
%           struct which specifies the SNR calculation. It must have the
%           fields:
%           * Cfg.WindType - window type (i.e. @hanning)
%           * Cfg.WindOpts - window options (i.e. 'periodic'), can be left empty
%           With optional fields:
%           * Cfg.Srange - binnumbers which contain the signal
%           * Cfg.Nrange - binnumbers which contain the noise
%             or
%           * Cfg.Fs     - Sampling frequency
%           * Cfg.Fsig   - Frequency of the signal
%           * Cfg.Swidth - Width of the signal range (single sided)
% Analyse - 0/1 to plot the FFT of the signal [default = 0]  
%
% When is chosen for an automatic SNR calculation, the following is
% assumed/used:
%      - blackmannharris window
%      - 21 bins that include the signal (at the most)
%      - the strongest frequency component indicates the signal
%      - the signal is real (-> spectrum is symmetrical)

if nargin==1 && ischar(x) && strcmpi(x,'ver')                               % Return the version number when asked for it
    SNR = '$Revision: 716 $';
    SNR([1,end]) = [];
    SNR = [mfilename,' ', SNR];
    return;
end

if nargin<3
    Analyse = 0;
end

if nargin==1 || ischar(Cfg)   %do automatic calculation
    Cfg.WindType    = @blackmanharris;
    Cfg.WindOpts    = [];
    [xas,yas,y_lin] = plotfft(x,1,Cfg);
    [~,I0]          = min(abs(xas));
    [~,Imax]        = max(abs(y_lin(1:I0)));                                % Assume real signal -> symmetric spectrum

    Sbin   = min(I0 - Imax,10);                                             % Take 10 signal-bins left and right,  at the most
    Srange = Imax-Sbin : Imax+Sbin;
    Nrange = [1:Imax-Sbin-1,Imax+Sbin+1:I0];
else                                                                        % Do specific calculation
    Cfg.normalize = 1;                                                          % Make sure normalization option is turned on
    if isfield(Cfg,'Srange') && isfield(Cfg,'Nrange')
        Srange   = Cfg.Srange;
        Nrange   = Cfg.Nrange;
        if isfield(Cfg,'Fs')
            Fs   = Cfg.Fs;
        else
            Fs   = 1;
        end
    else
        Fs     = Cfg.Fs;
        Fsig   = Cfg.Fsig;
        Swidth = Cfg.Swidth;
        
        Lx       = length(x);
        BinWidth = Lx/Fs;                                                   % (Hz/bin)
        I0       = floor(Lx/2 + 1);                                         % Index of xas(I0) = 0;
        if isreal(x)
            Srange = (I0 + round( BinWidth * Fsig) - Swidth:I0+round( BinWidth * Fsig) + Swidth);
            if Fsig>0
                Nrange = [I0:Srange(1)-1,Srange(end)+1:length(x)];
            else
                Nrange = [1:Srange(1)-1,Srange(end)+1:I0];                
            end
        else
            Srange = I0+round(BinWidth*Fsig)-Swidth : I0+round(BinWidth*Fsig)+Swidth;
            Nrange = [1:Srange(1)-1,Srange(end)+1:length(x)];
        end

    end
    [xas,yas,y_lin] = plotfft(x,Fs,Cfg);
end

% correct power values for used window
% N = length(x);
if ( ischar(Cfg.WindType) && strcmp(Cfg.WindType,'none') ) || ( isa(Cfg.WindType, 'function_handle') && strcmp(func2str(Cfg.WindType),'none') )
    Cfg.WindType = @rectwin;
end
if isempty(Cfg.WindOpts)
    W = window(Cfg.WindType,length(x));
else
    W = window(Cfg.WindType,length(x),Cfg.WindOpts);
end
W = reshape(W,size(x));

S   = sum( abs(y_lin(Srange)).^2 ) / mean(W.^2);
N   = sum( abs(y_lin(Nrange)).^2 ) / mean(W.^2);                            % The sample at 0Hz is twice taken into account, when N is odd.
SNR = 10*log10(S/N);

if Analyse
    if isfield(Cfg,'AxHandle')
        axes(Cfg.AxHandle);
    else
        figure;
    end
    hold on;
    plot(xas,yas,'b-')
    plot(xas(Srange),yas(Srange),'r.-');
    plot(xas(Nrange),yas(Nrange),'g.-');
    legend('Spectrum', 'Signal','Noise');
    if isfield(Cfg,'Fs')
        if log10(Cfg.Fs) >= 3 && log10(Cfg.Fs)<6
            xlabel('Frequency [kHz]');
        elseif log10(Cfg.Fs) >= 6 && log10(Cfg.Fs)<9
            xlabel('Frequency [MHz]');
        elseif log10(Cfg.Fs) >= 9
            xlabel('Frequency [GHz]');
        else
            xlabel('Frequency [Hz]');
        end
    else
        xlabel('Normalized frequency [\times\pi]');
    end
    ylabel('Magnitude [dBFS^2/Hz]');
end

% -------------------------------------------------------------------------
% -- Project   : Stingray
% -- Content   : This function is used to calculate the SNR of a signal.
% -- Filename  : $HeadURL: http://imecwww/svn/stingray/trunk/Data/GlobalLib/MatlabLib/calc_snr.m $
% -- Date      : $Date: 2013-09-13 14:17:37 +0200 (Fri, 13 Sep 2013) $
% -- Version   : $Revision: 716 $
% -- Commiter  : $Author: boerp $
% -------------------------------------------------------------------------
% --  CONFIDENTIAL and PROPRIETARY
% --  COPYRIGHT (c) Stichting IMEC Nederland, 2011
% --
% --  All rights are reserved. Reproduction in whole or in part is
% --  prohibited without the written consent of the copyright owner
    