// File: components/ContentForm.js
"use client";
import styles from "./ContentForm.module.css";
import toast from "react-hot-toast";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // Make sure this is configured properly
import estadosMexico from "@/utils/estados";
import UploadDocument from "./UploadDocument";
import { getCurrentDate } from "@/utils/getCurrentDate";

export default function ContentForm() {
  const data = {};
  const [formData, setFormData] = useState({
    NOMBRE: "",
    ESTADO: "",
    MUNICIPIO: "",
    AUTORIZACION: "",
    SOCIOCODE: "",
  });
  const [downloadURL, setDownloadURL] = useState("");
  const [socioCode, setSocioCode] = useState("");
  const [loadingMembership, setLoadingMembership] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const tableRef = useRef();
  const form = useRef(null);

  const generateSocioCode = () => {
    const code = Math.floor(Math.random() * 10 ** 13).toString().padStart(13, '0');
    setSocioCode(code);
    setFormData({
      ...formData,
      SOCIOCODE: code,
    });
  };

  const handleSaveAsPNG = async () => {
    const html2canvas = (await import("html2canvas")).default;
    const element = document.getElementById("tarjeta");
    const randomString = Math.random().toString(36).substring(2, 18);
    const timestamp = Date.now();
    const filename = `${timestamp}_${randomString}_Curativa.png`;

    try {
      const canvas = await html2canvas(element, { scale: 4, useCORS: true, allowTaint: false, });

      canvas.toBlob(async (blob) => {
        if (blob) {
          const { data, error } = await supabase.storage
            .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME)
            .upload(`membership/${filename}`, blob, {
              quality: 1,
              scale: 4,
              cacheControl: '3600',
              upsert: false,
            });

          if (error) {
            setLoadingMembership(false);
            throw (error);
          }

          const { data: urlData } = supabase
            .storage
            .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME)
            .getPublicUrl(`membership/${filename}`);

          if (!urlData || !urlData.publicUrl) {
            setLoadingMembership(false);
            throw new Error("Failed to retrieve public URL");
          }

          setDownloadURL(urlData.publicUrl);
          setUploadSuccess(true);

          // await createMembership(urlData.publicUrl);
        }
      }, 'image/png', 0.98);
    } catch (error) {
      setLoadingMembership(false);
      console.log("Error:", error);
    }
  };

  const createMembership = async (membershipUrl) => {
    try {
      const formData = new FormData();
      formData.append("membershipId", socioCode);
      formData.append("membershipUrl", membershipUrl);

      const response = await fetch("/api/membership", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create membership");

      const membership = await response.json();
      console.log("Membership created:", membership);
      setUploadSuccess(true);
    } catch (error) {
      console.log("Error creating membership:", error);
    }
  };

  const handleChange = (e) => {
    setUploadSuccess(false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setLoadingMembership(true);
    e.preventDefault();

    data.formData = formData;
    await handleSaveAsPNG();
  };

  useEffect(() => {
    setIsMounted(true);
    generateSocioCode();
  }, []);

  if (!isMounted) return null;

  return (
    <form className={`${styles.formMembership}`} onSubmit={handleSubmit} ref={form}>
      <div className="grid-cols-2 mt-10 lg:grid justify-items-center">
        <div className="w-full p-2 mx-auto mb-10 bg-white rounded-lg shadow-2xl lg:w-4/5">
          <div className="w-full bg-white">
            <div className="px-8 pt-6 pb-8 mb-4 bg-white">
              <>
                <label htmlFor="NOMBRE" className="block mb-2 text-sm font-bold text-primaryBlue">
                  NOMBRE:
                  <i className="font-light">
                    <span className="text-red-700"> *</span>
                  </i>
                </label>
                <input
                  name="NOMBRE"
                  type="text"
                  onChange={handleChange}
                  maxLength={18}
                  className="w-full px-3 py-2 border shadow appearance-none"
                  required
                  autoFocus
                />
              </>
              <>
                <label htmlFor="ESTADO" className="block mb-2 text-sm font-bold text-primaryBlue">
                  ESTADO:
                  <i className="font-light">
                    <span className="text-red-700"> *</span>
                  </i>
                </label>
                <select
                  id="ESTADO"
                  name="ESTADO"
                  value={formData.ESTADO}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border shadow appearance-none"
                  required
                >
                  <option value="">Selecciona un estado</option>
                  {estadosMexico.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </>
              <>
                <label htmlFor="MUNICIPIO" className="block mb-2 text-sm font-bold text-primaryBlue">
                  MUNICIPIO:
                  <i className="font-light">
                    <span className="text-red-700"> *</span>
                  </i>
                </label>
                <input
                  name="MUNICIPIO"
                  type="text"
                  onChange={handleChange}
                  maxLength={18}
                  className="w-full px-3 py-2 border shadow appearance-none"
                  required
                  autoFocus
                />
              </>
              <>
                <label htmlFor="AUTORIZACION" className="block mb-2 text-sm font-bold text-primaryBlue">
                  AUTORIZACIÓN:
                  <i className="font-light">
                    <span className="text-red-700"> *</span>
                  </i>
                </label>
                <input
                  name="AUTORIZACION"
                  type="text"
                  onChange={handleChange}
                  maxLength={18}
                  className="w-full px-3 py-2 border shadow appearance-none"
                  required
                  autoFocus
                />
              </>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className={`${styles.membership}`} ref={tableRef} id="tarjeta">
            <>
              <img className="w-full" src="/images/TARJETA_FINAL_BACK.png" />
              <table className="bg-custom-card rounded-2xl">
                <tbody height="100%">
                  <tr className="flex w-full h-full">
                    <td className="flex flex-col justify-around w-2/3 h-full pt-6 pb-5 pl-6">
                      <img src="/images/Logo-CUSACAN-HEADER.png" alt="CUSACAN" className="w-full" />
                      <div>
                        <p className="py-0 my-0 leading-4 text-left">
                          <span className="font-bold ">Nombre: </span>
                          <span className="capitalize">{formData.NOMBRE !== "" ? formData.NOMBRE : ""}</span>
                        </p>
                        <p className="py-0 my-0 leading-4 text-left">
                          <span className="font-bold ">Estado: </span>
                          <span className="capitalize">{formData.ESTADO !== "" ? formData.ESTADO : ""}</span>
                        </p>
                        <p className="py-0 my-0 leading-4 text-left">
                          <span className="font-bold ">Municipio: </span>
                          <span className="capitalize">{formData.MUNICIPIO !== "" ? formData.MUNICIPIO : ""}</span>
                        </p>
                        <p className="py-0 my-0 leading-4 text-left">
                          <span className="font-bold">Documento: </span>

                        </p>
                        <p className="py-0 my-0 leading-4 text-left">
                          <span className="font-bold">Fecha Creada: </span>
                          {getCurrentDate()}
                        </p>
                        <p className="py-0 my-0 leading-4 text-left whitespace-nowrap ">
                          <span className="font-bold">Autorización: </span>
                          <span className="text-sm uppercase md:text-base">
                            {formData.AUTORIZACION !== "" ? formData.AUTORIZACION : ""}
                          </span>
                        </p>
                      </div>
                      <h1 className="pt-5 text-lg font-bold text-center md:text-xl">#PRESERVANDORAICES</h1>
                      <p className="text-base text-center font-base">WWW.CURATIVASALUDCANNABIS.ORG</p>
                    </td>
                    <td className={`${styles.socio} flex flex-col items-center justify-around pb-5 pr-8 pt-6 pl-5 w-1/3`}>
                      <div className="flex flex-col items-center">
                        <img className="w-full rounded-2xl" src="/images/PROFILE.png" alt="QR" />
                        <p className="pt-5 font-bold text-left whitespace-nowrap">
                          ASOCIADO
                        </p>
                      </div>
                      <img className="w-2/3" src="/images/QR.jpg" alt="QR" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          </div>
          <p className="pt-5 text-center">
            Esta representación es lo mas cercano posible a la tarjeta final
          </p>
          <div className="flex flex-col items-center mt-6">
            <div className="flex flex-col justify-center w-full mb-4">
              {!uploadSuccess && (
                <>
                  {loadingMembership ? (
                    <p className="text-sm text-center text-gray-500">Generando membresía...</p>
                  ) : (
                    <button
                      type="submit"
                      className="block px-4 py-2 m-auto text-xs tracking-widest text-center text-white uppercase bg-black shadow cursor-pointer whitespace-nowrap font-formaBold w-min md:text-sm"
                    >
                      Generar PDF
                    </button>
                  )}
                </>
              )}

              {uploadSuccess && (
                <>
                  <p className="text-center">Membresía creada correctamente!</p>
                  <a
                    href={downloadURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center text-blue-600 underline break-all"
                  >
                    Descarga tu membresía
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}