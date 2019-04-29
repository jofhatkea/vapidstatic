var request = require("request");
var cheerio = require("cheerio");
const fs = require("fs");

const path = require("path");

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
}
function saveFile(name, data) {
  fs.writeFile(name, data, function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
}

function fetchFile(path) {
  request(
    {
      uri: "http://localhost:3000/" + path
    },
    function(error, response, body) {
      var $ = cheerio.load(body);
      saveFile("static/" + path, body);
      console.log(body);
      $("script").each(function() {
        const src = $(this).attr("src");
        if (src.startsWith("/javascripts")) {
          //TODO copy to static
        } else {
          //remove script from output
        }
      });
      $("a").each(function() {
        const link = $(this).attr("href");
        //console.log(link);
        if (
          !link.startsWith("http") &&
          !link.startsWith("/dashboard") &&
          link !== "/"
        ) {
          if (!pages.has(link)) {
            //console.log("fetching", link);
            fetchFile(link);
          }
          pages.add(link);
        }
      });
      //console.log(pages);
    }
  );
}
var pages = new Set(["index.html"]);

clean("static");
clean("static/stylesheets");
clean("static/javascripts");
pages.forEach(p => {
  fetchFile(p);
});
