// src/app/page.js

import ContentForm from "./components/ContentForm";

export default function Home() {

  return (
    <>
      <section className="container px-0 py-4 m-auto md:px-4">
        <h1 className="pt-5 text-4xl font-bold text-center text-white md:text-8xl">Proximamente</h1>
        {/* <ContentForm /> */}
        <img src="/images/logo-cusacan.png" alt="CUSACAN" className="px-10 pt-10 m-auto" />
      </section>
    </>
  );
}
