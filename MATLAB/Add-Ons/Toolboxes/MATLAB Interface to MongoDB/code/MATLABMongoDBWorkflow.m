%% MATLAB Interface to MongoDB Workflow
% This script shows how to connect to and execute query on a Mongo database from MATLAB.
% This script assumes it is connecting to a Mongo server version 3.0
% This script works on MATLAB R2013b and later.

% Copyright 2015 The MathWorks, Inc.

%% Mongo-JAVA Driver Installation
% Before running this script it is necessary to install one of 
% the following Mongo-JAVA driver version: 
%%
% * mongo-java-driver-3.0.0.jar
% * mongo-java-driver-3.0.0-rc0.jar
% * mongo-java-driver-3.0.0-rc1.jar
% * mongo-java-driver-3.0.0-beta1.jar
% * mongo-java-driver-3.0.0-beta2.jar
% * mongo-java-driver-3.0.0-beta3.jar
%%
%  Driver can be installed from following link: http://central.maven.org/maven2/org/mongodb/mongo-java-driver/

%% Add Mongo-JAVA driver to class path
javaaddpath
'<install_root>\mongo-java-driver-3.0.0-rc0.jar';

%% Connect to a Mongo Database
server = 'ServerName';
port = 27017;
database = 'DatabaseName';
username = 'DatabaseUser';
password = 'Password';

mongodbconn = mongodatabase(server, port, database, 'UserName', username, 'Password', password) %#ok<*NOPTS>
        
%% Execute FIND query on a Mongo Collection 'product'
query = '{"artist": "David Guetta"}';
documents = find(mongodbconn, 'product', 'Query', query, 'limit', 3)
 
%% Execute COUNT query on a Mongo Collection 'product'

query = '{"artist":"David Guetta"}';
result_size = count(mongodbconn, 'product', query)
     
%% Get meta-data information about the database

dbinfo = get(mongodbconn)
          
%% Get meta-data information about collection 'product'

collectinfo = collectioninfo(mongodbconn, 'product')
    
%% Check if a collection by the name 'inventory' exists in the database

col_exists = collectionexists(mongodbconn, 'inventory') %#ok<*NASGU>
     
%% Close database connection

close(mongodbconn);
mongodbconn
        
%% Verify if connection is closed

status = isopen(mongodbconn)
             