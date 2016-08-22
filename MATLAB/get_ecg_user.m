function [ array_ecc_struct ] = get_ecg_user( name,nr_files,path)
%UNTITLED2 Summary of this function goes here
%   Detailed explanation goes here
temp_array = init_array_struct_ECG(nr_files);

for i= 1:nr_files
    zero_s = '0';
    if i<10
        zero_s = '00';
    end
    
    load(strcat(path,name,'\MAT\DATA',zero_s,num2str(i),'.mat'));
    Start_date_num = Start_date_num +2/24;
    temp_struct = createNewEccStruct(Start_date_num);
    temp_struct.ECG_1 = ECG(1,:)' ;
    temp_struct.ECG_2 = ECG(2,:)' ;
    temp_struct= addEndDate(temp_struct,length(ECG(1,:)')/temp_struct.f);
    temp_array(i)=temp_struct;
end
%array_ecc_struct = mergeArrayOfBioStructures(temp_array,['ECG_1';'ECG_2']);
array_ecc_struct = temp_array;
end

