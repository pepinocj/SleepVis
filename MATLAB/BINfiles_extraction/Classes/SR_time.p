% -------------------------------------------------------------------------
% -- Project   : Stingray
% -- Content   : This defines the class SR_time, which is used as the 
%                Stingray-time representation.
% -- Filename  : $HeadURL: http://imecwww/svn/stingray/trunk/Data/GlobalLib/MatlabLib/Classes/SR_time.m $
% -- Date      : $Date: 2014-04-11 10:51:05 +0200 (Fri, 11 Apr 2014) $
% -- Version   : $Revision: 2072 $
% -- Commiter  : $Author: agell $
% -------------------------------------------------------------------------
% --  CONFIDENTIAL and PROPRIETARY
% --  COPYRIGHT (c) Stichting IMEC Nederland, 2011
% --
% --  All rights are reserved. Reproduction in whole or in part is
% --  prohibited without the written consent of the copyright owner

classdef SR_time
    properties
        year;
        day;
        hour;
        minute;
        second;
    end     % end properties
    
    methods
        function C = SR_time( year, varargin )
            if nargin == 0
                C.year   = 0;
                C.day    = 0;
                C.hour   = 0;
                C.minute = 0;
                C.second = 0;
            elseif nargin == 1
                if ischar(year)                                             % it is a hex-string or a BCD-string
                    warning('Not yet implemented');
                elseif isa(year,'uint64')
                    Century= floor(year/2^56);
                    rest   = year - Century*2^56;
                    Y      = floor(rest / 2^48);
                    rest   = rest - Y*2^48;
                    M      = floor(rest/2^40);                              % Must be between 0 .. 11
                    rest   = rest - M * 2^40;
                    d      = floor(rest/2^32);                              % Must be between 0 ... 30
                    rest   = rest - d * 2^32; 
                    h      = floor(rest/2^16);
                    rest   = rest - h * 2^16;
                    m      = floor(rest/2^8);
                    s      = rest - m * 2^8;
                    % Fill SR_time object
                    C         = SR_time();
                    C.year    = double(Century)*100+double(Y);
                    monthdays = MonthDays(C);
                    C.day     = sum(monthdays(1:M-1)) + double(d)-1;
                    C.hour    = double(h);
                    C.minute  = double(m);
                    C.second  = double(s);
                else
                    error('Class not supported')
                end
            elseif nargin == 5
                C.year   = year;
                if ~isleapyear(C)
                    if varargin{1}==365
                        error('Day 365 is only allowed in leap years. Day number must be between 0 and 364/365.');
                    end
                end
                C.day    = varargin{1};
                C.hour   = varargin{2};
                C.minute = varargin{3};
                C.second = varargin{4};
            elseif nargin==6
                C.year   = year;
                monthdays = MonthDays(C);
                C.day    = sum(monthdays(1:varargin{1}-1)) + varargin{2} - 1;
                C.hour   = varargin{3};
                C.minute = varargin{4};
                C.second = varargin{5};
            else
                error('The constructor of SR_time takes 0, 1, 5 or 6 argument, not %d',nargin);
            end
        end
        
        function obj = set.year(obj, year)
            if year<0 || year~=fix(year) || year>9999
                error('Year must be a positive integer below and including 9999');
            end
            obj.year = year;
        end
        
        function obj = set.day(obj, day)
            if day<0 || day~=fix(day) || day>365
                error('Date must be a positive integer between and including 0 and 365');
            end
            obj.day = day;
        end
        
        function obj = set.hour(obj, hour)
            if hour<0 || hour~=fix(hour) || hour>23
                error('Hour must be a positive integer below and including 23');
            end
            obj.hour = hour;
        end
        
        function obj = set.minute(obj, minute)
            if minute<0 || minute~=fix(minute) || minute>59
                error('Minute must be a positive integer below and including 59');
            end
            obj.minute = minute;
        end
        
        function obj = set.second(obj, second)
            if second<0 || second~=fix(second) || second>59
                error('Minute must be a positive integer below and including 59');
            end
            obj.second = second;
        end
        
        function disp(obj)
            [M,d] = day2date(obj);
            fprintf('%4d-%02d-%02d %2d:%02d:%02d\n',obj.year, M, d, obj.hour, obj.minute, obj.second);
        end
        
        function S = char(obj)
            [M,d] = day2date(obj);
            S = sprintf('%4d-%02d-%02d %02d:%02d:%02d',obj.year, M, d, obj.hour, obj.minute, obj.second);
        end
        
        function [M,d] = day2date(obj)
            monthdays = MonthDays(obj);
            M = find(obj.day < cumsum(monthdays),1,'first')-1;             % Find the correct month (between 0..11) ELENA CHANGE '=' sign
            DaysElapsedUntilMonth = sum(monthdays(1:M));
            d = obj.day - DaysElapsedUntilMonth + 1;
            M = M+1;                                                        % Just because the month is between 1..12
        end
        
        function y = hex(obj)
            [M,d] = day2date(obj);
            Century_hex = dec2hex(floor(obj.year/100),2);
            Year_hex    = dec2hex(obj.year - floor(obj.year/100)*100,2);
            Month_hex   = dec2hex(M,2);
            Date_hex    = dec2hex(d,2);
            Hour_hex    = dec2hex(obj.hour,2);
            Min_hex     = dec2hex(obj.minute,2);
            Sec_hex     = dec2hex(obj.second,2);
            y = ['0x',Century_hex, Year_hex, '.', ... 
                      Month_hex  , Date_hex, '.', ...
                      '00'       , Hour_hex, '.', ...
                      Min_hex    , Sec_hex];
        end
        
        function y = dec(obj)
            [M,d] = day2date(obj);
            % uint64 does not (yet) support inproduct
            y = uint64(floor(obj.year/100)) * uint64(2^56) + ...
                uint64(obj.year - floor(obj.year/100)*100) * uint64(2^48) + ...
                uint64(M) * uint64(2^40) + ...
                uint64(d) * uint64(2^32) + ...
                uint64(obj.hour) * uint64(2^16) + ...
                uint64(obj.minute) * uint64(2^8) + ...
                uint64(obj.second) * uint64(2^0);
        end
        
        function c = eq(a,b)
            c = all([a.year   == b.year, ...
             a.day    == b.day, ...
             a.hour   == b.hour, ...
             a.minute == b.minute, ...
             a.second == b.second]);
        end
        
        function c = ne(a,b)
            c = ~eq(a,b);
        end
        
        function C = plus(a,b)
            s = a.second + b.second;
            m = floor(double(s)/60) + a.minute + b.minute;
            s = mod(s,60);
            h = floor(double(m)/60) + a.hour + b.hour;
            m = mod(m,60);
            d = floor(double(h)/24) + a.day + b.day;
            h = mod(h,24);
            Y =  a.year + b.year;
            IsLeapYear = (mod(Y,4)==0 && mod(Y,100)~=0) || mod(Y,400)==0;
            IsNextLeapYear = (mod(Y+1,4)==0 && mod(Y+1,100)~=0) || mod(Y+1,400)==0;
            DaysThisYear = IsLeapYear * 366 + ~IsLeapYear*365;              % Select 365 or 366
            DaysNextYear = IsNextLeapYear * 366 + ~IsNextLeapYear*365;      % Select 365 or 366
            if d>=DaysThisYear && d<(DaysThisYear+DaysNextYear)             % 365/366 <= d < 731/730
                Y = Y + 1;
                d = d - DaysThisYear;
            elseif d>=(DaysThisYear+DaysNextYear)                           % d > 731/730
                Y = Y + 2;
                d = d - (DaysThisYear+DaysNextYear);
            end
            C = SR_time(Y,d,h,m,s);
        end
        
        function c = minus(a,b)
           warning('TBI'); 
        end
        
        function monthdays = MonthDays(C)
            if isleapyear(C)
                monthdays   = [31,29,31,30,31,30,31,31,30,31,30,31];        % Days per month in a leap year
            else
                monthdays   = [31,28,31,30,31,30,31,31,30,31,30,31];        % Days per month in a normal year
            end
        end
        
        function result = isleapyear(obj)
            result = (mod(obj.year,4)==0 && mod(obj.year,100)~=0) || mod(obj.year,400)==0;
        end 
    end     % end methods
end     % end classdef
