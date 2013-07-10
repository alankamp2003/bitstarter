#!/usr/bin/env node
var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var sys = require('util');
var rest = require('restler');
var TEMP_FILE = "temp.html";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if (!fs.existsSync(instr)) {
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1);
    }
    return instr;
};

var assertURLExists = function(url, checks) {
    var instr = url.toString();
    rest.get(instr).on('complete', function(result) { 
	if (result instanceof Error) {
	    console.log("%s does not exists. Exiting.", instr);
	    process.exit(1);
	} else {
	    fs.writeFileSync(TEMP_FILE, result);
	    showOutput(TEMP_FILE, checks);
	}
    }); 
};

var showOutput = function (file, checks) {
    var checkJson = checkHtmlFile(file, checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for (var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    return fn.bind({});
}

if (require.main == module) {
    program 
         .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
         .option('-f, --file <html_file>', 'Path to index.html',clone(assertFileExists), HTMLFILE_DEFAULT)
         .option('-u, --url <url>', 'Path to url') 
         .parse(process.argv);   
    if (program.url == undefined) {
	showOutput(program.file, program.checks);
        //var checkJson = checkHtmlFile(program.file, program.checks);
	//var outJson = JSON.stringify(checkJson, null, 4);
	//console.log(outJson);
    } else {
	assertURLExists(program.url, program.checks);
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
