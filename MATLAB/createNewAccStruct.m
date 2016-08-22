function [acc_struct] = createNewAccStruct(date)


acc_struct = struct();
acc_struct.X = [];
acc_struct.Y = [];
acc_struct.Z = [];
acc_struct.date = date;
acc_struct.date_string = convertToDateString(date);
acc_struct.end_date = 0;
acc_struct.end_date_string ='';
acc_struct.length_in_sec = 0;
acc_struct.f = 32;

end
