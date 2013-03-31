$(function(){


  // ***************
  // hashの仕様
  // ***************
  // e.g. index.html#ec=fff,111,000&ec=fff&lg=fff&h=fff&hd=fff&ct=fff

  // ec = extend color code / 拡張で読み込まれるカラーコード。,区切りで複数可能
  // lg = logo color / 現在のlogo色。状態保存用。複数不可。
  // h = heading color / 現在のh2...h6の色。状態保存用。複数不可。
  // hd = header bg color / 現在のヘッダーの背景色。状態保存用。複数不可。
  // ct = contents bg color / 現在のサイトの背景色。状態保存用。複数不可。
  var HASH_KEY = {
    EXTEND: 'ec',
    LOGO: 'lg',
    HEADING: 'h',
    TEXT: 'tx',
    HEADER: 'hd',
    CONTENTS: 'ct'
  };


  // ***************
  // init
  // ***************
  var extendColors = new ExtendColors();
  var urlCnt = new UrlController();

  extendColors.render( HASH_KEY );
  extendColors.setEvents( HASH_KEY );
  urlCnt.setEvents();



  var selectedTarget = $("#support").find(".pickto").find("li").first();
  selectedTarget.addClass("selected");

  var support = $("#support");
  support.prependTo("body");
  console.log(support);

  support.delay(500).slideUp( 250, 'swing' );


  // ***************
  // events
  // ***************

  // eventは機能ごとで発行すること
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

  // url controller
  function UrlController(){
    var self = this;

    // getArgs
    this.getArgs = function() {
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
    };

    // getHashes
    this.getHashes = function( hashesName ) {
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
      if( hashesName != undefined ){
        args = args[ hashesName ];
      }
      return args;
    };

    // set hashes
    this.setHashes = function( hashKey, color ){
      var hashes = self.getHashes();
      hashes[ hashKey ] = color;

      var ary = [];
      $.each( hashes, function( key, val ){
        var key = key.toLowerCase();
        var val = val.toLowerCase();
        var str = key + '=' + val;
        ary.push( str );
      });

      location.hash = ary.join( '&' );
    };

    // set events
    this.setEvents = function(){
      // とりあえず実装
      $el = $("#support").find(".color-sample").find("li");
      $el.on("click", function(){
        var t = $(this);
        var color = t.text();
        var _key = selectedTarget.data('key');
        self.setHashes( _key, color.substring(1) );
      });
    };
  }


  // extend colors
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
      '61B816',
      'fff',
      '000'
    ];

    // user color paint targets
    var PAINT_TARGETS = {
      LOGO: '#logo',
      HEADING: 'h2_h3_h4_h5_h6',
      TEXT: '#text_p_a',
      HEADER: '#header',
      CONTENTS: '#contents'
    };

    // get extend colors
    this._getExtendColors = function( HASH_KEY ){
      var colors = null;
      if( location.hash == '' ){
        colors = _defaultColors;
      } else {
        // get URL hashes
        var key = HASH_KEY.EXTEND;
        var hashes = urlCnt.getHashes( key );
        if( hashes == undefined ){
          colors = _defaultColors;
        } else {
          hashes = hashes + ',fff,000';
          colors = hashes.split(',');
        }
      }
      return colors;
    };

    // create color list
    this._createColorList = function( ary ){
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

    // set hash key
    this._setHashKey = function( HASH_KEY ){
      // とりあえず実装
      var $lists = $('#support').find('.pickto li').each(function(){
        var target = $(this).data('target');

        if( target == '#logo' ){
          $(this).attr('data-key', HASH_KEY.LOGO);

        } else if ( target == 'h2_h3_h4_h5_h6' ){
          $(this).attr('data-key', HASH_KEY.HEADING);

        } else if ( target == '#text_p_a' ){
          $(this).attr('data-key', HASH_KEY.TEXT);

        } else if ( target == '#header' ){
          $(this).attr('data-key', HASH_KEY.HEADER);

        } else if ( target == '#contents' ){
          $(this).attr('data-key', HASH_KEY.CONTENTS);
        }
      });
    };

    // set user colors
    this._setUserColors = function( HASH_KEY ){
      // とりあえず実装
      var PT = PAINT_TARGETS;
      var hashes = urlCnt.getHashes();

      $.each( PT, function( key, val ){
        var tar = val.split( '_' );
        $.each( tar, function( i ){
          $( tar[ i ] ).attr( 'style', '' );
        });
      });

      $.each( hashes, function( key, val ){
        var tar = [];
        var v = adjustColorCode( val );

        if( key == HASH_KEY.LOGO ){
          $( PT.LOGO ).css( 'color', v );

        } else if ( key == HASH_KEY.HEADING ){
          tar = PT.HEADING.split( '_' );
          $.each( tar, function( i ){
            $( tar[ i ] ).css( 'color', v );
          });

        } else if ( key == HASH_KEY.TEXT ){
          tar = PT.TEXT.split( '_' );
          $.each( tar, function( i ){
            $( tar[ i ] ).css( 'color', v );
          });

        } else if ( key == HASH_KEY.HEADER ){
          $( PT.HEADER ).css( 'background-color', v );

        } else if ( key == HASH_KEY.CONTENTS ){
          $( PT.CONTENTS ).css( 'background-color', v );
        }
      });
    };

    // render
    this.render = function( HASH_KEY ){
      // render color list
      var exColors = self._getExtendColors( HASH_KEY );
      var $lists = self._createColorList( exColors );
      $( renderTarget ).append( $lists );

      // render data-key
      self._setHashKey( HASH_KEY );

      // render current user colors
      self._setUserColors( HASH_KEY );
    };

    // set events
    this.setEvents = function( HASH_KEY ){
      $el = $(window).on( 'popstate', function( e ){
        self._setUserColors( HASH_KEY );
      });
    };
  }


  // #support toggle
  function pickertoggle(e){
    if(e.type === "click" || e.keyCode == 80){
      $("#support").slideToggle( 250, 'swing' );
    }
  }


  // 最適化されたcolor codeを返す
  function adjustColorCode( code ){
    // 超適当、後で作る
    return '#' + code.toUpperCase();
  }

});
