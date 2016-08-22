root='C:\Users\smets83\Documents\Experimenten\Experiment 3\Stingray\StingrayData_processed';
folders=dir(root);

for i=3%:length(folders)
    %% Open stingray data (from hdf5 files)
    fileinfo = hdf5info([root '\' folders(i).name]);
    % Days
    H5.open()
    fid = H5F.open([root '\' folders(i).name]); 
    gid = H5G.open(fid,'/Stingray/dayindexmap');
    dset_id = H5D.open(gid,'/Stingray/dayindexmap/values');
    day_ind = H5D.read(dset_id);
    for day=1 %day_ind(1):day_ind(end);
        % Acceleration data
        gid = H5G.open(fid,['/Stingray/Day' num2str(day) '/ACC']);
        dset_id = H5D.open(gid,['/Stingray/Day' num2str(day) '/ACC/block0_values']);
        ACC = H5D.read(dset_id);
        % ECG data
        gid = H5G.open(fid,['/Stingray/Day' num2str(day) '/ECG']);
        dset_id = H5D.open(gid,['/Stingray/Day' num2str(day) '/ECG/block0_values']);
        ECG = H5D.read(dset_id);
        % Confidence
        gid = H5G.open(fid,['/Stingray/Confidence/Day' num2str(day)]);
        dset_id = H5D.open(gid,['/Stingray/Confidence/Day' num2str(day) '/block0_values']);
        Confidence = H5D.read(dset_id);
        % Time
        gid = H5G.open(fid,['/Stingray/Day' num2str(day) '/ECG']);
        dset_id = H5D.open(gid,['/Stingray/Day' num2str(day) '/ECG/axis1']);
        Time = H5D.read(dset_id);
        date = datenum((Time(1,1)+2*3600)/86400 + datenum(1970,1,1));
%         
    
    
    
    end
    H5D.close(dset_id);
    H5G.close(gid);
    H5F.close(fid);
    H5.close()
    
    % Calculate HR
    addpath('C:\Users\smets83\Documents\MATLAB\Experiment 1\Parameter calculation');
    
    qrs = QRSDet(double(ECG(1,:)),256,50,17,0.5);
    HR=60./diff(qrs);
    
    qrs(1)=[];  % HR and qrs of equal lengths
    HR_conf=HR;
    qrs_conf=qrs;
    
    for k=1:length(Confidence)
        if Confidence(k)==1;
            qrs_ind=find(qrs>(k*10-10) & qrs<=(k*10));
            HR_conf(qrs_ind)=NaN;
            qrs_conf(qrs_ind)=NaN;
        end
    end
    
    figure;
    hold on
    xlim([0 qrs(end)./3600])
    ylim([0 200])
    plot(qrs./3600,HR)
    plot(qrs_conf./3600, HR_conf,'r')
    xlabel('Time (h)')
    ylabel('HR (bpm)')
end

