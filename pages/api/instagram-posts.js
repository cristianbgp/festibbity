export default async (req, res) => {
  const result = await fetch(
    `https://www.instagram.com/graphql/query/?query_hash=15bf78a4ad24e33cbd838fdb31353ac1&variables={"id":"32191791554","first":12}`
  );
  const data = await result.json();
  const instagramData = data.data.user.edge_owner_to_timeline_media.edges.map(
    (element) => ({ id:element.node.id ,displayUrl: element.node.display_url })
  );
  res.statusCode = 200;
  res.json(instagramData);
};
