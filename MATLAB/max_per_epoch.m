function [ output_args ] = max_per_epoch( data,sec,sample_rate )
data = data';
[data_size,d] = size(data)
result_size = round(data_size/(sample_rate*sec))
output_args = zeros(1,result_size);
max_in_interval = -1;
for i = 0:(result_size-1)
    a =i*sample_rate*sec + 1;
    b =(i+1)*sample_rate*sec;
    if(b<data_size)
        max_in_interval = max(abs(data(a: b,1)));
        output_args(i+1)=max_in_interval;
    end
    
    
end 
    

end

