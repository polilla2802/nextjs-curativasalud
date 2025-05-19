// src/app/page.js

import ContentForm from "./components/ContentForm";

export default function Home() {

  return (
    <>
      <section className="container px-0 py-4 m-auto md:px-4">
        <h1 className="text-4xl font-bold text-white md:text-8xl">Tarjetas Miembros</h1>
        <ContentForm />
      </section>
    </>
  );
}
