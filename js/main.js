
/*
Beschreibung
*/


/*
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Harald Hentschel; https://twitter.com/Mr_DblH
Lizenz CC BYNC: https://creativecommons.org/licenses/by-nc/4.0/
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 */

var data;
var data_to_show = [] // [["name", "Vorname", "note"...], [], ...]
var data_to_show_dezi = [] // dezimalzahlen
var data_to_show_plusminus = [] // 1,25 <=> 1-     2,75 <=> +3      2,50 <=> 2-3
var display_data;
var type_of_grades = 1; // 0=dezi, 1=+-
var is_plusminus_checked = true;
var is_file_dropped = false;
var seconds = 5;
var percent = 0;

var display_index = 0;
var display_interval;
var display_interval_progress;
var is_display_running = false;
var is_finished = false;

// - - - - getElements - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
let title_desc = document.getElementById('title_desc');
let title_div = document.getElementById('title_div');

let dropzone = document.getElementById('dropzone');
let dropzone_desc = document.getElementById('dropzone_desc');

let file = document.getElementById('dropzone_csvfile');
let datazone_div = document.getElementById('datazone_div');
let datazone = document.getElementById('datazone');
let btn_start = document.getElementById('btn_start');
let btn_start_display = document.getElementById('btn_start_display');


let controls = document.getElementById('controls');
let checkbox_plusminus = document.getElementById('checkbox_plusminus');
let input_seconds = document.getElementById('input_seconds');

let display_name = document.getElementById('display_name');
let display_name_div = document.getElementById('display_name_div');
let display_grade = document.getElementById('display_grade');
let display_grade_div = document.getElementById('display_grade_div');
let display_control_box = document.getElementById('display_control_box');

let display_progress = document.getElementById('progress');





// - - - - setUps - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
datazone.classList.add('hide');
controls.classList.add('conceal');
title_desc.classList.add('conceal');

display_name_div.classList.add('hide');
display_grade_div.classList.add('hide');
display_control_box.classList.add('hide');

set_seconds_in_input_field(seconds);

// - - - - eventListeners - - - - - - - - - - - - - - - - - - - - - - - - - - -
update_title_description(is_plusminus_checked, seconds)

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropzone.addEventListener(eventName, preventDefaults, false)
})

;['dragenter', 'dragover'].forEach(eventName => {
  dropzone.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  dropzone.addEventListener(eventName, unhighlight, false)
})

file.addEventListener('change', upload, false);
dropzone.addEventListener('dragover', handleDragOver, false);
dropzone.addEventListener('drop', handleFileSelect, false);

checkbox_plusminus.addEventListener('change', function() {
  if (this.checked) {
    is_plusminus_checked = true;
    type_of_grades = 1;
    if (is_file_dropped){
      generate_table_preview(data_to_show_plusminus);
    }
  } else {
    is_plusminus_checked = false;
    type_of_grades = 0;
    if (is_file_dropped){
      generate_table_preview(data_to_show_dezi);
    }
  }
  update_title_description(is_plusminus_checked, seconds)
});

input_seconds.addEventListener('change', function(){
  seconds = get_seconds();
  update_title_description(is_plusminus_checked, seconds);
});

btn_start.addEventListener('click', function(){
  start_interval();
  is_display_running = true;
});


// Leertaste / Pfeil links
document.addEventListener('keyup', event => {
  if (event.code === 'Space') {
    // console.log('Space pressed')
    if (is_file_dropped){
      if (is_display_running){
        stop_interval();
        is_display_running = false;
      } else {
        start_interval();
        is_display_running = true;
      }
    }
  }
  if (event.code === 'ArrowLeft' || event.code === 'ArrowDown'){
    // console.log('ArrowLeft|Down pressed')
    if (is_file_dropped){
      display_index = display_index-2;
      if (display_index<0){
        display_index = 0;
      }
      display_grades(display_data);
    }
  }
  if (event.code === 'ArrowRight' || event.code === 'ArrowUp'){
    // console.log('ArrowRight|Up pressed')
    if (is_file_dropped){
      display_grades(display_data);
    }
  }
})



// - - - - functions - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// - - - - dropzone - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

function highlight(e) {
  dropzone.classList.add('highlight')
}

function unhighlight(e) {
  dropzone.classList.remove('highlight')
}

