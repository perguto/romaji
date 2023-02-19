local export = {}
local gsub = mw.ustring.gsub
local match = mw.ustring.match
local sub = mw.ustring.sub
local len = mw.ustring.len

local lang = require("Module:languages").getByCode("ja")
local m_ja = require("Module:ja")
local m_accent = require("Module:accent qualifier")
-- also [[Module:qualifier]]

local PAGENAME = mw.title.getCurrentTitle().text

local function quote(text)
	return  "“" .. text .. "”"
end

local ref_template_name_data = {
	['DJR'] = 'R:Daijirin',
	['DJS'] = 'R:Daijisen',
	['KDJ'] = 'R:Kokugo Dai Jiten',
	['NHK'] = 'R:NHK Hatsuon',
	['SMK2'] = 'R:Shinmeikai2',
	['SMK5'] = 'R:Shinmeikai5',
	['SMK7'] = 'R:Shinmeikai7',
	['ZAJ'] = 'R:Zenkoku Akusento Jiten',
	['JEL'] = 'R:Kenkyusha JEL Pocket',
}

local function generate_ref_tag(ref_name)
	local ref_template_name = ref_template_name_data[ref_name]
	
	if not ref_template_name then
		-- [[Special:WhatLinksHere/Template:tracking/ja-pron/unrecognized ref]]
		require("Module:debug").track("ja-pron/unrecognized ref")
		return nil
	end

	local ref_tag = mw.getCurrentFrame():extensionTag{
		name = 'ref',
		args = { name = ref_name },
		content = '{{' .. ref_template_name .. '}}',
	}

	return ref_tag
end

local function add_acc_refs(text)
	local output = {}

	if mw.ustring.match(text, 'ref') then
		table.insert(output, mw.getCurrentFrame():preprocess(text))
	else
		for ref_name in mw.text.gsplit(text, '%s*,%s*') do
			table.insert(output, generate_ref_tag(ref_name))
		end
	end

	return table.concat(output)
end

