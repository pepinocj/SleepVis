function structure_var= addEndDate( structure_var,added_sec )
%UNTITLED2 Summary of this function goes here
%   Detailed explanation goes here
structure_var.length_in_sec = added_sec;
temp_date = structure_var.date;
temp_end_date = temp_date + added_sec/(24*60*60);
structure_var.end_date = temp_end_date;
structure_var.end_date_string = datestr(temp_end_date);
 
end

