function [Result] = flatten_heart_data_struct(Heart_data)

Heart_data.FFT_VLF=Heart_data.FFT.VLF;
Heart_data.FFT_LF=Heart_data.FFT.LF;
Heart_data.FFT_HF=Heart_data.FFT.HF;
Heart_data.FFT_TotalPower=Heart_data.FFT.TotalPower;
Heart_data.FFT_LFHFratio=Heart_data.FFT.LFHFratio;
Heart_data.FFT_LFnu=Heart_data.FFT.LFnu;
Heart_data.FFT_HFnu=Heart_data.FFT.HFnu;

Result = rmfield(Heart_data,'FFT');
end