function export.show(frame)
	local params = {
		[1] = {default = PAGENAME, list = true},
		
		["y"] = {alias_of = "yomi"},
		["yomi"] = {},
		
		["accent"] = {list = true},
		["accent=_loc"] = {list = true},
		["accent=_ref"] = {list = true, allow_holes = true},
		["accent=_note"] = {list = true, allow_holes = true},
		
		["acc"] = {alias_of = "accent", list = true},
		["acc=_loc"] = {alias_of = "accent_loc", list = true},	-- using "accent=_loc" (etc.) doesn't work
		["acc=_ref"] = {alias_of = "accent_ref", list = true},
		["acc=_note"] = {alias_of = "accent_note", list = true},
		
		["dev"] = {},
		["dev2"] = {},
		["devm"] = {},
		
		["noipa"] = {},
		
		["a"] = {alias_of = "audio"},
		["audio"] = {}
	}
	
	local args = require("Module:parameters").process(frame:getParent().args, params)
	
	local yomi, au = args.yomi, args.audio
	local dev = args.dev or args.devm
	local dev2 = args.dev2
	local maxindex = table.getn(args[1])
	local html_list_main = mw.html.create('ul')
	local html_list_yomi
	local text
	
	local yomi_types = {
		o = "on", on = "on",
		go = "goon", goon = "goon",
		ko = "kanon", kan = "kanon", kanon = "kanon",
		so = "soon", soon = "soon",
		to = "toon", toon = "toon",
		ky = "kanyoon", kanyo = "kanyoon", kanyoon = "kanyoon",
		k = "kun", kun = "kun",
		j = "ju", ju = "ju",
		y = "yu", yu = "yu",
		i = "irregular", irr = "irregular", irreg = "irregular", irregular = "irregular",
	}
	
	local yomi_text = {
		on = "[[音読み#Japanese|On’yomi]]",
		goon = "[[音読み#Japanese|On’yomi]]: [[呉音#Japanese|Goon]]",
		kanon = "[[音読み#Japanese|On’yomi]]: [[漢音#Japanese|Kan’on]]",
		soon = "[[音読み#Japanese|On’yomi]]: [[宋音#Japanese|Sōon]]",
		toon = "[[音読み#Japanese|On’yomi]]: [[唐音#Japanese|Tōon]]",
		kanyoon = "[[慣用読み#Japanese|Kan’yōyomi]]",
		kun = "[[訓読み#Japanese|Kun’yomi]]",
		ju = "[[重箱読み#Japanese|Jūbakoyomi]]",
		yu = "[[湯桶読み#Japanese|Yutōyomi]]",
		irregular = require("Module:qualifier").format_qualifier("Irregular reading")
	}
	
	-- Deals with the yomi
	if yomi then
		if yomi_types[yomi] then
			yomi = yomi_types[yomi]
		else
			error("The yomi type " .. quote(yomi) .. " is not recognized. See Template:ja-pron/documentation for recognized types")
		end
		
		local kanji = mw.ustring.gsub(PAGENAME, "[^" .. require("Module:scripts").getByCode("Hani"):getCharacters() .. "]+", "")
		
		if mw.ustring.len(kanji) ~= 2 and (yomi == "ju" or yomi == "yu") then
			require("Module:debug").track("ja-pron/incorrect yutou or juubako")
		end
		
		html_list_yomi = mw.html.create('ul'):tag('li'):wikitext(yomi_text[yomi]):done():done()
	end
	
	-- Deals with the accents
	local a, al, ar, an = args.accent, args.accent_loc, args.accent_ref, args.accent_note
	for i, position in ipairs(a) do
		local result

		text = args[1][math.min(maxindex,i)]
		if not al[i] then
			al[i] = "[[w:Tokyo dialect|Tokyo]]"
		end
		result = m_accent.show({al[i]}) .. " "
		
		result = result .. export.accent(text, position, dev, dev2)
		if ar[i] then
			result = result .. add_acc_refs(ar[i])
		end
		result = result .. (an[i] and (" " .. an[i]) or "")

		html_list_main:tag('li'):wikitext(
			result
		)
	end
	
	-- Deals with the IPA
	if not noipa then
		local m_IPA = require("Module:IPA")
		for i, text in ipairs(args[1]) do
			local sortkey = m_ja.jsort(text)
			html_list_main:tag('li'):wikitext(
				m_IPA.format_IPA_full(lang, {{ pron = "[" .. export.ipa(text, dev, dev2) .. "]" }}, nil, nil, sortkey)
			)
		end
	end
	
	-- Deals with the audio
	if au then
		sortkey = m_ja.jsort(args[1][1])
		html_list_main:tag('li'):wikitext(
			'<table class="audiotable" style="vertical-align: top; display:inline-block; list-style:none;line-height: 1em;"><tr><td class="unicode audiolink">Audio</td><td class="audiofile">[[Image:' .. au .. '|noicon|175px]]</td><td class="audiometa" style="font-size: 80%;">([[:Image:' .. au ..'|file]])</td></tr></table>[[Category:Japanese terms with audio links|' .. sortkey .. ']]'
		)
	end
	
	return '\n' .. tostring(html_list_yomi and html_list_yomi:node(html_list_main) or html_list_main)
end

