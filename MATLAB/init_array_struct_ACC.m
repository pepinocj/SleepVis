function [ temp_array] = init_array_struct_ACC(nr_files)
temp = createNewAccStruct(10000);
temp(nr_files) = temp;
temp_array = temp;

end