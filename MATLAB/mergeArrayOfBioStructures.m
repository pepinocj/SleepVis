function [merge_result] = mergeArrayOfBioStructures(array_structures,fields)



merge_result(1) = array_structures(1);

for i=2:length(array_structures)
   temp_struct = array_structures(i);
   last_merge = merge_result(end);
   date_a = temp_struct.date;
   date_b = last_merge.date;

   if(date_a == date_b)
        for j = 1:length(fields)
            merge_result(end).(fields{j}) = [merge_result(end).(fields{j}); temp_struct(end).(fields{j})]; 
        end
        
   else
       merge_result(end+1) = temp_struct;
        
   end
   
    
end


end
