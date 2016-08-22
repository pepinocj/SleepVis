function [ V ] = getRad( X,Z )
%1 rug
%2 links
%3 buik
%4 rechts


[s_ACC,~] = size(X);
V = zeros(1,s_ACC);

for i = 1:s_ACC
    
    
    a = [X(i);Z(i)];
    vec = a/(norm(a));   
    [t,~] = cart2pol(vec(1),vec(2));
    V(1,i) =t;
   
    
end
    

end