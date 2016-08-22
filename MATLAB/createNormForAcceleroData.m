function [ V ] = createNormForAcceleroData( ACC )

[~,s_ACC] = size(ACC(1,:));
V = zeros(1,s_ACC);

for i = 1:s_ACC
    V(1,i) = norm(ACC(:,i));
end



end

