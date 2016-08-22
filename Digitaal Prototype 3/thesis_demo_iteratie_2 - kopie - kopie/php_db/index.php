<!DOCTYPE html>
<html>
<head>
    <title>OCL-Visualisatie</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Fonts: <link href='http://fonts.googleapis.com/css?family=Roboto:100,300,400,700' rel='stylesheet' type='text/css'>  -->
    <!-- Stylesheets   -->

    <link rel="stylesheet" href="css/main.css">


</head>
<body>




<!--http://html5up.net/spectral & http://cssmenumaker.com/menu/slabbed-accordion-menu#-->



<h1>OCL-Visualisation</h1>
<div id='main_menu'>
    <h2>Query</h2>


<!--    <span>Tables</span>
    <input type="text"><br>



    <span>Charts</span>
    <input type="text"> <br>


    <button>Generate Charts!</button>-->
    
    <form action="visualisation.php" method="get" target="_blank">
        <label>Tables (one atm):</label> <input type="text" name="tables" class="rounded"><br>
<label>Columns (performance) <br> (ALL == complete table):  </label><input type="text" name="columns" class="rounded"><br>
<label>Charts: </label><input type="text" name="charts" class="rounded"><br>
<label>Line: </label><input type="text" name="line" class="rounded"><br>
<label>Track: </label><input type="text" name="track" class="rounded"><br>

<input type="submit">
</form>


</div>


<div id='howto'>
    <h2>How To</h2>
    This application opens new windows to visualize requested data. These could be blocked by a pop-up blocker: deactivate it for this application to fully enjoy all functionality.
    Start by: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed varius massa non dolor placerat, non dapibus ante dictum.<br>
    For more information:<br>
   <h3><a href="manual.html">Manual</a></h3>

</div>


<div id='about'>
    <h2>About</h2>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed varius massa non dolor placerat, non dapibus ante dictum. In viverra nisi vel tristique dignissim. Nunc a turpis vulputate, lobortis tortor vitae, convallis nunc. Nam vitae augue eros. Pellentesque ante tellus, faucibus ut enim a, gravida commodo dolor. Etiam commodo nisi dolor, et varius eros tincidunt quis. In ut felis eu erat tincidunt laoreet. Mauris a purus id sapien blandit cursus hendrerit eget eros. Sed feugiat sapien eget dui blandit, condimentum luctus nibh hendrerit. Mauris vitae risus nec odio elementum varius.
</div>


<div id='prototype'>
    <h2>Prototype</h2>
    For demo usages with dummy.json: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed varius massa non dolor placerat, non dapibus ante dictum.<br>

    <h3><a href="visualisation.php">Prototype</a></h3>

</div>


<div id='logboek'>
    <h2>Development log</h2>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed varius massa non dolor placerat, non dapibus ante dictum.<br>

    <h3><a href="logboek.html">Log</a></h3>

</div>



</body>
</html>
