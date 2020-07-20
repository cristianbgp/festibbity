// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { scrapeUserPage } from "instagram-scraping";

export default async (req, res) => {
  const result = await scrapeUserPage("festibbity");
  res.statusCode = 200;
  res.json(result);
};
