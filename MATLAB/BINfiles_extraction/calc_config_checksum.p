% -------------------------------------------------------------------------
% -- Project   : Stingray
% -- Content   : This function calculated the checksum for the config-file.
% -- Filename  : $HeadURL: http://imecwww/svn/stingray/trunk/Data/GlobalLib/MatlabLib/calc_config_checksum.m $
% -- Date      : $Date: 2013-10-30 10:48:24 +0100 (Wed, 30 Oct 2013) $
% -- Version   : $Revision: 1027 $
% -- Commiter  : $Author: boerp $
% -------------------------------------------------------------------------
% --  CONFIDENTIAL and PROPRIETARY
% --  COPYRIGHT (c) Stichting IMEC Nederland, 2011
% --
% --  All rights are reserved. Reproduction in whole or in part is
% --  prohibited without the written consent of the copyright owner

function CS = calc_config_checksum(msg)
% CS = calc_config_checksum(msg)
% Input:
%   msg - a string
% Output:
%   CS - checksum

msg = uint32(msg(:));
CS  = sum(msg);