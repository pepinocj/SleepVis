% XPTOPEN read of several file formats and writing of the SAS Transport Format (*.xpt)
%   Supported are ARFF, SAS-XPT and STATA files.
%   XPTOPEN is a mex-file and must be compiled before use. 
%   More detailed help can be obtained by the command 
%     xptopen
%   without an additional argument
%
%     X = xptopen(filename)
%     X = xptopen(filename,'r')
%   read file with filename and return variables in struct X
%
%   X = xptopen(filename,'w',X)
%        save fields of struct X in filename.
% 
%   The fields of X must be column vectors of equal length.
%   Each vector is either a numeric vector or a cell array of strings.
%   The SAS-XPT format stores Date/Time as numeric value counting the number of days since 1960-01-01.
%
% References:
% [1]	TS-140 THE RECORD LAYOUT OF A DATA SET IN SAS TRANSPORT (XPORT) FORMAT
%	http://support.sas.com/techsup/technote/ts140.html
% [2] IBM floating point format
%	http://en.wikipedia.org/wiki/IBM_Floating_Point_Architecture
% [3] see http://old.nabble.com/Re%3A-IBM-integer-and-double-formats-p20428979.html
% [4] STATA File Format
%	http://www.stata.com/help.cgi?dta
%	http://www.stata.com/help.cgi?dta_113


%   This program is free software; you can redistribute it and/or modify
%   it under the terms of the GNU General Public License as published by
%   the Free Software Foundation; either version 3 of the License, or
%   (at your option) any later version.
%
%   This program is distributed in the hope that it will be useful,
%   but WITHOUT ANY WARRANTY; without even the implied warranty of
%   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
%   GNU General Public License for more details.
%
%   You should have received a copy of the GNU General Public License
%   along with this program; If not, see <http://www.gnu.org/licenses/>.


%   $Id: xptopen.m 12495 2014-01-12 19:50:10Z schloegl $
%   Copyright (C) 2010,2011,2012,2014 by Alois Schloegl <alois.schloegl@ist.ac.at>
%   This is part of the NaN-toolbox. For more details see
%   http://pub.ist.ac.at/~schloegl/matlab/NaN/


if exist('xptopen','file')~=3
	error('xptopen.mex is not compiled')
end;

