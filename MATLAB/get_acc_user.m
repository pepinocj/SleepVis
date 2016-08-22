function [ array_acc_struct ] = get_acc_user(name,nr_files,path)

temp_array = init_array_struct_ACC(nr_files);
for i= 1:nr_files
    zero_s = '0';
    if i<10
        zero_s = '00';
    end
    
    load(strcat(path,name,'\MAT\DATA',zero_s,num2str(i),'.mat'));
    datestr(Start_date_num)
    Start_date_num = Start_date_num +2/24;
    datestr(Start_date_num)
    temp_struct = createNewAccStruct(Start_date_num);
    temp_struct.X = ACC(1,:)' ;
    temp_struct.Y = ACC(2,:)' ;
    temp_struct.Z = ACC(3,:)' ;
    temp_struct= addEndDate(temp_struct,length(ACC(1,:)')/temp_struct.f);
    temp_array(i)=temp_struct;
    
end

%array_acc_struct = mergeArrayOfBioStructures(temp_array,['X';'Y';'Z' ]);
array_acc_struct = temp_array;
end
