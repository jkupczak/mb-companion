console.warn("[medbridge-home-extension] loaded /js/medbridge/medbridge-blog.js");
//////////////////////////////////////////////////////////////////////////////////

// Only run script if the referrer is empty.
// Clicking from newsletters where target="_blank" is set will result in an empty referrer.

function getAuthorType() {

  if ( elExists(document.querySelector(".author-image a")) ) {
    var authorLink = document.querySelector(".author-image a").getAttribute("href");
    var authorType = "pearl";

    if ( !/medbridgeed(ucation)?\.com\/about\//gi.test(authorLink) ) {
      // console.log("Blog!");
      authorType = "blog";
    } else {
      // console.log("Pearl!")
      authorType = "pearl";
    }
  } else {
    var authorType = "blog";
  }

  return authorType;
}

function getModeNumber() {
  var modNumber = getParameterByName("utm_content");

  if ( modNumber && modNumber !== "" ) {
    modNumber = modNumber.replace(/mod/gi, "");
    modNumber = modNumber.replace(/\-.+/gi, "");

    if ( modNumber.length = 1 ) {
      return modNumber
    } else {
      return "1";
    }
  }
}


if ( getParameterByName("blog-check") ) {

  console.groupCollapsed("Blog Article Check (medbridge-blog.js)");

  // if ( document.referrer === "" ) {

    if ( /blog\-check\=\d/.test(document.URL) ) {
      console.warn("Found blog-check= parameter in querystring, continue processing.");


      console.log("document.referrer === \"\" [true] - " + document.referrer);
      console.log("document.URL: " + document.URL);

      var actualUrl = document.URL.replace(/^.+?\/blog/gi, "/blog");
          actualUrl = actualUrl.replace(/\?.+/gi, "");
          actualUrl = actualUrl.replace(/\/$/gi, "");

      var iframeNumber = document.URL.replace(/^.+?blog\-check\=/gi, "");
      console.log("iframeNumber: " + iframeNumber);

      var protectedStatus = document.querySelector(".post-title a").textContent.trim();
      console.log("protectedStatus: " + protectedStatus);

      if ( /^Protected\:/gi.test(protectedStatus) ) {
        console.log("Protected!");
        var protectedStatus = "protected";
      } else {
        console.log("Not protected!")
        var protectedStatus = "published";
      }

      var authorType = getAuthorType();

      console.log("authorType: " + authorType);

    	chrome.runtime.sendMessage({greeting: "blogStatus|" + actualUrl + "|" + protectedStatus + "|" + authorType + "|" + iframeNumber}, function(response) { });

    } else {
      console.error("Error: blog-check= querystring parameter was not found. This link was likely redirected and needs to be fixed.");
      chrome.runtime.sendMessage({greeting: "blogStatus|error"}, function(response) { });
    }

  // } else {
  //   console.log("document.referrer === \"\" [false] - " + document.referrer);
  // }

  console.groupEnd();
}


////////////////////////
////////////////////////
////                ////
////                ////
////   PROTECTED!   ////
////                ////
////                ////
////////////////////////
////////////////////////

var isProtected = document.querySelector(".post-title a").getAttribute("title");

if ( /^Protected:/.test(isProtected) ) {
  isProtected = true;
  document.body.classList.add("post-protected");
}

////////////////////////
////////////////////////
////                ////
////                ////
////    Help Bar    ////
////                ////
////                ////
////////////////////////
////////////////////////

// if ( /\/blog\//gi.test(document.URL) ) {

  console.log("We're on an article page, activate blog ID copy button.");

  var helpBar = document.createElement("div");
  helpBar.className = "jk-helpBar"

  var copyIdBtn = document.createElement("div");
  copyIdBtn.innerHTML = "Copy Blog ID";
  createCopyBtn(copyIdBtn, document.querySelector("link[rel='shortlink']").href.replace(/^.+?p=/gi,""));
  copyIdBtn.className = "copy blog-id"

  // helpBar.innerHTML = "<div class='copy blog-id'>Copy Blog ID</div>"
  helpBar.appendChild(copyIdBtn);
  document.body.appendChild(helpBar);

  // Set Links
  // var shortLink = document.querySelector("link[rel='shortlink']").href;

  // document.querySelector("#jk-blog-id").value = shortLink.replace(/^.+?p=/gi,"");

  //
  // document.querySelector(".jk-helpBar .copy.blog-id").addEventListener("click", copyBlogId, false);

  // function copyBlogId() {
  //   copyToClipboard(document.querySelector(".jk-helpBar #jk-blog-id"));
  // }


// } else {
//   console.log("This isn't an article page!");
// }