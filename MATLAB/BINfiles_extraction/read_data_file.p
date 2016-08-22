function [FileHeader, DataHeader, Payload] = read_data_file(FileName)
%   [FH, DH, PL] = read_data_file(filename)
%   This function is used to read holter data-files for the Stingray
%   project. The input-data must be stored according to the format as 
%   specified in http://imecwww/svn/stingray/trunk/Documentation/C07_Design_and_implementation/C07S000_SYS_Architecture/SR-IM-PS-015A/Data storage format specification.docm
%   
%   INPUT
%   - filename: a string containing the filename to be read
%
%   OUTPUT
%   - FH: struct containing the file-header
%   - DH: struct containing the data-header
%   - PL: struct containing the payload

if nargin==0
    help read_data_file
    exit;
end
fid = fopen(FileName,'r');

% Read file-header
FileHeader.SyncWord          = fread(fid, 1, 'uint32');
FileHeader.FileHeaderVersion = fread(fid, 1, 'uint16');
FileHeader.FileHeaderLength  = fread(fid, 1, 'uint16');
FileHeader.DeviceDescription = fread(fid, [1,50], 'uint8=>char');
FileHeader.DeviceHWID        = fread(fid, 4, 'uint32');
FileHeader.DeviceSWID.Build  = fread(fid, 1, 'uint32');
FileHeader.DeviceSWID.Minor  = fread(fid, 1, 'uint16');
FileHeader.DeviceSWID.Major  = fread(fid, 1, 'uint16');
FileHeader.PrescriptionID    = fread(fid, [1, 25], 'uint8=>char');

% Verify file-header
verify_fileheader(FileHeader);

% Read data-header
DataHeader.SyncWord          = fread(fid, 1, 'uint32');
DataHeader.DataType          = fread(fid, 1, 'uint32');
switch DataHeader.DataType
    case 0
        DataHeader.DataHeaderLength = fread(fid, 1, 'uint16');
        DataHeader.LocalTime        = SR_time(fread(fid, 1, 'uint64=>uint64'));
        DataHeader.TimeOffset       = fread(fid, 1, 'uint32');
        DataHeader.FileLength       = fread(fid, 1, 'uint32');
        DataHeader.ECGfs            = fread(fid, 1, 'uint16');
        DataHeader.ECGnc            = fread(fid, 1, 'uint8');
        DataHeader.ECGnb            = fread(fid, 1, 'uint8');
        DataHeader.AXfs             = fread(fid, 1, 'uint16');
        DataHeader.AXnc             = fread(fid, 1, 'uint8');
        DataHeader.AXnb             = fread(fid, 1, 'uint8');
        DataHeader.AXsampax         = fread(fid, 1, 'uint8');
        DataHeader.BatLvlts         = fread(fid, 1, 'uint16');
        DataHeader.ElectrodeStatts  = fread(fid, 1, 'uint16');
        DataHeader.PaceListBytes    = fread(fid, 1, 'uint8');
        DataHeader.BytesPerSecond   = fread(fid, 1, 'uint32');
        
        % Verify dataheader
%         verify_dataheader0(DataHeader);
        
        % Verify filesize
        verify_filesize0(fid, DataHeader, FileHeader.FileHeaderLength);   
    otherwise
        error('Datatype %d not specified yet',DataHeader.DataType);
end

% Read payload
switch  DataHeader.PaceListBytes
    case 1
        PaceDataType = 'uint8';
    case 2
        PaceDataType = 'uint16';
    otherwise
        error('Wrong value for PaceListBytes');
end
% Pre-allocate
ECGfs                        = DataHeader.ECGfs;
AXfs                         = DataHeader.AXfs;
AXnc                         = DataHeader.AXnc;
FileLength                   = DataHeader.FileLength;
Payload.ECG                  = zeros(2, ECGfs*FileLength);
Payload.AX                   = zeros(DataHeader.AXnc, AXfs*FileLength);
Payload.PaceList             = zeros(5, FileLength);
Payload.Status.BatteryLevel  = zeros(1,DataHeader.FileLength);
Payload.Status.PIEs          = zeros(1,DataHeader.FileLength);
Payload.Status.PaceListCount = zeros(1,DataHeader.FileLength);
Payload.Status.ElectrodeStat = zeros(DataHeader.FileLength,3);
for k=1:DataHeader.FileLength
    temp = uint16(fread(fid,1,'uint16'));
    %Payload.Status.BatteryLevel(k)  = double(bi2de(bitget(temp,1:7),'right-msb'));      % The function bi2de requires the communication toolbox; TODO: change code, so it does not need it.
    Payload.Status.PIEs(k)          = double(      bitget(temp,8));
%     Payload.Status.PaceListCount(k) = double(bi2de(bitget(temp,9:11),'right-msb'));     % The function bi2de requires the communication toolbox; TODO: change code, so it does not need it.
    Payload.Status.ElectrodeStat(k,:) = double(      bitget(temp,12:14));
