import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import Container from "../components/Container";

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="This page does not exist." path="/404" />
      <section className="py-32">
        <Container>
          <h1 className="text-5xl">Page not found.</h1>
          <p className="mt-4 text-muted">The link may be old or typed incorrectly.</p>
          <Link to="/" className="mt-8 inline-block text-accent">
            Back home
          </Link>
        </Container>
      </section>
    </>
  );
}
