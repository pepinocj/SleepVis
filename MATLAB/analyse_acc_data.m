function [ actigraphy_data ] = analyse_acc_data( epoch_length,X,Y,Z,frequency )


[data_size,~] = size(X);
epoch_size = samples_per_epoch(epoch_length,frequency);
result_size = max(1,round(data_size/epoch_size));
%define structure
actigraphy_data = struct();
actigraphy_data.mean_position = zeros(1,result_size);
actigraphy_data.std_position = zeros(1,result_size);
actigraphy_data.rms_position = zeros(1,result_size);

actigraphy_data.mean_x= zeros(1,result_size);
actigraphy_data.mean_y= zeros(1,result_size);
actigraphy_data.mean_z= zeros(1,result_size);

actigraphy_data.mean_x_norm= zeros(1,result_size);
actigraphy_data.mean_y_norm= zeros(1,result_size);
actigraphy_data.mean_z_norm= zeros(1,result_size);


actigraphy_data.movement = zeros(1,result_size);
actigraphy_data.movement_std=zeros(1,result_size);
actigraphy_data.movement_RMS = zeros(1,result_size);

actigraphy_data.movement_count_sum = zeros(1,result_size);
actigraphy_data.movement_count_mean = zeros(1,result_size);

result_size = round(data_size/epoch_size);

%preprocess positions in rad
rad_positions = getRadXZ(X,Z);


X = X*4/250;
Y = Y*4/250;
Z = Z*4/250;
%as vectors
Q = [X';Y';Z'];
normVectors = createNormForAcceleroData(Q)';

x_norm=X./normVectors;
y_norm=Y./normVectors;
z_norm=Z./normVectors;

if result_size ~= 0
% OAKLEY USING RMS
X_s = X.^2;
Y_s = Y.^2;
Z_s = Z.^2;
Q_s = X_s + Y_s + Z_s;
O_results = oakley_adapted(sqrt(Q_s));
O_results = O_results.data;

[O_size,~] = size(O_results);

O_length_epoch = floor(O_size/result_size);

end



for i = 0:(result_size-1)
    a =i*frequency*epoch_length + 1;
    b =(i+1)*frequency*epoch_length;
    %positions
    tmp_rp = rad_positions(a:min(b,length(rad_positions)));
    actigraphy_data.mean_position(1,i+1) = mean(tmp_rp);
    actigraphy_data.std_position(1,i+1) = std(tmp_rp);
    %x,y,z
    tmp_x = X(a:min(b,length(X)));
    tmp_y = Y(a:min(b,length(Y)));
    tmp_z = Z(a:min(b,length(Z)));
    
    actigraphy_data.mean_x(1,i+1)= mean(tmp_x);
actigraphy_data.mean_y(1,i+1)= mean(tmp_y);
actigraphy_data.mean_z(1,i+1)= mean(tmp_z);



    tmp_x_norm =  x_norm(a:min(b,length(x_norm)));
    tmp_y_norm = y_norm(a:min(b,length(y_norm)));
    tmp_z_norm = z_norm(a:min(b,length(z_norm)));

actigraphy_data.mean_x_norm(1,i+1)= mean(tmp_x_norm);
actigraphy_data.mean_y_norm(1,i+1)= mean(tmp_y_norm);
actigraphy_data.mean_z_norm(1,i+1)= mean(tmp_z_norm);


tmp_mov = normVectors(a:min(b,length(normVectors)));
actigraphy_data.movement(1,i+1) = mean(tmp_mov);
actigraphy_data.movement_std(1,i+1)=std(tmp_mov);
actigraphy_data.movement_RMS(1,i+1) = rms(diff(tmp_mov));

%oakly

  
c = i*O_length_epoch + 1;
d = (i+1)*O_length_epoch;


oakly_mov = O_results(c:min(d,length(O_results)));
actigraphy_data.movement_count_sum(1,i+1) = sum(oakly_mov);
actigraphy_data.movement_count_mean(1,i+1) = mean(oakly_mov);
       
    
end 


end