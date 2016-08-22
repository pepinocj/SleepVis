function [x_as,y_as,Ylin] = plotfft(x,Fs,varargin)
%[x_as,y_as,Ylin] = plotfft(x,Fs,Cfg)
%
% This function plots the FFT of the signal x, with N=length(x) samples
% INPUT:
%   x           -   Input signal
%   Fs          -   Sampling frequency (Hz)
%   Cfg         -   Configuration struct with the following fields:
%                   * WindType  - the name of the desired window. Type 
%                                 'help window' to see which window-names 
%                                 are valid. (Default = @hanning)
%                   * WindOpts  - options of the desired window. (Default = [])
%                   * normalize - string or numeric value:       (Default = 'none')
%                                 o 0) 'none'; no normalization 
%                                 o 1) 'Length'; normalize with respect to the
%                                       length of the input signal.
%                                 o 2) 'ComplexNormalize'; normalizes a complex
%                                       tone with amplitude 1 to 0dB:
%                                       1.0 * exp(j*2*pi*f*t+phi) => 0dB 
%                                 o 3) 'RealNormalize'; normalizes a complex
%                                       tone with amplitude 1 to 0dB:
%                                       1.0 * cos(2*pi*f*t+phi) => 0dB
%                   * marker    - [color,markertype], i.e. 'r.'  (Default = 'b')
%                   * MarkerOpts- struct with fields/value combinations
%                                 like:
%                                 o 'Color',[0,0,255]
%                                 o 'MarkerSize',6
%                                 o 'LineWidth',0.5
% OUTPUT:
% with 1 output argument:
%   x_as        -   handle to plotted line
% with more than 1 output argument:
%   x_as        -   values for x-axis
%   y_as        -   values for y-axis
%   Ylin        -   values for y-axis (linear)
%
% If this function is used for a sine/cosine with a single frequency (f),
% then two vertical bars are expected. To obtain this, the number of input
% samples (N), the sampling frequency Fs and f must have the relation:
% fN/Fs must be an integer.

if nargin==1 && ischar(x) && strcmpi(x,'ver')                               % Return the version number when asked for it
    x_as = '$Revision: 716 $';
    x_as([1,end]) = [];
    x_as = [mfilename,' ', x_as];
    return;
end

[Cfg] = parseinput(varargin);

N = length(x);
if isempty(Cfg.WindOpts)
    W = window(Cfg.WindType,length(x));
else
    W = window(Cfg.WindType,length(x),Cfg.WindOpts);
end
W = reshape(W,size(x));

%calculate the x-axis values
if mod(N,2)                                                                 % N is odd
    if log10(Fs) >= 3 && log10(Fs)<6
        x_as = (-N/2+1/2:N/2-1/2)/N*Fs/1000;
    elseif log10(Fs) >= 6 && log10(Fs)<9
        x_as = (-N/2+1/2:N/2-1/2)/N*Fs/1e6;
    elseif log10(Fs) >= 9
        x_as = (-N/2+1/2:N/2-1/2)/N*Fs/1e9;
    else
        x_as = (-N/2+1/2:N/2-1/2)/N*Fs;
    end
    x_as = x_as.';
else                                                                        % N is even
    if log10(Fs) >= 3 && log10(Fs)<6
        x_as = (-Fs/2:Fs/N:Fs/2-Fs/N)/1000;
    elseif log10(Fs) >= 6 && log10(Fs)<9
        x_as = (-Fs/2:Fs/N:Fs/2-Fs/N)/1e6;
    elseif log10(Fs) >= 9
        x_as = (-Fs/2:Fs/N:Fs/2-Fs/N)/1e9;
    else
        x_as = (-Fs/2:Fs/N:Fs/2-Fs/N);
    end
    x_as = x_as.';
end

%calculate the y-axis values
x       = W.*x;                                                             % Apply window
Ylin    = fftshift(fft(x));
if all(Cfg.normalize == 0) || strcmpi(Cfg.normalize,'none')
    %do nothing
elseif all(Cfg.normalize == 1) || strcmpi(Cfg.normalize,'Length')
    Ylin = Ylin/length(x);
elseif all(Cfg.normalize == 2) || strcmpi(Cfg.normalize,'ComplexNormalize') % Complex normalize
    Ylin = Ylin/sum(W);
