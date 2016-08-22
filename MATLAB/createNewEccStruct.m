function [ecc_struct] = createNewEccStruct(date)


ecc_struct = struct();
ecc_struct.ECG_1= [];
ecc_struct.ECG_2=[];
ecc_struct.date = date;
ecc_struct.date_string = convertToDateString(date);
ecc_struct.end_date = 0;
ecc_struct.end_date_string ='';
ecc_struct.length_in_sec = 0;
ecc_struct.f = 256;

end