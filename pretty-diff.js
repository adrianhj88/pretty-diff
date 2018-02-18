#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var open = require("open");
var diff = require("./diff");
var argv = require('minimist')(process.argv.slice(2));
var cmd = require('node-cmd');

cmd.get("git pull", function(error) {
    if (error) {
        console.log('error', error)
    }
});

var payload = JSON.parse(argv._);

diff(payload.changes[0].fromHash + " " + payload.changes[0].toHash, function(error, parsedDiff) {
    if (error) {
        console.log('error', error)
        return;
    }

    if (!parsedDiff) {
        console.log("No differences");
        return;
    }

    var mail = argv["mail"];
    if (mail === undefined) {
        process.stderr.write("Missing parameter --mail or -m\n");
        return;
    }

    var title = payload.actor.displayName;

    generatePrettyDiff(mail, title, parsedDiff);
});

function generatePrettyDiff(mail, title, parsedDiff) {
    var template = fs.readFileSync(__dirname + "/template.html", "utf8");
    var diffHtml = "<h1>Files changed:</h1>\n";

    diffHtml += "<ul>\n";
    for (var file in parsedDiff) {
        diffHtml += "<li><a href='#" + file + "'>" + file + "</a></li>\n";
    }
    diffHtml += "</ul>\n";

    for (var file in parsedDiff) {
        diffHtml += "<h2 id='" + file + "'>" + file + "</h2>" +
            "<div class='file-diff'><div>" + markUpDiff(parsedDiff[file]) + "</div></div>";
    }

    template = template.replace(/{{mail}}/g, mail);
    template = template.replace(/{{title}}/g, title);
    template = template.replace(/{{diff}}/, diffHtml);

    process.stdout.write(template);
}

var markUpDiff = function() {
    var diffClasses = {
        "d": "file",
        "i": "file",
        "@": "info",
        "-": "delete",
        "+": "insert",
        " ": "context"
    };

    function escape(str) {
        return str
            .replace(/\$/g, "$$$$")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\t/g, "    ");
    }

    return function(diff) {
        return diff.map(function(line) {
            var type = line.charAt(0);
            return "<pre class='" + diffClasses[type] + "'>" + escape(line) + "</pre>";
        }).join("\n");
    };
}();
