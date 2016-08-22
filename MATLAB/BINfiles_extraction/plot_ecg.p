function Cfg = plot_ecg(PL, Cfg)
% Cfg = plot_ecg(Payload, Cfg)
% This function is used to plot the ECG-signal, including
% PIE-, Pace-detection- and electrode-off-indications.
%
% INPUT
%   - Payload: a struct with the following fields
%       o Status   
%       o ECG      
%       o PaceList
%   - Cfg: a struct with the following fields (value in [] are defaults and may be omitted)
%       o Plot.PlotRawADCValues - Plot RAW-ADC-values (1) or convert to milli-volts [0]
%       o Plot.PlotPIE          - Plot PIE's; disable (0), enable [1]
%       o Plot.PlotPaceDet      - Plot Pace-detections; disable (0), enable [1]
%       o Plot.PlotElecStatus   - Plot electrode status; disable (0), enable [1]
%       o Plot.StartTime        - Start time of the plot (default = 0)
%       o Plot.EndTime          - End time of the plot (default = length(PL.ECG))
%       o Plot.LinkAxes         - Link axes of subplots; disable (0), enable [1]
%       o ECG.VrefADC           - (V) Refence voltage of the ADC.
%       o ECG.GainAfe           - () Thus 1mV at the input maps to 280mV at the ADC-input.
%       o ECG.MaxValue          - Maximum RAW ECG-value
%       o ECG.Fs                - (Hz) Sampling frequency of ECG-signal
% 
% OUTPUT
%    - Cfg: a struct as defined above, but with updated fields
% 
% EXAMPLE
% The following example will plot the ECG-data, Pace-pulse-detections and
% PIE's (default setting)
%   [FH,DH,PL]       = read_data_file('holter00.bin');
%   Cfg.ECG.VrefADC  = 1.05;                                                 % (V) Refence voltage of the ADC.
%   Cfg.ECG.GainAfe  = 70;                                                 % () Thus 1mV at the input maps to 280mV at the ADC-input.
%   Cfg.ECG.MaxValue = 2048;                                                % Maximum RAW ECG-value
%   Cfg.ECG.Fs       = DH.ECGfs;                                            % (Hz) Sampling frequency of ECG-signal
% 	Cfg              = plot_ecg(PL, Cfg);

if nargin == 0
    help plot_ecg
    return
elseif nargin==1
      Cfg.Plot.PlotRawADCValues = 0;                                        % Plot ECG-data in milli-volts
      Cfg.Plot.PlotPIE          = 1;                                        % Plot PIE's
      Cfg.Plot.PlotPaceDet      = 1;                                        % Plot Pace-detections
      Cfg.Plot.PlotElecStatus   = 1;                                        % Plot electrode status
      Cfg.Plot.StartTime        = 0;                                        % Start time of the plot
      Cfg.Plot.EndTime          = Inf;                                      % End time of the plot
      Cfg.Plot.LinkAxes         = 1;                                        % Link axes of subplots
      Cfg.ECG.VrefADC           = 1.05;                                     % (V) Reference voltage of the ADC.
      Cfg.ECG.GainAfe           = 70;                                       % () Gain of the AFE
      Cfg.ECG.MaxValue          = 2048;                                     % Maximum RAW ECG-value
      Cfg.ECG.Fs                = 256;                                      % (Hz) Sampling frequency of ECG-signal
      if strcmpi(PL,'cfg')
        return
      end
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
                253, 242,  49;                                              % yellow
                ]/255;
end
if isfield(Cfg.Plot,'AxHandles') && all(ishandle(Cfg.Plot.AxHandles))
    ax = Cfg.Plot.AxHandles;
else
    figure;
    subplot(2,1,1); ax(1) = gca; 
    subplot(2,1,2); ax(2) = gca; 
end
if isfield(Cfg.Plot,'PlotRawADCValues')
    PlotRawADCValues = Cfg.Plot.PlotRawADCValues;
else
    PlotRawADCValues = 0;
end
if isfield(Cfg.Plot,'StartTime')
    StartTime = Cfg.Plot.StartTime;
else
    StartTime = 0;
end
if isfield(Cfg.Plot,'EndTime')
    EndTime = Cfg.Plot.EndTime;
    if EndTime==Inf
        EndTime = length(PL.ECG)/Cfg.ECG.Fs;
    end
else
    EndTime = length(PL.ECG)/Cfg.ECG.Fs;
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
if isfield(Cfg.Plot,'PlotPaceDet')
    PlotPaceDet = Cfg.Plot.PlotPaceDet;
    if ~isfield(PL,'Status')
        error('PL.Status field not present')
    elseif ~isfield(PL.Status,'PaceListCount') || ~isfield(PL,'PaceList')
        error('Either PL.Status.PIEs or PL.PaceList field not present');
    end
