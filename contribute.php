<?php
include_once("./includes/header.php");
?>
<style>
    /*For the images to have correct size*/
    img {
        width: 500px !important;
        height: 300px !important;
    }
</style>
<h2>How to contribute to the main Github repository</h2>
<p>
I decided I better teach all of you how to contribute to the main repository. It is very simple, and very clean. The first thing you are going to want to do is go to <a href="http://github.com/GoEverywhere/Go-Everywhere.git[/url]" target="_blank">http://github.com/GoEverywhere/Go-Everywhere.git</a>. Then, find and click the "Fork" button:
<br /><img src="http://imageshack.us/a/img836/5218/1e3w.png" style="height: 200px;" />
<br />Just add it to your personal account, and wait for it to finish. Once it is done forking, make sure that you are indeed viewing your version of Go-Everywhere.git:
<br /><img src="http://imageshack.us/a/img593/8266/o5rm.png" style="height: 100px;"/>
<br />Find the HTTPS Clone URL and copy it:
<br /><img src="http://imageshack.us/a/img707/2618/gic7.png" style="height: 200px;"/>
<br />Now, if you are running Mac, install <a href="http://www.macports.org/" target="_blank">MacPorts</a>, open terminal, and run "sudo port install git".
<br />If you are running Linux (or Ubuntu, if you didn't know that was Linux :/ ), open terminal and run "sudo apt-get install git".
<br />If you are running Windows, install <a href="http://msysgit.github.io/" target="_blank">msysgit</a>. Depending on how you installed it, either run Command Prompt or Git-Bash from the start menu. From now on, throughout this tutorial, I am going to reference Command Prompt/Git-Bash as Terminal, but the commands are almost the same.
<br />This all ensures you have Git. You can probably also use Git for Windows and Git for Mac, but I am not going to go through doing it through there.
<br />
<br />Open your Terminal, and browse to a folder that you want to put your local copy of the fork. Then, run "git clone %YourHttpsUrlHere%", replacing %YourHttpsUrlHere% with your HTTPS URL that you copied over earlier:
<br /><img src="http://imageshack.us/a/img585/2050/jc9.png" style="height: 100px;"/>
<br />This will download the folder to your computer, containing all the files you need to edit. After that, browse inside the Go-Everywhere folder:
<br /><img src="http://imageshack.us/a/img19/2628/h88m.png" style="height: 100px;" />
<br />Keep the terminal open, for later use. Now, just edit/add whatever files you want to the Go-Everywhere folder:
<br /><img src="http://imageshack.us/a/img607/6945/l194.png" />
<br />After you edit/add your files, make sure you keep track of which files you changed/added. Open the terminal we had earlier, and add each file you changed/added to the commit by running "git add %filenamehere%", replacing %filenamehere% with the file you changed. OR, if you prefer, just run "git add *" in the Go-Everywhere folder. This will add all the files. (HOWEVER, if you are using gedit, do NOT use this command!! gedit saves other files, such as ~index.php, to whatever files you changed. We will not accept your pull request if you have these files!!)
<br /><b><u>EDIT:</u></b> As pointed out by blob8108, you can use "git add -u" to add only files updated. You can run the two together, just run "git add -u" to add the files you updated, and then "git add %filenamehere%" to only the files you updated:
<br /><img src="http://imageshack.us/a/img801/3408/vjx7.png" style="height: 100px;" />
<br />After adding all your files to the commit (you can have multiple commits, also), add a commit message. This let's everybody know, in a general idea, what you did. Do it by running 'git commit -m "%yourmessagehere%"', and again, change the %yourmessagehere% accordingly:
<br /><img src="http://imageshack.us/a/img543/7835/phr.png" style="height: 100px;" />
<br />Now, push your commits back to your fork. Do this by running 'git push %YourHttpsUrlHere%', and I assume you get the idea to replace %YourHttpsUrlHere% with your HTTPS Clone URL from <u>your</u> fork :D :
<br /><img src="http://imageshack.us/a/img542/1870/4ck.png" style="height: 100px;" />
<br />It will ask for your username and password (or just your password, if you configured the global GIT configurations), then upload your local fork repository to your fork on Github. You can go to your Github fork and take a look to make sure it went:
<br /><img src="http://imageshack.us/a/img197/9332/rj2p.png" />
<br />On your fork repository on Github, find and click the "Pull Request" button:
<br /><img src="http://imageshack.us/a/img18/1989/6b3x.png" />
<br />This will take you to a page looking like this:
<br /><img src="http://imageshack.us/a/img829/1120/78dh.png" />
<br />On this page, find the "Edit" button. We need to edit this so that we can merge your fork into our experimental branch. After clicking "Edit", find the base and change it to, "Experimental":
<br /><img src="http://imageshack.us/a/img10/5844/n0l1.png" />
<br />When the page refreshes, make sure it now looks like this:
<br /><img src="http://imageshack.us/a/img547/9141/xxes.png" />
<br />Then, click the "Click to create a pull request for this comparison" button. In this next screen, you can fill out the comment section, but it is optional. After you add your comments, Click the "Send pull request" button:
<br /><img src="http://imageshack.us/a/img707/3795/4kf1.png" />
<br />You will then be taken to the GoEverywhere/Go-Everywhere.git page, and it will show your pull request:
<br /><img src="http://imageshack.us/a/img844/2964/5hy7.png" />
<br />Then, just wait! You can continue to add more commits to your pull request, or wait until we merge your pull request into our experimental branch.
<br />
<br /><b>Thank you for contributing :D</b>
</p>
<?php
include_once("./includes/footer.php");
?>