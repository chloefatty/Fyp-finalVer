var d3 = require("d3");
var globals = require("./globals");
var chart = require("./chart");
var nationData = require("./data/studyData");

function sandbox () {

  suppress_touch_val_feedback = false;
  suppress_touch_feedback = false;
  globals.trial_response = [];
  
  var checkExist;    
  var checkTouch;
  
  function getDims() {
    height = window.innerHeight;
    width = window.innerWidth;
    svg_dim = d3.min([height,width]) - 2;
    inner_padding = svg_dim * 0.1;
    chart_dim = svg_dim * 0.8;
  }
  
  function draw() {
  
    getDims();
        
    d3.select('#main_svg')
    .style('height',svg_dim + 'px')
    .style('width',svg_dim + 'px');

    d3.select('#selector_div')
    .style('height', function(){
    if (height < width) {
      return (height) + 'px';
    }
    else {
      var menubar_height = width / 7;
      var remaining_height = height - svg_dim - menubar_height - 10; 
      return (remaining_height) + 'px';
    }
    })
    .style('width', function(){
      if (height < width) {
        var menubar_width = height / 7;
        var remaining_width = width - svg_dim - menubar_width; 
        return (remaining_width) + 'px';
      }
      else {        
        return (width) + 'px';
      }      
    })
    .style('float', (height < width) ? 'right' : 'unset')
    .style('left', (height < width) ? (svg_dim) + 'px' : 'unset');
      

    chart_g.attr('transform','translate(' + inner_padding + ',' + inner_padding + ')');
  
    d3.selectAll('.guide').remove();
    chart_instance.lines('off'); 
    chart_instance.animation('off');
    chart_instance.facets('off');
    chart_instance.current_year(globals.param_yearMin);

    chart_g.call(chart_instance);
    chart_g.call(chart_instance);    
  
    d3.selectAll('.toolbar')
    .style('position','absolute')
    .style('top', height < width ? '0px' : (svg_dim) + 'px')
    .style('right', height < width ? '0px' : 'unset')
    .style('width', height < width ? (height / 7) + 'px'  : width + 'px')
    .style('height',  height < width ? height + 'px'  : (width / 7) + 'px');
  
    d3.selectAll('.img_btn_enabled')
    .style('margin', height < width ? '0px' : '2px')
    .style('height', height < width ? (height / 7 - 6) + 'px' : (width / 7 - 6) + 'px')
    .style('width', width < height ? (width / 7 - 6) + 'px' : (height / 7 - 6) + 'px'); 

    // d3.select('#sandbox_div')
    // .style('height', function(){
    //   return svg_dim + (height < width ? (height / 7 - 6) : (width / 7 - 6)) + 'px'; 
    // });

  }
  
  function toggleLines () {
    chart_instance.this_chart().interrupt();
    if (chart_instance.lines() == "on") {
      chart_instance.lines("off");
    }
    else if (chart_instance.lines() == "off") {
      chart_instance.lines("on"); 
    }
    chart_g.call(chart_instance);
    globals.log_message = { 
      "TimeStamp": new Date().valueOf(),
      "user_id": globals.userID, 
      "Event": "SandBoxEvent",
      "EventType": "toggleLines", 
      "Status": chart_instance.lines()
    };
    console.log("SandBoxEvent", globals.log_message);


    document.getElementById('sandbox_div').focus();
  }

  function toggleAnimate () {
    chart_instance.this_chart().interrupt();
    if (chart_instance.animation() == "on") {
      chart_instance.current_year(Math.floor(chart_instance.current_year()));
      chart_instance.animation("off");
      d3.select('#next_btn')
      .attr('class','img_btn_enabled')
      .transition()
      .duration(250)
      .ease(d3.easeCubic)
      .attr('src', 'assets/next.svg');
      d3.select('#prev_btn')
      .attr('class','img_btn_enabled');
    }
    else if (chart_instance.animation() == "off") {
      chart_instance.animation("on"); 
      d3.select('#next_btn')
      .attr('class','img_btn_disabled')
      .transition()
      .duration(250)
      .ease(d3.easeCubic)
      .attr('src', 'assets/next_gold.svg');
      d3.select('#prev_btn')
      .attr('class','img_btn_disabled');
    }
    chart_g.call(chart_instance);
    globals.log_message = { 
      "TimeStamp": new Date().valueOf(),
      "user_id": globals.userID, 
      "Event": "SandBoxEvent",
      "EventType": "toggleAnimate", 
      "Status": chart_instance.animation()
    };
    console.log("SandBoxEvent", globals.log_message);


    document.getElementById('sandbox_div').focus();
  }
  
  function toggleFacets () {
    chart_instance.this_chart().interrupt();
    if (chart_instance.facets() == "on") {
      chart_instance.facets("off");      
    }
    else if (chart_instance.facets() == "off") {
      chart_instance.facets("on");      
    }
    chart_g.call(chart_instance);

    globals.log_message = { 
      "TimeStamp": new Date().valueOf(),
      "user_id": globals.userID, 
      "Event": "SandBoxEvent",
      "EventType": "toggleFacets", 
      "Status": chart_instance.facets()
    };
    console.log("SandBoxEvent", globals.log_message);


    document.getElementById('sandbox_div').focus();
  }

  function loadData () {     

    checkExist = setInterval(function() {
      if (all_data != undefined) {        
        chart_g.datum(all_data);
        draw();    

        hideAddressBar();

        d3.select('#sandbox_div')
        .style('visibility','visible');

        globals.log_message = { 
          "TimeStamp": new Date().valueOf(),
          "user_id": globals.userID, 
          "Event": "SandBoxEvent",
          "EventType": "loadData", 
        };
        console.log("SandBoxEvent", globals.log_message);


        clearInterval(checkExist);
      }
    }, 100); // check every 100ms

    chart_instance = chart();    
  
    main_svg = d3.select('#main_svg').remove();
  
    main_svg = d3.select('#sandbox_div').append('svg')
    .attr('id','main_svg');      
  
    defs = d3.select('#main_svg').append('defs');
  
    chart_g = main_svg.append('g')
    .attr('id','chart_g');      

    
    document.getElementById('sandbox_div').focus();

    // var orientation_div = d3.select('#sandbox_div').append('div')
    // .attr('id','orientation_div')
    // .attr('tabindex',0);

    // orientation_div.append('span')
    // .attr('id','orientation_span')
    // .html('<span class="instruction_emphasis">TooSmallForMultiples</span>');

  } 
    
  /** INIT **/
  
  d3.select('body').append('div')
  .attr('id','sandbox_div')
  .attr('tabindex',0);

  d3.select('body').append('div')
  .attr('id','selector_div')
  .style('bottom','0px')
  .style('position', 'absolute')
  .attr('tabindex',0);

  all_data = nationData;  
  var codes = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"]; //,
  codes = shuffle(codes);
  all_data.forEach(function (d,i){ 
    d.code = codes[i]; 
  });
    
  loadData(); 

  function exitHandler () {
    globals.log_message = { 
      "TimeStamp": new Date().valueOf(),
      "Event": "SandBox_Closed",
      "user_id": globals.userID
    };
    console.log("SandBox_Closed", globals.log_message);

    
    document.getElementById('sandbox_div').remove();
    if (document.getElementById('selector_div') != undefined) {      
      document.getElementById('selector_div').remove();                    
    } 
    loadMenu();
    hideAddressBar();   
  }

  var menubar = d3.select('#sandbox_div').append('div')
  .attr('class','toolbar')
  .attr('id','menubar');
  
  menubar.append("input")
  .attr('class', 'img_btn_enabled')
  .attr('id','fullscreen_btn')
  .attr('disabled', null)
  .attr('type','image')
  .attr('name','Exit')
  .attr('title', 'Exit')
  .attr('src', 'assets/fullscreen.png')
  .on('touchstart',function(){
    d3.event.preventDefault();
    exitHandler();
  });

  menubar.append("input")
  .attr('class', 'img_btn_enabled')
  .attr('id','na_btn')
  .attr('type','image')
  .attr('name','MiscToggle')
  .attr('title', 'MiscToggle')
  .attr('src', 'assets/na.svg')
  .on('touchstart', function() {
    d3.event.preventDefault(); 
  });    

  menubar.append("input")
  .attr('class', 'img_btn_enabled')
  .attr('type','image')
  .attr('name','LineToggle')
  .attr('title', 'LineToggle')
  .attr('src', 'assets/line.svg')
  .on('touchstart', function() {
    d3.event.preventDefault();
    toggleLines();
  });

  menubar.append("input")
  .attr('class', 'img_btn_enabled')
  .attr('type','image')
  .attr('name','FacetToggle')
  .attr('title', 'FacetToggle')
  .attr('src', 'assets/grid.svg')
  .on('touchstart', function() {
    d3.event.preventDefault();
    toggleFacets();
  });  

  menubar.append("input")
  .attr('class', 'img_btn_enabled')
  .attr('type','image')
  .attr('name','AnimateToggle')
  .attr('title', 'AnimateToggle')
  .attr('src', 'assets/play.svg')
  .on('touchstart', function() {
    d3.event.preventDefault();
    toggleAnimate();
  });  

  menubar.append("input")
  .attr('class', 'img_btn_enabled')
  .attr('id','prev_btn')
  .attr('type','image')
  .attr('name','PrevToggle')
  .attr('title', 'PrevToggle')
  .attr('src', 'assets/prev.svg')
  .on('touchstart', function() {    
    d3.event.preventDefault();
    d3.select(this).transition()
    .duration(250)
    .ease(d3.easeCubic)
    .attr('src', 'assets/prev_gold.svg')
    .transition()
    .duration(250)
    .ease(d3.easeCubic)
    .attr('src', 'assets/prev.svg');
    chart_instance.this_chart().interrupt();

    if (chart_instance.animation() == 'off'){

      if (chart_instance.current_year() == chart_instance.params().yearMin) {
        chart_instance.current_year(chart_instance.params().yearMax);
      }
      else {
        var prev_year = chart_instance.current_year() - 1;
        chart_instance.current_year(prev_year);
      }
      chart_g.call(chart_instance);

      checkTouch = setInterval(function() {
        if (chart_instance.current_year() == chart_instance.params().yearMin) {
          chart_instance.current_year(chart_instance.params().yearMax);
        }
        else {
          var prev_year = chart_instance.current_year() - 1;
          chart_instance.current_year(prev_year);
        }
        chart_g.call(chart_instance);
      }, 500); // check every 500ms if touch is ongoing          

    }
  })
  .on('touchend', function(){
    d3.event.preventDefault();
    clearInterval(checkTouch);
  });    

  menubar.append("input")
  .attr('class', 'img_btn_enabled')
  .attr('id','next_btn')
  .attr('type','image') 
  .attr('name','NextToggle')
  .attr('title', 'NextToggle')
  .attr('src', 'assets/next.svg')
  .on('touchstart', function() {    
    d3.event.preventDefault();
    d3.select(this).transition()
    .duration(250)
    .ease(d3.easeCubic)
    .attr('src', 'assets/next_gold.svg')
    .transition()
    .duration(250)
    .ease(d3.easeCubic)
    .attr('src', 'assets/next.svg');
    chart_instance.this_chart().interrupt();

    if (chart_instance.animation() == 'off'){

      if (chart_instance.current_year() == chart_instance.params().yearMax) {
        chart_instance.loop_count(chart_instance.loop_count + 1);
        chart_instance.current_year(chart_instance.params().yearMin);
      }
      else {
        var next_year = chart_instance.current_year() + 1;
        chart_instance.current_year(next_year);
      }
      chart_g.call(chart_instance);

      checkTouch = setInterval(function() {
        if (chart_instance.current_year() == chart_instance.params().yearMax) {
          chart_instance.loop_count(chart_instance.loop_count + 1);
          chart_instance.current_year(chart_instance.params().yearMin);
        }
        else {
          var next_year = chart_instance.current_year() + 1;
        chart_instance.current_year(next_year);
        }
        chart_g.call(chart_instance);
      }, 500); // check every 500ms if touch is ongoing          

    }
  })
  .on('touchend', function(){
    d3.event.preventDefault();
    clearInterval(checkTouch);
  });    

}

module.exports = sandbox;
