$(function(){


  // ***************
  // hashの仕様
  // ***************
  // e.g. index.html#ec=fff,111,000&ec=fff&lg=fff&h=fff&hd=fff&ct=fff

  // ec = extend color code / 拡張で読み込まれるカラーコード。,区切りで複数可能
  // lg = logo color / 現在のlogo色。状態保存用。複数不可。
  // h = heading color / 現在のh1...h6の色。状態保存用。複数不可。
  // hd = header bg color / 現在のヘッダーの背景色。状態保存用。複数不可。
  // ct = contents bg color / 現在のサイトの背景色。状態保存用。複数不可。
  var HASHES_NAME = {
    EXTEND: 'ec',
    LOGO: 'lg',
    HEADING: 'h',
    HEADER: 'hd',
    CONTENTS: 'ct'
  };


  // ***************
  // init
  // ***************

  var extendColors = new ExtendColors();
  extendColors.render();

  var selectedTarget = $("#support").find(".pickto").find("li").first();
  selectedTarget.addClass("selected");

  var support = $("#support");
  support.prependTo("body");
  console.log(support);

  support.delay(500).slideDown();


  // ***************
  // events
  // ***************

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


  // ***************
  // functions
  // ***************

  function ExtendColors(){
    var self = this;
    var renderTarget = '#support';
    var listsClass = 'color-sample';

    // default colors
    var _defaultColors = [
      'E1DBC9',
      'C5BFB0',
      '746643',
      '3F3724',
      '3F5466',
      '062737',
      '1586BF',
      'FFF1C6',
      'F1BD3D',
      'B68299',
      '982365',
      'E0EC8F',
      '61B816'
    ];

    // get extend colors
    this._get = function(){
      var colors = null;
      if( location.hash == '' ){
        colors = _defaultColors;
      } else {
        // get URL hashes
        var hashes = getHashes();
        var extendColors = HASHES_NAME.EXTEND;
        colors = hashes[ extendColors ].split(',');
      }
      return colors;
    };

    // create color list
    this._create = function( ary ){
      var colors = ary;
      var $lists = $('<ul/>').addClass( listsClass );
      $.each( colors, function( i ){
        var code = adjustColorCode( colors[ i ] );
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


  // getHashes
  function getHashes() {
    var args = new Object();
    var hash = location.hash.substring(1);
    var pairs = hash.split('&');
    for( var i = 0; i < pairs.length; i++ ) {
      var pos = pairs[i].indexOf('=');
      if( pos == -1 ) continue;
      var argname = pairs[i].substring( 0, pos );
      var value= pairs[i].substring( pos + 1 );
      value = decodeURIComponent( value );
      args[ argname ] = value;
    }
    console.log( args );
    return args;
  }


  // 最適化されたcolor codeを返す
  function adjustColorCode( code ){
    // 超適当、後で作る
    return '#' + code.toUpperCase();
  }

});
