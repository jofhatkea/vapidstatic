var request = require("request");
var cheerio = require("cheerio");
const fs = require("fs");

const path = require("path");

var ncp = require("ncp").ncp;

function copyAssets() {
  ncp("www/images", "static/images", function(err) {
    if (err) {
      return console.error(err);
    }
    console.log("Copied Assets!");
  });
  ncp("data/uploads", "static/uploads", function(err) {
    if (err) {
      return console.error(err);
    }
    console.log("Copied Assets!");
  });
}
function clean(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      //console.log(file.stat().isDirectory());
      fs.lstat(path.join(directory, file), (err, stats) => {
        if (!stats.isDirectory()) {
          fs.unlink(path.join(directory, file), err => {
            if (err) throw err;
          });
        }
      });
    }
  });
  console.log("cleaned", directory);
}
function saveFile(name, data) {
  fs.writeFile(name, data, function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file ", name, "was saved!");
  });
}

function parseHTML(path, body) {
  var $ = cheerio.load(body);

  $("a").each(function() {
    const link = $(this).attr("href");
    if (
      !link.startsWith("http") &&
      !link.startsWith("/dashboard") &&
      link !== "/"
    ) {
      if (!pages.has(link)) {
        fetchFile(link);
      }
      pages.add(link);
    }
  });
  $("img").each(function() {
    const src = $(this).attr("src");
    if (src.startsWith("/")) {
      $(this).attr(
        "src",
        $(this)
          .attr("src")
          .split("/")
          .slice(1)
          .join("/")
      );
    }
  });
  $("script").each(function() {
    const link = $(this).attr("src");
    if (link.startsWith("/dashboard")) {
      $("body script[src='" + link + "']").remove();
    } else if (!pages.has(link)) {
      fetchFile(link);
    }
    pages.add(link);
  });
  $("link").each(function() {
    const link = $(this).attr("href");
    if (!pages.has(link)) {
      fetchFile(link);
    }
    pages.add(link);
  });

  saveFile("static/" + path, $.html());
}
function fetchFile(path) {
  request(
    {
      uri: "http://localhost:3000/" + path
    },
    function(error, response, body) {
      if (path.endsWith(".html")) {
        parseHTML(path, body);
      } else if (path.endsWith(".js")) {
        //TODO, tror ikke den er brugt
        saveFile("static/" + path, body);
      } else if (path.endsWith(".css")) {
        //TODO, tror ikke den er brugt
        saveFile("static/" + path, body);
      }
    }
  );
}

const pages = new Set(["index.html"]);

clean("static");
clean("static/stylesheets");
clean("static/javascripts");
clean("static/images");
copyAssets();

pages.forEach(p => {
  fetchFile(p);
});
//JS IS bundled
//TODO, js is not minified, and possibly not transpiled?
