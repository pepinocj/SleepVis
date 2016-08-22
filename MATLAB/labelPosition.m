function [ V ] = labelPosition( ACC )
%1 rug
%2 links
%3 buik
%4 rechts


[d,s_ACC] = size(ACC(1,:));
V = zeros(1,s_ACC);

for i = 1:s_ACC
    
    
    a = ACC(:,i);
    b = abs(a);
    c= 0;
    if b(1) > b(3)
        if(a(1) < 0)
            c=2;
        else
            c=4;
        end
        
    else
        if(a(3) < 0)
            c=1;
        else
            c=3;
        end
    end
    
    V(1,i) =c;
   
    
end
    

end

