function [ V ] = mapXZtoColor( ACC )
%1 rug
%2 links
%3 buik
%4 rechts


[d,s_ACC] = size(ACC(1,:));
V = zeros(3,s_ACC);

for i = 1:s_ACC
    
    
    a = [ACC(1,i);ACC(3,i)];
    vec = a/(norm(a));
    
    vecR =  [1;(1/3)^0.5];
    vecR = vecR/norm(vecR);
    vecG = [-1;(1/3)^0.5]  ;
    vecG = vecG/norm(vecG);
    vecB = [0;-1]        ; 
    vecB = vecB/norm(vecB);
   
    r   = max(3^0.5-norm(vec-vecR),0)/3^0.5;
    g   = max(3^0.5-norm(vec-vecG),0)/3^0.5;
    b   = max(3^0.5-norm(vec-vecB),0)/3^0.5;
    
    
    color = [r;g;b]; 
    color = color/norm(color);
    V(:,i) =color;
   
    
end
    

end