function export.ipa(text, dev, dev2)
	if type(text) == "table" then
		text, dev, dev2 = text.args[1], text.args["dev"], text.args["dev2"] end
	dev = dev or ""
	dev2 = dev2 or ""
	
	if dev2 ~= "" then error('Please remove parameter dev2 and change parameter dev to \"dev=' .. dev .. ',' .. dev2 .. '"') end
	
	local position_mora = {}
	
	for i=1,len(text) do
		if not match(sub(text,i,i), "[ ァィゥェォャュョヮぁぃぅぇぉゃゅょゎ𛅑𛅐𛅒%.]") then
			if sub(text,i+1,i+1) and match(sub(text,i+1,i+1), "[ァィゥェォャュョヮぁぃぅぇぉゃゅょゎ𛅑𛅐𛅒]") then
				table.insert(position_mora, i+1)
			else
				table.insert(position_mora, i)
			end
		end
	end
	
	-- insert @ to stand for devoicing
	if dev ~= "" then
		for position in mw.text.gsplit(dev,",") do
			position = tonumber(position)
			if #position_mora == position then
				text = text .. "@"
			else
				local position_devspace = position_mora[position]
				text = sub(text, 1, position_devspace) .. "@" .. sub(text, position_devspace+1, -1)
			end
			for i=position+1,#position_mora do
				position_mora[i] = position_mora[i] + 1
			end
		end
	end
	
	text = m_ja.kana_to_romaji(text, { keep_period = true })
	
	text = gsub(text, "@", "̥")
	
	text = gsub(text, "ー", "ː")
	
	text = gsub(text, "&#39;", "ʔ")
	
	text = gsub(text, "[ptkbjgzsdr][ptckbjgzsdr][hs]?", {
		["pp"] = "p̚p", ["tch"] = "t̚ch", ["kk"] = "k̚k", ["bb"] = "b̚b̥", ["jj"] = "d̚j",
		["dd"] = "d̚d̥", ["gg"] = "g̚g̊", ["zz"] = "d̚z", ["tt"] = "t̚t", ["tts"] = "t̚ts",
		["rr"] = "r̚r", ["ssh"] = "ɕː" })
	
	text = gsub(text, "ei", "ē")
	text = gsub(text, "[āēīōūfvjryz]", {
		["ā"] = "aː", ["ē"] = "eː", ["ī"] = "iː", ["ō"] = "oː", ["ū"] = "uː", 
		["f"] = "ɸ", ["v"] = "b", ["j"] = "d͡ʑ", ["r"] = "ɾ", ["y"] = "j", ["z"] = "d͡z" })
	
	text = gsub(text, "[sct][hs]", {
		["sh"] = "ɕ", 
		["ch"] = "t͡ɕ", 
		["ts"] = "t͡s" })
	
	text = gsub(text, "([aeiouː̥])d͡([zʑ])", "%1%2")
	
	-- Tokyo-style yotsugana
	text = gsub(text, "d͡([zʑ])([iu])", "(d͡)%1%2")
	
	text = gsub(text, "([pbtdkgnmɸszɾ][̥̊]?)i", "%1ʲi")
	text = gsub(text, "([pbtdkgnmɸszɾ][̥̊]?)j", "%1ʲ")
	text = gsub(text, "nʲ", "ɲ̟")
	
	text = gsub(text, "([^ ː])(ː?)n([^aeou])", "%1̃%2n%3")
	for i, args in pairs{
			{ "(ː?)n$", "̃%1ɴ" },
			{ "n( ?)([pbm])", "m%1%2" },
			{ "n( ?)(.͡[ɕʑ])", "ɲ̟%1%2" },
			{ "n( ?)ɲ̟", "ɲ̟%1ɲ̟" },
			{ "n( ?)([kg])(ʲ?)", "ŋ%1%3%2%3" },
			{ "n( ?)([ɸszɕhjw])", "ɰ̃%1%2" },
			{ "n'", "ɰ̃" },
			{ "n ([aeiou])", "ɰ̃ %1" },
		} do
		
		text = gsub(text, args[1], args[2])
	end
	
	text = gsub(text, "h[iju]", {
		["hi"] = "çi", ["hj"] = "ç", 
		["hu"] = "ɸu" })
	
	text = gsub(text, "h([çɸ])", "%1%1")
	text = gsub(text, "([snhçɸmɾjw])%1", "%1ː")
	text = gsub(text, "ːʲ", "ʲː")
	text = gsub(text, "̚(.[̥̊]?)ʲ", "̚ʲ%1ʲ")
	text = gsub(text, "[aeiouw]", {
		["a"] = "a̠", 
		["e"] = "e̞", 
		["o"] = "o̞", 
		["u"] = "ɯ̟ᵝ", 
		["w"] = "ɰᵝ"})
	
	text = gsub(text, "([szɕʑɲçʲ])ɯ̟", "%1ɨ")
	
	text = gsub(text, "ᵝ̥", "̥ᵝ")
	text = gsub(text, "ᵝ̃", "̃ᵝ")
	text = gsub(text, "̠[̥̃][̥̃]", "̥̃˗")
	text = gsub(text, "̞[̥̃][̥̃]", "̥̃˕")
	text = gsub(text, "̟[̥̃][̥̃]", "̥̃˖")
	text = gsub(text, "([̠̞̟])̥", "%1̊")
	text = gsub(text, "%.", "")
	text = gsub(text, "'", ".")
	text = gsub(text, "g", "ɡ")
	
	return text
