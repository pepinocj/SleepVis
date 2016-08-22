function [ V ] = getRad( ACC )
%1 rug
%2 links
%3 buik
%4 rechts


[d,s_ACC] = size(ACC(1,:));
V = zeros(1,s_ACC);

for i = 1:s_ACC
    
    
    a = [ACC(1,i);ACC(3,i)];
    vec = a/(norm(a));
    
    [t,r] = cart2pol(vec(1),vec(2));
    

    
    
    V(1,i) =t;
   
    
end
    

end

