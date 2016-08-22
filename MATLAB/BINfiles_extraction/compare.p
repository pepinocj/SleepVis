function C = compare(A,B,tol)
% COMPARE(A,B,tol) compares A and B element-by-element
%
% A and B must be of the same type, and of one of the following types:
% struct, cell array, numeric or logical array, filter-objects or string.
% A and B may contain further elements of the types listed above (if they
% are cell arrays or structs).
% If A and B are structs, and/or contain structs, all structs the must have
% the the same fields.
% If A and B are arrays, and/or contain arrays, all arrays must be of the
% same size.
% Strings don't need to be of the same length.
% The return value C is of the same type as A and B, and contains the same
% elements as A and B, but C contains only logical values, in place of any
% numeric values and strings in A and B.
% If a number or string in A equals the number (resp. string) in B, C has a
% logical 1 in the same place as the number (resp. string). Otherwise C has
% a logical 0 in this place.
%
% HINT:
% use alltrue(compare(a,b)) to check if a and b are identical
%
% EXAMPLE 1:
% >> a = {'a',1,[1,1]};
% >> b = {'a',1,[1,2]};
% >> a == b
% ??? Undefined function or method 'eq' for input arguments of type 'cell'.
% >> compare(a,b)
% ans = 
%     [1]    [1]    [1x2 logical]
% >> ans{1,3}
% ans =
%      1     0
%
% EXAMPLE 2:
% >> a.f1 = 'foo';
% >> a.f2 = 'bar';
% >> b.f1 = 'foo';
% >> b.f2 = 'rab';
% >> compare(a,b)
% ans = 
%     f1: 1
%     f2: 0

if nargin==2
    tol = 0;
end

if strcmp(class(A),class(B));
   if isstruct(A)
       Afields = sort(fieldnames(A));
       Bfields = sort(fieldnames(B));
       if alltrue(compare(Afields,Bfields))
           for i=1:size(Afields,1)
               for k=1:length(A)
                   field = Afields{i};
                   C(k).(field) = compare(A(k).(field),B(k).(field),tol);   %#ok
               end
           end
       else
           frintf('%s.%s \t/\t %s.%s\n', inputname(1), field, inputname(1), field);
           error('Structs must have the same fields.');
       end
   elseif iscell(A)
       if size(A)==size(B)
           C = cellfun(@(a,b) compare(a,b),A,B,'UniformOutput',false);
       else
           error('Cell arrays must have the same size.');
       end
   elseif isnumeric(A) || islogical(A)
       if size(A)==size(B)
           C = abs(real(A)-real(B)) <= tol;         %compare real parts
           C = (abs(imag(A)-imag(B)) <= tol) & C;    %compare imaginary parts
       else
           error('Numeric and logical arrays must have the same size.');
       end
   elseif ischar(A)
       C = strcmp(sort(A),sort(B));
   elseif ~isempty(strfind(class(A), 'dfilt.'))                             % If it is a discrete-filter
       C = (A == B);
   elseif ~isempty(strfind(class(A), 'mfilt.'))                             % If it is a multirate-filter
       C = (A == B);
   elseif isa(A,'SR_time')
       C = A==B;
   else
       error('A and B are of an unknown type. Valid types are: struct, cell, numeric and logical arrays, filter-objects and strings.');
   end
else
    error('A and B must be of the same type.');
end

% -------------------------------------------------------------------------
% -- Project   : Stingray
% -- Content   : This function compares A and B element-by-element.
% -- Filename  : $HeadURL: http://imecwww/svn/stingray/trunk/Data/GlobalLib/MatlabLib/compare.m $
% -- Date      : $Date: 2013-09-15 23:00:54 +0200 (Sun, 15 Sep 2013) $
% -- Version   : $Revision: 722 $
% -- Commiter  : $Author: boerp $
% -------------------------------------------------------------------------
% --  CONFIDENTIAL and PROPRIETARY
% --  COPYRIGHT (c) Stichting IMEC Nederland, 2011
% --
% --  All rights are reserved. Reproduction in whole or in part is
% --  prohibited without the written consent of the copyright owner