/**
 *	The MIT License (MIT)
 *
 *	Copyright (c) 2015 Toni Sučić
 *
 *	Permission is hereby granted, free of charge, to any person obtaining a copy
 *	of this software and associated documentation files (the "Software"), to deal
 *	in the Software without restriction, including without limitation the rights
 *	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *	copies of the Software, and to permit persons to whom the Software is
 *	furnished to do so, subject to the following conditions:
 *
 *	The above copyright notice and this permission notice shall be included in
 *	all copies or substantial portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *	THE SOFTWARE.
 */

/**
 * (https://github.com/ts95/lang-detector/blob/master/index.js)
 * 
 * A checker is an object with the following form:
 *  { pattern: /something/, points: 1 }
 * or if the pattern only matches code near the top of a given file:
 *  { pattern: /something/, points: 2, nearTop: true }
 * 
 * Key: Language name.
 * Value: Array of checkers.
 * 
 * N.B. An array of checkers shouldn't contain more regexes than
 * necessary as it would inhibit performance.
 *
 * Points scale:
 *  2 = Bonus points:   Almost unique to a given language.
 *  1 = Regular point:  Not unique to a given language.
 * -1 = Penalty point:  Does not match a given language.
 * Rare:
 * -50 = Bonus penalty points: Only used when two languages are mixed together,
 *  and one has a higher precedence over the other one.
 */
