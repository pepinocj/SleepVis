function Cfg = plot_ax(PL, Cfg)
% Cfg = plot_ecg(Payload, Cfg)
% This function is used to plot the ECG-signal, including
% PIE- and Pace-detection-indications.
%
% INPUT
%   - Payload: a struct with the following fields
%       o Status   
%       o ECG      
%       o PaceList
%   - Cfg: a struct with the following fields (value in [] are defaults and may be omitted)
%       o Cfg.Plot.PlotRawAXValues - Plot RAW-ADC-values (1) or convert to milli-volts [0]
%       o Cfg.Plot.PlotPIE         - Plot PIE's [1]
%       o Cfg.Plot.LinkAxes        - Link axes of subplots [1]
%       o Cfg.AX.Fs                - (Hz) Sampling frequency
%       o Cfg.AX.AxRange           - (g) Dynamic range of acceleration (single-sided)
%       o Cfg.AX.MaxValue          - Maximum RAW acceleration value
% 
% OUTPUT
%    - Cfg: a struct as defined above, but with updated fields
% 
% EXAMPLE
% The following example will plot the AX-data, and PIE's (default setting)
%   [FH,DH,PL]       = read_data_file('holter00.bin');
%   Cfg.AX.AxRange   = 2;                                                   % (g) Dynamic range of acceleration (single-sided)
%   Cfg.AX.MaxValue  = 128;                                                 % Maximum RAW acceleration value (8-bit signed value)
%   Cfg.AX.Fs        = DH.AXfs;                                             % (Hz) Sampling frequency
% 	Cfg              = plot_ax(PL, Cfg);

if nargin==0
    help plot_ax
    return
end

%% Parse input
if ~isfield(Cfg,'Plot')
    Cfg.Plot = struct([]);                                                  % Create empty struct
end
if isfield(Cfg.Plot,'ColorMap')
    ColorMap = Cfg.Plot.ColorMap;
else
    ColorMap = [  0,  48, 255;                                              % blue
                255,   0,   0;                                              % red
                  0, 234, 117;                                              % green
                255, 128,   0;                                              % orange
                170,   0, 255;                                              % purple
                210,   0,   0;                                              % dark red
                  0, 207, 255;                                              % light blue
                  0, 159,   0;                                              % dark green
                  0,   0, 128;                                              % dark blue
                ]/255;
end
if isfield(Cfg.Plot,'AxHandles') && all(ishandle(Cfg.Plot.AxHandles))
    ax = Cfg.Plot.AxHandles;
else
    figure;
    subplot(3,1,1); ax(1) = gca; 
    subplot(3,1,2); ax(2) = gca; 
    subplot(3,1,3); ax(3) = gca; 
end
if isfield(Cfg.Plot,'PlotRawAXValues')
    PlotRawAXValues = Cfg.Plot.PlotRawAXValues;
else
    PlotRawAXValues = 0;
end
if isfield(Cfg.Plot,'PlotPIE')
    PlotPIE = Cfg.Plot.PlotPIE;
    if ~isfield(PL,'Status')
        error('PL.Status field not present')
    elseif ~isfield(PL.Status,'PIEs')
            error('No PL.Status.PIEs field present');
    end
else
    PlotPIE = 1;
end
if isfield(Cfg.Plot,'LinkAxes')
    LinkAxes = Cfg.Plot.LinkAxes;
else
    LinkAxes = 1;
end

%% Calculate data to plot
Fs = Cfg.AX.Fs;
if PlotRawAXValues
    AX = PL.AX / Cfg.AX.MaxValue;
    YLabelStr = 'Acceleration [FS]';
else
    AX = PL.AX * Cfg.AX.AxRange / Cfg.AX.MaxValue;                          % [g] Convert to g's
    YLabelStr = 'Acceleration [g]';
end
t_ax = (0:length(AX)-1) / Fs;

% Create Index list of PIE's
if PlotPIE
    Indx    = find(PL.Status.PIEs==1).';
    if isempty(Indx)
        PlotPIE = 0;
    else
        PieList = [(Indx-1)*Fs+1,Indx*Fs];
    end
end

LegendStr    = cell(1,1+PlotPIE);
LegendStr{1} = 'Acceleration';

%% Plot data
axes(ax(1)); grid on;
plot(t_ax, AX(1,:),'Color',ColorMap(1,:));
hold on; 
if PlotPIE
    for k=1:size(PieList,1)
        plot(t_ax(PieList(k,1):PieList(k,2)), AX(1,PieList(k,1):PieList(k,2)),'Color',ColorMap(8,:),'LineWidth',1);
    end
    LegendStr{2} = 'PIE detected';
end
xlabel('Time [s]');
ylabel(YLabelStr);
title('Acceleration on X-axes');
legend(LegendStr);

axes(ax(2)); grid on;
plot(t_ax, AX(2,:),'Color',ColorMap(2,:));
hold on; 
if PlotPIE
    for k=1:size(PieList,1)
        plot(t_ax(PieList(k,1):PieList(k,2)), AX(2,PieList(k,1):PieList(k,2)),'Color',ColorMap(7,:),'LineWidth',1);
    end
end
xlabel('Time [s]');
ylabel(YLabelStr);
title('Acceleration on Y-axes');
legend(LegendStr);

axes(ax(3)); grid on;
plot(t_ax, AX(3,:),'Color',ColorMap(3,:));
hold on; 
if PlotPIE
    for k=1:size(PieList,1)
        plot(t_ax(PieList(k,1):PieList(k,2)), AX(3,PieList(k,1):PieList(k,2)),'Color',ColorMap(4,:),'LineWidth',1);
    end
end
xlabel('Time [s]');
ylabel(YLabelStr);
title('Acceleration on Z-axes');
legend(LegendStr);

if LinkAxes
    linkaxes(ax,'xy');
end

%% Save plot configuration
%           Note: subscript assignment is needed when structure is empty
Cfg.Plot(1).ColorMap         = ColorMap;                                    % Colormap with colors to be used
Cfg.Plot(1).AxHandles        = ax;                                          % Handle to axes where the data needs to be plotted
Cfg.Plot(1).PlotRawAXValues  = PlotRawAXValues;                             % Plot RAW-ADC-values (1) or convert to milli-volts
Cfg.Plot(1).PlotPIE          = PlotPIE;                                     % Plot PIE's
Cfg.Plot(1).LinkAxes         = LinkAxes;                                    % Link axes of subplots

% -------------------------------------------------------------------------
% -- Project   : Stingray
% -- Content   : This function is used to plot the AX-signal, including
%                PIE-indications.
% -- Filename  : $HeadURL: http://imecwww/svn/stingray/trunk/Data/GlobalLib/MatlabLib/plot_ax.m $
% -- Date      : $Date: 2013-10-07 21:38:21 +0200 (Mon, 07 Oct 2013) $
% -- Version   : $Revision: 897 $
% -- Commiter  : $Author: boerp $
% -------------------------------------------------------------------------
% --  CONFIDENTIAL and PROPRIETARY
% --  COPYRIGHT (c) Stichting IMEC Nederland, 2011
% --
% --  All rights are reserved. Reproduction in whole or in part is
% --  prohibited without the written consent of the copyright owner