elseif all(Cfg.normalize == 3) || strcmpi(Cfg.normalize,'RealNormalize')    % Real normalize
    Ylin = 2*Ylin/sum(W);
else                                                                        % Error when field is not known
    error('value in field Cfg.normalize not known');
end
y_as = 20*log10(abs(Ylin)+eps(1));

if nargout==0 || nargout==1
    x_as = plot(x_as,y_as,Cfg.marker,Cfg.MarkerOpts);
    ylabel('Magnitude [dBV^2/Hz]');
    if log10(Fs) >= 3 && log10(Fs)<6
        xlabel('Frequency [kHz]');    
    elseif log10(Fs) >= 6 && log10(Fs)<9
        xlabel('Frequency [MHz]');
    elseif log10(Fs) >= 9
        xlabel('Frequency [GHz]');
    else
        xlabel('Frequency [Hz]');
    end    
    grid on;
end

%==========================================================================
function Cfg = parseinput(input)
if isstruct(input{1})
    Cfg = input{1};
else                                                                        % Just support of old function-calls
    %seach for function handle
    for k=1:length(input)
        if  isa(input{k}, 'function_handle')
            found = 1;
            break
        else
            found = 0;
        end
    end
    if found == 1
        Cfg.WindType = input{k};
        input(k) = [];                                                      % Remove this entry from the cell-array
    else
        error('Window function must be specified');
    end

    Cfg.WindOpts  = [];
    Cfg.marker    = 'b';
    Cfg.normalize = 0;
    if length(input)==1
        if ischar(input{1})
            Cfg.marker        = input{1};
            Cfg.normalize = 0;
        elseif isnumeric(input{1})
            Cfg.marker        = 'b';
            Cfg.normalize = input{1};
        end
        Cfg.WindOpts = [];
    end

    if length(input)==2
        if ischar(input{1})
            Cfg.marker = input{1};
        elseif ischar(input{2})
            Cfg.marker = input{2};
        else
            error('ERROR: No marker specified');
        end
        if isnumeric(input{1})
            Cfg.normalize = input{1};
        elseif isnumeric(input{2})
            Cfg.normalize = input{2};
        else
            error('ERROR: No normalization specified');
        end
        Cfg.WindOpts = [];
    end

    if length(input)==3
        Cfg.WindOpts = input{3};
        if ischar(input{1})
            Cfg.marker = input{1};
        elseif ischar(input{2})
            Cfg.marker = input{2};
        else
            error('ERROR: No marker specified');
        end
        if isnumeric(input{1})
            Cfg.normalize = input{1};
        elseif isnumeric(input{2})
            Cfg.normalize = input{2};
        else
            error('ERROR: No normalization specified');
        end
    end
end

if ~isfield(Cfg,'WindType')
    Cfg.WindType = @hanning;                                                % Can have options 'periodic' and 'symmetric'
elseif ( ischar(Cfg.WindType) && strcmp(Cfg.WindType,'none') ) || ( isa(Cfg.WindType, 'function_handle') && strcmp(func2str(Cfg.WindType),'none') )
    Cfg.WindType = @rectwin;
end
if ~isfield(Cfg,'WindOpts')
    Cfg.WindOpts = [];                                                      % When left empty, default options of hanning window are taken ('symmetric')
end
if ~isfield(Cfg,'marker')
    Cfg.marker = 'b';
end
if ~isfield(Cfg,'normalize')
    Cfg.normalize = 0;
end
if ~isfield(Cfg,'MarkerOpts')
    Cfg.MarkerOpts.LineWidth = 0.5;
    Cfg.MarkerOpts.MarkerSize = 6;
end

% -------------------------------------------------------------------------
% -- Project   : Stingray
% -- Content   : This function is used to plot the FFT.
% -- Filename  : $HeadURL: http://imecwww/svn/stingray/trunk/Data/GlobalLib/MatlabLib/plotfft.m $
% -- Date      : $Date: 2013-09-13 14:17:37 +0200 (Fri, 13 Sep 2013) $
% -- Version   : $Revision: 716 $
% -- Commiter  : $Author: boerp $
% -------------------------------------------------------------------------
% --  CONFIDENTIAL and PROPRIETARY
% --  COPYRIGHT (c) Stichting IMEC Nederland, 2011
% --
% --  All rights are reserved. Reproduction in whole or in part is
% --  prohibited without the written consent of the copyright owner