var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)};$jscomp.getGlobal=function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global&&null!=global?global:a};$jscomp.global=$jscomp.getGlobal(this);$jscomp.SYMBOL_PREFIX="jscomp_symbol_";
$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};$jscomp.Symbol=function(){var a=0;return function(b){return $jscomp.SYMBOL_PREFIX+(b||"")+a++}}();
$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var a=$jscomp.global.Symbol.iterator;a||(a=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&$jscomp.defineProperty(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return $jscomp.arrayIterator(this)}});$jscomp.initSymbolIterator=function(){}};$jscomp.arrayIterator=function(a){var b=0;return $jscomp.iteratorPrototype(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})};
$jscomp.iteratorPrototype=function(a){$jscomp.initSymbolIterator();a={next:a};a[$jscomp.global.Symbol.iterator]=function(){return this};return a};$jscomp.makeIterator=function(a){$jscomp.initSymbolIterator();var b=a[Symbol.iterator];return b?b.call(a):$jscomp.arrayIterator(a)};
var languages={"text/javascript":[{pattern:/undefined/g,points:2},{pattern:/console\.log( )*\(/,points:2},{pattern:/(var|const|let)( )+\w+( )*=?/,points:2},{pattern:/(('|").+('|")( )*|\w+):( )*[{\[]/,points:2},{pattern:/===/g,points:1},{pattern:/!==/g,points:1},{pattern:/function\*?(( )+[\$\w]+( )*\(.*\)|( )*\(.*\))/g,points:1},{pattern:/null/g,points:1},{pattern:/\(.*\)( )*=>( )*.+/,points:1},{pattern:/(else )?if( )+\(.+\)/,points:1},{pattern:/while( )+\(.+\)/,points:1},{pattern:/(^|\s)(char|long|int|float|double)( )+\w+( )*=?/,
points:-1},{pattern:/(\w+)( )*\*( )*\w+/,points:-1},{pattern:/<(\/)?script( type=('|")text\/javascript('|"))?>/,points:-50}],"text/x-c":[{pattern:/(char|long|int|float|double)( )+\w+( )*=?/,points:2},{pattern:/malloc\(.+\)/,points:2},{pattern:/#include (<|")\w+\.h(>|")/,points:2,nearTop:!0},{pattern:/(\w+)( )*\*( )*\w+/,points:2},{pattern:/(\w+)( )+\w+(;|( )*=)/,points:1},{pattern:/(\w+)( )+\w+\[.+\]/,points:1},{pattern:/#define( )+.+/,points:1},{pattern:/NULL/,points:1},{pattern:/void/g,points:1},
{pattern:/(else )?if( )*\(.+\)/,points:1},{pattern:/while( )+\(.+\)/,points:1},{pattern:/(printf|puts)( )*\(.+\)/,points:1},{pattern:/new \w+/,points:-1},{pattern:/new [A-Z]\w*( )*\(.+\)/,points:2},{pattern:/'.{2,}'/,points:-1},{pattern:/var( )+\w+( )*=?/,points:-1}],"text/x-c++":[{pattern:/(char|long|int|float|double)( )+\w+( )*=?/,points:2},{pattern:/#include( )*(<|")\w+(\.h)?(>|")/,points:2,nearTop:!0},{pattern:/using( )+namespace( )+.+( )*;/,points:2},{pattern:/template( )*<.*>/,points:2},{pattern:/std::\w+/g,
points:2},{pattern:/(cout|cin|endl)/g,points:2},{pattern:/(public|protected|private):/,points:2},{pattern:/nullptr/,points:2},{pattern:/new \w+(\(.*\))?/,points:1},{pattern:/#define( )+.+/,points:1},{pattern:/\w+<\w+>/,points:1},{pattern:/class( )+\w+/,points:1},{pattern:/void/g,points:1},{pattern:/(else )?if( )*\(.+\)/,points:1},{pattern:/while( )+\(.+\)/,points:1},{pattern:/\w*::\w+/,points:1},{pattern:/'.{2,}'/,points:-1},{pattern:/(List<\w+>|ArrayList<\w*>( )*\(.*\))(( )+[\w]+|;)/,points:-1}],
"text/x-python":[{pattern:/def( )+\w+\(.*\)( )*:/,points:2},{pattern:/while (.+):/,points:2},{pattern:/from [\w\.]+ import (\w+|\*)/,points:2},{pattern:/class( )*\w+(\(( )*\w+( )*\))?( )*:/,points:2},{pattern:/if( )+(.+)( )*:/,points:2},{pattern:/elif( )+(.+)( )*:/,points:2},{pattern:/else:/,points:2},{pattern:/for (\w+|\(?\w+,( )*\w+\)?) in (.+):/,points:2},{pattern:/\w+( )*=( )*\w+(?!;)(\n|$)/,points:1},{pattern:/import ([[^\.]\w])+/,points:1,nearTop:!0},{pattern:/print((( )*\(.+\))|( )+.+)/,points:1},
{pattern:/(&{2}|\|{2})/,points:-1}],"text/x-java":[{pattern:/System\.(in|out)\.\w+/,points:2},{pattern:/(private|protected|public)( )*\w+( )*\w+(( )*=( )*[\w])?/,points:2},{pattern:/(private|protected|public)( )*\w+( )*[\w]+\(.+\)/,points:2},{pattern:/(^|\s)(String)( )+[\w]+( )*=?/,points:2},{pattern:/(List<\w+>|ArrayList<\w*>( )*\(.*\))(( )+[\w]+|;)/,points:2},{pattern:/(public( )*)?class( )*\w+/,points:2},{pattern:/(\w+)(\[( )*\])+( )+\w+/,points:2},{pattern:/final( )*\w+/,points:2},{pattern:/\w+\.(get|set)\(.+\)/,
points:2},{pattern:/new [A-Z]\w*( )*\(.+\)/,points:2},{pattern:/(^|\s)(char|long|int|float|double)( )+[\w]+( )*=?/,points:1},{pattern:/(extends|implements)/,points:2,nearTop:!0},{pattern:/null/g,points:1},{pattern:/(else )?if( )*\(.+\)/,points:1},{pattern:/while( )+\(.+\)/,points:1},{pattern:/void/g,points:1},{pattern:/const( )*\w+/,points:-1},{pattern:/(\w+)( )*\*( )*\w+/,points:-1},{pattern:/'.{2,}'/,points:-1},{pattern:/#include( )*(<|")\w+(\.h)?(>|")/,points:-1,nearTop:!0}],"text/html":[{pattern:/<!DOCTYPE (html|HTML PUBLIC .+)>/,
points:2,nearTop:!0},{pattern:/<[a-z0-9]+(( )*[\w]+=('|").+('|")( )*)?>.*<\/[a-z0-9]+>/g,points:2},{pattern:/[a-z\-]+=("|').+("|')/g,points:2},{pattern:/<\?php/,points:-50}],"text/css":[{pattern:/[a-z\-]+:(?!:).+;/,points:2},{pattern:/<(\/)?style>/,points:-50}],"text/x-ruby":[{pattern:/(require|include)( )+'\w+(\.rb)?'/,points:2,nearTop:!0},{pattern:/def( )+\w+( )*(\(.+\))?( )*\n/,points:2},{pattern:/@\w+/,points:2},{pattern:/\.\w+\?/,points:2},{pattern:/puts( )+("|').+("|')/,points:2},{pattern:/class [A-Z]\w*( )*<( )*([A-Z]\w*(::)?)+/,
points:2},{pattern:/attr_accessor( )+(:\w+(,( )*)?)+/,points:2},{pattern:/\w+\.new( )+/,points:2},{pattern:/elsif/,points:2},{pattern:/do( )*\|(\w+(,( )*\w+)?)+\|/,points:2},{pattern:/for (\w+|\(?\w+,( )*\w+\)?) in (.+)/,points:1},{pattern:/nil/,points:1},{pattern:/[A-Z]\w*::[A-Z]\w*/,points:1}],"text/x-go":[{pattern:/package( )+[a-z]+\n/,points:2,nearTop:!0},{pattern:/(import( )*\(( )*\n)|(import( )+"[a-z0-9\/\.]+")/,points:2,nearTop:!0},{pattern:/if.+err( )*!=( )*nil.+{/,points:2},{pattern:/fmt\.Print(f|ln)?\(.*\)/,
points:2},{pattern:/func(( )+\w+( )*)?\(.*\).*{/,points:2},{pattern:/\w+( )*:=( )*.+[^;\n]/,points:2},{pattern:/(}( )*else( )*)?if[^\(\)]+{/,points:2},{pattern:/(var|const)( )+\w+( )+[\w\*]+(\n|( )*=|$)/,points:2},{pattern:/[a-z]+\.[A-Z]\w*/,points:1},{pattern:/nil/,points:1},{pattern:/'.{2,}'/,points:-1}],"text/x-php":[{pattern:/<\?php/,points:2},{pattern:/\$\w+/,points:2},{pattern:/use( )+\w+(\\\w+)+( )*;/,points:2,nearTop:!0},{pattern:/\$\w+\->\w+/,points:2},{pattern:/(require|include)(_once)?( )*\(?( )*('|").+\.php('|")( )*\)?( )*;/,
points:2},{pattern:/echo( )+('|").+('|")( )*;/,points:1},{pattern:/NULL/,points:1},{pattern:/new( )+((\\\w+)+|\w+)(\(.*\))?/,points:1},{pattern:/function(( )+[\$\w]+\(.*\)|( )*\(.*\))/g,points:1},{pattern:/(else)?if( )+\(.+\)/,points:1},{pattern:/\w+::\w+/,points:1},{pattern:/===/g,points:1},{pattern:/!==/g,points:1},{pattern:/(^|\s)(var|char|long|int|float|double)( )+\w+( )*=?/,points:-1}],"text/plain":[]};
function getPoints(a,b,c){return _.reduce(_.map(c,function(a){return a.pattern.test(b)?a.points:0}),function(a,b){return a+b},0)}
function detectLang(a,b){var c=_.defaults(b||{},{heuristic:!0,statistics:!1}),d=a.replace(/\r\n?/g,"\n").replace(/\n{2,}/g,"\n").split("\n");c.heuristic&&500<d.length&&(d=d.filter(function(a,b){return 10>=d.length||b<d.length/10?!0:0===b%Math.ceil(d.length/500)}));var g=_.keys(languages).map(function(a){return{language:a,checkers:languages[a]}}),f=_.map(g,function(a){var b=a.language,c=a.checkers;if("Unknown"===b)return{language:"Unknown",points:1};a=d.map(function(a,e){return 10>=d.length||e<d.length/
10?getPoints(b,a,c):getPoints(b,a,_.reject(c,function(a){return a.nearTop}))});a=_.reduce(a,function(a,b){return a+b});return{language:b,points:a}});g=_.max(f,function(a){return a.points});if(c.statistics){c={};f=$jscomp.makeIterator(f);for(var e=f.next();!e.done;e=f.next())e=e.value,c[e.language]=e.points;return{detected:g.language,statistics:c}}return g.language};