else
    PlotPaceDet = 1;
end

if isfield(Cfg.Plot,'PlotElecStatus')
    PlotElecStatus = Cfg.Plot.PlotElecStatus;
    if ~isfield(PL,'Status')
        error('PL.Status field not present')
    elseif ~isfield(PL.Status,'ElectrodeStat')
        error('Either PL.Status.ElectrodeStat field not present');
    end
else
    PlotElecStatus = 1;
end
if isfield(Cfg.Plot,'LinkAxes')
    LinkAxes = Cfg.Plot.LinkAxes;
else
    LinkAxes = 1;
end

%% Calculate data to plot
Fs    = Cfg.ECG.Fs;

if ~PlotRawADCValues
    % Convert data from RAW ADC values to milli-volts
    ECGdata = PL.ECG(:,Fs*StartTime+1:Fs*EndTime) / Cfg.ECG.MaxValue * (Cfg.ECG.VrefADC/2)/ Cfg.ECG.GainAfe * 1000; % (mV) Convert values to milli-volts
    YLabelStr = 'Input voltage [mV]';
else
    ECGdata = PL.ECG(:,Fs*StartTime+1:Fs*EndTime) / Cfg.ECG.MaxValue;
    YLabelStr = 'ADC-output value [FS]';
end

% Prune PaceList and Status info
PL.PaceList             = PL.PaceList(:,StartTime+1:EndTime);
PL.Status.BatteryLevel  = PL.Status.BatteryLevel(StartTime+1:EndTime);
PL.Status.PIEs          = PL.Status.PIEs(StartTime+1:EndTime);
PL.Status.PaceListCount = PL.Status.PaceListCount(StartTime+1:EndTime);
PL.Status.ElectrodeStat = PL.Status.ElectrodeStat(StartTime+1:EndTime,:);

% Create time-signal
t_ecg = (Fs*StartTime:Fs*EndTime-1)/Fs;

if PlotPaceDet
    if sum(PL.Status.PaceListCount)==0
       PlotPaceDet = 0; 
    else
        % Create Index list of pace-detections
        PaceDetIndx = zeros(1,sum(PL.Status.PaceListCount));
        count = 1;
        for k=find(PL.Status.PaceListCount~=0)
            range     = (k-1)*Fs+1:k*Fs;
            RangeIndx = PL.PaceList(1:PL.Status.PaceListCount(k),k);
            PaceDetIndx(count:count+PL.Status.PaceListCount(k)-1) = range(RangeIndx+1);
            count     = count + PL.Status.PaceListCount(k);
        end
    end
end

if PlotPIE
    if sum(PL.Status.PIEs)==0
       PlotPIE = 0; 
    else
        % Create Index list of PIE's
        Indx = find(PL.Status.PIEs==1).';
        PieList = [(Indx-1)*Fs+1,Indx*Fs];
    end
end

if PlotElecStatus
    % Create Index list of PIE's
    ElectrodeStat(:,1) = PL.Status.ElectrodeStat(:,1)==0;                   % Check when electrode 1 is off
    ElectrodeStat(:,2) = PL.Status.ElectrodeStat(:,2)==0;                   % Check when electrode 2 is off
    ElectrodeStat(:,3) = PL.Status.ElectrodeStat(:,3)==0;                   % Check when electrode 3 is off
    ElectrodeStat(:,4) = all(ElectrodeStat,2);                              % Check when all electrodes are off
    ElectrodeStat(ElectrodeStat(:,4),1:3) = 0;                              % Uncheck where electrode 1, 2 and 3 off, where all electrodes are off
  
    if sum(ElectrodeStat(:))==0                                             % If no electrode-off
        PlotElecStatus = 0;
    else
        Indx = find(ElectrodeStat(:,1));
        ElectrodeOffList{1} = [(Indx-1)*Fs+1,Indx*Fs];
        Indx = find(ElectrodeStat(:,2));
        ElectrodeOffList{2} = [(Indx-1)*Fs+1,Indx*Fs];
        Indx = find(ElectrodeStat(:,3));
        ElectrodeOffList{3} = [(Indx-1)*Fs+1,Indx*Fs];
        Indx = find(ElectrodeStat(:,4));
        ElectrodeOffList{4} = [(Indx-1)*Fs+1,Indx*Fs];
    end
 end

%% Plot data
axes(ax(1));
h(1) = plot(t_ecg, ECGdata(1,:),'-','Color',ColorMap(1,:));
hold on; grid on;
LegendStr{1} = 'ECG data';

