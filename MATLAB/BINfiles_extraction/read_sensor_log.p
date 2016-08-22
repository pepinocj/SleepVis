% -------------------------------------------------------------------------
% -- Project   : Stingray
% -- Content   : This function read the sensor-log.
% -- Filename  : $HeadURL: http://imecwww/svn/stingray/trunk/Data/GlobalLib/MatlabLib/read_sensor_log.m $
% -- Date      : $Date: 2014-07-01 12:27:26 +0200 (Tue, 01 Jul 2014) $
% -- Version   : $Revision: 2742 $
% -- Commiter  : $Author: boerp $
% -------------------------------------------------------------------------
% --  CONFIDENTIAL and PROPRIETARY
% --  COPYRIGHT (c) Stichting IMEC Nederland, 2013
% --
% --  All rights are reserved. Reproduction in whole or in part is
% --  prohibited without the written consent of the copyright owner

function S = read_sensor_log(filename)
fid                     = fopen(filename,'r');
S.BIST                  = fread(fid, 1, 'uint32');
S.NrPrescriptions       = fread(fid, 1, 'uint16');
temp1                   = fread(fid, 2, 'uint8');
S.SensorLogVersion      = fread(fid, 1, 'uint8');
S.BatteryEndOfLife      = fread(fid, 1, 'uint8');
S.NrChargeCycles        = fread(fid, 1, 'uint16');
S.BattCapFirstCharge    = fread(fid, 1, 'uint16');
S.BattCapLastCharge     = fread(fid, 1, 'uint16');
S.BattCapBelowThreshold = fread(fid, 10, 'uint16');
S.CycleNrBelowThreshold = fread(fid, 10, 'uint16');
ErrorList               = reshape(fread(fid, 226, 'uint16'),2,113).';
temp2                   = fread(fid, 1, 'uint32');
fclose(fid);

% prune ErrorList to have no 0 values in it
ErrorList = ErrorList(ErrorList(:,1)~=0,:);

assert(all(temp1==0),'Terminating int8 is expected to be 0');
assert(temp2==0,'Terminating int32 is expected to be 0');
assert(issorted(ErrorList(ErrorList(:,1)~=0,1)),'Errorlist must be sorted');

NrName = get_nrname();
C = intersect([NrName{:,1}], ErrorList(:,1));
assert(length(C)==size(ErrorList,1),'Some values in the ErrorList are unknown by Matlab');

for k=1:size(ErrorList,1)
    S.ErrorList{k,1} = number2name(ErrorList(k,1));
    S.ErrorList{k,2} = ErrorList(k,2);
%     fprintf('%s hase code %d\n', ErrorName, ErrorList(k,1));
end

function Name = number2name(n)
NrName = get_nrname();
Indx = find([NrName{:,1}]==n);
if isempty(Indx)
    Name = '';
else
    Name = NrName{Indx, 2};
end

function NrName = get_nrname()
CATEGORY_GENERAL = hex2dec('0000');
CATEGORY_SDCARD  = hex2dec('0100');
CATEGORY_AFE     = hex2dec('0200');
CATEGORY_ADXL362 = hex2dec('0300');
CATEGORY_BMA222  = hex2dec('0400');
CATEGORY_POWER   = hex2dec('0500');
CATEGORY_USB     = hex2dec('0600');
CATEGORY_RADIO   = hex2dec('0700');
CATEGORY_SAM4S   = hex2dec('0800');

% NrName = cell(50,2);
% fid = fopen('D:\Projects\Stingray\trunk\Data\SW_uC\stingrayAtmel\stingray\src\Application\codes.h');
% count = 0;
% while ~feof(fid)
%     Tline = fgetl(fid);
%     if strfind(Tline,'#define')
%         if isempty(strfind(Tline,'_CODES_H_'))
%             count = count + 1;
%             spacesaftername = strfind(Tline(9:end),' ');
%             NrName{count,1} = Tline(8+(1:spacesaftername(1)));
%             NrName{count,2} = Tline(8+spacesaftername(end):end);
%             NrName(count,:)
%         end
%     end
% end
% fclose(fid);

% -- Codes for CATEGORY_GENERAL
NrName{1,1}     = bitxor(CATEGORY_GENERAL, hex2dec('00'));
NrName{1,2}     = 'EVENT_ERROR';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('01'));
NrName{end,2}   = 'EVENT_INI_ERROR';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('02'));
NrName{end,2}   = 'EVENT_ENTER_ACTIVE_MODE';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('03'));
NrName{end,2}   = 'EVENT_LEAVE_ACTIVE_MODE';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('04'));
NrName{end,2}   = 'EVENT_ENTER_USB_MODE';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('05'));
NrName{end,2}   = 'EVENT_LEAVE_USB_MODE';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('06'));
NrName{end,2}   = 'EVENT_ENTER_WAIT_MODE';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('07'));
NrName{end,2}   = 'EVENT_LEAVE_WAIT_MODE';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('08'));
NrName{end,2}   = 'EVENT_ENTER_SERVICE_MODE';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('09'));
NrName{end,2}   = 'EVENT_LEAVE_SERVICE_MODE';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('10'));
NrName{end,2}   = 'EVENT_ENTER_OFF_MODE';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('11'));
NrName{end,2}   = 'EVENT_LEAVE_OFF_MODE';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('12'));
NrName{end,2}   = 'EVENT_TIME_NOW';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('13'));
NrName{end,2}   = 'EVENT_NOT_AN_EVENT';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('14'));
NrName{end,2}   = 'EVENT_LOWPOWER';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('15'));
NrName{end,2}   = 'EVENT_LOG_MSG';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('16'));
NrName{end,2}   = 'EVENT_PIE';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('17'));
NrName{end,2}   = 'EVENT_WAIT_ACTIVE_MODE';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('18'));
NrName{end,2}   = 'EVENT_PATCH_WEAR';

NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('8001'));
NrName{end,2}   = 'ERROR_NOT_AN_ERROR';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('8002'));
NrName{end,2}   = 'ERROR_CONFIG_CRC';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('8003'));
NrName{end,2}   = 'ERROR_NO_CONFIG_INI';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('8004'));
NrName{end,2}   = 'ERROR_CONFIG_INI';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('8005'));
NrName{end,2}   = 'ERROR_MSF_BUFFER_OVERFLOW';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('8006'));
NrName{end,2}   = 'ERROR_AFE_BUFFER_OVERFLOW';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('8007'));
NrName{end,2}   = 'ERROR_LOWPOWER_INI';
NrName{end+1,1} = bitxor(CATEGORY_GENERAL, hex2dec('8008'));
NrName{end,2}   = 'ERROR_POST';

% -- Codes for CATEGORY_SDCARD
NrName{end+1,1} = bitxor(CATEGORY_SDCARD , hex2dec('01'));
NrName{end,2}   = 'LOG_SDCARD_POST';
NrName{end+1,1} = bitxor(CATEGORY_SDCARD , hex2dec('02'));
NrName{end,2}   = 'LOG_SDCARD_BIST';

NrName{end+1,1} = bitxor(CATEGORY_SDCARD , hex2dec('8001'));
NrName{end,2}   = 'ERROR_SDCARD_NOCARD';
NrName{end+1,1} = bitxor(CATEGORY_SDCARD , hex2dec('8002'));
NrName{end,2}   = 'ERROR_SDCARD_INIT';
NrName{end+1,1} = bitxor(CATEGORY_SDCARD , hex2dec('8003')); 
NrName{end,2}   = 'ERROR_SDCARD_MOUNT';
NrName{end+1,1} = bitxor(CATEGORY_SDCARD , hex2dec('8004'));
NrName{end,2}   = 'ERROR_SDCARD_WRITE';
NrName{end+1,1} = bitxor(CATEGORY_SDCARD , hex2dec('8005'));
NrName{end,2}   = 'ERROR_SDCARD_CREATE';

% -- Codes for CATEGORY_AFE
NrName{end+1,1} = bitxor(CATEGORY_SDCARD , hex2dec('01'));
NrName{end,2}   = 'LOG_AFE2Q_POST';
NrName{end+1,1} = bitxor(CATEGORY_SDCARD , hex2dec('02'));
NrName{end,2}   = 'LOG_AFE2Q_BIST';

NrName{end+1,1} = bitxor(CATEGORY_AFE    , hex2dec('8001'));
NrName{end,2}   = 'ERROR_AFE_INI';

% -- Codes for CATEGORY_ADXL362
NrName{end+1,1} = bitxor(CATEGORY_SDCARD , hex2dec('01'));
NrName{end,2}   = 'LOG_ADXL362_POST';
NrName{end+1,1} = bitxor(CATEGORY_SDCARD , hex2dec('02'));
NrName{end,2}   = 'LOG_ADXL362_BIST';

NrName{end+1,1} = bitxor(CATEGORY_ADXL362, hex2dec('8001'));
NrName{end,2}   = 'ERROR_ADXL362_INI';

% -- Codes for CATEGORY_BMA222
NrName{end+1,1} = bitxor(CATEGORY_SDCARD , hex2dec('01'));
NrName{end,2}   = 'LOG_BMA222_POST';
NrName{end+1,1} = bitxor(CATEGORY_SDCARD , hex2dec('02'));
NrName{end,2}   = 'LOG_BMA222_BIST';

NrName{end+1,1} = bitxor(CATEGORY_BMA222 , hex2dec('8001'));
NrName{end,2}   = 'ERROR_BMA222_INI';

% -- Codes for CATEGORY_POWER
NrName{end+1,1} = bitxor(CATEGORY_SDCARD , hex2dec('01'));
NrName{end,2}   = 'LOG_BATT_POST';
NrName{end+1,1} = bitxor(CATEGORY_SDCARD , hex2dec('02'));
NrName{end,2}   = 'LOG_BATT_BIST';

% -- Codes for CATEGORY_RADIO
NrName{end+1,1} = bitxor(CATEGORY_SDCARD , hex2dec('01'));
NrName{end,2}   = 'LOG_RADIO_DBG';
NrName{end+1,1} = bitxor(CATEGORY_SDCARD , hex2dec('02'));
NrName{end,2}   = 'LOG_RADIO_CONNECT';
NrName{end+1,1} = bitxor(CATEGORY_SDCARD , hex2dec('01'));
NrName{end,2}   = 'LOG_RADIO_POST';
NrName{end+1,1} = bitxor(CATEGORY_SDCARD , hex2dec('02'));
NrName{end,2}   = 'LOG_RADIO_BIST';
NrName{end+1,1} = bitxor(CATEGORY_SDCARD , hex2dec('01'));
NrName{end,2}   = 'LOG_PAN1322_DBG';

% -- Codes for CATEGORY_USB
% -- Codes for CATEGORY_SAM4S