function upload(evt) {
  data = null;
  data_to_show = [];
  var file = evt.target.files[0];
  var reader = new FileReader();
  reader.readAsText(file);

  reader.onload = function(event) {
    var csvData = event.target.result;
    data = Papa.parse(csvData, {header:true, dynamicTyping: false});

    change_dropzone_desc(file.name);
    data_to_show = generate_data_array(data);

    data_to_show_dezi = JSON.parse(JSON.stringify(data_to_show)); // deepclone https://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript
    console.log("O - data_to_show_dezi", data_to_show_dezi);

    data_to_show_plusminus = generate_data_to_show_plusminus(data_to_show_dezi);
    console.log("O - data_to_show_plusminus", data_to_show_plusminus)

    is_file_dropped = true;

    if (type_of_grades==0){
      generate_table_preview(data_to_show_dezi);
    } else {
      generate_table_preview(data_to_show_plusminus);
    }
  };

  reader.onerror = function() {
    alert('Unable to read ' + file.name);
  };
}

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  data = null;
  data_to_show = [];
  var files = evt.dataTransfer.files;
  var file = files[0]
  var reader = new FileReader();
  reader.readAsText(file);

  reader.onload = function(event) {
    var csvData = event.target.result;
    data = Papa.parse(csvData, {header:true, dynamicTyping: false});

    change_dropzone_desc(file.name);
    data_to_show = generate_data_array(data);

    data_to_show_dezi = JSON.parse(JSON.stringify(data_to_show)); // deepclone https://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript
    console.log("O - data_to_show_dezi", data_to_show_dezi);

    data_to_show_plusminus = generate_data_to_show_plusminus(data_to_show_dezi);
    console.log("O - data_to_show_plusminus", data_to_show_plusminus)

    is_file_dropped = true;

    if (type_of_grades==0){
      generate_table_preview(data_to_show_dezi);
    } else {
      generate_table_preview(data_to_show_plusminus);
    }
  };

  reader.onerror = function() {
    alert('Unable to read ' + file.name);
  };
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy';
}

function change_dropzone_desc(file_name){
  dropzone_desc.innerHTML = file_name;
}

// fill data_to_show: [ name, vorname, [note1, note2...] ]
function generate_data_array(data){
  var data_to_show_gen = [];
  data.data = data.data.sort( compare )
  for (i=0; i<data.data.length; i++){
    var array = Object.keys(data.data[i]).map(
      function(key) {
        return data.data[i][key];
      });
    data_to_show_gen.push(array);
  }
  for (i=0; i<data_to_show_gen.length; i++){
    data_to_show_gen[i][0] = data_to_show_gen[i][0].replace(",", "");
    data_to_show_gen[i][1] = data_to_show_gen[i][1].split(' ')[0];
    var grades = []
    while (data_to_show_gen[i].length>2){
      try{
        grades.push(parseFloat(data_to_show_gen[i][data_to_show_gen[i].length-1].replace(",", ".")).toFixed(2));
      } catch {
        grades.push(data_to_show_gen[i][data_to_show_gen[i].length-1]);
      }
      data_to_show_gen[i].pop();
    }
    data_to_show_gen[i].push(grades.reverse());
  };
  console.log("O - data_to_show", data_to_show_gen)
  return data_to_show_gen;
}

// sort by name
function compare( a, b ) {
  if ( a.Name < b.Name ){
    return -1;
  }
  if ( a.Name > b.Name ){
    return 1;
  }
  return 0;
}

// - - - - dropzone - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function generate_table_preview(date_to_show_in_table){
  datazone.innerHTML = "";
  var table_preview = "<table id='datazone_table_data_preview'>";
  var columns = 3;
  for (i=0; i<5; i++){
    table_preview += "</tr>";
    for (j=0; j<3; j++){
      try{
        if (j<2){
          table_preview += "<td>" + date_to_show_in_table[i][j] + "</td>";
        } else {
          var grades = ""
          for (k=0; k<date_to_show_in_table[i][j].length; k++){
            grades += date_to_show_in_table[i][j][k] + " &emsp; ";
          }
          table_preview += "<td>" + grades.slice(0, -8) + "</td>";
        }
      } catch {
        console.log("Index zu groß")
      }
    }
    table_preview += "</tr>";
  }
  table_preview += "<tr><td>...</td><td>...</td><td>...</td></tr>";
  table_preview += "</table>";
  datazone.innerHTML = table_preview;
  datazone.classList.remove('hide');
  controls.classList.remove('conceal');
  title_desc.classList.remove('conceal');
}