if PlotPaceDet
    h(end+1) = plot(t_ecg(PaceDetIndx), ECGdata(1,PaceDetIndx),'o','MarkerFaceColor', ColorMap(2,:), 'Color', ColorMap(2,:));  % Plot now, to make correct legend
    LegendStr{end+1} = 'Pace detected';
end
if PlotPIE
    h(end+1) = plot(t_ecg(PieList(1,1):PieList(1,2)), ECGdata(1,PieList(1,1):PieList(1,2)), 'Color',ColorMap(7,:), 'LineWidth',2);
    for k=2:size(PieList,1)
        plot(t_ecg(PieList(k,1):PieList(k,2)), ECGdata(1,PieList(k,1):PieList(k,2)), 'Color',ColorMap(7,:), 'LineWidth',2);
    end
    LegendStr{end+1} = 'PIE detected';
end
if PlotElecStatus
    if ~isempty(ElectrodeOffList{1})
        h(end+1) = plot(t_ecg(ElectrodeOffList{1}(1,1):ElectrodeOffList{1}(1,2)), ECGdata(1,ElectrodeOffList{1}(1,1):ElectrodeOffList{1}(1,2)), ':', 'Color',ColorMap(4,:),'LineWidth',2);
        for k=2:size(ElectrodeOffList{1},1)
            plot(t_ecg(ElectrodeOffList{1}(k,1):ElectrodeOffList{1}(k,2)), ECGdata(1,ElectrodeOffList{1}(k,1):ElectrodeOffList{1}(k,2)), ':', 'Color',ColorMap(4,:),'LineWidth',2);
        end
        LegendStr{end+1} = 'X1 off';
    end
    if ~isempty(ElectrodeOffList{3})
        h(end+1) = plot(t_ecg(ElectrodeOffList{3}(1,1):ElectrodeOffList{3}(1,2)), ECGdata(1,ElectrodeOffList{3}(1,1):ElectrodeOffList{3}(1,2)), ':', 'Color',ColorMap(5,:),'LineWidth',2);
        for k=2:size(ElectrodeOffList{3},1)
            plot(t_ecg(ElectrodeOffList{3}(k,1):ElectrodeOffList{3}(k,2)), ECGdata(1,ElectrodeOffList{3}(k,1):ElectrodeOffList{3}(k,2)), ':', 'Color',ColorMap(5,:),'LineWidth',2);
        end
        LegendStr{end+1} = 'X3 off';
    end
    if ~isempty(ElectrodeOffList{4})
        h(end+1) = plot(t_ecg(ElectrodeOffList{4}(1,1):ElectrodeOffList{4}(1,2)), ECGdata(1,ElectrodeOffList{4}(1,1):ElectrodeOffList{4}(1,2)), ':', 'Color',ColorMap(6,:),'LineWidth',2);
        for k=2:size(ElectrodeOffList{4},1)
            plot(t_ecg(ElectrodeOffList{4}(k,1):ElectrodeOffList{4}(k,2)), ECGdata(1,ElectrodeOffList{4}(k,1):ElectrodeOffList{4}(k,2)), ':', 'Color',ColorMap(6,:),'LineWidth',2);
        end
        LegendStr{end+1} = 'All off';
    end
end

title('ECGdata channel 1');
xlabel('Time [s]');
ylabel(YLabelStr);
legend(h, LegendStr);
if PlotRawADCValues
    ylim([-1,1]);
else
%     set(ax(1),'Ytick',-5:5);
    UpperLimit = ceil(Cfg.ECG.VrefADC/(2*Cfg.ECG.GainAfe)*1000);
    ylim([-UpperLimit, UpperLimit]);
end

clear LegendStr h;

axes(ax(2)); 
h(1) = plot(t_ecg, ECGdata(2,:),'-','Color',ColorMap(1,:));
hold on; grid on;
LegendStr{1} = 'ECG data';

if PlotPaceDet
    h(end+1) = plot(t_ecg(PaceDetIndx), ECGdata(2,PaceDetIndx),'o','MarkerFaceColor', ColorMap(2,:), 'Color', ColorMap(2,:));  % Plot now, to make correct legend
    LegendStr{end+1} = 'Pace detected';
end
if PlotPIE
    h(end+1) = plot(t_ecg(PieList(1,1):PieList(1,2)), ECGdata(2,PieList(1,1):PieList(1,2)), 'Color',ColorMap(7,:), 'LineWidth',2);
    for k=2:size(PieList,1)
        plot(t_ecg(PieList(k,1):PieList(k,2)), ECGdata(2,PieList(k,1):PieList(k,2)), 'Color',ColorMap(7,:), 'LineWidth',2);
    end
    LegendStr{end+1} = 'PIE detected';