end

function export.rise_and_fall(word, rftype)
	word = gsub(word, "([おこごそぞとどのほぼぽもよろぉょオコゴソゾトドノホボポモヨロォョ])([うウ])", "%1.%2")
	word = gsub(word, "([えけげせぜてでねへべぺめれゑぇエケゲセゼテデネヘベペメレェ])([いイ])", "%1.%2")
	word = m_ja.kana_to_romaji(word)

	if rftype == "rise" then
		word = gsub(word, ".", {
			["a"] = "á", ["e"] = "é", ["i"] = "í", ["o"] = "ó", ["u"] = "ú", 
			["ā"] = "áá", ["ē"] = "éé", ["ī"] = "íí", ["ō"] = "óó", ["ū"] = "úú" })
	
		word = gsub(gsub(word, "n([bcdfghjkmnprstvw%'z ])", "ń%1"), "n$", "ń")
		
	elseif rftype == "fall" then
		word = gsub(word, ".", {
			["a"] = "à", ["e"] = "è", ["i"] = "ì", ["o"] = "ò", ["u"] = "ù", 
			["ā"] = "àà", ["ē"] = "èè", ["ī"] = "ìì", ["ō"] = "òò", ["ū"] = "ùù" })
		
		word = gsub(gsub(word, "n([bcdfghjkmnprstvw%'z ])", "ǹ%1"), "n$", "ǹ")
		
	else
		return error("Type not recognised.")
	end
	
	return word
end

