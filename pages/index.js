import { useRef } from "react";
import Head from "next/head";
import useSWR from "swr";
import { Button, Spacer, Card, Col, Text, Link } from "@zeit-ui/react";
import { Download } from "@zeit-ui/react-icons";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";

const IMAGE_SIZE = "calc(100vw / 3)";

async function fetcher(url) {
  const res = await fetch(url);
  return await res.json();
}

function Gallery({ posterContainer, instagramData }) {
  const { data } = useSWR("api/instagram-posts", fetcher, {
    initialData: instagramData,
  });

  return (
    <div className="gallery" ref={posterContainer}>
      {data.map((post) => (
        <Post post={post} key={post.id} />
      ))}
      <style jsx>{`
        .gallery {
          max-width: 600px;
          display: grid;
          grid-template-columns: repeat(3, ${IMAGE_SIZE});
        }
      `}</style>
    </div>
  );
}

function Post({ post }) {
  return (
    <img
      src={post.displayUrl}
      style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
    />
  );
}

export async function getServerSideProps() {
  const result = await fetch(
    `https://www.instagram.com/graphql/query/?query_hash=15bf78a4ad24e33cbd838fdb31353ac1&variables={"id":"32191791554","first":12}`
  );
  const data = await result.json();
  const instagramData = data.data.user.edge_owner_to_timeline_media.edges.map(
    (element) => ({ id: element.node.id, displayUrl: element.node.display_url })
  );
  return { props: { instagramData } };
}

export default function Home({ instagramData }) {
  const posterContainer = useRef(null);

  function handleDownload() {
    const scale =
      window.innerHeight > window.innerWidth
        ? 1440 / posterContainer.current.offsetWidth
        : 1920 / posterContainer.current.offsetHeight;

    domtoimage
      .toPng(posterContainer.current, {
        width: 1440,
        height: 1920,
        style: {
          width: "1440px",
          height: "1920px",
          transform: `scale(${scale})`,
          "transform-origin": "top left",
        },
      })
      .then((blob) => {
        saveAs(blob, "festibbity.png");
      });
  }

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
        <Gallery
          posterContainer={posterContainer}
          instagramData={instagramData}
        />
      </main>
      <Col
        align="center"
        justify="center"
        style={{
          marginTop: 10,
          marginBottom: 30,
          paddingLeft: 30,
          paddingRight: 30,
        }}
      >
        <Card shadow style={{ maxWidth: 400, minWidth: 200 }}>
          <Text p>
            Puedes descargar un poster con las últimas 12 ilustraciones de{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/festibbity/"
              icon
              style={{ fontWeight: "bold" }}
            >
              @festibbity
            </Link>
          </Text>
          <Button auto type="secondary" onClick={handleDownload}>
            Descargar
            <Spacer x={0.5} />
            <Download />
          </Button>
          <Card.Footer style={{ flexDirection: "column" }}>
            Una pequeña app hecha por{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.twitter.com/cristianbgp/"
              style={{ fontWeight: "bold" }}
            >
              @cristianbgp
            </Link>
            Todas las ilustraciones son propiedad de{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/grrabbity/"
              style={{ fontWeight: "bold" }}
            >
              @grrabbity
            </Link>
          </Card.Footer>
        </Card>
      </Col>
    </div>
  );
}