%     Payload.Status(k).BatteryLevel  = double(bi2de(bitget(temp,1:7),'right-msb'));      % The function bi2de requires the communication toolbox; TODO: change code, so it does not need it.
%     Payload.Status(k).PIEs          = double(      bitget(temp,8));
%     Payload.Status(k).PaceListCount = double(bi2de(bitget(temp,9:11),'right-msb'));     % The function bi2de requires the communication toolbox; TODO: change code, so it does not need it.
%     Payload.Status(k).ElectrodeStat = double(      bitget(temp,12:14));
    assert(all(bitget(temp,15:16)==[0,0]),'All reserved bits in the status word must be 0')
    temp                                     = fread(fid, [3, DataHeader.ECGfs],'uint8');
    if ECGfs>0
        Payload.ECG(:,(k-1)*ECGfs+1:k*ECGfs) = format212_to_data(temp);
    end
    if AXnc*AXfs>0
        Payload.AX (:,(k-1)*AXfs+1:k*AXfs)   = fread(fid, [AXnc, AXfs], 'int8');
    end
    Payload.PaceList(:,k)                    = fread(fid, 5, PaceDataType).';
end
fclose(fid);

function verify_fileheader(FileHeader)
assert(FileHeader.SyncWord==hex2dec('f3f3f3f3'),'FileHeader-syncword does not equal 0xF3F3F3F3')
assert(FileHeader.FileHeaderLength==107,'File-header length must be 107 bytes');

function verify_dataheader0(DataHeader)
BytesPerSecond_exp = 2 + 3*DataHeader.ECGfs + DataHeader.AXnc * DataHeader.AXfs + 5*DataHeader.PaceListBytes;

assert(DataHeader.SyncWord==hex2dec('fdfdfdfd'),'DataHeader-syncword does not equal 0xFDFDFDFD')
assert(DataHeader.DataType==0,'Datatype must be 0');
assert(DataHeader.DataHeaderLength==44,'Data-header length must be 44 bytes');
assert(DataHeader.ECGnc==2,'Number of ECG channels must be 2');
assert(DataHeader.ECGnb<=12 & DataHeader.ECGnb>=0,'Number of bits per ECG-sample must be <=12');
assert(DataHeader.AXnc<=3 & DataHeader.AXnc>=0,'Number of AX channels must be <=3');
assert(DataHeader.AXnb<=8 & DataHeader.AXnb>=0,'Number of bits per AX-sample must be <=8');
assert(DataHeader.BatLvlts>=0,'Battery-level sample time must be >=0');
assert(DataHeader.ElectrodeStatts>=0,'Electrode-status sample time must be >=0');
assert(DataHeader.PaceListBytes==1 || DataHeader.PaceListBytes==2,'Each pace-list entry must have 1 or 2 bytes');
assert(DataHeader.BytesPerSecond==BytesPerSecond_exp,'It is expected to have %d B/s and not %d',BytesPerSecond_exp, DataHeader.BytesPerSecond);

function verify_filesize0(fid, DataHeader, FileHeaderLength)
s = ftell(fid);                                                             % Get current file-pointer location
fseek(fid,0,'eof');                                                         % Set file-point location to end-of-file
FileSizeAct = ftell(fid);                                                   % Get number of bytes
fseek(fid,s,'bof');                                                         % Set file-pointer to previous location
FileSizeExp =  FileHeaderLength + DataHeader.DataHeaderLength + DataHeader.FileLength*DataHeader.BytesPerSecond;
%assert(FileSizeAct==FileSizeExp, 'Exptected and actual file-size are not equal')

function y = format212_to_data(A)
% The routine below is copied from: http://www.physionet.org/physiotools/matlab/rddata.m
if isempty(A)
    y = [];
    return
end

M2H    = bitshift(A(2,:), -4);
M1H    = bitand(A(2,:), 15);
PRL    = bitshift(bitand(A(2,:),8),9);                                      % Sign Bit; 2^9*2^3=2^12
PRR    = bitshift(bitand(A(2,:),128),5);                                    % Sign Bit; 2^5*2^7=2^12
y(1,:) = bitshift(M1H,8)+ A(1,:)-PRL;
y(2,:) = bitshift(M2H,8)+ A(3,:)-PRR;

% -------------------------------------------------------------------------
% -- Project   : Stingray
% -- Content   : This function is used to read a holter data-file.
% -- Filename  : $HeadURL: http://imecwww/svn/stingray/trunk/Data/GlobalLib/MatlabLib/FileFormat/read_data_file.m $
% -- Date      : $Date: 2013-09-23 09:38:59 +0200 (Mon, 23 Sep 2013) $
% -- Version   : $Revision: 786 $
% -- Commiter  : $Author: boerp $
% -------------------------------------------------------------------------
% --  CONFIDENTIAL and PROPRIETARY
% --  COPYRIGHT (c) Stichting IMEC Nederland, 2011
% --
% --  All rights are reserved. Reproduction in whole or in part is
% --  prohibited without the written consent of the copyright owner


