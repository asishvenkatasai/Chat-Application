console.log("Great");
var a=100;
let btnShow=document.querySelector('button');
btnShow.disabled=true;
function usernameValidation()
{
    var srcUsername=document.getElementById("txtUsername");
    var username=srcUsername.value;
    srcUsername.style.border="none";
    ReactSignin.innerHTML="";
    if(username=="") 
    {
    ReactSignin.innerHTML="Enter a valid username";
    srcUsername.style.border="2px solid red";
    btnShow.disabled=true;
    }
    else{
        btnShow.disabled=false;
    }
}
function passwordValidation()
{
    var srcPassword=document.getElementById("txtPassword");
    var password=srcPassword.value;
    console.log("ps");
    console.log(password);
    srcPassword.style.border="none";
    ReactPassword.innerHTML=""; 
    if(password=="")
    {
    srcPassword.style.border="2px solid red";
    ReactPassword.innerHTML="Enter a valid password";
    btnShow.disabled=true;
    }
    else
   {
    var spec=0;
    var num=0;
    var ucase=0;
    var lcase=0;
    var k1=0;var k2=0;var k3=0;var k4=0;
    for(var i=0;i<password.length;i++)
    {
      //  var n=0;
       var n= password.charCodeAt(i);
       console.log(password[i]);
       console.log(n);
       if(n>=97 && n<=122)
       {
        lcase++;
        k2++;
       }
       else if(n>=65 && n<=90)
       {
        ucase++;
        k1++;  
       }
       else if(n>=48 && n<=57)
       {
           num++;
           k3++;
       }
       else{
           spec++;
           k4++;
       }
    }
    // console.log(spec,num);
    if((k1==0)||(k2==0)||(k3==0)||(k4==0))
    {
        var y="Enter a ";
        ReactPassword.innerHTML=y;
    }
    var k=0;
    if(spec==0)
    {
        ReactPassword.innerHTML+="Special Character,";k=1;
    }
    if(num==0)
    {
        ReactPassword.innerHTML+="Number,";k=1;
    }
    if(ucase==0)
    {
        ReactPassword.innerHTML+="Upper Case Letter,";k=1
    }
    if(lcase==0)
    {
        ReactPassword.innerHTML+="Lower Case Letter,";k=1;
    }
    if((k1==0)||(k2==0)||(k3==0)||(k4==0))
    {
    var s1=ReactPassword.innerHTML;
    var s2=s1.substring(0,s1.length-1);
    ReactPassword.innerHTML=s2;
    srcPassword.style.border="2px solid red";
    btnShow.disabled=true;
    }
    else{
        btnShow.disabled=false;
    }
  }
}
