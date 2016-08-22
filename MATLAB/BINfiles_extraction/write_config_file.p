function Str = write_config_file(filepath, Cfg)
% Create string 
Str =       sprintf('[config]\n');
Str = [Str, sprintf('SensorMode          = %s\n', Cfg.SensorMode)];
Str = [Str, sprintf('VisualMode          = %d\n', Cfg.VisualMode)];
Str = [Str, sprintf('AudioMode           = %d\n', Cfg.AudioMode)];
Str = [Str, sprintf('FileName            = %s\n', Cfg.FileName)];
Str = [Str, sprintf('PrescriptionID      = %s\n', Cfg.PID)];
Str = [Str, sprintf('PatchWearDuration   = %d\n', Cfg.PatchWearDuration)];
Str = [Str, sprintf('TimeOffset          = %d\n', Cfg.TimeOffset)];

% Create config-file
fid = fopen(fullfile(filepath,'config.ini'),'w');
fprintf(fid,'%s',Str);
fclose(fid);

% Calculate checksum
CS  = calc_config_checksum(Str);

% Create crc-file
fid = fopen(fullfile(filepath,'config.crc'),'w');
fprintf(fid,'%d\n',CS);
fclose(fid);

% -------------------------------------------------------------------------
% -- Project   : Stingray
% -- Content   : This function is used write a config-file.
% -- Filename  : $HeadURL: http://imecwww/svn/stingray/trunk/Data/GlobalLib/MatlabLib/write_config_file.m $
% -- Date      : $Date: 2013-12-19 12:29:39 +0100 (Thu, 19 Dec 2013) $
% -- Version   : $Revision: 1301 $
% -- Commiter  : $Author: boerp $
% -------------------------------------------------------------------------
% --  CONFIDENTIAL and PROPRIETARY
% --  COPYRIGHT (c) Stichting IMEC Nederland, 2011
% --
% --  All rights are reserved. Reproduction in whole or in part is
% --  prohibited without the written consent of the copyright owner
