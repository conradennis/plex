/**
 * Often times, we generate a filename by creating an array of each part of the
 * path for the filename and then we need to clean it up using this function.
 *
 * Here, `formatFilename` gets rid of false-y values and normalizes each part
 * of the path before joining them with the '/' separator.
 */
const formatFilename = array =>
  array
    .filter(Boolean)
    .map(string => string.toLowerCase())
    .join('/');

exports.formatFilename = formatFilename;

/**
 * `createFontFace` is used to generate the actual `@font-face` declarations
 * that get written to the appropriate files.
 */
const createFontFace = (filename, family, weight, unicode = {}) => {
  const fontFileName = [
    `IBMPlex${family.type.split(' ').join('')}`,
    weight.variant ? weight.type + weight.variant : weight.type,
    unicode.type,
  ]
    .filter(Boolean)
    .join('-');
  const localFileName = [
    `IBM Plex ${family.type}`,
    weight.type !== 'Regular' &&
      (weight.variant ? `${weight.type} ${weight.variant}` : weight.type),
  ]
    .filter(Boolean)
    .join(' ');
  const localPostscriptName = [
    `IBMPlex${family.type.split(' ').join('')}`,
    weight.type !== 'Regular' &&
      (weight.variant ? `-${weight.type}${weight.variant}` : `-${weight.type}`),
  ]
    .filter(Boolean)
    .join('');

  const local = `local('${localFileName}'),
    local('${localPostscriptName}')`;

  const urls = {
    woff: `#{$font-prefix}/IBM-Plex-${family.type
      .split(' ')
      .join('-')}/fonts/complete/woff/${fontFileName}.woff`,
    woff2Split: `#{$font-prefix}/IBM-Plex-${family.type
      .split(' ')
      .join('-')}/fonts/split/woff2/${fontFileName}.woff2`,
    woff2Complete: `#{$font-prefix}/IBM-Plex-${family.type
      .split(' ')
      .join('-')}/fonts/complete/woff2/${fontFileName}.woff2`,
  };

  const src = unicode.characters
    ? `src: ${local},
    url('${urls.woff2Split}') format('woff2');
    unicode-range: ${unicode.characters.join(', ')};`
    : `src: ${local},
    url('${urls.woff2Complete}') format('woff2'),
    url('${urls.woff}') format('woff');`;

  return `@font-face {
  font-family: '${family.name}';
  font-style: ${weight.properties.fontStyle};
  font-weight: ${weight.properties.fontWeight};
  ${src}
}
`;
};

exports.createFontFace = createFontFace;
