const request = require("request-promise-native");
const qs = require("qs");
const _ = require("lodash");

const wpApiRoot = "/wp-json/wp/v2";

const getAllUrls = async ({ baseUrl, postMaxCount = 100 } = {}) => {
  // for simplicity sake, I only show how to load posts, but I would also load pages
  const posts = await getAllPosts({
    baseUrl,
    maxCount: postMaxCount
  });
  let urls = ["/"]; // The index page is not a post per say, so I include it by default

  // Array map on all posts and on each iteration, this will return an object with the absolute link coming from the source url. The source url has to be removed as the sitemap plugin requires the pathname without the hostname
  const postUrls = posts.map(p => ({ url: p.link.replace(baseUrl, "") }));
  urls = urls.concat(postUrls);
  return urls;
};

// Recursion FTW
// I don't know how many pages I have, so I call them until there's none
const getAllPosts = async ({
  baseUrl,
  posts = [],
  curPage = 1, // WP default
  maxCount = 10 // WP default
}) => {
  const curPosts = await getPosts({ baseUrl, count: maxCount, page: curPage });
  // Merge the batch with the master batch
  posts = posts.concat(curPosts);

  // if the response length is equal to the requested number of posts,
  // there's a good there are more post,
  // so we return and call the same function by incrementing the current page by 1
  if (curPosts.length === maxCount) {
    return await getAllPosts({
      baseUrl,
      posts,
      maxCount,
      curPage: curPage + 1
    });
  } else {
    // if the response length is inferior to the requested number of posts
    // it means there are no other posts
    // we can now return all the merged posts
    return posts;
  }
};

const getPosts = async ({ baseUrl, count = 10, page = 1 }) => {
  const query = {
    per_page: count,
    page,
    categories: 31
  };
  const urlParams = qs.stringify(query);
  const url = `${baseUrl}${wpApiRoot}/posts?${urlParams}`;
  // console.log("url", url); // love to have a log that shows me the actual URL to test in case it's been malformed
  const response = await request(url);

  const json = JSON.parse(response);
  // in case the page doesn't exist, I will get an error 400
  // so I catch it and send an empty array
  // so the calling function knows what to do with that
  if (_.get(json, "data.status") === 400) {
    return [];
  } else {
    return json;
  }
};

module.exports = getAllUrls;