function generate_data_to_show_plusminus(data_array_dezi_to_change){
  var data_to_show_gen = JSON.parse(JSON.stringify(data_array_dezi_to_change));
  for (i=0; i<data_to_show_gen.length; i++){
    var grades = [];
    for (j=0; j<data_to_show_gen[i][2].length; j++){
      grades.push(data_to_show_gen[i][2][j])
    }
    // console.log("grades", grades)
    var grades_new = []
    for (k=0; k<grades.length; k++){
      if (grades[k].includes(".25")){
        grades_new.push(String(parseFloat(grades[k])-0.25) + "-&nbsp;")
      } else if (grades[k].includes(".75")){
        grades_new.push("&nbsp;+" + String(parseFloat(grades[k])+0.25))
      } else if (grades[k].includes(".50")){
        grades_new.push(String(parseFloat(grades[k])-0.5) + "-" + String(parseFloat(grades[k])+0.5));
      } else {
        try{
          grades_new.push(String(parseFloat(grades[k]))+"&nbsp;&nbsp;");
        } catch {
          grades_new.push(String(grades[k]));
        }
      }
    data_to_show_gen[i][2] = grades_new;
    }
  }
  return data_to_show_gen;
}

// - - - - input - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function update_title_description(is_plusminus, seconds){
  var format = "";
  if (is_plusminus){
    format = "+  -"
  } else {
    format = "dezimal"
  }
  title_desc.innerHTML = "[&emsp;" + format + "&emsp; " + String(seconds) + "s &emsp;]"
}

function set_seconds_in_input_field(seconds){
  input_seconds.value = seconds;
}

function get_seconds(){
  return input_seconds.value;
}



// - - - - display - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function start_interval(){
  if (is_plusminus_checked){
    display_data = JSON.parse(JSON.stringify(data_to_show_plusminus));
  } else {
    display_data = JSON.parse(JSON.stringify(data_to_show_dezi));
  }
  display_grades(display_data);
  display_interval = setInterval(function(){
    display_grades(display_data);
  }, seconds*1000);
  set_layout_for_display();
  btn_start_display.innerHTML = `<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" /></svg>`
}

function stop_interval(){
  clearInterval(display_interval);
  btn_start_display.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32"><path d="M0 0h24v24H0z" fill="none"/><path d="M8 5v14l11-7z" style="fill:white"/></svg>`
}


function display_grades(display_data_to_show){
  // console.log("display_interval: ", display_index);
  // check for last item and clear interval
  if (display_index==display_data_to_show.length){
    stop_interval();
    is_display_running = false;
    display_index--;
    // show coffee
    display_name_div.innerHTML = `<svg style="width:128px;height:128px" viewBox="0 0 24 24"><path fill="#50C878" d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z" /></svg>`;
    display_grade_div.innerHTML= `<svg style="width:64px;height:64px" viewBox="0 0 24 24"><path fill="currentColor" d="M2,21V19H20V21H2M20,8V5H18V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z" /></svg>`
    btn_start_display.classList.add('conceal');
    display_grade.classList.add('conceal');
    display_name.classList.add('conceal');
    is_finished = true;
  }
  // show data
  var grades = "";
  for (i=0; i<display_data_to_show[display_index][2].length; i++){
    // console.log(i, "bad?", get_is_bad_grade(display_data_to_show[display_index][2][i]))
    if (get_is_bad_grade(display_data_to_show[display_index][2][i])){
      grades = grades + '<span style="color: #a50000;">' + display_data_to_show[display_index][2][i] + '&emsp;</span>'
    } else {
      grades = grades + display_data_to_show[display_index][2][i] + "&emsp;";
    }
  }
  display_name.innerHTML = display_data_to_show[display_index][0] + ", " + display_data_to_show[display_index][1];
  display_grade.innerHTML = grades.substring(0, grades.length-6);
  display_index++;
}

function get_is_bad_grade(grade){
  grade = String(grade);
  if (grade.includes("5.") || grade.includes("6") || grade.includes("4-") || grade.includes("4.25")){
    return true;
  } else {
    return false;
  }
}

function set_layout_for_display(){
  title_div.classList.add('hide');
  datazone_div.classList.add('hide');
  datazone.classList.add('hide');
  dropzone.classList.add('conceal');
  controls.classList.add('hide');

  display_name_div.classList.remove('hide');
  display_grade_div.classList.remove('hide');
  display_control_box.classList.remove('hide');

  btn_start_display.addEventListener('click', function(){
    if (is_display_running){
      stop_interval();
      is_display_running = false;
      display_index = display_index-1;
      if (display_index<0){
        display_index = 0;
      }
    } else {
      start_interval();
      is_display_running = true;
    }
  });
}


