var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
var path = require("path");

function templateMain(title, list, body, control) {
  return `<!DOCTYPE html>
  <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
    </body>
  </html>
  `;
}
function templateList(filelist) {
  var list = "<ul>";
  var i = 0;
  while (i < filelist.length) {
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li> `;
    i += 1;
  }
  list += "</ul>";
  return list;
}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./file", function (error, filelist) {
        var title = "Main";
        var description = "메인페이지입니다.";
        // console.log(filelist);
        var list = templateList(filelist);
        var template = templateMain(
          title,
          list,
          `<a href="/create">Create</a>
          <h2>${title}</h2>
          ${description}`,
          ""
        );
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir("./file", function (error, filelist) {
        fs.readFile(
          `file/${queryData.id}`,
          "utf-8",
          function (error, description) {
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateMain(
              title,
              list,
              `<h2>${title}</h2>${description}`,
              `<a href="/create">Create</a><br>
              <a href="/update">Update</a><br>
              <a href="/delete">Delete</a>`
            );
            response.writeHead(200);
            response.end(template);
          }
        );
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./file", function (error, filelist) {
      var title = queryData.id;
      var list = templateList(filelist);
      var template = templateMain(
        title,
        list,
        `
        <h2>Create File</h2>
        <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="제목을 입력하세요"></p>
        <p>
          <textarea name="description" placeholder="내용을 입력하세요"></textarea>
        </p>
        <p><input type="submit" value="입력"></p>
        </form>
        `,
        `
        <a href="/create">Create</a><br>
        <a href="/update">Update</a><br>
        <a href="/delete">Delete</a>`
      );
      response.writeHead(200);
      response.end(template);
    });
    console.log("create성공");
  } else if (pathname === "/create_process") {
    var body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;

      fs.writeFile(`file/${title}`, description, "utf-8", function (error) {
        response.writeHead(302, { location: `/?id=${title}` });
        response.end("create success!");
      });
    });
  } else if (pathname === "/update") {
    fs.readdir("./file", function (error, filelist) {
      fs.readFile(
        `file/${queryData.id}`,
        "utf-8",
        function (error, description) {
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateMain(
            title,
            list,
            `
            <h2>Update File</h2>
            <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="내용을 입력하세요">${description}</textarea>
            </p>
            <p><input type="submit" value="수정"></p>
            </form>
            `,
            `
            <a href="/create">Create</a><br>
            <a href="/update?id=${title}">Update</a><br>
            <a href="/delete">Delete</a>`
          );
          response.writeHead(200);
          response.end(template);
        }
      );
    });
    console.log("update 성공");
  } else if (pathname === "/update_process") {
    var body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`file/${id}`, `file/${title}`, function (error) {
        fs.writeFile(`file/${title}`, description, "utf-8", function (error) {
          response.writeHead(302, { location: `/?id=${title}` });
          response.end("create success!");
        });
      });
    });
  } else {
    response.writeHead(404);
    response.end("ERROR");
  }
});
app.listen(3001);
