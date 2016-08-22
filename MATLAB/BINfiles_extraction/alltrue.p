function o = alltrue(A)
% ALLTRUE(A) detects if A contains only true values.
% A can be a combination of structs, cell arrays, numeric and logical
% arrays and strings. If A contains any 0 or '', ISTRUE(A) return 0,
% otherwise 1 is returned.
if isstruct(A)
    o = alltrue(struct2cell(A));
elseif iscell(A)
    o = alltrue(cellfun(@(a) alltrue(a),A));
elseif isnumeric(A) || islogical(A)
    if ~isscalar(A)
        o = alltrue(all(A));
    else
        o = all(A);
    end
elseif ischar(A)
	o = all(~strcmp(A,''));
else
    error('A is of an unknown type. Valid types are: struct, cell, numeric and logical arrays and strings.');
end

% -------------------------------------------------------------------------
% -- Project   : Stingray
% -- Content   : This function detects whether A contains only true values.
% -- Filename  : $HeadURL: http://imecwww/svn/stingray/trunk/Data/GlobalLib/MatlabLib/alltrue.m $
% -- Date      : $Date: 2013-08-20 12:32:21 +0200 (Tue, 20 Aug 2013) $
% -- Version   : $Revision: 590 $
% -- Commiter  : $Author: boerp $
% -------------------------------------------------------------------------
% --  CONFIDENTIAL and PROPRIETARY
% --  COPYRIGHT (c) Stichting IMEC Nederland, 2011
% --
% --  All rights are reserved. Reproduction in whole or in part is
% --  prohibited without the written consent of the copyright owner