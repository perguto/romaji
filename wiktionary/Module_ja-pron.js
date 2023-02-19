var lua_script = (function() {
  var tmp;
  var G = lua_newtable2(lua_core);
  for (var i in lua_libs) {
    G.str[i] = lua_newtable2(lua_libs[i]);
  }
  G.str['arg'] = lua_newtable();
  G.str['_G'] = G;
  G.str['module'] = function (name) {
    lua_createmodule(G, name, slice(arguments, 1));
  };
  G.str['require'] = function (name) {
    lua_require(G, name);
  };
  G.str['package'].str['seeall'] = function (module) {
    if (!module.metatable) {
      module.metatable = lua_newtable();
    }
    module.metatable.str['__index'] = G;
  };
  {
    var _export_1 = lua_newtable();
    var _gsub_1 = lua_tableget(lua_tableget(G.str['mw'], 'ustring'), 'gsub');
    var _match_1 = lua_tableget(lua_tableget(G.str['mw'], 'ustring'), 'match');
    var _sub_1 = lua_tableget(lua_tableget(G.str['mw'], 'ustring'), 'sub');
    var _len_1 = lua_tableget(lua_tableget(G.str['mw'], 'ustring'), 'len');
    var _lang_1 = lua_tablegetcall(lua_call(G.str['require'], ["Module:languages"])[0], 'getByCode', ["ja"])[0];
    var _m_ja_1 = lua_call(G.str['require'], ["Module:ja"])[0];
    var _m_accent_1 = lua_call(G.str['require'], ["Module:accent qualifier"])[0];
    var _PAGENAME_1 = lua_tableget(lua_tablegetcall(lua_tableget(G.str['mw'], 'title'), 'getCurrentTitle', [])[0], 'text');
    var _quote_1 = (function (_text) {
      var tmp;
      return [lua_concat("“", lua_concat(_text, "”"))];
      return [];
    });
    var _ref_template_name_data_1 = lua_newtable([], 'DJR', 'R:Daijirin', 'DJS', 'R:Daijisen', 'KDJ', 'R:Kokugo Dai Jiten', 'NHK', 'R:NHK Hatsuon', 'SMK2', 'R:Shinmeikai2', 'SMK5', 'R:Shinmeikai5', 'SMK7', 'R:Shinmeikai7', 'ZAJ', 'R:Zenkoku Akusento Jiten', 'JEL', 'R:Kenkyusha JEL Pocket');
    var _generate_ref_tag_1 = (function (_ref_name) {
      var tmp;
      var _ref_template_name_3 = lua_tableget(_ref_template_name_data_1, _ref_name);
      if (lua_not(_ref_template_name_3)) {
        lua_tablegetcall(lua_call(G.str['require'], ["Module:debug"])[0], 'track', ["ja-pron/unrecognized ref"]);
        return [null];
      }
      var _ref_tag_3 = lua_mcall(lua_tablegetcall(G.str['mw'], 'getCurrentFrame', [])[0], 'extensionTag', [lua_newtable([], 'name', 'ref', 'args', lua_newtable([], 'name', _ref_name), 'content', lua_concat('{{', lua_concat(_ref_template_name_3, '}}')))])[0];
      return [_ref_tag_3];
      return [];
    });
    var _add_acc_refs_1 = (function (_text) {
      var tmp;
      var _output_5 = lua_newtable();
      if (lua_true(lua_tablegetcall(lua_tableget(G.str['mw'], 'ustring'), 'match', [_text, 'ref'])[0])) {
        lua_tablegetcall(G.str['table'], 'insert', [_output_5].concat(lua_mcall(lua_tablegetcall(G.str['mw'], 'getCurrentFrame', [])[0], 'preprocess', [_text])));
      } else {
        tmp = lua_tablegetcall(lua_tableget(G.str['mw'], 'text'), 'gsplit', [_text, '%s*,%s*']);
        var f_8 = tmp[0], s_8 = tmp[1], var_8 = tmp[2];
        tmp = null;
        while ((var_8 = lua_call(f_8, [s_8, var_8])[0]) != null) {
          var _ref_name_8 = var_8;
          lua_tablegetcall(G.str['table'], 'insert', [_output_5].concat(lua_call(_generate_ref_tag_1, [_ref_name_8])));
        }
      }
      return lua_tablegetcall(G.str['table'], 'concat', [_output_5]);
      return [];
    });
    lua_tableset(_export_1, 'show', (function (_frame) {
      var tmp;
      var _params_10 = lua_newtable([], 1, lua_newtable([], 'default', _PAGENAME_1, 'list', true), "y", lua_newtable([], 'alias_of', "yomi"), "yomi", lua_newtable(), "accent", lua_newtable([], 'list', true), "accent=_loc", lua_newtable([], 'list', true), "accent=_ref", lua_newtable([], 'list', true, 'allow_holes', true), "accent=_note", lua_newtable([], 'list', true, 'allow_holes', true), "acc", lua_newtable([], 'alias_of', "accent", 'list', true), "acc=_loc", lua_newtable([], 'alias_of', "accent_loc", 'list', true), "acc=_ref", lua_newtable([], 'alias_of', "accent_ref", 'list', true), "acc=_note", lua_newtable([], 'alias_of', "accent_note", 'list', true), "dev", lua_newtable(), "dev2", lua_newtable(), "devm", lua_newtable(), "noipa", lua_newtable(), "a", lua_newtable([], 'alias_of', "audio"), "audio", lua_newtable());
      var _args_10 = lua_tablegetcall(lua_call(G.str['require'], ["Module:parameters"])[0], 'process', [lua_tableget(lua_mcall(_frame, 'getParent', [])[0], 'args'), _params_10])[0];
      tmp = [lua_tableget(_args_10, 'yomi'), lua_tableget(_args_10, 'audio')]; var _yomi_10 = tmp[0]; var _au_10 = tmp[1]; tmp = null;
      var _dev_10 = lua_or(lua_tableget(_args_10, 'dev'), function () {return lua_tableget(_args_10, 'devm');});
      var _dev2_10 = lua_tableget(_args_10, 'dev2');
      var _maxindex_10 = lua_tablegetcall(G.str['table'], 'getn', [lua_tableget(_args_10, 1)])[0];
      var _html_list_main_10 = lua_tablegetcall(lua_tableget(G.str['mw'], 'html'), 'create', ['ul'])[0];
      var _html_list_yomi_10;
      var _text_10;
      var _yomi_types_10 = lua_newtable([], 'o', "on", 'on', "on", 'go', "goon", 'goon', "goon", 'ko', "kanon", 'kan', "kanon", 'kanon', "kanon", 'so', "soon", 'soon', "soon", 'to', "toon", 'toon', "toon", 'ky', "kanyoon", 'kanyo', "kanyoon", 'kanyoon', "kanyoon", 'k', "kun", 'kun', "kun", 'j', "ju", 'ju', "ju", 'y', "yu", 'yu', "yu", 'i', "irregular", 'irr', "irregular", 'irreg', "irregular", 'irregular', "irregular");
      var _yomi_text_10 = lua_newtable([], 'on', "[[音読み#Japanese|On’yomi]]", 'goon', "[[音読み#Japanese|On’yomi]]: [[呉音#Japanese|Goon]]", 'kanon', "[[音読み#Japanese|On’yomi]]: [[漢音#Japanese|Kan’on]]", 'soon', "[[音読み#Japanese|On’yomi]]: [[宋音#Japanese|Sōon]]", 'toon', "[[音読み#Japanese|On’yomi]]: [[唐音#Japanese|Tōon]]", 'kanyoon', "[[慣用読み#Japanese|Kan’yōyomi]]", 'kun', "[[訓読み#Japanese|Kun’yomi]]", 'ju', "[[重箱読み#Japanese|Jūbakoyomi]]", 'yu', "[[湯桶読み#Japanese|Yutōyomi]]", 'irregular', lua_tablegetcall(lua_call(G.str['require'], ["Module:qualifier"])[0], 'format_qualifier', ["Irregular reading"])[0]);
      if (lua_true(_yomi_10)) {
        if (lua_true(lua_tableget(_yomi_types_10, _yomi_10))) {
          _yomi_10 = lua_tableget(_yomi_types_10, _yomi_10);
        } else {
          lua_call(G.str['error'], [lua_concat("The yomi type ", lua_concat(lua_call(_quote_1, [_yomi_10])[0], " is not recognized. See Template:ja-pron/documentation for recognized types"))]);
        }
        var _kanji_11 = lua_tablegetcall(lua_tableget(G.str['mw'], 'ustring'), 'gsub', [_PAGENAME_1, lua_concat("[^", lua_concat(lua_mcall(lua_tablegetcall(lua_call(G.str['require'], ["Module:scripts"])[0], 'getByCode', ["Hani"])[0], 'getCharacters', [])[0], "]+")), ""])[0];
        if ((!lua_eq(lua_tablegetcall(lua_tableget(G.str['mw'], 'ustring'), 'len', [_kanji_11])[0], 2) && (lua_eq(_yomi_10, "ju") || lua_eq(_yomi_10, "yu")))) {
          lua_tablegetcall(lua_call(G.str['require'], ["Module:debug"])[0], 'track', ["ja-pron/incorrect yutou or juubako"]);
        }
        _html_list_yomi_10 = lua_mcall(lua_mcall(lua_mcall(lua_mcall(lua_tablegetcall(lua_tableget(G.str['mw'], 'html'), 'create', ['ul'])[0], 'tag', ['li'])[0], 'wikitext', [lua_tableget(_yomi_text_10, _yomi_10)])[0], 'done', [])[0], 'done', [])[0];
      }
      tmp = [lua_tableget(_args_10, 'accent'), lua_tableget(_args_10, 'accent_loc'), lua_tableget(_args_10, 'accent_ref'), lua_tableget(_args_10, 'accent_note')]; var _a_10 = tmp[0]; var _al_10 = tmp[1]; var _ar_10 = tmp[2]; var _an_10 = tmp[3]; tmp = null;
      tmp = lua_call(G.str['ipairs'], [_a_10]);
      var f_15 = tmp[0], s_15 = tmp[1], var_15 = tmp[2];
      while ((tmp = lua_call(f_15, [s_15, var_15]))[0] != null) {
        var_15 = tmp[0];
        var _i_15 = var_15, _position_15 = tmp[1];
        tmp = null;
        var _result_16;
        _text_10 = lua_tableget(lua_tableget(_args_10, 1), lua_tablegetcall(G.str['math'], 'min', [_maxindex_10, _i_15])[0]);
        if (lua_not(lua_tableget(_al_10, _i_15))) {
          lua_tableset(_al_10, _i_15, "[[w:Tokyo dialect|Tokyo]]");
        }
        _result_16 = lua_concat(lua_tablegetcall(_m_accent_1, 'show', [lua_newtable([lua_tableget(_al_10, _i_15)])])[0], " ");
        _result_16 = lua_concat(_result_16, lua_tablegetcall(_export_1, 'accent', [_text_10, _position_15, _dev_10, _dev2_10])[0]);
        if (lua_true(lua_tableget(_ar_10, _i_15))) {
          _result_16 = lua_concat(_result_16, lua_call(_add_acc_refs_1, [lua_tableget(_ar_10, _i_15)])[0]);
        }
        _result_16 = lua_concat(_result_16, (lua_or(lua_and(lua_tableget(_an_10, _i_15), function () {return (lua_concat(" ", lua_tableget(_an_10, _i_15)));}), function () {return "";})));
        lua_mcall(lua_mcall(_html_list_main_10, 'tag', ['li'])[0], 'wikitext', [_result_16]);
      }
      tmp = null;
      if (lua_not(G.str['noipa'])) {
        var _m_IPA_19 = lua_call(G.str['require'], ["Module:IPA"])[0];
        tmp = lua_call(G.str['ipairs'], [lua_tableget(_args_10, 1)]);
        var f_20 = tmp[0], s_20 = tmp[1], var_20 = tmp[2];
        while ((tmp = lua_call(f_20, [s_20, var_20]))[0] != null) {
          var_20 = tmp[0];
          var _i_20 = var_20, _text_20 = tmp[1];
          tmp = null;
          var _sortkey_21 = lua_tablegetcall(_m_ja_1, 'jsort', [_text_20])[0];
          lua_mcall(lua_mcall(_html_list_main_10, 'tag', ['li'])[0], 'wikitext', lua_tablegetcall(_m_IPA_19, 'format_IPA_full', [_lang_1, lua_newtable([lua_newtable([], 'pron', lua_concat("[", lua_concat(lua_tablegetcall(_export_1, 'ipa', [_text_20, _dev_10, _dev2_10])[0], "]")))]), null, null, _sortkey_21]));
        }
        tmp = null;
      }
      if (lua_true(_au_10)) {
        G.str['sortkey'] = lua_tablegetcall(_m_ja_1, 'jsort', [lua_tableget(lua_tableget(_args_10, 1), 1)])[0];
        lua_mcall(lua_mcall(_html_list_main_10, 'tag', ['li'])[0], 'wikitext', [lua_concat('<table class="audiotable" style="vertical-align: top; display:inline-block; list-style:none;line-height: 1em;"><tr><td class="unicode audiolink">Audio</td><td class="audiofile">[[Image:', lua_concat(_au_10, lua_concat('|noicon|175px]]</td><td class="audiometa" style="font-size: 80%;">([[:Image:', lua_concat(_au_10, lua_concat('|file]])</td></tr></table>[[Category:Japanese terms with audio links|', lua_concat(G.str['sortkey'], ']]'))))))]);
      }
      return [lua_concat('\n', lua_call(G.str['tostring'], [lua_or(lua_and(_html_list_yomi_10, function () {return lua_mcall(_html_list_yomi_10, 'node', [_html_list_main_10])[0];}), function () {return _html_list_main_10;})])[0])];
      return [];
    }))
    lua_tableset(_export_1, 'ipa', (function (_text, _dev, _dev2) {
      var tmp;
      if (lua_eq(lua_call(G.str['type'], [_text])[0], "table")) {
        tmp = [lua_tableget(lua_tableget(_text, 'args'), 1), lua_tableget(lua_tableget(_text, 'args'), "dev"), lua_tableget(lua_tableget(_text, 'args'), "dev2")]; _text = tmp[0]; _dev = tmp[1]; _dev2 = tmp[2]; tmp = null;
      }
      _dev = lua_or(_dev, function () {return "";});
      _dev2 = lua_or(_dev2, function () {return "";});
      if (!lua_eq(_dev2, "")) {
        lua_call(G.str['error'], [lua_concat('Please remove parameter dev2 and change parameter dev to \"dev=', lua_concat(_dev, lua_concat(',', lua_concat(_dev2, '"'))))]);
      }
      var _position_mora_23 = lua_newtable();
      var var_26 = 1, stop_26 = lua_assertfloat(lua_call(_len_1, [_text])[0]);
      for (; var_26 <= stop_26; var_26++) {
        var _i_26 = var_26;
        if (lua_not(lua_call(_match_1, [lua_call(_sub_1, [_text, _i_26, _i_26])[0], "[ ァィゥェォャュョヮぁぃぅぇぉゃゅょゎ𛅑𛅐𛅒%.]"])[0])) {
          if ((lua_true(lua_call(_sub_1, [_text, lua_add(_i_26, 1), lua_add(_i_26, 1)])[0]) && lua_true(lua_call(_match_1, [lua_call(_sub_1, [_text, lua_add(_i_26, 1), lua_add(_i_26, 1)])[0], "[ァィゥェォャュョヮぁぃぅぇぉゃゅょゎ𛅑𛅐𛅒]"])[0]))) {
            lua_tablegetcall(G.str['table'], 'insert', [_position_mora_23, lua_add(_i_26, 1)]);
          } else {
            lua_tablegetcall(G.str['table'], 'insert', [_position_mora_23, _i_26]);
          }
        }
      }
      if (!lua_eq(_dev, "")) {
        tmp = lua_tablegetcall(lua_tableget(G.str['mw'], 'text'), 'gsplit', [_dev, ","]);
        var f_32 = tmp[0], s_32 = tmp[1], var_32 = tmp[2];
        tmp = null;
        while ((var_32 = lua_call(f_32, [s_32, var_32])[0]) != null) {
          var _position_32 = var_32;
          _position_32 = lua_call(G.str['tonumber'], [_position_32])[0];
          if (lua_eq(lua_len(_position_mora_23), _position_32)) {
            _text = lua_concat(_text, "@");
          } else {
            var _position_devspace_35 = lua_tableget(_position_mora_23, _position_32);
            _text = lua_concat(lua_call(_sub_1, [_text, 1, _position_devspace_35])[0], lua_concat("@", lua_call(_sub_1, [_text, lua_add(_position_devspace_35, 1), -1])[0]));
          }
          var var_36 = lua_assertfloat(lua_add(_position_32, 1)), stop_36 = lua_assertfloat(lua_len(_position_mora_23));
          for (; var_36 <= stop_36; var_36++) {
            var _i_36 = var_36;
            lua_tableset(_position_mora_23, _i_36, lua_add(lua_tableget(_position_mora_23, _i_36), 1));
          }
        }
      }
      _text = lua_tablegetcall(_m_ja_1, 'kana_to_romaji', [_text, lua_newtable([], 'keep_period', true)])[0];
      _text = lua_call(_gsub_1, [_text, "@", "̥"])[0];
      _text = lua_call(_gsub_1, [_text, "ー", "ː"])[0];
      _text = lua_call(_gsub_1, [_text, "&#39;", "ʔ"])[0];
      _text = lua_call(_gsub_1, [_text, "[ptkbjgzsdr][ptckbjgzsdr][hs]?", lua_newtable([], "pp", "p̚p", "tch", "t̚ch", "kk", "k̚k", "bb", "b̚b̥", "jj", "d̚j", "dd", "d̚d̥", "gg", "g̚g̊", "zz", "d̚z", "tt", "t̚t", "tts", "t̚ts", "rr", "r̚r", "ssh", "ɕː")])[0];
      _text = lua_call(_gsub_1, [_text, "ei", "ē"])[0];
      _text = lua_call(_gsub_1, [_text, "[āēīōūfvjryz]", lua_newtable([], "ā", "aː", "ē", "eː", "ī", "iː", "ō", "oː", "ū", "uː", "f", "ɸ", "v", "b", "j", "d͡ʑ", "r", "ɾ", "y", "j", "z", "d͡z")])[0];
      _text = lua_call(_gsub_1, [_text, "[sct][hs]", lua_newtable([], "sh", "ɕ", "ch", "t͡ɕ", "ts", "t͡s")])[0];
      _text = lua_call(_gsub_1, [_text, "([aeiouː̥])d͡([zʑ])", "%1%2"])[0];
      _text = lua_call(_gsub_1, [_text, "d͡([zʑ])([iu])", "(d͡)%1%2"])[0];
      _text = lua_call(_gsub_1, [_text, "([pbtdkgnmɸszɾ][̥̊]?)i", "%1ʲi"])[0];
      _text = lua_call(_gsub_1, [_text, "([pbtdkgnmɸszɾ][̥̊]?)j", "%1ʲ"])[0];
      _text = lua_call(_gsub_1, [_text, "nʲ", "ɲ̟"])[0];
      _text = lua_call(_gsub_1, [_text, "([^ ː])(ː?)n([^aeou])", "%1̃%2n%3"])[0];
      tmp = lua_call(G.str['pairs'], [lua_newtable([lua_newtable(["(ː?)n$", "̃%1ɴ"]), lua_newtable(["n( ?)([pbm])", "m%1%2"]), lua_newtable(["n( ?)(.͡[ɕʑ])", "ɲ̟%1%2"]), lua_newtable(["n( ?)ɲ̟", "ɲ̟%1ɲ̟"]), lua_newtable(["n( ?)([kg])(ʲ?)", "ŋ%1%3%2%3"]), lua_newtable(["n( ?)([ɸszɕhjw])", "ɰ̃%1%2"]), lua_newtable(["n'", "ɰ̃"]), lua_newtable(["n ([aeiou])", "ɰ̃ %1"])])]);
      var f_38 = tmp[0], s_38 = tmp[1], var_38 = tmp[2];
      while ((tmp = lua_call(f_38, [s_38, var_38]))[0] != null) {
        var_38 = tmp[0];
        var _i_38 = var_38, _args_38 = tmp[1];
        tmp = null;
        _text = lua_call(_gsub_1, [_text, lua_tableget(_args_38, 1), lua_tableget(_args_38, 2)])[0];
      }
      tmp = null;
      _text = lua_call(_gsub_1, [_text, "h[iju]", lua_newtable([], "hi", "çi", "hj", "ç", "hu", "ɸu")])[0];
      _text = lua_call(_gsub_1, [_text, "h([çɸ])", "%1%1"])[0];
      _text = lua_call(_gsub_1, [_text, "([snhçɸmɾjw])%1", "%1ː"])[0];
      _text = lua_call(_gsub_1, [_text, "ːʲ", "ʲː"])[0];
      _text = lua_call(_gsub_1, [_text, "̚(.[̥̊]?)ʲ", "̚ʲ%1ʲ"])[0];
      _text = lua_call(_gsub_1, [_text, "[aeiouw]", lua_newtable([], "a", "a̠", "e", "e̞", "o", "o̞", "u", "ɯ̟ᵝ", "w", "ɰᵝ")])[0];
      _text = lua_call(_gsub_1, [_text, "([szɕʑɲçʲ])ɯ̟", "%1ɨ"])[0];
      _text = lua_call(_gsub_1, [_text, "ᵝ̥", "̥ᵝ"])[0];
      _text = lua_call(_gsub_1, [_text, "ᵝ̃", "̃ᵝ"])[0];
      _text = lua_call(_gsub_1, [_text, "̠[̥̃][̥̃]", "̥̃˗"])[0];
      _text = lua_call(_gsub_1, [_text, "̞[̥̃][̥̃]", "̥̃˕"])[0];
      _text = lua_call(_gsub_1, [_text, "̟[̥̃][̥̃]", "̥̃˖"])[0];
      _text = lua_call(_gsub_1, [_text, "([̠̞̟])̥", "%1̊"])[0];
      _text = lua_call(_gsub_1, [_text, "%.", ""])[0];
      _text = lua_call(_gsub_1, [_text, "'", "."])[0];
      _text = lua_call(_gsub_1, [_text, "g", "ɡ"])[0];
      return [_text];
      return [];
    }))
    lua_tableset(_export_1, 'rise_and_fall', (function (_word, _rftype) {
      var tmp;
      _word = lua_call(_gsub_1, [_word, "([おこごそぞとどのほぼぽもよろぉょオコゴソゾトドノホボポモヨロォョ])([うウ])", "%1.%2"])[0];
      _word = lua_call(_gsub_1, [_word, "([えけげせぜてでねへべぺめれゑぇエケゲセゼテデネヘベペメレェ])([いイ])", "%1.%2"])[0];
      _word = lua_tablegetcall(_m_ja_1, 'kana_to_romaji', [_word])[0];
      if (lua_eq(_rftype, "rise")) {
        _word = lua_call(_gsub_1, [_word, ".", lua_newtable([], "a", "á", "e", "é", "i", "í", "o", "ó", "u", "ú", "ā", "áá", "ē", "éé", "ī", "íí", "ō", "óó", "ū", "úú")])[0];
        _word = lua_call(_gsub_1, [lua_call(_gsub_1, [_word, "n([bcdfghjkmnprstvw%'z ])", "ń%1"])[0], "n$", "ń"])[0];
      } else if (lua_eq(_rftype, "fall")) {
        _word = lua_call(_gsub_1, [_word, ".", lua_newtable([], "a", "à", "e", "è", "i", "ì", "o", "ò", "u", "ù", "ā", "àà", "ē", "èè", "ī", "ìì", "ō", "òò", "ū", "ùù")])[0];
        _word = lua_call(_gsub_1, [lua_call(_gsub_1, [_word, "n([bcdfghjkmnprstvw%'z ])", "ǹ%1"])[0], "n$", "ǹ"])[0];
      } else {
        return lua_call(G.str['error'], ["Type not recognised."]);
      }
      return [_word];
      return [];
    }))
    lua_tableset(_export_1, 'accent', (function (_text, _class, _dev, _dev2) {
      var tmp;
      var _result_44;
      if (lua_eq((lua_call(G.str['type'], [_text])[0]), "table")) {
        tmp = [lua_tableget(lua_tableget(_text, 'args'), 1), lua_tableget(lua_tableget(_text, 'args'), 2), lua_tableget(lua_tableget(_text, 'args'), "dev"), lua_tableget(lua_tableget(_text, 'args'), "dev2")]; _text = tmp[0]; _class = tmp[1]; _dev = tmp[2]; _dev2 = tmp[3]; tmp = null;
      }
      _text = lua_call(_gsub_1, [_text, "([おこごそぞとどのほぼぽもよろぉょオコゴソゾトドノホボポモヨロォョ])[うウ]", "%1ー"])[0];
      _text = lua_call(_gsub_1, [_text, "([えけげせぜてでねへべぺめれゑぇエケゲセゼテデネヘベペメレェ])[いイ]", "%1ー"])[0];
      _text = lua_call(_gsub_1, [_text, "%.", ""])[0];
      if (lua_eq(_dev, "")) {
        _dev = false;
      }
      if (lua_eq(_dev2, "")) {
        _dev2 = false;
      }
      var _down_first_44 = "<span style=\"border-top:1px solid black;position:relative;padding:1px;\">";
      var _down_last_44 = "<span style=\"position:absolute;top:0;bottom:67%;right:0%;border-right:1px solid black;\">&#8203;</span></span>";
      var _high_first_44 = "<span style=\"border-top:1px solid black\">";
      var _start_44 = "<span lang=\"ja\" class=\"Jpan\">";
      var _romaji_start_44 = " <span class=\"Latn\"><samp>[";
      var _romaji_last_44 = "]</samp></span> ";
      var _last_44 = "</span>";
      var _position_kana_44 = lua_newtable();
      var _position_mora_44 = lua_newtable();
      var _position_mora_space_44 = lua_newtable();
      var var_48 = 1, stop_48 = lua_assertfloat(lua_tablegetcall(lua_tableget(G.str['mw'], 'ustring'), 'len', [_text])[0]);
      for (; var_48 <= stop_48; var_48++) {
        var _i_48 = var_48;
        if (lua_not(lua_tablegetcall(lua_tableget(G.str['mw'], 'ustring'), 'match', [lua_call(_sub_1, [_text, _i_48, _i_48])[0], "[ァィゥェォャュョヮぁぃぅぇぉゃゅょゎ𛅑𛅐𛅒 ]"])[0])) {
          var _extra_50 = lua_tablegetcall(lua_tableget(G.str['mw'], 'ustring'), 'len', lua_tablegetcall(lua_tableget(G.str['mw'], 'ustring'), 'match', [lua_call(_sub_1, [_text, lua_add(_i_48, 1)])[0], "^[ァィゥェォャュョヮぁぃぅぇぉゃゅょゎ𛅑𛅐𛅒]*"]))[0];
          lua_tablegetcall(G.str['table'], 'insert', [_position_mora_space_44, lua_add(_i_48, _extra_50)]);
        }
      }
      var _space_removed_44 = lua_tablegetcall(lua_tableget(G.str['mw'], 'ustring'), 'gsub', [_text, " ", ""])[0];
      var var_51 = 1, stop_51 = lua_assertfloat(lua_tablegetcall(lua_tableget(G.str['mw'], 'ustring'), 'len', [_space_removed_44])[0]);
      for (; var_51 <= stop_51; var_51++) {
        var _i_51 = var_51;
        lua_tablegetcall(G.str['table'], 'insert', [_position_kana_44, _i_51]);
        if (lua_not(lua_tablegetcall(lua_tableget(G.str['mw'], 'ustring'), 'match', [lua_call(_sub_1, [_space_removed_44, _i_51, _i_51])[0], "[ァィゥェォャュョヮぁぃぅぇぉゃゅょゎ𛅑𛅐𛅒]"])[0])) {
          var _extra_53 = lua_tablegetcall(lua_tableget(G.str['mw'], 'ustring'), 'len', lua_tablegetcall(lua_tableget(G.str['mw'], 'ustring'), 'match', [lua_call(_sub_1, [_space_removed_44, lua_add(_i_51, 1)])[0], "^[ァィゥェォャュョヮぁぃぅぇぉゃゅょゎ𛅑𛅐𛅒]*"]))[0];
          lua_tablegetcall(G.str['table'], 'insert', [_position_mora_44, lua_add(_i_51, _extra_53)]);
        }
      }
      if (lua_true(lua_call(_match_1, [_class, "^[h0]$"])[0])) {
        tmp = ["h", 0]; G.str['acc_type'] = tmp[0]; G.str['acc_number'] = tmp[1]; tmp = null;
      } else if (lua_true(lua_call(_match_1, [_class, "^[a1]$"])[0])) {
        tmp = ["a", 1]; G.str['acc_type'] = tmp[0]; G.str['acc_number'] = tmp[1]; tmp = null;
      } else if (lua_true(lua_call(_match_1, [_class, "^o$"])[0])) {
        G.str['acc_type'] = "o";
      }
      if ((lua_true(lua_call(_match_1, [_class, "^[0-9]+$"])[0]) && lua_not(lua_call(_match_1, [_class, "^[01]$"])[0]))) {
        _class = lua_call(_gsub_1, [_class, "[on]", ""])[0];
        G.str['acc_number'] = lua_call(G.str['tonumber'], [_class])[0];
        G.str['morae_count'] = lua_call(_len_1, lua_call(_gsub_1, [_text, "[ァィゥェォャュョヮぁぃぅぇぉゃゅょゎ𛅑𛅐𛅒 ]", ""]))[0];
        if (lua_eq(G.str['morae_count'], G.str['acc_number'])) {
          G.str['acc_type'] = "o";
        } else if (lua_lt(G.str['morae_count'], G.str['acc_number'])) {
          return lua_call(G.str['error'], lua_mcall(("Mora count (%d) is smaller than position of downstep mora (%d)."), 'format', [G.str['morae_count'], G.str['acc_number']]));
        } else {
          G.str['acc_type'] = "n";
        }
      } else if (lua_not(G.str['acc_number'])) {
        G.str['acc_number'] = _class;
      }
      var _start_index_44 = 1;
      while (lua_true(lua_call(_match_1, [lua_call(_sub_1, [_text, lua_add(_start_index_44, 1), lua_add(_start_index_44, 1)])[0], "[ァィゥェォャュョヮぁぃぅぇぉゃゅょゎ𛅑𛅐𛅒]"])[0])) {
        _start_index_44 = lua_add(_start_index_44, 1);
      }
      var _kanas_44 = lua_newtable();
      var _single_mora_44;
      var var_63 = 1, stop_63 = lua_assertfloat(lua_tablegetcall(lua_tableget(G.str['mw'], 'ustring'), 'len', [_text])[0]);
      for (; var_63 <= stop_63; var_63++) {
        var _i_63 = var_63;
        if (lua_not(lua_tablegetcall(lua_tableget(G.str['mw'], 'ustring'), 'match', [lua_call(_sub_1, [_text, _i_63, _i_63])[0], "[ァィゥェォャュョヮぁぃぅぇぉゃゅょゎ𛅑𛅐𛅒 ]"])[0])) {
          _single_mora_44 = lua_call(_gsub_1, [lua_call(_sub_1, [_text, _i_63, -1])[0], "^(.[ァィゥェォャュョヮぁぃぅぇぉゃゅょゎ𛅑𛅐𛅒]*).*", "%1"])[0];
          lua_tablegetcall(G.str['table'], 'insert', [_kanas_44, _single_mora_44]);
        }
      }
      var _kana_devoice_44 = (function (_text) {
        var tmp;
        return [lua_concat('<span style="border:1px dotted gray; border-radius:50%;">', lua_concat(_text, "</span>"))];
        return [];
      });
      if (lua_true(_dev)) {
        tmp = lua_tablegetcall(lua_tableget(G.str['mw'], 'text'), 'gsplit', [_dev, ","]);
        var f_68 = tmp[0], s_68 = tmp[1], var_68 = tmp[2];
        while ((tmp = lua_call(f_68, [s_68, var_68]))[0] != null) (function () {
          var_68 = tmp[0];
          var _position_68 = var_68;
          tmp = null;
          _position_68 = lua_call(G.str['tonumber'], [_position_68])[0];
          lua_tableset(_kanas_44, _position_68, lua_call(_kana_devoice_44, [lua_tableget(_kanas_44, _position_68)])[0]);
        })();
        tmp = null;
      }
      G.str['romaji_text'] = lua_call(_gsub_1, [_text, "([おこそとのほもよろをごぞどぼぽょぉオコソトノホモヨロヲゴゾドボポョォ])ー", "%1お"])[0];
      G.str['romaji_text'] = lua_call(_gsub_1, [G.str['romaji_text'], "([えけせてねへめれゑげぜでべぺぇエケセテネヘメレヱゲゼデベペェ])ー", "%1え"])[0];
      G.str['romaji_text'] = lua_call(_gsub_1, [G.str['romaji_text'], "([うくすつぬふむゆるぐずづぶぷゅうウクスツヌフムユルグズヅブプュゥゔヴ])ー", "%1う"])[0];
      G.str['romaji_text'] = lua_call(_gsub_1, [G.str['romaji_text'], "([いきしちにひみりゐぎじぢびぴぃイキシチニヒミリヰギジヂビピィ])ー", "%1い"])[0];
      G.str['romaji_text'] = lua_call(_gsub_1, [G.str['romaji_text'], "([あかさたなはまやらわんがざだばぱゃぁアカサタナハマヤラワンガザダバパャァ])ー", "%1あ"])[0];
      var _romajis_44 = lua_tablegetcall(lua_tableget(G.str['mw'], 'text'), 'split', [G.str['romaji_text'], ""])[0];
      var _count_nspaces_44 = (function (_text, _index) {
        var tmp;
        tmp = [0, "", 0]; var _i_70 = tmp[0]; var _sample_70 = tmp[1]; var _nspaces_70 = tmp[2]; tmp = null;
        while (lua_lt(lua_call(_len_1, [_sample_70])[0], _index)) {
          _i_70 = lua_add(_i_70, 1);
          tmp = lua_call(_gsub_1, [lua_call(_sub_1, [_text, 1, _i_70])[0], " ", ""]); _sample_70 = tmp[0]; _nspaces_70 = tmp[1]; tmp = null;
        }
        return [_nspaces_70];
        return [];
      });
      var _romaji_devoice_44 = (function (_text) {
        var tmp;
        return [lua_concat(_text, "@")];
        return [];
      });
      if (lua_true(_dev)) {
        tmp = lua_tablegetcall(lua_tableget(G.str['mw'], 'text'), 'gsplit', [_dev, ","]);
        var f_74 = tmp[0], s_74 = tmp[1], var_74 = tmp[2];
        while ((tmp = lua_call(f_74, [s_74, var_74]))[0] != null) (function () {
          var_74 = tmp[0];
          var _position_74 = var_74;
          tmp = null;
          _position_74 = lua_tableget(_position_mora_space_44, lua_call(G.str['tonumber'], [_position_74])[0]);
          lua_tableset(_romajis_44, _position_74, lua_call(_romaji_devoice_44, [lua_tableget(_romajis_44, _position_74)])[0]);
        })();
        tmp = null;
      }
      if (lua_eq(G.str['acc_type'], "n")) {
        G.str['r_start_index'] = lua_add(_start_index_44, lua_call(_count_nspaces_44, [G.str['romaji_text'], _start_index_44])[0]);
        var _r_index_76 = lua_tableget(_position_mora_space_44, G.str['acc_number']);
        var _k_index_76 = G.str['acc_number'];
        G.str['r_parts'] = lua_newtable([], 1, lua_tablegetcall(G.str['table'], 'concat', [_romajis_44, "", 1, G.str['r_start_index']])[0], 2, lua_tablegetcall(G.str['table'], 'concat', [_romajis_44, "", lua_add(G.str['r_start_index'], 1), _r_index_76])[0], 3, lua_tablegetcall(G.str['table'], 'concat', [_romajis_44, "", lua_add(_r_index_76, 1), lua_len(_romajis_44)])[0]);
        G.str['k_parts'] = lua_newtable([], 1, lua_tablegetcall(G.str['table'], 'concat', [_kanas_44, "", 1, 1])[0], 2, lua_tablegetcall(G.str['table'], 'concat', [_kanas_44, "", 2, _k_index_76])[0], 3, lua_tablegetcall(G.str['table'], 'concat', [_kanas_44, "", lua_add(_k_index_76, 1), lua_len(_kanas_44)])[0]);
        var _space2_76 = "";
        var _space3_76 = "";
        if (lua_eq(lua_call(_sub_1, [lua_tableget(G.str['r_parts'], 2), 1, 1])[0], " ")) {
          _space2_76 = " ";
        }
        if (lua_eq(lua_call(_sub_1, [lua_tableget(G.str['r_parts'], 3), 1, 1])[0], " ")) {
          _space3_76 = " ";
        }
        _result_44 = lua_concat(_start_44, lua_concat(lua_tableget(G.str['k_parts'], 1), lua_concat(_down_first_44, lua_concat(lua_tableget(G.str['k_parts'], 2), lua_concat(_down_last_44, lua_concat(lua_tableget(G.str['k_parts'], 3), lua_concat(_last_44, lua_concat(_romaji_start_44, lua_concat(lua_tablegetcall(_export_1, 'rise_and_fall', [lua_tableget(G.str['r_parts'], 1), "fall"])[0], lua_concat(_space2_76, lua_concat(lua_tablegetcall(_export_1, 'rise_and_fall', [lua_tableget(G.str['r_parts'], 2), "rise"])[0], lua_concat("ꜜ", lua_concat(_space3_76, lua_concat(lua_tablegetcall(_export_1, 'rise_and_fall', [lua_tableget(G.str['r_parts'], 3), "fall"])[0], lua_concat(_romaji_last_44, lua_concat("([[中高型|Nakadaka]] – [", lua_concat(G.str['acc_number'], "])")))))))))))))))));
      } else {
        G.str['r_start_index'] = lua_add(_start_index_44, lua_call(_count_nspaces_44, [G.str['romaji_text'], _start_index_44])[0]);
        G.str['r_parts'] = lua_newtable([], 1, lua_tablegetcall(G.str['table'], 'concat', [_romajis_44, "", 1, G.str['r_start_index']])[0], 2, lua_tablegetcall(G.str['table'], 'concat', [_romajis_44, "", lua_add(G.str['r_start_index'], 1), lua_len(_romajis_44)])[0]);
        G.str['k_parts'] = lua_newtable([], 1, lua_tablegetcall(G.str['table'], 'concat', [_kanas_44, "", 1, 1])[0], 2, lua_tablegetcall(G.str['table'], 'concat', [_kanas_44, "", 2, lua_len(_kanas_44)])[0]);
        var _space2_79 = "";
        if (lua_eq(lua_call(_sub_1, [lua_tableget(G.str['r_parts'], 2), 1, 1])[0], " ")) {
          _space2_79 = " ";
        }
        if (lua_eq(G.str['acc_type'], "h")) {
          _result_44 = lua_concat(_start_44, lua_concat(lua_tableget(G.str['k_parts'], 1), lua_concat(_high_first_44, lua_concat(lua_tableget(G.str['k_parts'], 2), lua_concat(_last_44, lua_concat(_last_44, lua_concat(_romaji_start_44, lua_concat(lua_tablegetcall(_export_1, 'rise_and_fall', [lua_tableget(G.str['r_parts'], 1), "fall"])[0], lua_concat(_space2_79, lua_concat(lua_tablegetcall(_export_1, 'rise_and_fall', [lua_tableget(G.str['r_parts'], 2), "rise"])[0], lua_concat(_romaji_last_44, lua_concat("([[平板型|Heiban]] – [", lua_concat(G.str['acc_number'], "])")))))))))))));
        } else if (lua_eq(G.str['acc_type'], "a")) {
          _result_44 = lua_concat(_start_44, lua_concat(_down_first_44, lua_concat(lua_tableget(G.str['k_parts'], 1), lua_concat(_down_last_44, lua_concat(lua_tableget(G.str['k_parts'], 2), lua_concat(_last_44, lua_concat(_romaji_start_44, lua_concat(lua_tablegetcall(_export_1, 'rise_and_fall', [lua_tableget(G.str['r_parts'], 1), "rise"])[0], lua_concat("ꜜ", lua_concat(_space2_79, lua_concat(lua_tablegetcall(_export_1, 'rise_and_fall', [lua_tableget(G.str['r_parts'], 2), "fall"])[0], lua_concat(_romaji_last_44, lua_concat("([[頭高型|Atamadaka]] – [", lua_concat(G.str['acc_number'], "])"))))))))))))));
        } else if (lua_eq(G.str['acc_type'], "o")) {
          _result_44 = lua_concat(_start_44, lua_concat(lua_tableget(G.str['k_parts'], 1), lua_concat(_down_first_44, lua_concat(lua_tableget(G.str['k_parts'], 2), lua_concat(_down_last_44, lua_concat(_last_44, lua_concat(_romaji_start_44, lua_concat(lua_tablegetcall(_export_1, 'rise_and_fall', [lua_tableget(G.str['r_parts'], 1), "fall"])[0], lua_concat(_space2_79, lua_concat(lua_tablegetcall(_export_1, 'rise_and_fall', [lua_tableget(G.str['r_parts'], 2), "rise"])[0], lua_concat("ꜜ", lua_concat(_romaji_last_44, lua_concat("([[尾高型|Odaka]] – [", lua_concat(G.str['acc_number'], "])"))))))))))))));
        } else {
          return lua_call(G.str['error'], ["Accent type not recognised."]);
        }
      }
      _result_44 = lua_call(_gsub_1, [_result_44, "(.)@", "<del>%1</del>"])[0];
      return [_result_44];
      return [];
    }))
    return [_export_1];
  };
  return [G];
})()[0];