-- [[Module:ja-ojad]] and [[Module:ja-infl-demo]] rely on the output format of this function
function export.accent(text, class, dev, dev2)
	local result

	if(type(text)) == "table" then text, class, dev, dev2 = text.args[1], text.args[2], text.args["dev"], text.args["dev2"] end
	text = gsub(text, "([おこごそぞとどのほぼぽもよろぉょオコゴソゾトドノホボポモヨロォョ])[うウ]", "%1ー")
	text = gsub(text, "([えけげせぜてでねへべぺめれゑぇエケゲセゼテデネヘベペメレェ])[いイ]", "%1ー")
	text = gsub(text, "%.", "")
	if dev == "" then dev = false end
	if dev2 == "" then dev2 = false end
	
	local down_first = "<span style=\"border-top:1px solid black;position:relative;padding:1px;\">"
	local down_last = "<span style=\"position:absolute;top:0;bottom:67%;right:0%;border-right:1px solid black;\">&#8203;</span></span>"
	local high_first = "<span style=\"border-top:1px solid black\">"
	local start = "<span lang=\"ja\" class=\"Jpan\">"
	local romaji_start = " <span class=\"Latn\"><samp>["
	local romaji_last = "]</samp></span> "
	local last = "</span>"
	
	local position_kana = {}       --position of each kana (ぁ counted), text without space
	local position_mora = {}       --position of each mora (ぁ not counted), text without space
	local position_mora_space = {} --position of each mora (ぁ not counted), text with space
	
	for i=1,mw.ustring.len(text) do
		if not mw.ustring.match(sub(text,i,i), "[ァィゥェォャュョヮぁぃぅぇぉゃゅょゎ𛅑𛅐𛅒 ]") then
			local extra = mw.ustring.len(mw.ustring.match(sub(text,i+1), "^[ァィゥェォャュョヮぁぃぅぇぉゃゅょゎ𛅑𛅐𛅒]*"))
			table.insert(position_mora_space, i+extra)
		end
	end
	local space_removed = mw.ustring.gsub(text," ","")
	for i=1,mw.ustring.len(space_removed) do
		table.insert(position_kana, i)
		if not mw.ustring.match(sub(space_removed,i,i), "[ァィゥェォャュョヮぁぃぅぇぉゃゅょゎ𛅑𛅐𛅒]") then
			local extra = mw.ustring.len(mw.ustring.match(sub(space_removed,i+1), "^[ァィゥェォャュョヮぁぃぅぇぉゃゅょゎ𛅑𛅐𛅒]*"))
			table.insert(position_mora, i+extra)
		end
	end
	
	if match(class, "^[h0]$") then
		acc_type, acc_number = "h", 0
		
	elseif match(class, "^[a1]$") then
		acc_type, acc_number = "a", 1
	
	elseif match(class, "^o$") then
		acc_type = "o"
	end
	
	if match(class, "^[0-9]+$") and not match(class,"^[01]$") then
		class = gsub(class, "[on]", "")
		acc_number = tonumber(class)
		
		morae_count = len(gsub(text, "[ァィゥェォャュョヮぁぃぅぇぉゃゅょゎ𛅑𛅐𛅒 ]", ""))
			
		if morae_count == acc_number then
			acc_type = "o"
		elseif morae_count < acc_number then
			return error(("Mora count (%d) is smaller than position of downstep mora (%d).")
				:format(morae_count, acc_number))
		else
			acc_type = "n"
		end
	elseif not acc_number then
		acc_number = class
	end
	
	local start_index = 1
	while match(sub(text, start_index+1, start_index+1), "[ァィゥェォャュョヮぁぃぅぇぉゃゅょゎ𛅑𛅐𛅒]") do
		start_index = start_index + 1
	end
	
	local kanas = {}
	local single_mora
	for i=1,mw.ustring.len(text) do
		if not mw.ustring.match(sub(text,i,i), "[ァィゥェォャュョヮぁぃぅぇぉゃゅょゎ𛅑𛅐𛅒 ]") then
			single_mora = gsub(sub(text, i, -1), "^(.[ァィゥェォャュョヮぁぃぅぇぉゃゅょゎ𛅑𛅐𛅒]*).*", "%1")
			table.insert(kanas, single_mora)
		end
	end
	
	local function kana_devoice(text)
		return '<span style="border:1px dotted gray; border-radius:50%;">' .. text .. "</span>"
	end
	
	if dev then
		for position in mw.text.gsplit(dev, ",") do
			position = tonumber(position)
			kanas[position] = kana_devoice(kanas[position])
		end
	end
	
	romaji_text = gsub(text, "([おこそとのほもよろをごぞどぼぽょぉオコソトノホモヨロヲゴゾドボポョォ])ー", "%1お")
	romaji_text = gsub(romaji_text, "([えけせてねへめれゑげぜでべぺぇエケセテネヘメレヱゲゼデベペェ])ー", "%1え")
	romaji_text = gsub(romaji_text, "([うくすつぬふむゆるぐずづぶぷゅうウクスツヌフムユルグズヅブプュゥゔヴ])ー", "%1う")
	romaji_text = gsub(romaji_text, "([いきしちにひみりゐぎじぢびぴぃイキシチニヒミリヰギジヂビピィ])ー", "%1い")
	romaji_text = gsub(romaji_text, "([あかさたなはまやらわんがざだばぱゃぁアカサタナハマヤラワンガザダバパャァ])ー", "%1あ")
	
	local romajis = mw.text.split(romaji_text, "")
	
	local function count_nspaces(text, index)
		local i, sample, nspaces = 0, "", 0
		while len(sample) < index do
			i = i + 1
			sample, nspaces = gsub(sub(text, 1, i), " ", "")
		end
		return nspaces
	end
	
	local function romaji_devoice(text)
		-- use @ instead of  ̥
		return text .. "@"
	end
	
	if dev then
		for position in mw.text.gsplit(dev,",") do
			position = position_mora_space[tonumber(position)]
			romajis[position] = romaji_devoice(romajis[position])
		end
	end
	
	if acc_type == "n" then
		r_start_index = start_index + count_nspaces(romaji_text, start_index)
		local r_index = position_mora_space[acc_number]
		local k_index = acc_number
		
		r_parts = {
			[1] = table.concat(romajis, "", 1, r_start_index),
			[2] = table.concat(romajis, "", r_start_index + 1, r_index),
			[3] = table.concat(romajis, "", r_index + 1, #romajis)
		}
		
		k_parts = {
			[1] = table.concat(kanas, "", 1, 1),
			[2] = table.concat(kanas, "", 2, k_index),
			[3] = table.concat(kanas, "", k_index + 1, #kanas)
		}
		
		local space2 = ""
		local space3 = ""
		if sub(r_parts[2], 1, 1) == " " then
			space2 = " "
		end
		if sub(r_parts[3], 1, 1) == " " then
			space3 = " "
		end
		
		result = start .. 
			k_parts[1] .. 
			down_first .. 
			k_parts[2] .. 
			down_last .. 
			k_parts[3] .. 
			last .. 
			romaji_start .. 
			export.rise_and_fall(r_parts[1], "fall") .. 
			space2 ..
			export.rise_and_fall(r_parts[2], "rise") .. 
			"ꜜ" .. 
			space3 ..
			export.rise_and_fall(r_parts[3], "fall") .. 
			romaji_last .. 
			"([[中高型|Nakadaka]] – [" .. acc_number .. "])"
		
	else
		r_start_index = start_index + count_nspaces(romaji_text, start_index)
		r_parts = {
			[1] = table.concat(romajis, "", 1, r_start_index),
			[2] = table.concat(romajis, "", r_start_index + 1, #romajis)
		}
		
		k_parts = {
			[1] = table.concat(kanas, "", 1, 1),
			[2] = table.concat(kanas, "", 2, #kanas)
		}
		
		local space2 = ""
		if sub(r_parts[2], 1, 1) == " " then
			space2 = " "
		end
			
		if acc_type == "h" then
			result = start .. 
				k_parts[1] .. 
				high_first .. 
				k_parts[2] .. 
				last .. 
				last .. 
				romaji_start .. 
				export.rise_and_fall(r_parts[1], "fall") .. 
				space2 ..
				export.rise_and_fall(r_parts[2], "rise") .. 
				romaji_last .. 
				"([[平板型|Heiban]] – [" .. acc_number .. "])"
				
		elseif acc_type == "a" then
			result = start .. 
				down_first .. 
				k_parts[1] .. 
				down_last .. 
				k_parts[2] .. 
				last .. 
				romaji_start .. 
				export.rise_and_fall(r_parts[1], "rise") .. 
				"ꜜ" .. 
				space2 ..
				export.rise_and_fall(r_parts[2], "fall") .. 
				romaji_last .. 
				"([[頭高型|Atamadaka]] – [" .. acc_number .. "])"
				
		elseif acc_type == "o" then
			result = start .. 
				k_parts[1] .. 
				down_first .. 
				k_parts[2] .. 
				down_last .. 
				last .. 
				romaji_start .. 
				export.rise_and_fall(r_parts[1], "fall") .. 
				space2 ..
				export.rise_and_fall(r_parts[2], "rise") .. 
				"ꜜ" .. 
				romaji_last .. 
				"([[尾高型|Odaka]] – [" .. acc_number .. "])"
				
		else
			return error("Accent type not recognised.")
		end
		
	end
	
	result = gsub(result, "(.)@", "<del>%1</del>")
	
	return result
end

return export