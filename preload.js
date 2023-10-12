const serialport=require("serialport").SerialPort;
var serial;
var settings=[1,90,10,[255,198,0],255,15,1000];
var changed=false;

async function find(){
var ports=await serialport.list();
var device=ports.find(port=>port.vendorId=="0D28");
if(device){
connect(device.path);
}else{
setTimeout(find,1000);
}
}
async function connect(path){
serial=new serialport({path:path,baudRate:115200,autoOpen:false});
serial.on("open",function(data){
serial.write(`${settings.join(":")}\n`);
});
serial.on("data",function(data){serial.write(`${settings.join(":")}\n`);});
serial.on("close",function(data){serial=undefined;setTimeout(find,1000);});
serial.open((e)=>{if(e){}});
}

function checkUpdates(){
if(changed){
if(serial)serial.write(`${settings.join(":")}\n`);
changed=false;
}
setTimeout(checkUpdates,100);
}
window.addEventListener("DOMContentLoaded",()=>{
var rainbow_speed=document.querySelector(`#rainbow input[name="speed"]`);
var rainbow_speed_indicator=document.querySelector(`#rainbow number[name="speed"]`);
var rainbow_backwards=document.querySelector(`#rainbow input[name="backwards"]`);
var rainbow_range=document.querySelector(`#rainbow input[name="range"]`);
var rainbow_range_indicator=document.querySelector(`#rainbow number[name="range"]`);
var static_color=document.querySelector(`#static input[name="color"]`);
var static_fade_color=document.querySelector(`#static_fade input[name="color"]`);
var static_brightness=document.querySelector(`#static input[name="brightness"]`);
var static_brightness_indicator=document.querySelector(`#static number[name="brightness"]`);
var static_fade_speed=document.querySelector(`#static_fade input[name="speed"]`);
var static_fade_speed_indicator=document.querySelector(`#static_fade number[name="speed"]`);
var static_fade_hold=document.querySelector(`#static_fade input[name="hold"]`);
var static_fade_hold_indicator=document.querySelector(`#static_fade number[name="hold"]`);
rainbow_speed.addEventListener("input",e=>{
changed=true;
rainbow_speed_indicator.innerText=rainbow_speed.value;
settings[2]=rainbow_speed.value;
});
rainbow_backwards.addEventListener("input",e=>{
changed=true;
rainbow_backwards.checked?settings[0]=0:settings[0]=1;
});
rainbow_range.addEventListener("input",e=>{
changed=true;
rainbow_range_indicator.innerText=rainbow_range.value;
settings[1]=rainbow_range.value;
});
static_color.addEventListener("input",e=>{
changed=true;
settings[3]=[parseInt(static_color.value.substring(1,3),16),parseInt(static_color.value.substring(3,5),16),parseInt(static_color.value.substring(5,7),16)]
static_fade_color.value=static_color.value;
});
static_fade_color.addEventListener("input",e=>{
changed=true;
settings[3]=[parseInt(static_fade_color.value.substring(1,3),16),parseInt(static_fade_color.value.substring(3,5),16),parseInt(static_fade_color.value.substring(5,7),16)]
static_color.value=static_fade_color.value;
});
static_brightness.addEventListener("input",e=>{
changed=true;
static_brightness_indicator.innerText=static_brightness.value;
settings[4]=static_brightness.value;
});
static_fade_speed.addEventListener("input",e=>{
changed=true;
static_fade_speed_indicator.innerText=static_fade_speed.value;
settings[5]=static_fade_speed.value;
});
static_fade_hold.addEventListener("input",e=>{
changed=true;
static_fade_hold_indicator.innerText=static_fade_hold.value;
settings[6]=static_fade_hold.value;
});
document.querySelectorAll(".mode").forEach(button=>{
button.addEventListener("click",e=>{
document.querySelector(`.mode.selected`).classList.remove("selected");
document.querySelector(`[name="${e.target.name}"]`).classList.add("selected");
document.querySelector(`.page.selected`).classList.remove("selected");
document.querySelector(`#${e.target.name}`).classList.add("selected");
if(e.target.name=="rainbow"){
rainbow_backwards.checked?settings[0]=0:settings[0]=1;
}else if(e.target.name=="static"){
settings[0]=2;
}else if(e.target.name=="static_fade"){
settings[0]=3;
}
changed=true;
});
});
checkUpdates();
find();
});
