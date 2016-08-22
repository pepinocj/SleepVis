function [ IBI_begin_end ] = divide_ibi( IBI,epoch_length,max ) %end index does not point to element which belongs in the interval

IBI_begin_end = zeros(max,2);
temp_pointer_IBI_intervals = 0;
temp_max = epoch_length;
old_i = 1;
sum_IBI = 0;
for i=1:length(IBI) %cut if last epoch not enough data
    sum_IBI = sum_IBI + IBI(i);
    if(sum_IBI>temp_max)
        temp_pointer_IBI_intervals = temp_pointer_IBI_intervals+ 1 ;
        IBI_begin_end(temp_pointer_IBI_intervals,:) = [old_i i]; 
        old_i = i;
        temp_max = temp_max + epoch_length;
    end
    
end

if temp_pointer_IBI_intervals == 0
    IBI_begin_end = 0;
else
    IBI_begin_end = IBI_begin_end(1:temp_pointer_IBI_intervals,:);
end





end