end
if PlotElecStatus
    if ~isempty(ElectrodeOffList{1})
        h(end+1) = plot(t_ecg(ElectrodeOffList{1}(1,1):ElectrodeOffList{1}(1,2)), ECGdata(2,ElectrodeOffList{1}(1,1):ElectrodeOffList{1}(1,2)), ':', 'Color',ColorMap(4,:),'LineWidth',2);
        for k=2:size(ElectrodeOffList{1},1)
            plot(t_ecg(ElectrodeOffList{1}(k,1):ElectrodeOffList{1}(k,2)), ECGdata(2,ElectrodeOffList{1}(k,1):ElectrodeOffList{1}(k,2)), ':', 'Color',ColorMap(4,:),'LineWidth',2);
        end
        LegendStr{end+1} = 'X1 off';
    end
    if ~isempty(ElectrodeOffList{2})
        h(end+1) = plot(t_ecg(ElectrodeOffList{2}(1,1):ElectrodeOffList{2}(1,2)), ECGdata(2,ElectrodeOffList{2}(1,1):ElectrodeOffList{2}(1,2)), ':', 'Color',ColorMap(5,:),'LineWidth',2);
        for k=2:size(ElectrodeOffList{2},1)
            plot(t_ecg(ElectrodeOffList{2}(k,1):ElectrodeOffList{2}(k,2)), ECGdata(2,ElectrodeOffList{2}(k,1):ElectrodeOffList{2}(k,2)), ':', 'Color',ColorMap(5,:),'LineWidth',2);
        end
        LegendStr{end+1} = 'X2 off';
    end
    if ~isempty(ElectrodeOffList{4})
        h(end+1) = plot(t_ecg(ElectrodeOffList{4}(1,1):ElectrodeOffList{4}(1,2)), ECGdata(2,ElectrodeOffList{4}(1,1):ElectrodeOffList{4}(1,2)), ':', 'Color',ColorMap(6,:),'LineWidth',2);
        for k=2:size(ElectrodeOffList{4},1)
            plot(t_ecg(ElectrodeOffList{4}(k,1):ElectrodeOffList{4}(k,2)), ECGdata(2,ElectrodeOffList{4}(k,1):ElectrodeOffList{4}(k,2)), ':', 'Color',ColorMap(6,:),'LineWidth',2);
        end
        LegendStr{end+1} = 'All off';
    end
end
title('ECG channel 2');
xlabel('Time [s]');
ylabel(YLabelStr);
legend(h, LegendStr);
if PlotRawADCValues
    ylim([-1,1]);
else
%     set(ax(2),'Ytick',-5:5);
    UpperLimit = ceil(Cfg.ECG.VrefADC/(2*Cfg.ECG.GainAfe)*1000);
    ylim([-UpperLimit, UpperLimit]);
end

if LinkAxes
    linkaxes(ax,'xy');
end

%% Save plot configuration
%           Note: subscript assignment is needed when structure is empty
Cfg.Plot(1).ColorMap         = ColorMap;                                    % Colormap with colors to be used
Cfg.Plot(1).AxHandles        = ax;                                          % Handle to axes where the data needs to be plotted
Cfg.Plot(1).PlotRawADCValues = PlotRawADCValues;                            % Plot RAW-ADC-values (1) or convert to milli-volts
Cfg.Plot(1).PlotPIE          = PlotPIE;                                     % Plot PIE's
Cfg.Plot(1).PlotPaceDet      = PlotPaceDet;                                 % Plot Pace-detections
Cfg.Plot(1).PlotElecStatus   = PlotElecStatus;                              % Plot electrodestatus
Cfg.Plot(1).StartTime        = StartTime;                                   % End time of the plot
Cfg.Plot(1).EndTime          = EndTime;                                 	% Start time of the plot
Cfg.Plot(1).LinkAxes         = LinkAxes;                                    % Link axes of subplots

% -------------------------------------------------------------------------
% -- Project   : Stingray
% -- Content   : This function is used to plot the ECG-signal, including
%                PIE- and Pace-detection-indications.
% -- Filename  : $HeadURL: http://imecwww/svn/stingray/trunk/Data/GlobalLib/MatlabLib/plot_ecg.m $
% -- Date      : $Date: 2014-08-22 14:02:08 +0200 (Fri, 22 Aug 2014) $
% -- Version   : $Revision: 3303 $
% -- Commiter  : $Author: boerp $
% -------------------------------------------------------------------------
% --  CONFIDENTIAL and PROPRIETARY
% --  COPYRIGHT (c) Stichting IMEC Nederland, 2011
% --
% --  All rights are reserved. Reproduction in whole or in part is
% --  prohibited without the written consent of the copyright owner