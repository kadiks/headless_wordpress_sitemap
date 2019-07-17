const sm = require("sitemap");

const getAllUrls = require("./getAllUrls");

const getSitemap = async ({ destHost, sourceHost }) => {
  let urls = await getAllUrls({ baseUrl: sourceHost });
  const sitemap = sm.createSitemap({
    hostname: destHost,
    urls
  });
  return sitemap;
};

module.exports = getSitemap;
