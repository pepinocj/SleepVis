function write_data_file(FileName, FileHeader, DataHeader, Payload)
%   write_data_file(filename, fileheader, dataheader, payload)
%   This function is used to write holter data-files for the Stingray
%   project. The input-data is stored according to the format as 
%   specified in http://imecwww/svn/stingray/trunk/Documentation/C07_Design_and_implementation/C07S000_SYS_Architecture/SR-IM-PS-015A/Data storage format specification.docm
%   
%   INPUT
%   - filename: a string containing the filename
%   - fileheader: a struct with the following fields:
%       o SyncWord          = hex2dec('f3f3f3f3');
%       o FileHeaderVersion
%       o FileHeaderLength 
%       o DeviceDescription
%       o DeviceHWID       
%       o DeviceSWID       
%       o PrescriptionID   
%   - dataheader: a struct with the followng fields:
%       o SyncWord          = hex2dec('fdfdfdfd');
%       o DataType         
%       o DataHeaderLength 
%       o UTC        
%       o TimeOffset       
%       o FileLength       
%       o ECGfs            
%       o ECGnc             = 2;
%       o ECGnb             
%       o AXfs              
%       o AXnc              
%       o AXnb              
%       o AXsampax          
%       o BatLvlts          
%       o ElectrodeStatts   
%       o PaceListBytes     
%       o BytesPerSecond    
%   - payload: a struct with the following fields
%       o Status   
%       o ECG      
%       o AX       
%       o PaceList 

if nargin==0
    help write_data_file
    return
end

FileLength    = DataHeader.FileLength;
ECGnb         = DataHeader.ECGnb;
ECGfs         = DataHeader.ECGfs;
AXfs          = DataHeader.AXfs;
switch  DataHeader.PaceListBytes
    case 1
        PaceDataType = 'uint8';
    case 2
        PaceDataType = 'uint16';
    otherwise
        error('Wrong value for PaceListBytes');
end
    
% Store file-header
fid = fopen(FileName,'w');
fwrite(fid, FileHeader.SyncWord,'uint32');
fwrite(fid, FileHeader.FileHeaderVersion,'uint16');
fwrite(fid, FileHeader.FileHeaderLength,'uint16');
fwrite(fid, FileHeader.DeviceDescription,'uint8');
fwrite(fid, FileHeader.DeviceHWID,'uint32');
fwrite(fid, FileHeader.DeviceSWID.Build,'uint32');
fwrite(fid, FileHeader.DeviceSWID.Minor,'uint16');
fwrite(fid, FileHeader.DeviceSWID.Major,'uint16');
fwrite(fid, FileHeader.PrescriptionID,'uint8');

% Store data-header
fwrite(fid, DataHeader.SyncWord,'uint32');
fwrite(fid, DataHeader.DataType,'uint32');
fwrite(fid, DataHeader.DataHeaderLength,'uint16');
fwrite(fid, dec(DataHeader.UTC),'uint64');
fwrite(fid, DataHeader.TimeOffset,'int32');
fwrite(fid, DataHeader.FileLength,'uint32');
fwrite(fid, DataHeader.ECGfs,'uint16');
fwrite(fid, DataHeader.ECGnc,'uint8');
fwrite(fid, DataHeader.ECGnb,'uint8');
fwrite(fid, DataHeader.AXfs,'uint16');
fwrite(fid, DataHeader.AXnc,'uint8');
fwrite(fid, DataHeader.AXnb,'uint8');
fwrite(fid, DataHeader.AXsampax,'uint8');
fwrite(fid, DataHeader.BatLvlts,'uint16');
fwrite(fid, DataHeader.ElectrodeStatts,'uint16');
fwrite(fid, DataHeader.PaceListBytes,'uint8');
fwrite(fid, DataHeader.BytesPerSecond,'uint32');

% Store data
for k=1:FileLength
    StatusWord = [Payload.Status.BatteryLevel(k), ...
                  Payload.Status.PIEs(k), ...
                  Payload.Status.PaceListCount(k), ...
                  Payload.Status.ElectrodeStat(k,:)] * 2.^[0;7;8;11;12;13];
    fwrite(fid, StatusWord,'uint16');
    if ~isempty(Payload.ECG)
        Words212   = data_to_212format(Payload.ECG(:,(k-1)*ECGfs+1:k*ECGfs), ECGnb);
        fwrite(fid, Words212,'uint8');
    end
    if ~isempty(Payload.AX)
        fwrite(fid, Payload.AX(:,(k-1)*AXfs+1:k*AXfs),'int8');
    end
    fwrite(fid, Payload.PaceList(:,k), PaceDataType);    
end
FileSizeObt = ftell(fid);                                                   % Obtained file-size
fclose(fid);

% Expected file-size
FileSizeExp = FileHeader.FileHeaderLength + DataHeader.DataHeaderLength + FileLength*(2+3*DataHeader.ECGfs+DataHeader.AXnc*DataHeader.AXfs+5*DataHeader.PaceListBytes);

% Check file-size
assert(FileSizeObt==FileSizeExp, 'Exptected file-size = %dB, obtained file-size = %dB. They are not equal',FileSizeExp,FileSizeObt)

function y = data_to_212format(x, B)
x_unsigned = x;                                                             % Convert from signed to unsigned.
x_unsigned(x<0) = x(x<0) + 4096;

% Create 212-words depending on the number of bits
switch B
    case 12
        y = [mod(x_unsigned(1,:),256); ...
             floor(x_unsigned(1,:)/256) + 16*floor(x_unsigned(2,:)/256); ...
             mod(x_unsigned(2,:),256)];
        
    otherwise
        error('Not implemented yet');
end

% -------------------------------------------------------------------------
% -- Project   : Stingray
% -- Content   : This function stores a holter-data-file.
% -- Filename  : $HeadURL: http://imecwww/svn/stingray/trunk/Data/GlobalLib/MatlabLib/FileFormat/write_data_file.m $
% -- Date      : $Date: 2014-05-07 16:26:22 +0200 (Wed, 07 May 2014) $
% -- Version   : $Revision: 2304 $
% -- Commiter  : $Author: boerp $
% -------------------------------------------------------------------------
% --  CONFIDENTIAL and PROPRIETARY
% --  COPYRIGHT (c) Stichting IMEC Nederland, 2011
% --
% --  All rights are reserved. Reproduction in whole or in part is
% --  prohibited without the written consent of the copyright owner