'use strict';

const acento = '[áéíóúâêôãõüöäëï]';
const vogal = '[áéíóúâêôãõàèaeiouüöäëï]';
const consoante = '[bcçdfghjklmñnpqrstvwyxz]';

const syl = {
  20: " -.!?:;",
  10: "bçdfgjkpqtv",
  8: "sc",
  7: "m",
  6: "lzx",
  5: "nr",
  4: "h",
  3: "wy",
  2: "eaoáéíóúôâêûàãõäëïöü",
  1: "iu",
  breakpair:
    "sl|sm|sn|sc|sr|rn|bc|lr|lz|bd|bj|bg|bq|bt|bv|pt|pc|dj|pç|ln|nr|mn|tp|bf|bp|xc|sç|ss|rr",
};

let spri = {};

Object.keys(syl)
  .filter(pri => pri.match(/\d/))
  .forEach(pri => {
    for (let x of syl[pri].split('')) {
      spri[x] = Number(pri);
    }
  });

const sylseppair = syl.breakpair.replace(/(\p{L})(\p{L})/gu, '(?<=($1))(?=($2))');

function syllable(word, opts = {}) {
  const sylSep = opts.sylSep || '|';
  let punctuation = {};
  word = word.replace(/(\p{P})/ug, (match, p1, offset) => {
    punctuation[offset] = p1;
    return '';
  });
  word = word
    .replace(new RegExp(sylseppair, 'g'), '|')
    .replace(/(\p{L})(?=(\p{L})(\p{L}))/ug, (m, m1, m2, m3) => (spri[m1.toLowerCase()] < spri[m2.toLowerCase()] && spri[m2.toLowerCase()] >= spri[m3.toLowerCase()]) ? m1 + '|' : m1)
    .replace(new RegExp('('+vogal+')('+consoante+')('+vogal+')', 'ig'), '$1|$2$3')
    .replace(/(de)(us)/ig, '$1|$2')
    .replace(/([a])(i[ru])$/i, '$1|$2')
    .replace(/(?<!^h)([ioeê])([e])/ig, '$1|$2')
    .replace(/([ioeêé])([ao])/ig, '$1|$2')
    .replace(/([^qg]u)(ai|ou|a)/i, '$1|$2')
    .replace(new RegExp('([^qgc]u)(i|ei|iu|ir|'+acento+'|e)', 'i'), '$1|$2')
    .replace(/([lpt]u)\|(i)(?=\|[ao])/ig, '$1$2')
    .replace(/([^q]u)(o)/i, '$1|$2')
    .replace(new RegExp('([aeio])('+acento+')', 'i'), '$1|$2')
    .replace(new RegExp('([íúô])('+vogal+')', 'i'), '$1|$2')
    .replace(/^a(o|e)/i, 'a|$1')
    .replace(/rein/ig, 're|in')
    .replace(/ae/ig, 'a|e')
    .replace(/ain/ig, 'a|in')
    .replace(/ao(?!s)/ig, 'a|o')
    .replace(/cue/ig, 'cu|e')
    .replace(/cui(?=\|[mnr])/ig, 'cu|i')
    .replace(/cui(?=\|da\|de$)/ig, 'cu|i')
    .replace(/coi(?=[mn])/ig, 'co|i')
    .replace(/cai(?=\|?[mnd])/ig, 'ca|i')
    .replace(new RegExp('ca\\|i(?=\\|?[m]'+acento+')', 'ig'), 'cai')
    .replace(/cu([áó])/ig, 'cu|$1')
    .replace(/ai(?=\|?[z])/ig, 'a|i')
    .replace(/i(u\|?)n/ig, 'i|$1n')
    .replace(/i(u\|?)r/ig, 'i|$1r')
    .replace(/i(u\|?)v/ig, 'i|$1v')
    .replace(/i(u\|?)l/ig, 'i|$1l')
    .replace(/ium/ig, 'i|um')
    .replace(/([ta])iu/ig, '$1i|u')
    .replace(/miu\|d/ig, 'mi|u|d')
    .replace(/au\|to(?=i)/ig, 'au|to|')
    .replace(new RegExp('(?<='+vogal+')i\\|nh(?=[ao])', 'ig'), '|i|nh')
    .replace(/oi([mn])/ig, 'o|i$1')
    .replace(/oi\|b/ig, 'o|i|b')
    .replace(/ois(?!$)/ig, 'o|is')
    .replace(new RegExp('o(i\\|?)s(?='+acento+')','ig'), 'o|$1s')
    .replace(/([dtm])aoi/ig, '$1a|o|i')
    .replace(/(?<=[trm])u\|i(?=\|?[tvb][oa])/ig, 'ui')
    .replace(/^gas\|tro(?!-)/ig, 'gas|tro|')
    .replace(/^fais/ig, 'fa|is')
    .replace(/^hie/ig, 'hi|e')
    .replace(/^ciu/ig, 'ci|u')
    .replace(/(?<=^al\|ca)\|i/ig, 'i')
    .replace(/(?<=^an\|ti)(p)\|?/ig, '|$1')
    .replace(/(?<=^an\|ti)(\-p)\|?/ig, '$1')
    .replace(/(?<=^neu\|ro)p\|/ig, '|p')
    .replace(/(?<=^pa\|ra)p\|/ig, '|p')
    .replace(/(?<=^ne\|)op\|/ig, 'o|p')
    .replace(/^re(?=[i]\|?[md])/ig, 're|')
    .replace(/^re(?=i\|n[ií]\|c)/ig, 're|')
    .replace(/^re(?=i\|nau\|g)/ig, 're|')
    .replace(/^re(?=[u]\|?[ntsr])/ig, 're|')
    .replace(new RegExp('^vi\\|de\\|o('+vogal+')', 'ig'), 'o|$1')
    .replace(/s\|s$/i, 'ss')
    .replace(/\|\|/g, '\|');
    return sylSep === '|' ? word : word.replace(/\|/g, sylSep);
}

module.exports = {
    syllable
  };
