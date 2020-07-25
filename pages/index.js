import { useRef } from "react";
import Head from "next/head";
import useSWR from "swr";
import {
  Button,
  Spacer,
  Card,
  Col,
  Text,
  Link,
  Row,
  Loading,
} from "@zeit-ui/react";
import { Download } from "@zeit-ui/react-icons";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import { SSRSuspense } from "../components/ssr-suspense";

const IMAGE_SIZE = "calc(100vw / 3)";

async function fetcher(url) {
  const res = await fetch(url);
  return await res.json();
}

function Gallery({ posterContainer }) {
  const { data } = useSWR("api/instagram-posts", fetcher, { suspense: true });

  return (
    <div className="gallery" ref={posterContainer}>
      {data.medias.map((post) => (
        <Post post={post} key={post.media_id} />
      ))}
      <style jsx>{`
        .gallery {
          max-width: 600px;
          display: grid;
          grid-template-columns: repeat(3, calc(100vw / 3));
        }
      `}</style>
    </div>
  );
}

function Post({ post }) {
  return (
    <img
      src={post.thumbnail}
      style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
    />
  );
}

export default function Home() {
  const posterContainer = useRef(null);

  function handleDownload() {
    domtoimage
      .toBlob(posterContainer.current, { quality: 1 })
      .then(function (blob) {
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
        <SSRSuspense
          fallback={
            <Row style={{ padding: 50 }}>
              <Loading type="secondary" size="large" />
            </Row>
          }
        >
          <Gallery posterContainer={posterContainer} />
        </SSRSuspense>
      </main>
      <Col
        align="center"
        justify="center"
        style={{
          marginTop: 30,
          marginBottom: 30,
          paddingTop: 30,
          paddingBottom: 30,
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
