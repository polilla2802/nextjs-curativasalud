// src/app/page.js

import ContentForm from "./components/ContentForm";

export default function Home() {

  return (
    <>
      <section className="container px-4 py-4 m-auto">
        <h1 className="font-bold text-white md:text-8xl text-4xl">Tarjetas Miembros</h1>
        <ContentForm />
      </section>
    </>
  );
}
