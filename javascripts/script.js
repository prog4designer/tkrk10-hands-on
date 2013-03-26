$(function(){

  console.log("jQuery Version: " + $().jquery);


  // events
  $(document).on("keydown", pickertoggle);

  $("header").on("click", pickertoggle);

  $("#support").find(".pickto").find("li").on("click", function(){
    var t = $(this);
    t.parent().find("li").removeClass("selected");
    t.addClass("selected");
    selectedTarget=t;
  });

  $("#support").find(".color-sample").find("li").on("click", function(){
    var t = $(this);
    var targets = selectedTarget.data("target").split("_");
    var type = selectedTarget.data("type");
    var color = t.text();

    var len = targets.length;
    for(var i = 0; i < len; i++){
      if(targets[i] === "h1"){
        $(targets[i]).not("#logo").css(type, color);
      }else{
        $(targets[i]).css(type, color);
      }
    }
  });


  // init
  var selectedTarget = $("#support").find(".pickto").find("li").first();
  selectedTarget.addClass("selected");

  var support = $("#support");
  support.prependTo("body");
  console.log(support);

  support.delay(500).slideDown();


  // 必要な機能
  function ExtendColors(){
    var self = this;
    var renderTarget = '#support';
    var listsClass = 'color-sample';

    // default colors
    var _defaultColors = {
      1:  'E1DBC9',
      2:  'C5BFB0',
      3:  '746643',
      4:  '3F3724',
      5:  '3F5466',
      6:  '062737',
      7:  '1586BF',
      8:  'FFF1C6',
      9:  'F1BD3D',
      10: 'B68299',
      11: '982365',
      12: 'E0EC8F',
      13: '61B816'
    };

    // get extend colors
    this._get = function(){
      var colors = null;
      if( location.search == '' ){
        colors = _defaultColors;
      } else {
        // get URL query
        colors = getArgs();
      }
      return colors;
    };

    // create color list
    this._create = function( obj ){
      var colors = obj;
      var $lists = $('<ul/>').addClass( listsClass );
      $.each( colors, function(key, val){
        var code = adjustColorCode( val );
        var $list = $('<li/>');
        $list.css('background-color', code);
        $list.text( code );
        $lists.append( $list );
      });
      return $lists;
    };

    // render color list
    this.render = function(){
      var $target = $( renderTarget );
      var $lists = self._create( self._get() );
      $target.append( $lists );
    };
  }

  var extendColors = new ExtendColors();
  extendColors.render();


  // ***************
  // functions
  // ***************

  // #support toggle
  function pickertoggle(e){
    if(e.type === "click" || e.keyCode == 80){
      $("#support").slideToggle();
    }
  }

  // getArgs
  function getArgs() {
    var args = new Object();
    var query = location.search.substring(1);
    var pairs = query.split('&');
    for( var i = 0; i < pairs.length; i++ ) {
      var pos = pairs[i].indexOf('=');
      if( pos == -1 ) continue;
      var argname = pairs[i].substring( 0, pos );
      var value= pairs[i].substring( pos + 1 );
      value = decodeURIComponent( value );
      args[ argname ] = value;
    }
    return args;
  }

  // 最適化されたcolor codeを返す
  function adjustColorCode( code ){
    // 超適当、後で作る
    return '#' + code.toUpperCase();
  }

});
