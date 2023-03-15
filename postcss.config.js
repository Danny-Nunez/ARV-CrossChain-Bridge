const tailwind  = require('tailwindcss')
const autoprefixer  = require('autoprefixer')
const postcss_import  = require('postcss-import')

const purgecss = require('@fullhuman/postcss-purgecss')({
    // Specify the paths to all of the template files in your project 
    content: [ './public/**/*.html', './src/**/*.vue' ],

    css: ['./index.css'],

    // Include any special characters you're using in this regular expression
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
})


module.exports = {
    plugins: [
      tailwind,
      autoprefixer,
      postcss_import,
      purgecss

]
}