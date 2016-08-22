function [ user_object ] = load_user( name,nr_files,epochs,path )
%UNTITLED3 Summary of this function goes here
%   Detailed explanation goes here

user_object = struct();

user_object.name = name;
user_object.extra_info = 'space for extra information';
%user_object.raw_data.ecg = get_ecg_user(name,nr_files);
%user_object.raw_data.acc = get_acc_user(name,nr_files);

if nr_files == 0
    concat_path = strcat(path,name,'\MAT\')
    nr_files = length(dir(concat_path)) - 2;
    
nr_files
    
user_object.raw_data.ecg = get_ecg_user(name,nr_files,path);
user_object.raw_data.acc = get_acc_user(name,nr_files,path);

%plus array of structures approach



for i=1:nr_files
    
user_object.data_obj(i).date = user_object.raw_data.ecg(i).date;
user_object.data_obj(i).date_string = user_object.raw_data.ecg(i).date_string;
user_object.data_obj(i).end_date = user_object.raw_data.ecg(i).end_date;
user_object.data_obj(i).end_date_string = user_object.raw_data.ecg(i).end_date_string;
user_object.data_obj(i).raw_data.ecg = [];
user_object.data_obj(i).raw_data.acc = [];

for j=1:length(epochs)
    user_object.data_obj(i).preprocessed(j).mov = analyse_acc_data(epochs(j),user_object.raw_data.acc(i).X,user_object.raw_data.acc(i).Y,user_object.raw_data.acc(i).Z,user_object.raw_data.acc(i).f);
    user_object.data_obj(i).preprocessed(j).heart = analyse_ecg_data(epochs(j),user_object.raw_data.ecg(i).ECG_1,user_object.raw_data.ecg(i).f);
    user_object.data_obj(i).preprocessed(j).epoch = epochs(j);
end

end

user_object.raw_data.ecg = 0;
user_object.raw_data.acc = 0;





end

