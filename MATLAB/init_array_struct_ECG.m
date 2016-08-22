function [ temp_array] = init_array_struct_ECG(nr_files)
temp = createNewEccStruct(10000);
temp(nr_files) = temp;
temp_array = temp;

end

