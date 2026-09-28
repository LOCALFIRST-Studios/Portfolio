import Seo from "../components/Seo";
import Container from "../components/Container";

export default function Page({ title, description, path }) {
  return (
    <>
      <Seo title={title} description={description} path={path} />
      <section className="py-24">
        <Container>
          <p className="text-sm tracking-[0.2em] text-accent uppercase">Foundation</p>
          <h1 className="mt-4 text-4xl md:text-6xl">{title}</h1>
          <p className="mt-4 max-w-xl text-muted">{description}</p>
        </Container>
      </section>
    </>
  );
}
