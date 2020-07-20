import Head from "next/head";
import useSWR from "swr";
import { SSRSuspense } from "../components/ssr-suspense";

async function fetcher(url) {
  const res = await fetch(url);
  return await res.json();
}

function Gallery() {
  const { data } = useSWR("api/instagram-posts", fetcher, { suspense: true });

  return (
    <div className="gallery">
      {data.medias.map((post) => (
        <Post post={post} key={post.media_id} />
      ))}
      <style jsx>{`
        .gallery {
          max-width: 600px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
        }
      `}</style>
    </div>
  );
}

function Post({ post }) {
  return <img src={post.thumbnail} style={{ height: 200, width: 200 }} />;
}

export default function Home() {
  return (
    <div>
      <Head>
        <title>Festibbity</title>
        <link rel="icon" href="/favicon.ico" />
        <style>{`
          body {
            margin: 0;
          }
        `}</style>
      </Head>

      <main>
        <SSRSuspense fallback={<p>Loading...</p>}>
          <Gallery />
        </SSRSuspense>
      </main>
      <style jsx>
        {`
          main {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}
      </style>
    </div>
  );
}
